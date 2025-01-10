export interface MatchingResult {
  vacancyId: string;
  candidateId: string;
  overallScore: number;
}

export interface FileUploadHookReturn {
  file: File | null;
  results: string | null;
  error: string | null;
  loading: boolean;
  isDragging: boolean;
  uploadProgress: number;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragEnter: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}
