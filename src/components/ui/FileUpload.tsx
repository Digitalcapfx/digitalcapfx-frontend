'use client'

import React, { useState, useEffect } from 'react'
import { Upload, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { uploadService } from '@/services/upload.service'
import { toast } from 'sonner'
import { FilePreviewDialog } from './FilePreviewDialog'

export interface FileUploadProps {
  label?: string;
  purpose: 'kyc' | 'avatar' | 'document' | 'business' | 'misc';
  onUploadComplete: (readUrl: string, objectPath: string) => void;
  accept?: string;
  required?: boolean;
  value?: string;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  purpose,
  onUploadComplete,
  accept = 'image/*,application/pdf',
  required = false,
  value,
  error
}) => {
  const [uploading, setUploading] = useState(false);
  const [completed, setCompleted] = useState(!!value);
  const [uploadedUrl, setUploadedUrl] = useState(value || '');
  const [fileName, setFileName] = useState('');
  const [localError, setLocalError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const inputId = React.useId();

  useEffect(() => {
    if (value) {
      setUploadedUrl(value);
      setCompleted(true);
    } else {
      setUploadedUrl('');
      setCompleted(false);
    }
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Cap at 15MB matching Swagger spec
    if (file.size > 15 * 1024 * 1024) {
      toast.error('File size exceeds 15 MB limit.');
      setLocalError('File size exceeds 15 MB limit.');
      return;
    }

    setUploading(true);
    setCompleted(false);
    setLocalError('');
    setFileName(file.name);

    try {
      const res = await uploadService.uploadFile(file, purpose);
      if (res.success && res.data) {
        const url = res.data.readUrl || res.data.object;
        setUploadedUrl(url);
        setCompleted(true);
        toast.success(`Uploaded ${file.name} successfully!`);
        // Trigger the callback with readUrl and objectPath
        onUploadComplete(url, res.data.object);
      } else {
        throw new Error(res.error?.message || 'Upload failed');
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      const msg = err.response?.data?.error?.message || err.message || 'File upload failed.';
      setLocalError(msg);
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1.5 text-left w-full">
      {label && (
        <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block select-none">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Hidden File Input element triggered via htmlFor label bindings */}
      <input
        type="file"
        id={inputId}
        accept={accept}
        disabled={uploading}
        onChange={handleFileChange}
        className="hidden"
      />

      {completed ? (
        /* Completed State (Distinct links prevent click event overlays) */
        <div
          className={cn(
            "border border-emerald-500/30 bg-emerald-500/[0.02] hover:bg-emerald-500/[0.04] rounded-xl p-5 transition duration-250 flex flex-col items-center justify-center space-y-2 select-none min-h-[105px]",
            (error || localError) && "border-rose-500/30 bg-rose-500/[0.02]"
          )}
        >
          <CheckCircle className="h-6 w-6 text-emerald-400 animate-in zoom-in-75 duration-200" />
          <div className="text-center space-y-1">
            <span className="text-[11px] font-semibold text-white block truncate max-w-[240px] px-2">
              {fileName || 'File uploaded successfully'}
            </span>
            <div className="flex items-center justify-center space-x-3.5">
              {uploadedUrl && (
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="text-[9px] font-bold text-emerald-400 hover:underline cursor-pointer bg-transparent border-0 p-0 focus:outline-none"
                >
                  View File
                </button>
              )}
              {uploadedUrl && <span className="text-slate-650 text-[9px]">•</span>}
              <label
                htmlFor={inputId}
                className="text-[9px] font-bold text-primary-400 hover:underline cursor-pointer"
              >
                Replace file
              </label>
            </div>
          </div>
        </div>
      ) : uploading ? (
        /* Uploading Spinner State */
        <div
          className="border border-primary-500/35 bg-primary-500/[0.02] rounded-xl p-5 flex flex-col items-center justify-center space-y-2 select-none min-h-[105px]"
        >
          <RefreshCw className="h-6 w-6 text-primary-400 animate-spin" />
          <span className="text-[11px] font-semibold text-slate-400 text-center animate-pulse">
            Uploading {fileName || 'file'}...
          </span>
        </div>
      ) : (
        /* Idle Dropzone Input Area */
        <label
          htmlFor={inputId}
          className={cn(
            "border border-dashed rounded-xl p-5 transition duration-250 flex flex-col items-center justify-center space-y-2 select-none cursor-pointer min-h-[105px] border-white/10 bg-black/15 hover:bg-black/30 hover:border-white/20 block",
            (error || localError) && "border-rose-500/30 bg-rose-500/[0.02]"
          )}
        >
          <Upload className="h-6 w-6 text-slate-500 transition" />
          <div className="text-center space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-450 block font-satoshi">
              Choose a file or drag here
            </span>
            <span className="text-[9px] font-medium text-slate-500 block">
              PDF, PNG, JPG (Max 15MB)
            </span>
          </div>
        </label>
      )}

      {(error || localError) && (
        <div className="flex items-center space-x-1.5 text-[10px] font-bold text-rose-455 pt-0.5 animate-in slide-in-from-top-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error || localError}</span>
        </div>
      )}

      {/* Reusable Document Preview Modal */}
      <FilePreviewDialog
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        url={uploadedUrl}
        fileName={fileName || 'Uploaded File'}
      />
    </div>
  )
}
