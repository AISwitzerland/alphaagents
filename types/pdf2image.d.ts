declare module 'pdf2image' {
  interface ConvertOptions {
    width?: number;
    height?: number;
    density?: number;
    format?: string;
    outputDirectory?: string;
    outputName?: string;
  }

  const pdf2image: {
    convert: (pdfPath: string, options?: ConvertOptions) => Promise<string[]>;
  };

  export default pdf2image;
} 