import React, { memo } from "react";
import { Card } from "../../common/Card";
import { ResultsDisplay } from "../../ResultsDisplay";
import { UploadArea } from "../UploadArea";
import { UploadButton } from "../UploadButton";
import { ErrorMessage } from "../../common/ErrorMessage";
import { useFileUpload } from "../../../hooks/useFileUpload";
import "./styles.css";

export const FileUpload = memo(() => {
  const {
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
  } = useFileUpload();

  return (
    <Card>
      <div className="file-upload">
        <h4 className="file-upload__title">Upload the input file</h4>

        <form onSubmit={handleSubmit} className="file-upload__form">
          <UploadArea
            file={file}
            isDragging={isDragging}
            onFileChange={handleFileChange}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />

          {error && <ErrorMessage message={error} />}

          <div className="file-upload__button-container">
            <UploadButton isDisabled={!file || loading} isLoading={loading} />
          </div>
        </form>

        {loading && uploadProgress > 0 && (
          <div className="upload-progress">
            <div
              className="upload-progress-bar"
              style={{ width: `${uploadProgress}%` }}
            />
            <span className="upload-progress-text">
              Uploading: {uploadProgress}%
            </span>
          </div>
        )}

        {results && <ResultsDisplay results={results} />}
      </div>
    </Card>
  );
});

FileUpload.displayName = "FileUpload";
