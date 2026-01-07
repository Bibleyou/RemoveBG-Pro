
export interface ProcessingState {
  isProcessing: boolean;
  status: string;
  error: string | null;
}

export interface ImageData {
  original: string | null;
  processed: string | null;
  mimeType: string;
}
