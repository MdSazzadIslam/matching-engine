import React, { memo } from 'react';
import { Button } from '../../common/Button';
import './styles.css';

interface UploadButtonProps {
  isDisabled: boolean;
  isLoading: boolean;
}

export const UploadButton = memo<UploadButtonProps>(({
  isDisabled,
  isLoading,
}) => (
  <Button
    type="submit"
    disabled={isDisabled}
    className="upload-button"
  >
    {isLoading ? (
      <div className="loading-container">
        <div className="spinner" />
        <span>Processing...</span>
      </div>
    ) : (
      <>
        <div className="upload-icon" />
        <span>Upload</span>
      </>
    )}
  </Button>
));

UploadButton.displayName = 'UploadButton';