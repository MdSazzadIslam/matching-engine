import { useState, useCallback } from 'react';
import { calculateMatching } from '../api/matching';
import type { FileUploadHookReturn } from '../types';

// Constants for file validation
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPE = 'text/plain';

// Helper function to validate file
const validateFile = (file: File): { isValid: boolean; error?: string } => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  if (file.type !== ALLOWED_FILE_TYPE) {
    return { isValid: false, error: 'Please upload a valid .txt file' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { 
      isValid: false, 
      error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit` 
    };
  }

  return { isValid: true };
};

export const useFileUpload = (): FileUploadHookReturn => {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const resetStates = useCallback(() => {
    setError(null);
    setResults(null);
    setUploadProgress(0);
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validation = validateFile(selectedFile);
      if (validation.isValid) {
        setFile(selectedFile);
        resetStates();
      } else {
        setError(validation.error || 'Invalid file');
        setFile(null);
      }
    }
  }, [resetStates]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validation = validateFile(droppedFile);
      if (validation.isValid) {
        setFile(droppedFile);
        resetStates();
      } else {
        setError(validation.error || 'Invalid file');
        setFile(null);
      }
    }
  }, [resetStates]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);

      // Create FormData with progress tracking
      const formData = new FormData();
      formData.append('file', file);

      const result = await calculateMatching(file);

      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setResults(null);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  }, [file]);

  return {
    file,
    results,
    error,
    loading,
    isDragging,
    uploadProgress,
    handleFileChange,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleSubmit,
  };
};