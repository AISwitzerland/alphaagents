// Load environment variables first with explicit path
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../../.env') });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import multer from 'multer';

import { AgentOrchestrator } from '../../../packages/core/src/registry/AgentOrchestrator';
import { ConfigService } from '../../../packages/services/src';
import { ErrorHandler } from '../../../packages/core/src/errors/ErrorHandler';

/**
 * AlphaAgents API Gateway
 * 
 * Unified REST API for all agent interactions:
 * - Document processing endpoints
 * - Chat interaction endpoints  
 * - Email processing endpoints
 * - System status and monitoring
 * - File upload handling
 */

const app = express();
const PORT = process.env.PORT || 3001;

// Global middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// File upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
    files: 5
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'image/jpeg',
      'image/png', 
      'image/tiff'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  }
});

// Global error handler
const errorHandler = ErrorHandler.getInstance();

// Initialize orchestrator
let orchestrator: AgentOrchestrator;

// === DOCUMENT ENDPOINTS ===

/**
 * POST /api/documents/upload
 * Upload and process documents
 */
app.post('/api/documents/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const userInfo = {
      name: req.body.userName,
      email: req.body.userEmail,
      phone: req.body.userPhone
    };

    const result = await orchestrator.processDocument(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      userInfo
    );

    res.json({
      success: true,
      data: {
        documentId: result.documentRecord.id,
        filename: result.documentRecord.file_name,
        documentType: result.documentRecord.document_type,
        status: result.documentRecord.status,
        extractedText: result.ocrResult?.extractedText,
        confidence: result.ocrResult?.confidence,
        processingTime: result.ocrResult?.processingTime
      }
    });

  } catch (error) {
    console.error('Document upload error:', error);
    const agentError = errorHandler.handleError(error);
    
    res.status(500).json({
      success: false,
      error: agentError.message,
      code: agentError.code
    });
  }
});

/**
 * POST /api/documents/upload-multiple
 * Upload multiple documents
 */
app.post('/api/documents/upload-multiple', upload.array('documents', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
    }

    const userInfo = {
      name: req.body.userName,
      email: req.body.userEmail,
      phone: req.body.userPhone
    };

    const results = [];
    
    for (const file of req.files as Express.Multer.File[]) {
      try {
        const result = await orchestrator.processDocument(
          file.buffer,
          file.originalname,
          file.mimetype,
          userInfo
        );
        
        results.push({
          success: true,
          filename: file.originalname,
          documentId: result.documentRecord.id,
          documentType: result.documentRecord.document_type,
          extractedText: result.ocrResult?.extractedText,
          confidence: result.ocrResult?.confidence
        });
      } catch (error) {
        results.push({
          success: false,
          filename: file.originalname,
          error: error instanceof Error ? error.message : 'Processing failed'
        });
      }
    }

    res.json({
      success: true,
      data: {
        processed: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results
      }
    });

  } catch (error) {
    console.error('Multiple upload error:', error);
    const agentError = errorHandler.handleError(error);
    
    res.status(500).json({
      success: false,
      error: agentError.message,
      code: agentError.code
    });
  }
});

// === CHAT ENDPOINTS ===

/**
 * POST /api/chat/message
 * Send chat message
 */
app.post('/api/chat/message', async (req, res) => {
  try {
    const { sessionId, message, context } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({
        success: false,
        error: 'Session ID and message are required'
      });
    }

    const result = await orchestrator.handleChat(sessionId, message, context);

    res.json({
      success: true,
      data: {
        response: result.response,
        conversationState: result.conversationState,
        nextStep: result.nextStep,
        options: result.options,
        uiUpdates: result.uiUpdates
      }
    });

  } catch (error) {
    console.error('Chat error:', error);
    const agentError = errorHandler.handleError(error);
    
    res.status(500).json({
      success: false,
      error: agentError.message,
      code: agentError.code
    });
  }
});

/**
 * POST /api/chat/upload
 * Upload document through chat
 */
app.post('/api/chat/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const { sessionId, userInfo } = req.body;

    // Process document first
    const docResult = await orchestrator.processDocument(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      JSON.parse(userInfo || '{}')
    );

    res.json({
      success: true,
      data: {
        documentId: docResult.documentRecord.id,
        filename: docResult.documentRecord.file_name,
        status: 'uploaded',
        message: `Dokument "${req.file.originalname}" wurde erfolgreich hochgeladen.`
      }
    });

  } catch (error) {
    console.error('Chat upload error:', error);
    const agentError = errorHandler.handleError(error);
    
    res.status(500).json({
      success: false,
      error: agentError.message,
      code: agentError.code
    });
  }
});

// === EMAIL ENDPOINTS ===

/**
 * POST /api/email/process
 * Process incoming email
 */
app.post('/api/email/process', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email data is required'
      });
    }

    const result = await orchestrator.processEmail(email);

    res.json({
      success: true,
      data: {
        classification: result.classification,
        response: result.response,
        escalated: result.escalated,
        attachments: result.attachments
      }
    });

  } catch (error) {
    console.error('Email processing error:', error);
    const agentError = errorHandler.handleError(error);
    
    res.status(500).json({
      success: false,
      error: agentError.message,
      code: agentError.code
    });
  }
});

// === SYSTEM ENDPOINTS ===

/**
 * GET /api/system/status
 * Get system status
 */
app.get('/api/system/status', async (req, res) => {
  try {
    const status = await orchestrator.getSystemStatus();
    
    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    console.error('System status error:', error);
    
    res.status(500).json({
      success: false,
      data: {
        overall: 'critical',
        agents: { total: 0, running: 0, healthy: 0, errors: 1 },
        services: { database: false, ai: false, storage: false },
        uptime: 0,
        version: '1.0.0'
      }
    });
  }
});

/**
 * GET /api/system/agents
 * Get all agents status
 */
app.get('/api/system/agents', async (req, res) => {
  try {
    const agents = orchestrator.getRegisteredAgents();
    
    res.json({
      success: true,
      data: agents.map(agent => ({
        id: agent.id,
        name: agent.name,
        status: agent.status,
        healthy: agent.healthStatus.healthy,
        lastCheck: agent.healthStatus.lastCheck,
        errorCount: agent.healthStatus.errorCount
      }))
    });

  } catch (error) {
    console.error('Agents status error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to get agents status'
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  });
});

// === ERROR HANDLING ===

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error:', err);
  
  const agentError = errorHandler.handleError(err);
  
  res.status(500).json({
    success: false,
    error: agentError.message,
    code: agentError.code
  });
});

// === SERVER STARTUP ===

async function startServer() {
  try {
    console.log('🚀 Starting AlphaAgents API Gateway...\n');

    // Initialize orchestrator
    orchestrator = AgentOrchestrator.getInstance();
    await orchestrator.initialize();

    // Start server
    app.listen(PORT, () => {
      console.log(`\n🌐 API Gateway running on http://localhost:${PORT}`);
      console.log(`📋 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📊 System Status: http://localhost:${PORT}/api/system/status`);
      console.log(`\n✅ AlphaAgents System Ready for Requests!\n`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('🔄 Received SIGTERM, shutting down gracefully...');
      await orchestrator.shutdown();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('🔄 Received SIGINT, shutting down gracefully...');
      await orchestrator.shutdown();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start API Gateway:', error);
    process.exit(1);
  }
}

// Start the server
if (require.main === module) {
  startServer();
}

export default app;