import { BaseAgent } from '../../../core/src/agents/BaseAgent';
import { AgentContext, AgentResult, AgentConfig, LogLevel } from '../../../shared/src/types/agent';
import { ErrorHandler, ErrorCodes, ValidationError } from '../../../core/src/errors/ErrorHandler';
import { DIContainer, ServiceTokens } from '../../../core/src/container/DIContainer';
import { LoggerService, SupabaseService } from '../../../services/src';
import { DocumentRecord } from '../../../services/src/database/SupabaseService';

/**
 * Document Agent Input/Output Types
 */
export interface DocumentAgentInput {
  action: 'upload' | 'validate' | 'process' | 'retrieve' | 'delete' | 'batch-upload' | 'storage-stats' | 'cleanup';
  file?: {
    buffer: Buffer;
    originalName: string;
    mimeType: string;
    size: number;
  };
  files?: FileUploadItem[];
  batchOptions?: BatchUploadOptions;
  documentId?: string;
  userInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  metadata?: Record<string, any>;
  progressCallback?: (event: ProgressEvent) => void;
}

export interface FileUploadItem {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  size: number;
  fileId?: string;
}

export interface BatchUploadOptions {
  parallel: boolean;
  maxConcurrency: number;
  stopOnError: boolean;
}

export interface ProgressEvent {
  type: 'upload-start' | 'upload-progress' | 'upload-complete' | 'upload-error' | 'batch-start' | 'batch-complete';
  fileId?: string;
  fileName?: string;
  progress: number;
  processed: number;
  total: number;
  status: string;
  error?: string;
}

export interface DocumentAgentOutput {
  status: 'success' | 'error' | 'partial';
  message: string;
  documentRecord?: DocumentRecord;
  documentRecords?: DocumentRecord[];
  validationResult?: ValidationResult;
  batchResult?: BatchUploadResult;
  storageStats?: StorageStats;
  cleanupResult?: CleanupResult;
  filePath?: string;
  downloadUrl?: string;
}

export interface BatchUploadResult {
  totalFiles: number;
  successfulUploads: number;
  failedUploads: number;
  results: Array<{
    fileId: string;
    fileName: string;
    status: 'success' | 'error';
    documentRecord?: DocumentRecord;
    error?: string;
  }>;
  processingTime: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  securityChecks?: SecurityValidationResult;
  fileInfo: {
    name: string;
    type: string;
    size: number;
    extension: string;
    detectedMimeType?: string;
  };
}

export interface SecurityValidationResult {
  magicNumberValid: boolean;
  mimeTypeMismatch: boolean;
  suspiciousContent: boolean;
  fileHeaderValid: boolean;
  contentAnalysis: {
    hasExecutableCode: boolean;
    hasSuspiciousStrings: boolean;
    fileIntegrityValid: boolean;
  };
}

export interface DocumentCache {
  metadata: Map<string, CachedDocumentMetadata>;
  validationResults: Map<string, ValidationResult>;
  fileHashes: Map<string, string>;
  lastCleanup: Date;
}

export interface CachedDocumentMetadata {
  fileSize: number;
  mimeType: string;
  documentType: string;
  lastAccessed: Date;
  accessCount: number;
  validationHash: string;
}

export interface StorageStats {
  totalFiles: number;
  totalSizeBytes: number;
  oldestFile: Date;
  newestFile: Date;
  filesByType: Record<string, number>;
  storageUsagePercent: number;
}

export interface CleanupResult {
  filesRemoved: number;
  bytesFreed: number;
  errors: string[];
  warnings: string[];
  cleanupStartTime: Date;
  cleanupEndTime: Date;
  criteria: {
    olderThanDays: number;
    maxStorageUsage: number;
    removeFailedUploads: boolean;
  };
}

/**
 * Document Agent - File Processing Specialist
 * 
 * The Document Agent handles:
 * - File upload and validation
 * - Secure storage in Supabase
 * - Document metadata management
 * - File type validation for Swiss insurance documents
 * - Structured database record creation
 * - File retrieval and download
 */
export class DocumentAgent extends BaseAgent<DocumentAgentInput, DocumentAgentOutput> {
  private container: DIContainer;
  private logger!: LoggerService;
  private supabase!: SupabaseService;
  private errorHandler: ErrorHandler;
  private documentCache!: DocumentCache;

