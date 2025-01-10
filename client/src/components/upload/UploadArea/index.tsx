import React, { memo } from 'react';
import './styles.css';

interface UploadAreaProps {
  file: File | null;
  isDragging: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export const UploadArea = memo<UploadAreaProps>(({
  file,
  isDragging,
  onFileChange,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
}) => (
  <div className="file-input-wrapper">
    <label>
      <input
        type="file"
        accept=".txt"
        onChange={onFileChange}
        className="file-input"
      />
      <div 
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <span className="choose-file-button">Choose file</span>
        <span className="file-name">
          {file ? file.name : "No file chosen"}
        </span>
      </div>
    </label>
  </div>
));

UploadArea.displayName = 'UploadArea';