'use client'

import React from 'react'
import { Dialog } from './Dialog'

export interface FilePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  fileName?: string;
}

export const FilePreviewDialog: React.FC<FilePreviewDialogProps> = ({
  isOpen,
  onClose,
  url,
  fileName = 'Document'
}) => {
  const isImage = /\.(jpg|jpeg|png|gif|webp|svg)($|\?)/i.test(url);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Document Preview"
      description={fileName}
    >
      {isImage ? (
        <div className="w-full h-full flex items-center justify-center bg-black/20 rounded-xl overflow-auto p-4 min-h-[400px]">
          <img
            src={url}
            alt="Document preview"
            className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-md animate-in fade-in-50"
          />
        </div>
      ) : (
        <iframe
          src={url}
          className="w-full h-full rounded-xl bg-white border border-white/10"
          title="Document preview"
        />
      )}
    </Dialog>
  )
}

export default FilePreviewDialog;