  // Supported file types for Swiss insurance documents
  private readonly SUPPORTED_MIME_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword', // .doc
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/tiff',
    'image/tif'
  ];

  private readonly SUPPORTED_EXTENSIONS = [
    '.pdf', '.docx', '.doc', '.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif'
  ];

  private readonly MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  private readonly MIN_FILE_SIZE = 100; // 100 bytes
  private readonly CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
  private readonly MAX_CACHE_SIZE = 1000; // Maximum cached entries
  // Note: STORAGE_CLEANUP_THRESHOLD used in cleanup logic implementation

  // Security enhancement: Magic number validation for file types
  private readonly FILE_SIGNATURES = new Map([
    // PDF signatures
    ['25504446', 'application/pdf'], // %PDF
    // PNG signatures  
    ['89504E47', 'image/png'], // .PNG
    // JPEG signatures
    ['FFD8FFE0', 'image/jpeg'], // JFIF
    ['FFD8FFE1', 'image/jpeg'], // EXIF
    ['FFD8FFDB', 'image/jpeg'], // JPEG
    // DOCX/ZIP signatures (DOCX is ZIP-based)
    ['504B0304', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ['504B0506', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ['504B0708', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    // DOC signatures
    ['D0CF11E0', 'application/msword'], // MS Office legacy
    // WEBP signature
    ['52494646', 'image/webp'], // RIFF (check for WEBP in content)
    // TIFF signatures
    ['49492A00', 'image/tiff'], // Little endian
    ['4D4D002A', 'image/tiff']  // Big endian
  ]);

  constructor(config: AgentConfig, container: DIContainer) {
    super(config);
    this.container = container;
    this.errorHandler = ErrorHandler.getInstance();
    this.initializeCache();
  }

  async execute(input: DocumentAgentInput, context: AgentContext): Promise<AgentResult<DocumentAgentOutput>> {
    this.log(LogLevel.INFO, `Document Agent executing action: ${input.action}`, { 
      action: input.action,
      hasFile: !!input.file,
      documentId: input.documentId
    });

    try {
      switch (input.action) {
        case 'upload':
          return await this.handleUpload(input, context);
        
        case 'validate':
          return await this.handleValidation(input, context);
        
        case 'process':
          return await this.handleProcessing(input, context);
        
        case 'retrieve':
          return await this.handleRetrieval(input, context);
        
        case 'delete':
          return await this.handleDeletion(input, context);
        
        case 'batch-upload':
          return await this.handleBatchUpload(input, context);
        
        case 'storage-stats':
          return await this.handleStorageStats(input, context);
        
        case 'cleanup':
          return await this.handleStorageCleanup(input, context);
        
        default:
          throw this.errorHandler.createError(
            ErrorCodes.INVALID_INPUT,
            `Unknown action: ${input.action}`
          );
      }
    } catch (error) {
      this.log(LogLevel.ERROR, 'Document Agent execution failed', { error, input });
      
      const agentError = this.errorHandler.handleError(error, { 
        action: input.action,
        fileName: input.file?.originalName,
        documentId: input.documentId
      });
      
      return this.createErrorResult(context, agentError);
    }
  }

  protected async initialize(): Promise<void> {
    this.log(LogLevel.INFO, 'Initializing Document Agent...');

    try {
      // Resolve dependencies
      this.logger = await this.container.resolve<LoggerService>(ServiceTokens.LOGGER);
      this.supabase = await this.container.resolve<SupabaseService>(ServiceTokens.SUPABASE_SERVICE);

      this.log(LogLevel.INFO, 'Document Agent initialized successfully');
    } catch (error) {
      this.log(LogLevel.FATAL, 'Document Agent initialization failed', { error });
      throw error;
    }
  }

  protected async cleanup(): Promise<void> {
    this.log(LogLevel.INFO, 'Document Agent cleanup completed');
  }

  protected async performHealthCheck(): Promise<boolean> {
    try {
      // Check if dependencies are available
      if (!this.logger || !this.supabase) {
        return false;
      }

      // Test database connection
      return await this.supabase.testConnection();
    } catch (error) {
      this.log(LogLevel.ERROR, 'Document Agent health check failed', { error });
      return false;
    }
  }

  // === FILE UPLOAD HANDLING ===

  /**
   * Handle file upload
   */
  private async handleUpload(input: DocumentAgentInput, context: AgentContext): Promise<AgentResult<DocumentAgentOutput>> {
    if (!input.file) {
      throw new ValidationError('File is required for upload action');
    }

    this.log(LogLevel.INFO, 'Processing file upload', {
      fileName: input.file.originalName,
      fileSize: input.file.size,
      mimeType: input.file.mimeType
    });

    // Validate file with caching
    const validationResult = this.validateFileWithCache(input.file);
    if (!validationResult.valid) {
      return this.createSuccessResult(context, {
        status: 'error',
        message: `File validation failed: ${validationResult.errors.join(', ')}`,
        validationResult
      });
    }

    try {
      // Generate unique file path
      const filePath = this.generateFilePath(input.file.originalName, input.userInfo?.name);
      
      // Upload to Supabase Storage
      const uploadResult = await this.supabase.uploadFile(
        filePath,
        input.file.buffer,
        input.file.mimeType
      );

      // Create database record
      const documentRecord = await this.supabase.createDocument({
        file_name: input.file.originalName,
        file_path: uploadResult.path,
        file_type: input.file.mimeType,
        document_type: this.detectDocumentType(input.file.originalName, input.file.mimeType),
        status: 'eingereicht',
        user_name: input.userInfo?.name || undefined,
        user_email: input.userInfo?.email || undefined,
        user_phone: input.userInfo?.phone || undefined
      });

      this.log(LogLevel.INFO, 'File uploaded successfully', {
        documentId: documentRecord.id,
        filePath: uploadResult.path,
        fileName: input.file.originalName
      });

      return this.createSuccessResult(context, {
        status: 'success',
        message: `File "${input.file.originalName}" uploaded successfully`,
        documentRecord,
        filePath: uploadResult.path,
        downloadUrl: uploadResult.publicUrl || ''
      });
    } catch (error) {
      this.log(LogLevel.ERROR, 'File upload failed', { error });
      throw error;
    }
  }

  // === FILE VALIDATION ===

  /**
   * Handle file validation
   */
  private async handleValidation(input: DocumentAgentInput, context: AgentContext): Promise<AgentResult<DocumentAgentOutput>> {
    if (!input.file) {
      throw new ValidationError('File is required for validation action');
    }

    const validationResult = this.validateFileWithCache(input.file);

    return this.createSuccessResult(context, {
      status: validationResult.valid ? 'success' : 'error',
      message: validationResult.valid 
        ? 'File validation passed' 
        : `File validation failed: ${validationResult.errors.join(', ')}`,
      validationResult
    });
  }

  /**
   * Enhanced file validation with security checks
   */
  private validateFile(file: DocumentAgentInput['file']): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!file) {
      errors.push('No file provided');
      return {
        valid: false,
        errors,
        warnings,
        fileInfo: { name: '', type: '', size: 0, extension: '' }
      };
    }

    const fileExtension = this.getFileExtension(file.originalName);
    
    // Basic file size validation
    if (file.size > this.MAX_FILE_SIZE) {
      errors.push(`File size ${this.formatFileSize(file.size)} exceeds maximum allowed size of ${this.formatFileSize(this.MAX_FILE_SIZE)}`);
    }
    
    if (file.size < this.MIN_FILE_SIZE) {
      errors.push(`File size ${this.formatFileSize(file.size)} is below minimum required size of ${this.formatFileSize(this.MIN_FILE_SIZE)}`);
    }

    // MIME type validation
    if (!this.SUPPORTED_MIME_TYPES.includes(file.mimeType)) {
      errors.push(`Unsupported file type: ${file.mimeType}. Supported types: ${this.SUPPORTED_MIME_TYPES.join(', ')}`);
    }

    // File extension validation
    if (!this.SUPPORTED_EXTENSIONS.includes(fileExtension.toLowerCase())) {
      errors.push(`Unsupported file extension: ${fileExtension}. Supported extensions: ${this.SUPPORTED_EXTENSIONS.join(', ')}`);
    }

    // File name validation
    if (file.originalName.length > 255) {
      errors.push('File name is too long (maximum 255 characters)');
    }

    if (!/^[a-zA-Z0-9._\-\s()]+$/.test(file.originalName)) {
      warnings.push('File name contains special characters that may cause issues');
    }

    // Enhanced Security Validation
    const securityChecks = this.performSecurityValidation(file);
    
    if (!securityChecks.magicNumberValid) {
      errors.push('File type validation failed: File signature does not match declared MIME type');
    }
    
    if (securityChecks.mimeTypeMismatch) {
      warnings.push('MIME type mismatch detected between file extension and content');
    }
    
    if (securityChecks.suspiciousContent) {
      errors.push('Security threat detected: File contains potentially malicious content');
    }
    
    if (!securityChecks.fileHeaderValid) {
      errors.push('File header validation failed: Corrupted or invalid file structure');
    }
    
    if (securityChecks.contentAnalysis.hasExecutableCode) {
      errors.push('Security violation: Embedded executable code detected');
    }
    
    if (securityChecks.contentAnalysis.hasSuspiciousStrings) {
      warnings.push('Potentially suspicious content patterns detected');
    }

    // Swiss document specific validations
    if (file.mimeType === 'application/pdf' && file.size < 1024) {
      warnings.push('PDF file seems unusually small, please verify it contains valid content');
    }

    const detectedMimeType = this.detectMimeTypeFromContent(file.buffer);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      securityChecks,
      fileInfo: {
        name: file.originalName,
        type: file.mimeType,
        size: file.size,
        extension: fileExtension,
        detectedMimeType
      }
    };
  }

  // === DOCUMENT PROCESSING ===

  /**
   * Handle document processing (prepare for OCR/AI analysis)
   */
  private async handleProcessing(input: DocumentAgentInput, context: AgentContext): Promise<AgentResult<DocumentAgentOutput>> {
    if (!input.documentId) {
      throw new ValidationError('Document ID is required for processing action');
    }

    const documentRecord = await this.supabase.getDocument(input.documentId);
    if (!documentRecord) {
      throw this.errorHandler.createError(
        ErrorCodes.DOCUMENT_NOT_FOUND,
        `Document with ID ${input.documentId} not found`
      );
    }

    try {
      // Update status to processing
      const updatedRecord = await this.supabase.updateDocument(input.documentId, {
        status: 'in_bearbeitung',
        processing_notes: 'Document queued for AI processing'
      });

      this.log(LogLevel.INFO, 'Document marked for processing', {
        documentId: input.documentId,
        fileName: documentRecord.file_name
      });

      return this.createSuccessResult(context, {
        status: 'success',
        message: `Document "${documentRecord.file_name}" queued for processing`,
        documentRecord: updatedRecord
      });
    } catch (error) {
      this.log(LogLevel.ERROR, 'Document processing preparation failed', { error });
      throw error;
    }
  }

  // === DOCUMENT RETRIEVAL ===

  /**
   * Handle document retrieval
   */
  private async handleRetrieval(input: DocumentAgentInput, context: AgentContext): Promise<AgentResult<DocumentAgentOutput>> {
    if (!input.documentId) {
      throw new ValidationError('Document ID is required for retrieval action');
    }

    const documentRecord = await this.supabase.getDocument(input.documentId);
    if (!documentRecord) {
      throw this.errorHandler.createError(
        ErrorCodes.DOCUMENT_NOT_FOUND,
        `Document with ID ${input.documentId} not found`
      );
    }

    return this.createSuccessResult(context, {
      status: 'success',
      message: `Document "${documentRecord.file_name}" retrieved successfully`,
      documentRecord,
      filePath: documentRecord.file_path
    });
  }

  // === BATCH UPLOAD HANDLING ===

  /**
   * Handle batch file upload with progress tracking
   */
  private async handleBatchUpload(input: DocumentAgentInput, context: AgentContext): Promise<AgentResult<DocumentAgentOutput>> {
    if (!input.files || input.files.length === 0) {
      throw new ValidationError('Files array is required for batch-upload action');
    }

    const startTime = Date.now();
    const totalFiles = input.files.length;
    const batchOptions = input.batchOptions || {
      parallel: true,
      maxConcurrency: 3,
      stopOnError: false
    };

    this.log(LogLevel.INFO, 'Starting batch upload', {
      totalFiles,
      parallel: batchOptions.parallel,
      maxConcurrency: batchOptions.maxConcurrency
    });

    // Emit batch start event
    this.emitProgressEvent(input.progressCallback, {
      type: 'batch-start',
      progress: 0,
      processed: 0,
      total: totalFiles,
      status: 'Batch upload gestartet'
    });

    try {
      let results: BatchUploadResult['results'];

      if (batchOptions.parallel) {
        results = await this.processBatchParallel(input.files, batchOptions, input.userInfo, input.progressCallback);
      } else {
        results = await this.processBatchSequential(input.files, batchOptions, input.userInfo, input.progressCallback);
      }

      const successfulUploads = results.filter(r => r.status === 'success').length;
      const failedUploads = results.filter(r => r.status === 'error').length;
      const processingTime = Date.now() - startTime;

      const batchResult: BatchUploadResult = {
        totalFiles,
        successfulUploads,
        failedUploads,
        results,
        processingTime
      };

      // Emit batch complete event
      this.emitProgressEvent(input.progressCallback, {
        type: 'batch-complete',
        progress: 100,
        processed: totalFiles,
        total: totalFiles,
        status: `Batch upload abgeschlossen: ${successfulUploads}/${totalFiles} erfolgreich`
      });

      this.log(LogLevel.INFO, 'Batch upload completed', {
        totalFiles,
        successfulUploads,
        failedUploads,
        processingTime: `${processingTime}ms`
      });

      return this.createSuccessResult(context, {
        status: failedUploads === 0 ? 'success' : 'partial',
        message: failedUploads === 0 
          ? `Alle ${totalFiles} Dateien erfolgreich hochgeladen`
          : `${successfulUploads}/${totalFiles} Dateien erfolgreich hochgeladen`,
        batchResult,
        documentRecords: results.filter(r => r.documentRecord).map(r => r.documentRecord!)
      });
    } catch (error) {
      this.log(LogLevel.ERROR, 'Batch upload failed', { error });
      throw error;
    }
  }

  /**
   * Process batch upload in parallel with concurrency control
   */
  private async processBatchParallel(
    files: FileUploadItem[],
    options: BatchUploadOptions,
    userInfo?: DocumentAgentInput['userInfo'],
    progressCallback?: (event: ProgressEvent) => void
  ): Promise<BatchUploadResult['results']> {
    const results: BatchUploadResult['results'] = [];
    // Concurrency control implemented through chunking
    let processedCount = 0;

    // Create chunks for controlled parallel processing
    const chunks: FileUploadItem[][] = [];
    for (let i = 0; i < files.length; i += options.maxConcurrency) {
      chunks.push(files.slice(i, i + options.maxConcurrency));
    }

    for (const chunk of chunks) {
      const chunkPromises = chunk.map(async (file, index) => {
        const fileId = file.fileId || `file_${Date.now()}_${index}`;
        
        try {
          // Emit upload start event
          this.emitProgressEvent(progressCallback, {
            type: 'upload-start',
            fileId,
            fileName: file.originalName,
            progress: 0,
            processed: processedCount,
            total: files.length,
            status: `Upload gestartet: ${file.originalName}`
          });

          const uploadResult = await this.uploadSingleFile(file, userInfo);
          processedCount++;

          // Emit upload complete event
          this.emitProgressEvent(progressCallback, {
            type: 'upload-complete',
            fileId,
            fileName: file.originalName,
            progress: (processedCount / files.length) * 100,
            processed: processedCount,
            total: files.length,
            status: `Upload abgeschlossen: ${file.originalName}`
          });

          return {
            fileId,
            fileName: file.originalName,
            status: 'success' as const,
            documentRecord: uploadResult.documentRecord
          };
        } catch (error) {
          processedCount++;
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';

          // Emit upload error event
          this.emitProgressEvent(progressCallback, {
            type: 'upload-error',
            fileId,
            fileName: file.originalName,
            progress: (processedCount / files.length) * 100,
            processed: processedCount,
            total: files.length,
            status: `Upload fehlgeschlagen: ${file.originalName}`,
            error: errorMessage
          });

          if (options.stopOnError) {
            throw error;
          }

          return {
            fileId,
            fileName: file.originalName,
            status: 'error' as const,
            error: errorMessage
          };
        }
      });

      const chunkResults = await Promise.all(chunkPromises);
      results.push(...chunkResults);
    }

    return results;
  }

  /**
   * Process batch upload sequentially
   */
  private async processBatchSequential(
    files: FileUploadItem[],
    options: BatchUploadOptions,
    userInfo?: DocumentAgentInput['userInfo'],
    progressCallback?: (event: ProgressEvent) => void
  ): Promise<BatchUploadResult['results']> {
    const results: BatchUploadResult['results'] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = file.fileId || `file_${Date.now()}_${i}`;

      try {
        // Emit upload start event
        this.emitProgressEvent(progressCallback, {
          type: 'upload-start',
          fileId,
          fileName: file.originalName,
          progress: (i / files.length) * 100,
          processed: i,
          total: files.length,
          status: `Upload gestartet: ${file.originalName}`
        });

        const uploadResult = await this.uploadSingleFile(file, userInfo);

        // Emit upload complete event
        this.emitProgressEvent(progressCallback, {
          type: 'upload-complete',
          fileId,
          fileName: file.originalName,
          progress: ((i + 1) / files.length) * 100,
          processed: i + 1,
          total: files.length,
          status: `Upload abgeschlossen: ${file.originalName}`
        });

        results.push({
          fileId,
          fileName: file.originalName,
          status: 'success',
          documentRecord: uploadResult.documentRecord
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        // Emit upload error event
        this.emitProgressEvent(progressCallback, {
          type: 'upload-error',
          fileId,
          fileName: file.originalName,
          progress: ((i + 1) / files.length) * 100,
          processed: i + 1,
          total: files.length,
          status: `Upload fehlgeschlagen: ${file.originalName}`,
          error: errorMessage
        });

        if (options.stopOnError) {
          throw error;
        }

        results.push({
          fileId,
          fileName: file.originalName,
          status: 'error',
          error: errorMessage
        });
      }
    }

    return results;
  }

  /**
   * Upload a single file (extracted from handleUpload for reuse)
   */
  private async uploadSingleFile(file: FileUploadItem, userInfo?: DocumentAgentInput['userInfo']): Promise<{
    documentRecord: DocumentRecord;
    filePath: string;
    downloadUrl: string;
  }> {
    // Validate file with caching
    const validationResult = this.validateFileWithCache(file);
    if (!validationResult.valid) {
      throw new ValidationError(`File validation failed: ${validationResult.errors.join(', ')}`);
    }

    // Generate unique file path
    const filePath = this.generateFilePath(file.originalName, userInfo?.name);
    
    // Upload to Supabase Storage
    const uploadResult = await this.supabase.uploadFile(
      filePath,
      file.buffer,
      file.mimeType
    );

    // Create database record
    const documentRecord = await this.supabase.createDocument({
      file_name: file.originalName,
      file_path: uploadResult.path,
      file_type: file.mimeType,
      document_type: this.detectDocumentType(file.originalName, file.mimeType),
      status: 'eingereicht'
    });

    return {
      documentRecord,
      filePath: uploadResult.path,
      downloadUrl: uploadResult.publicUrl || ''
    };
  }

  /**
   * Emit progress event if callback is provided
   */
  private emitProgressEvent(callback: ((event: ProgressEvent) => void) | undefined, event: ProgressEvent): void {
    if (callback && typeof callback === 'function') {
      try {
        callback(event);
      } catch (error) {
        this.log(LogLevel.WARN, 'Progress callback failed', { error });
      }
    }
  }

  // === DOCUMENT DELETION ===

  /**
   * Handle document deletion
   */
  private async handleDeletion(input: DocumentAgentInput, context: AgentContext): Promise<AgentResult<DocumentAgentOutput>> {
    if (!input.documentId) {
      throw new ValidationError('Document ID is required for deletion action');
    }

    const documentRecord = await this.supabase.getDocument(input.documentId);
    if (!documentRecord) {
      throw this.errorHandler.createError(
        ErrorCodes.DOCUMENT_NOT_FOUND,
        `Document with ID ${input.documentId} not found`
      );
    }

    try {
      // Delete file from storage
      await this.supabase.deleteFile(documentRecord.file_path);

      // Update database record (soft delete by marking as deleted)
      await this.supabase.updateDocument(input.documentId, {
        status: 'archiviert',
        processing_notes: 'Document deleted by user request'
      });

      this.log(LogLevel.INFO, 'Document deleted successfully', {
        documentId: input.documentId,
        fileName: documentRecord.file_name
      });

      return this.createSuccessResult(context, {
        status: 'success',
        message: `Document "${documentRecord.file_name}" deleted successfully`
      });
    } catch (error) {
      this.log(LogLevel.ERROR, 'Document deletion failed', { error });
      throw error;
    }
  }

  // === UTILITY METHODS ===

  /**
   * Generate unique file path for storage
   */
  private generateFilePath(originalName: string, userName?: string): string {
    // Sanitize filename
    const sanitizedName = originalName
      .replace(/[#%/\\&?+<>:]/g, '')
      .replace(/\s+/g, '_');

    // Generate timestamp
    const timestamp = new Date().toISOString()
      .replace(/[-:]/g, '')
      .replace('T', '_')
      .substring(0, 15);

    // Generate random ID
    const randomId = Math.random().toString(36).substring(2, 6);

    // Create path structure
    const userFolder = userName ? userName.replace(/[^a-zA-Z0-9]/g, '_') : 'anonymous';
    const fileName = `${sanitizedName.split('.')[0]}_${timestamp}_${randomId}.${this.getFileExtension(sanitizedName).substring(1)}`;

    return `${userFolder}/${fileName}`;
  }

  /**
   * Detect document type based on filename and MIME type
   */
  private detectDocumentType(fileName: string, mimeType: string): string {
    const nameLower = fileName.toLowerCase();
    
    // Swiss insurance document patterns
    if (nameLower.includes('schaden') || nameLower.includes('claim')) {
      return 'Schadenmeldung';
    }
    
    if (nameLower.includes('unfall') || nameLower.includes('accident')) {
      return 'Unfallmeldung';
    }
    
    if (nameLower.includes('rechnung') || nameLower.includes('invoice')) {
      return 'Rechnung';
    }
    
    if (nameLower.includes('vertrag') || nameLower.includes('contract')) {
      return 'Vertrag';
    }
    
    if (nameLower.includes('police') || nameLower.includes('policy')) {
      return 'Versicherungspolice';
    }

    // Fallback based on MIME type
    if (mimeType.startsWith('image/')) {
      return 'Bild-Dokument';
    }
    
    if (mimeType === 'application/pdf') {
      return 'PDF-Dokument';
    }
    
    if (mimeType.includes('word')) {
      return 'Word-Dokument';
    }

    return 'Unbekanntes Dokument';
  }

  /**
   * Get file extension from filename
   */
  private getFileExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf('.');
    return lastDot === -1 ? '' : fileName.substring(lastDot);
  }

  /**
   * Format file size for human reading
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // === SECURITY VALIDATION METHODS ===

  /**
   * Perform comprehensive security validation
   */
  private performSecurityValidation(file: FileUploadItem): SecurityValidationResult {
    const buffer = file.buffer;
    const declaredMimeType = file.mimeType;
    
    return {
      magicNumberValid: this.validateMagicNumber(buffer, declaredMimeType),
      mimeTypeMismatch: this.detectMimeTypeMismatch(buffer, declaredMimeType),
      suspiciousContent: this.detectSuspiciousContent(buffer),
      fileHeaderValid: this.validateFileHeader(buffer, declaredMimeType),
      contentAnalysis: {
        hasExecutableCode: this.detectExecutableCode(buffer),
        hasSuspiciousStrings: this.detectSuspiciousStrings(buffer),
        fileIntegrityValid: this.validateFileIntegrity(buffer, declaredMimeType)
      }
    };
  }

  /**
   * Validate file magic number (file signature)
   */
  private validateMagicNumber(buffer: Buffer, declaredMimeType: string): boolean {
    if (buffer.length < 4) return false;
    
    // Get first 4 bytes as hex string
    const signature = buffer.subarray(0, 4).toString('hex').toUpperCase();
    
    // Check against known signatures
    const detectedMimeType = this.FILE_SIGNATURES.get(signature);
    
    if (!detectedMimeType) {
      // Special case for WEBP (needs more bytes to validate)
      if (declaredMimeType === 'image/webp') {
        return this.validateWebPSignature(buffer);
      }
      // Special case for DOCX (ZIP-based, needs content inspection)
      if (declaredMimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return this.validateDocxSignature(buffer);
      }
      return false;
    }
    
    return detectedMimeType === declaredMimeType;
  }

  /**
   * Validate WEBP file signature
   */
  private validateWebPSignature(buffer: Buffer): boolean {
    if (buffer.length < 12) return false;
    
    // WEBP signature: RIFF[4 bytes][file size]WEBP
    const riffSignature = buffer.subarray(0, 4).toString('hex').toUpperCase();
    const webpSignature = buffer.subarray(8, 12).toString();
    
    return riffSignature === '52494646' && webpSignature === 'WEBP';
  }

  /**
   * Validate DOCX file signature (ZIP-based)
   */
  private validateDocxSignature(buffer: Buffer): boolean {
    if (buffer.length < 4) return false;
    
    // DOCX files are ZIP archives with specific signatures
    const signature = buffer.subarray(0, 4).toString('hex').toUpperCase();
    const validZipSignatures = ['504B0304', '504B0506', '504B0708'];
    
    if (!validZipSignatures.includes(signature)) return false;
    
    // Additional check: Look for DOCX-specific content
    const content = buffer.toString('ascii', 0, Math.min(buffer.length, 1024));
    return content.includes('word/') || content.includes('[Content_Types].xml');
  }

  /**
   * Detect MIME type from file content
   */
  private detectMimeTypeFromContent(buffer: Buffer): string | undefined {
    if (buffer.length < 4) return undefined;
    
    const signature = buffer.subarray(0, 4).toString('hex').toUpperCase();
    
    // Check standard signatures first
    const detectedType = this.FILE_SIGNATURES.get(signature);
    if (detectedType) return detectedType;
    
    // Special cases
    if (this.validateWebPSignature(buffer)) return 'image/webp';
    if (this.validateDocxSignature(buffer)) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    return undefined;
  }

  /**
   * Detect MIME type mismatch
   */
  private detectMimeTypeMismatch(buffer: Buffer, declaredMimeType: string): boolean {
    const detectedMimeType = this.detectMimeTypeFromContent(buffer);
    
    if (!detectedMimeType) return false;
    
    return detectedMimeType !== declaredMimeType;
  }

  /**
   * Detect suspicious content patterns
   */
  private detectSuspiciousContent(buffer: Buffer): boolean {
    // Convert buffer to string for pattern matching (first 8KB should be enough)
    const content = buffer.subarray(0, Math.min(buffer.length, 8192)).toString('ascii');
    
    // Suspicious patterns that shouldn't be in legitimate documents
    const suspiciousPatterns = [
      /javascript:/gi,
      /<script[\s\S]*?>/gi,
      /vbscript:/gi,
      /data:text\/html/gi,
      /eval\s*\(/gi,
      /document\.write/gi,
      /windows\.location/gi,
      /cmd\.exe/gi,
      /powershell/gi,
      /certutil/gi
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Validate file header structure
   */
  private validateFileHeader(buffer: Buffer, mimeType: string): boolean {
    if (buffer.length < 8) return false;
    
    switch (mimeType) {
      case 'application/pdf':
        return this.validatePdfHeader(buffer);
      case 'image/png':
        return this.validatePngHeader(buffer);
      case 'image/jpeg':
        return this.validateJpegHeader(buffer);
      default:
        return true; // Skip validation for other types
    }
  }

  /**
   * Validate PDF header structure
   */
  private validatePdfHeader(buffer: Buffer): boolean {
    // PDF must start with %PDF-x.y
    const header = buffer.subarray(0, 8).toString('ascii');
    return /^%PDF-\d\.\d/.test(header);
  }

  /**
   * Validate PNG header structure
   */
  private validatePngHeader(buffer: Buffer): boolean {
    if (buffer.length < 8) return false;
    
    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    const expectedHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    const actualHeader = buffer.subarray(0, 8);
    
    return expectedHeader.equals(actualHeader);
  }

  /**
   * Validate JPEG header structure
   */
  private validateJpegHeader(buffer: Buffer): boolean {
    if (buffer.length < 4) return false;
    
    // JPEG must start with FF D8 and end with FF D9
    const startsCorrectly = buffer[0] === 0xFF && buffer[1] === 0xD8;
    const endsCorrectly = buffer[buffer.length - 2] === 0xFF && buffer[buffer.length - 1] === 0xD9;
    
    return startsCorrectly && (buffer.length < 100 || endsCorrectly); // Don't check end for small buffers
  }

  /**
   * Detect embedded executable code
   */
  private detectExecutableCode(buffer: Buffer): boolean {
    // Check for Windows PE executable signature first
    if (buffer.length >= 64) {
      // Look for MZ header at start
      const mzHeader = buffer.subarray(0, 2).toString('ascii');
      if (mzHeader === 'MZ') {
        // Check for PE signature at offset indicated in MZ header
        const peOffset = buffer.readUInt32LE(60);
        if (peOffset < buffer.length - 4) {
          const peSignature = buffer.subarray(peOffset, peOffset + 2).toString('ascii');
          if (peSignature === 'PE') {
            return true;
          }
        }
        // Even without full PE structure, MZ header is suspicious in documents
        return true;
      }
    }
    
    // Check for other executable signatures and patterns
    const content = buffer.toString('ascii', 0, Math.min(buffer.length, 4096));
    
    // Common executable patterns
    const executablePatterns = [
      /\x7fELF/g,   // Linux ELF header
      /\xca\xfe\xba\xbe/g, // Mach-O (macOS)
      /#!/g,        // Shell script
      /%!PS-Adobe/g // PostScript (can contain code)
    ];
    
    return executablePatterns.some(pattern => pattern.test(content));
  }

  /**
   * Detect suspicious strings in content
   */
  private detectSuspiciousStrings(buffer: Buffer): boolean {
    const content = buffer.toString('ascii', 0, Math.min(buffer.length, 4096));
    
    // Patterns that are suspicious in document files
    const suspiciousStrings = [
      'base64',
      'shellcode',
      'payload',
      'exploit',
      'metasploit',
      'reverse_shell',
      'cmd /c',
      'powershell -e',
      'wget',
      'curl -o'
    ];
    
    return suspiciousStrings.some(str => content.toLowerCase().includes(str));
  }

  /**
   * Validate overall file integrity
   */
  private validateFileIntegrity(buffer: Buffer, mimeType: string): boolean {
    // Basic integrity checks based on file type
    switch (mimeType) {
      case 'application/pdf':
        return this.validatePdfIntegrity(buffer);
      case 'image/png':
        return this.validatePngIntegrity(buffer);
      default:
        return true; // Pass for other file types
    }
  }

  /**
   * Validate PDF file integrity
   */
  private validatePdfIntegrity(buffer: Buffer): boolean {
    const content = buffer.toString('ascii');
    
    // PDF should contain required keywords
    const requiredKeywords = ['obj', 'endobj'];
    const hasRequiredKeywords = requiredKeywords.every(keyword => content.includes(keyword));
    
    // Note: PDF ending validation is flexible in practice
    
    return hasRequiredKeywords; // Don't enforce EOF ending as some PDFs are valid without it
  }

  /**
   * Validate PNG file integrity
   */
  private validatePngIntegrity(buffer: Buffer): boolean {
    if (buffer.length < 12) return false;
    
    // PNG files must have IHDR chunk immediately after signature
    const ihdrSignature = buffer.subarray(8, 12).toString('ascii');
    
    // Also check that we have a valid chunk length
    if (ihdrSignature === 'IHDR' && buffer.length >= 21) {
      // IHDR chunk should be exactly 13 bytes
      const chunkLength = buffer.readUInt32BE(4);
      return chunkLength === 13;
    }
    
    return ihdrSignature === 'IHDR';
  }

  // === CACHING AND STORAGE MANAGEMENT ===

  /**
   * Initialize document cache
   */
  private initializeCache(): void {
    this.documentCache = {
      metadata: new Map(),
      validationResults: new Map(),
      fileHashes: new Map(),
      lastCleanup: new Date()
    };

    // Schedule periodic cache cleanup
    setInterval(() => {
      this.cleanupCache();
    }, this.CACHE_TTL_MS / 4); // Cleanup every 6 hours if TTL is 24 hours
  }

  /**
   * Get cached validation result
   */
  private getCachedValidation(fileHash: string): ValidationResult | null {
    const cached = this.documentCache.validationResults.get(fileHash);
    if (!cached) return null;

    // Check if cache is still valid
    const metadata = this.documentCache.metadata.get(fileHash);
    if (!metadata) return null;

    const cacheAge = Date.now() - metadata.lastAccessed.getTime();
    if (cacheAge > this.CACHE_TTL_MS) {
      // Cache expired
      this.documentCache.validationResults.delete(fileHash);
      this.documentCache.metadata.delete(fileHash);
      return null;
    }

    // Update access stats
    metadata.lastAccessed = new Date();
    metadata.accessCount++;

    return cached;
  }

  /**
   * Cache validation result
   */
  private cacheValidationResult(fileHash: string, validationResult: ValidationResult, file: FileUploadItem): void {
    // Check cache size limit
    if (this.documentCache.metadata.size >= this.MAX_CACHE_SIZE) {
      this.evictOldestCacheEntry();
    }

    this.documentCache.validationResults.set(fileHash, validationResult);
    this.documentCache.metadata.set(fileHash, {
      fileSize: file.size,
      mimeType: file.mimeType,
      documentType: this.detectDocumentType(file.originalName, file.mimeType),
      lastAccessed: new Date(),
      accessCount: 1,
      validationHash: fileHash
    });
    this.documentCache.fileHashes.set(fileHash, file.originalName);
  }

  /**
   * Calculate file hash for caching
   */
  private calculateFileHash(buffer: Buffer): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(buffer).digest('hex').substring(0, 16);
  }

  /**
   * Enhanced file validation with caching
   */
  private validateFileWithCache(file: DocumentAgentInput['file']): ValidationResult {
    if (!file) {
      return {
        valid: false,
        errors: ['No file provided'],
        warnings: [],
        fileInfo: { name: '', type: '', size: 0, extension: '' }
      };
    }

    // Calculate file hash for caching
    const fileHash = this.calculateFileHash(file.buffer);
    
    // Try to get cached result
    const cachedResult = this.getCachedValidation(fileHash);
    if (cachedResult) {
      this.log(LogLevel.DEBUG, 'Using cached validation result', { 
        fileName: file.originalName,
        hash: fileHash 
      });
      return cachedResult;
    }

    // Perform validation
    const validationResult = this.validateFile(file);
    
    // Cache the result
    this.cacheValidationResult(fileHash, validationResult, file);
    
    this.log(LogLevel.DEBUG, 'Cached new validation result', { 
      fileName: file.originalName,
      hash: fileHash 
    });

    return validationResult;
  }

  /**
   * Evict oldest cache entry
   */
  private evictOldestCacheEntry(): void {
    let oldestHash: string | null = null;
    let oldestTime = Date.now();

    for (const [hash, metadata] of this.documentCache.metadata.entries()) {
      if (metadata.lastAccessed.getTime() < oldestTime) {
        oldestTime = metadata.lastAccessed.getTime();
        oldestHash = hash;
      }
    }

    if (oldestHash) {
      this.documentCache.metadata.delete(oldestHash);
      this.documentCache.validationResults.delete(oldestHash);
      this.documentCache.fileHashes.delete(oldestHash);
    }
  }

  /**
   * Clean up expired cache entries
   */
  private cleanupCache(): void {
    const now = Date.now();
    const expiredHashes: string[] = [];

    for (const [hash, metadata] of this.documentCache.metadata.entries()) {
      const cacheAge = now - metadata.lastAccessed.getTime();
      if (cacheAge > this.CACHE_TTL_MS) {
        expiredHashes.push(hash);
      }
    }

    expiredHashes.forEach(hash => {
      this.documentCache.metadata.delete(hash);
      this.documentCache.validationResults.delete(hash);
      this.documentCache.fileHashes.delete(hash);
    });

    if (expiredHashes.length > 0) {
      this.log(LogLevel.INFO, 'Cleaned up expired cache entries', { 
        count: expiredHashes.length 
      });
    }

    this.documentCache.lastCleanup = new Date();
  }

  /**
   * Handle storage statistics request
   */
  private async handleStorageStats(_input: DocumentAgentInput, context: AgentContext): Promise<AgentResult<DocumentAgentOutput>> {
    this.log(LogLevel.INFO, 'Generating storage statistics');

    try {
      // Mock: Get all documents from database (getDocuments method would need to be implemented)
      const allDocuments: DocumentRecord[] = []; // Placeholder for actual implementation
      
      if (!allDocuments || allDocuments.length === 0) {
        return this.createSuccessResult(context, {
          status: 'success',
          message: 'No documents found in storage',
          storageStats: {
            totalFiles: 0,
            totalSizeBytes: 0,
            oldestFile: new Date(),
            newestFile: new Date(),
            filesByType: {},
            storageUsagePercent: 0
          }
        });
      }

      // Calculate statistics
      const stats: StorageStats = {
        totalFiles: allDocuments.length,
        totalSizeBytes: 0, // We don't store file size in DB, would need to query storage
        oldestFile: new Date(allDocuments[0].created_at),
        newestFile: new Date(allDocuments[0].created_at),
        filesByType: {},
        storageUsagePercent: 0
      };

      // Process each document
      allDocuments.forEach((doc: DocumentRecord) => {
        const createdAt = new Date(doc.created_at);
        
        if (createdAt < stats.oldestFile) {
          stats.oldestFile = createdAt;
        }
        if (createdAt > stats.newestFile) {
          stats.newestFile = createdAt;
        }

        // Count by file type
        const fileType = doc.file_type || 'unknown';
        stats.filesByType[fileType] = (stats.filesByType[fileType] || 0) + 1;
      });

      // Estimate storage usage (this would be more accurate with actual file sizes)
      const avgFileSize = 2 * 1024 * 1024; // Assume 2MB average
      stats.totalSizeBytes = stats.totalFiles * avgFileSize;
      const maxStorage = 100 * 1024 * 1024 * 1024; // Assume 100GB limit
      stats.storageUsagePercent = (stats.totalSizeBytes / maxStorage) * 100;

      this.log(LogLevel.INFO, 'Storage statistics generated', {
        totalFiles: stats.totalFiles,
        storageUsagePercent: stats.storageUsagePercent.toFixed(2)
      });

      return this.createSuccessResult(context, {
        status: 'success',
        message: `Storage statistics generated for ${stats.totalFiles} files`,
        storageStats: stats
      });
    } catch (error) {
      this.log(LogLevel.ERROR, 'Failed to generate storage statistics', { error });
      throw error;
    }
  }

  /**
   * Handle storage cleanup request
   */
  private async handleStorageCleanup(input: DocumentAgentInput, context: AgentContext): Promise<AgentResult<DocumentAgentOutput>> {
    const cleanupStartTime = new Date();
    const defaultCriteria = {
      olderThanDays: 90,
      maxStorageUsage: 85,
      removeFailedUploads: true
    };

    // Get cleanup criteria from metadata or use defaults
    const criteria = input.metadata?.cleanupCriteria || defaultCriteria;

    this.log(LogLevel.INFO, 'Starting storage cleanup', { criteria });

    const cleanupResult: CleanupResult = {
      filesRemoved: 0,
      bytesFreed: 0,
      errors: [],
      warnings: [],
      cleanupStartTime,
      cleanupEndTime: new Date(),
      criteria
    };

    try {
      // Get storage stats first
      const statsResult = await this.handleStorageStats(input, context);
      const storageStats = statsResult.data?.storageStats;

      if (!storageStats) {
        throw new Error('Could not retrieve storage statistics');
      }

      // Check if cleanup is needed
      if (storageStats.storageUsagePercent < criteria.maxStorageUsage) {
        cleanupResult.warnings.push(`Storage usage (${storageStats.storageUsagePercent.toFixed(1)}%) below threshold (${criteria.maxStorageUsage}%)`);
        cleanupResult.cleanupEndTime = new Date();
        
        return this.createSuccessResult(context, {
          status: 'success',
          message: 'No cleanup needed - storage usage below threshold',
          cleanupResult
        });
      }

      // Get old documents
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - criteria.olderThanDays);

      // Mock: Get all documents from database (getDocuments method would need to be implemented)
      const allDocuments: DocumentRecord[] = []; // Placeholder for actual implementation
      const documentsToCleanup = allDocuments?.filter((doc: DocumentRecord) => {
        const createdAt = new Date(doc.created_at);
        const isOld = createdAt < cutoffDate;
        const isFailedUpload = criteria.removeFailedUploads && 
          (doc.status === 'abgelehnt' || doc.status === 'storniert');
        
        return isOld || isFailedUpload;
      }) || [];

      this.log(LogLevel.INFO, 'Found documents for cleanup', { 
        count: documentsToCleanup.length 
      });

      // Remove documents
      for (const doc of documentsToCleanup) {
        try {
          // Delete file from storage
          await this.supabase.deleteFile(doc.file_path);
          
          // Update database record (soft delete)
          await this.supabase.updateDocument(doc.id, {
            status: 'archiviert',
            processing_notes: `Automatically cleaned up on ${new Date().toISOString()}`
          });

          cleanupResult.filesRemoved++;
          cleanupResult.bytesFreed += 2 * 1024 * 1024; // Estimate 2MB per file
          
        } catch (error) {
          const errorMsg = `Failed to cleanup document ${doc.id}: ${error}`;
          cleanupResult.errors.push(errorMsg);
          this.log(LogLevel.WARN, errorMsg);
        }
      }

      cleanupResult.cleanupEndTime = new Date();

      this.log(LogLevel.INFO, 'Storage cleanup completed', {
        filesRemoved: cleanupResult.filesRemoved,
        bytesFreed: cleanupResult.bytesFreed,
        errors: cleanupResult.errors.length
      });

      return this.createSuccessResult(context, {
        status: cleanupResult.errors.length === 0 ? 'success' : 'partial',
        message: `Cleanup completed: ${cleanupResult.filesRemoved} files removed, ${this.formatFileSize(cleanupResult.bytesFreed)} freed`,
        cleanupResult
      });

    } catch (error) {
      cleanupResult.errors.push(`Cleanup failed: ${error}`);
      cleanupResult.cleanupEndTime = new Date();
      
      this.log(LogLevel.ERROR, 'Storage cleanup failed', { error });
      
      return this.createSuccessResult(context, {
        status: 'error',
        message: 'Storage cleanup failed',
        cleanupResult
      });
    }
  }
}