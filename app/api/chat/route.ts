import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { CHAT_CONFIG } from '@/services/chatConfig';
import { ChatCompletionMessageParam, ChatCompletionSystemMessageParam, ChatCompletionUserMessageParam, ChatCompletionAssistantMessageParam } from 'openai/resources/chat';

// Verwende den API Key aus der Umgebungsvariable mit Fallback
const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: apiKey,
});

// Rate limiting map (in a production environment, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = CHAT_CONFIG.rateLimit.maxRequestsPerMinute;
  const windowMs = 60 * 1000; // 1 minute

  const userLimit = rateLimitMap.get(ip) || { count: 0, timestamp: now };
  
  if (now - userLimit.timestamp > windowMs) {
    // Reset if window has passed
    userLimit.count = 1;
    userLimit.timestamp = now;
  } else if (userLimit.count >= limit) {
    return false;
  } else {
    userLimit.count++;
  }
  
  rateLimitMap.set(ip, userLimit);
  return true;
}

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: CHAT_CONFIG.errorMessages.de.rateLimitExceeded },
        { status: 429 }
      );
    }

    const { messages, language = CHAT_CONFIG.defaultLanguage } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Get the last detected intent for context
    const lastUserMessage = [...messages].reverse().find(m => m.type === 'user');
    const lastIntent = lastUserMessage?.intent;

    // Prepare messages for OpenAI with intent context
    const chatMessages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: CHAT_CONFIG.openai.systemPrompt,
      } as ChatCompletionSystemMessageParam,
      // Add intent context if available
      ...(lastIntent ? [{
        role: 'system',
        content: `Der Benutzer hat folgende Absicht: ${lastIntent}. Bitte berücksichtige dies in deiner Antwort.`
      } as ChatCompletionSystemMessageParam] : []),
      ...messages.map((msg: any) => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
      } as (ChatCompletionUserMessageParam | ChatCompletionAssistantMessageParam))),
    ];

    // Call OpenAI with language preference
    const completion = await openai.chat.completions.create({
      model: CHAT_CONFIG.openai.model,
      messages: chatMessages,
      max_tokens: CHAT_CONFIG.openai.maxTokens,
      temperature: CHAT_CONFIG.openai.temperature,
    });

    const response = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ content: response });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: CHAT_CONFIG.errorMessages.de.serverError },
      { status: 500 }
    );
  }
} 