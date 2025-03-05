export interface Document {
  file: Buffer;
  fileName: string;
  mimeType: string;
  fileSize: number;
  metadata: {
    originalName: string;
    size: number;
    mimeType: string;
    uploadedBy: {
      name: string;
      email: string;
      id?: string;
    };
    uploadedAt: string;
    [key: string]: unknown;
  };
} 