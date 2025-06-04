# Chat Agent Critical Fixes Required

## Test Results Summary
- **Overall Accuracy: 62% (24/39 tests passed)**
- **Edge Cases: 62% (13/21)**  
- **Flow Transitions: 38% (3/8)**
- **German Terminology: 80% (8/10)**

## Critical Issues Found

### 1. Mixed Intent Handling (HIGHEST PRIORITY)
**Problem**: Multiple intents in one sentence cause wrong classification
- "Termin und Dokumente hochladen" → Triggers `document_upload` instead of asking for clarification
- "Was kostet das und kann ich einen Termin machen?" → Triggers `appointment` instead of `faq`

**Solution**: Add mixed intent detection and clarification prompts

### 2. Question Word Patterns Missing
**Problem**: Common question patterns not detected as FAQ
- "Wo ist mein Dokument?" → Should be FAQ but detected as general
- "Wie lade ich Dokumente hoch?" → Should be FAQ but detected as general  

**Solution**: Add question word patterns: `/wo.*ist|wie.*lade|wie.*funktioniert|wo.*finde/i`

### 3. Single Word Over-Triggering  
**Problem**: Single words trigger specific flows when they should stay general
- "Termin" alone → Triggers appointment flow
- Should require more context before committing to a flow

**Solution**: Add minimum confidence threshold for single words

### 4. Instruction/Help Requests Misclassified
**Problem**: Requests for instructions/help get wrong classification
- "Dokument hochladen Anleitung" → Triggers upload instead of FAQ
- "Upload Hilfe" would likely have same issue

**Solution**: Add instruction/help patterns to FAQ: `/anleitung|hilfe|help|wie.*mache|tutorial/i`

### 5. Flow Transition Conflicts
**Problem**: When user changes mind or clarifies intent, system doesn't handle gracefully
- "Nein, ich möchte keine Offerte, nur Informationen" → Still triggers quote
- Negation words not properly handled

**Solution**: Add negation detection and intent correction patterns

## Immediate Fixes Needed

### Fix 1: Enhanced FAQ Patterns
```javascript
faq: [
  // Existing patterns...
  
  // NEW: Question word patterns
  /wo.*ist|wo.*finde|wo.*kann.*ich|wie.*lade|wie.*funktioniert|wie.*mache/i,
  /wann.*ist.*frist|wann.*kann.*ich|wann.*muss.*ich/i,
  
  // NEW: Instruction/Help patterns  
  /anleitung|hilfe|help|tutorial|erklärun|erklär.*mir/i,
  /wie.*mache.*ich|wie.*geht.*das|wie.*funktioniert.*das/i,
  
  // NEW: Location/Status questions
  /wo.*dokument|wo.*finde.*ich|status.*von|stand.*der/i
]
```

### Fix 2: Single Word Confidence Threshold
```javascript
// In detectTopicByPatterns function
const wordCount = message.trim().split(/\s+/).length;
if (wordCount === 1 && confidence < 0.8) {
  return { topic: 'general', confidence: 0.1, matchCount: 0 };
}
```

### Fix 3: Mixed Intent Detection
```javascript
// Check for multiple strong intents
const intentCounts = Object.entries(TOPIC_PATTERNS).map(([topic, patterns]) => ({
  topic,
  matches: patterns.filter(pattern => pattern.test(messageLower)).length
})).filter(result => result.matches > 0);

if (intentCounts.length > 1) {
  return { topic: 'mixed_intent', confidence: 0.95, matchCount: intentCounts.length };
}
```

### Fix 4: Negation Handling
```javascript
// Check for negation patterns
if (/nein|nicht|kein|keine|nie|niemals|doch.*nicht/i.test(messageLower)) {
  // Lower confidence for contradicted intents
  if (bestMatch.topic !== 'faq') {
    bestMatch.confidence *= 0.5;
  }
}
```

## Implementation Priority
1. **Fix FAQ question patterns** (Quick win - 15 minutes)
2. **Add single word threshold** (Quick win - 10 minutes)  
3. **Mixed intent detection** (Medium - 30 minutes)
4. **Negation handling** (Medium - 20 minutes)
5. **Test all fixes** (30 minutes)

## Expected Improvement
After fixes, accuracy should improve from **62%** to **85%+**

## Files to Modify
- `/packages/agents/src/chat/ChatAgent.ts` - TOPIC_PATTERNS and detectTopicByPatterns method
- Add new handling for `mixed_intent` topic in response generation

## Testing Plan
1. Run comprehensive test again after each fix
2. Add new test cases for fixed scenarios  
3. Verify no regression in previously working cases
4. Test with real Chat API once patterns are stable