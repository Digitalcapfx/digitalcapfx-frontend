import React from 'react'
import { UploadCloud, ArrowRight, ArrowLeft, FolderCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { FileUpload } from '@/components/ui/FileUpload'
import { DocumentSpec } from '@/services/kyc.service'
import { useLanguageStore } from '@/store/languageStore'

interface ComplianceDocumentsStepProps {
  uploadableDocuments: DocumentSpec[];
  uploadedDocUrls: Record<string, string>;
  docUploadingKey: string | null;
  onDocumentUploadComplete: (docKey: string, fileUrl: string) => Promise<void>;
  onProceedToBiometrics: () => void;
  onBackToFields: () => void;
}

export const ComplianceDocumentsStep: React.FC<ComplianceDocumentsStepProps> = ({
  uploadableDocuments,
  uploadedDocUrls,
  docUploadingKey,
  onDocumentUploadComplete,
  onProceedToBiometrics,
  onBackToFields,
}) => {
  const { t } = useLanguageStore();

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 md:p-8 space-y-6 text-left shadow-xl">
        <div className="flex justify-between items-start border-b border-white/[0.04] pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <UploadCloud className="h-5 w-5 text-cyan-400" />
              <h4 className="text-base font-bold text-white">
                {t('settings.verification.step2.title')}
              </h4>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {t('settings.verification.step2.desc')}
            </p>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {uploadableDocuments.length > 0 ? (
            uploadableDocuments.map((doc) => {
              const maxAge = doc.maxAgeMonths || doc.max_age_months;

              return (
                <div key={doc.key} className="bg-black/30 border border-white/10 rounded-2xl p-5 space-y-3.5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between">
                      <h5 className="text-xs font-bold text-white">{doc.label}</h5>
                      <span className={cn(
                        "text-[9px] font-extrabold uppercase px-2 py-0.5 rounded font-mono",
                        doc.required ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                      )}>
                        {doc.required ? t('settings.verification.step2.required') : t('settings.verification.step2.optional')}
                      </span>
                    </div>
                    {doc.help && <p className="text-[11px] text-slate-400 leading-relaxed">{doc.help}</p>}
                    {maxAge && (
                      <span className="text-[10px] text-cyan-400 font-mono block">
                        {t('settings.verification.step2.maxAge', { months: maxAge })}
                      </span>
                    )}
                  </div>

                  <div className="pt-2">
                    <FileUpload
                      required={doc.required}
                      label={doc.label}
                      purpose="kyc"
                      value={uploadedDocUrls[doc.key] || ''}
                      onUploadComplete={(fileUrl) => onDocumentUploadComplete(doc.key, fileUrl)}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="md:col-span-2 p-8 text-center bg-black/20 rounded-2xl border border-white/5 space-y-2">
              <FolderCheck className="h-8 w-8 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">
                {t('settings.verification.step2.noDocs')}
              </p>
            </div>
          )}
        </div>

        {/* Step 2 Footer Navigation Controls */}
        <div className="flex justify-between items-center pt-6 border-t border-white/[0.04]">
          <Button
            type="button"
            variant="secondary"
            onClick={onBackToFields}
            className="rounded-xl text-xs font-bold px-5 h-11"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            {t('settings.verification.step2.backToFields')}
          </Button>

          <Button
            type="button"
            onClick={onProceedToBiometrics}
            className="rounded-xl text-xs font-bold px-6 h-11 bg-cyan-500 hover:bg-cyan-400 text-white"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            {t('settings.verification.step2.proceedToBiometrics')}
          </Button>
        </div>
      </div>
    </div>
  );
};
