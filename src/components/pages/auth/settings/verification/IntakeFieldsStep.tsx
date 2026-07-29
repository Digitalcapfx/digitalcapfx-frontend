import React from 'react'
import { FileText, Save, ArrowRight, ArrowLeft, Info, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectOption } from '@/components/ui/Select'
import { DatePicker } from '@/components/ui/DatePicker'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { IntakeFieldSpec, IntakeCounterparty } from '@/services/kyc.service'
import {
  COUNTRY_OPTIONS,
  getCountryCodeByName,
  getCountryNameByCode,
  getGroupMeta,
  getValueForKey,
} from './verificationUtils'

interface IntakeFieldsStepProps {
  groupKeys: string[];
  groupedFields: Record<string, IntakeFieldSpec[]>;
  activeGroupIndex: number;
  setActiveGroupIndex: (index: number) => void;
  intakeForm: Record<string, any>;
  setIntakeForm: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  notesList: string[];
  isBusiness: boolean;
  isSavingDraft: boolean;
  isSubmitting: boolean;
  onSaveDraft: () => void;
  onSaveAndProceed: (advanceToNextStep?: boolean) => void;
  hasDocuments: boolean;
}

export const IntakeFieldsStep: React.FC<IntakeFieldsStepProps> = ({
  groupKeys,
  groupedFields,
  activeGroupIndex,
  setActiveGroupIndex,
  intakeForm,
  setIntakeForm,
  notesList,
  isBusiness,
  isSavingDraft,
  isSubmitting,
  onSaveDraft,
  onSaveAndProceed,
  hasDocuments,
}) => {
  const currentGroupKey = groupKeys[activeGroupIndex] || groupKeys[0];
  const currentGroupFields = groupedFields[currentGroupKey] || [];
  const currentGroupMeta = getGroupMeta(currentGroupKey);

  const isImporter = Boolean(getValueForKey(intakeForm, 'is_importer'));

  const updateFormField = (key: string, value: any) => {
    const camelKey = key.replace(/([-_][a-z])/g, (g) => g.toUpperCase().replace('-', '').replace('_', ''));
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    setIntakeForm((prev) => ({
      ...prev,
      [key]: value,
      [camelKey]: value,
      [snakeKey]: value,
    }));
  };

  // Dynamic Repeatable Array Helpers
  const updateRepeatableItem = (fieldKey: string, index: number, itemKey: keyof IntakeCounterparty, value: string) => {
    const currentVal = getValueForKey(intakeForm, fieldKey);
    const list: IntakeCounterparty[] = Array.isArray(currentVal) ? [...currentVal] : [];
    while (list.length <= index) {
      list.push({ country: '', purpose: '', relationship: '' });
    }
    list[index] = { ...list[index], [itemKey]: value };
    updateFormField(fieldKey, list);
  };

  const addRepeatableItem = (fieldKey: string) => {
    const currentVal = getValueForKey(intakeForm, fieldKey);
    const list: IntakeCounterparty[] = Array.isArray(currentVal) ? [...currentVal] : [];
    if (list.length < 3) {
      list.push({ country: '', purpose: '', relationship: '' });
    }
    updateFormField(fieldKey, list);
  };

  const removeRepeatableItem = (fieldKey: string, index: number) => {
    const currentVal = getValueForKey(intakeForm, fieldKey);
    const list: IntakeCounterparty[] = Array.isArray(currentVal) ? [...currentVal] : [];
    list.splice(index, 1);
    updateFormField(fieldKey, list);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Field Sub-Group Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/[0.05] pb-3 overflow-x-auto">
        {groupKeys.map((gKey, idx) => {
          const meta = getGroupMeta(gKey);
          const isActive = activeGroupIndex === idx;

          return (
            <button
              key={gKey}
              type="button"
              onClick={() => setActiveGroupIndex(idx)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border",
                isActive
                  ? "bg-primary-500/15 border-primary-500/30 text-primary-400"
                  : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
              )}
            >
              {meta.label}
            </button>
          );
        })}
      </div>

      <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 md:p-8 space-y-6 text-left shadow-xl">
        <div className="flex justify-between items-start border-b border-white/[0.04] pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary-400" />
              <h4 className="text-base font-bold text-white">
                {currentGroupMeta.label}
              </h4>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {currentGroupMeta.description} You can edit and update your answers anytime before completing liveness verification.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={onSaveDraft}
            isLoading={isSavingDraft}
            className="rounded-xl text-xs font-bold h-10 px-4 shrink-0"
            leftIcon={<Save className="h-3.5 w-3.5" />}
          >
            Save Draft Progress
          </Button>
        </div>

        {/* Compliance Notes if present */}
        {notesList.length > 0 && activeGroupIndex === 0 && (
          <div className="bg-primary-500/5 border border-primary-500/10 rounded-2xl p-4 space-y-1.5 text-xs text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary-400 block font-mono">Compliance Guidance</span>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-350">
              {notesList.map((note, idx) => (
                <li key={idx} className="leading-relaxed">{note}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Render Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentGroupFields.map((field) => {
            const fKeyLower = field.key.toLowerCase();
            const fieldValue = getValueForKey(intakeForm, field.key);

            // Date field -> DatePicker
            if (field.type === 'date' || fKeyLower.includes('date') || fKeyLower === 'date_of_birth' || fKeyLower === 'dateofbirth') {
              let dateVal = fieldValue || '';
              if (dateVal && typeof dateVal === 'string' && dateVal.includes('T')) {
                dateVal = dateVal.split('T')[0];
              }
              return (
                <DatePicker
                  key={field.key}
                  label={field.label}
                  required={field.required}
                  value={dateVal}
                  onChange={(val) => updateFormField(field.key, val)}
                />
              );
            }

            // Country field -> Select with COUNTRY_OPTIONS
            if (field.type === 'country' || fKeyLower === 'nationality') {
              return (
                <Select
                  key={field.key}
                  label={field.label}
                  required={field.required}
                  placeholder="Select country"
                  options={COUNTRY_OPTIONS}
                  value={getCountryCodeByName(fieldValue || '')}
                  onChange={(val) => updateFormField(field.key, getCountryNameByCode(val))}
                  searchable
                />
              );
            }

            // Phone input
            if (field.type === 'phone' || fKeyLower.includes('phone')) {
              return (
                <PhoneInput
                  key={field.key}
                  label={field.label}
                  required={field.required}
                  value={fieldValue || ''}
                  onChange={(val) => updateFormField(field.key, val)}
                />
              );
            }

            // BVN field -> Input with NGN notice
            if (fKeyLower === 'bvn') {
              return (
                <Input
                  key={field.key}
                  label={field.label}
                  required={field.required}
                  placeholder="11-digit BVN"
                  value={fieldValue || ''}
                  onChange={(e) => updateFormField(field.key, e.target.value)}
                  helperText={field.help || 'Needed to activate your Naira (NGN) account'}
                  rightIcon={
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                      NGN Wallet
                    </span>
                  }
                />
              );
            }

            // Select dropdown
            if (field.type === 'select') {
              const opts: SelectOption[] = (field.options || []).map((opt) => {
                if (typeof opt === 'string') return { value: opt, label: opt };
                return opt;
              });
              return (
                <Select
                  key={field.key}
                  label={field.label}
                  required={field.required}
                  options={opts}
                  value={fieldValue || (opts[0]?.value || '')}
                  onChange={(val) => updateFormField(field.key, val)}
                  searchable={opts.length > 5}
                />
              );
            }

            // Boolean toggle
            if (field.type === 'boolean') {
              return (
                <div key={field.key} className="md:col-span-2 p-4 bg-black/25 border border-white/10 rounded-2xl space-y-1.5">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(fieldValue)}
                      onChange={(e) => updateFormField(field.key, e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-black/40 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-xs text-white font-bold">
                      {field.label}
                      {field.required && <span className="text-rose-400 font-bold ml-1">*</span>}
                    </span>
                  </label>
                  {field.help && (
                    <p className="text-xs text-slate-400 pl-7">{field.help}</p>
                  )}
                </div>
              );
            }

            // Repeatable counterparty list
            if (field.type === 'repeatable' || field.type === 'counterparties' || fKeyLower.includes('counterpart')) {
              if (isBusiness && !isImporter && fKeyLower.includes('counterpart')) {
                return (
                  <div key={field.key} className="md:col-span-2 p-4 bg-[#080E1E] border border-cyan-500/20 rounded-2xl space-y-1">
                    <div className="flex items-center space-x-2 text-cyan-400">
                      <Info className="h-4 w-4 shrink-0" />
                      <span className="font-bold text-xs">{field.label}</span>
                    </div>
                    <p className="text-slate-400 text-xs pl-6 leading-relaxed">
                      Counterparties are only required if your business is an importer. Check <strong>"Is your business an importer?"</strong> above if applicable to provide counterparties.
                    </p>
                  </div>
                );
              }

              const itemArray: IntakeCounterparty[] = Array.isArray(fieldValue)
                ? fieldValue
                : [];

              return (
                <div key={field.key} className="md:col-span-2 space-y-4 pt-3 border-t border-white/[0.04]">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-white block">
                      {field.label}
                      {field.required && <span className="text-rose-400 ml-1">*</span>}
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Up to 3 Items</span>
                  </div>
                  {field.help && <p className="text-xs text-slate-400 leading-relaxed">{field.help}</p>}

                  <div className="space-y-3">
                    {itemArray.map((item, idx) => (
                      <div key={idx} className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Item #{idx + 1}</span>
                          {itemArray.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeRepeatableItem(field.key, idx)}
                              className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <Select
                            placeholder="Select Country"
                            options={COUNTRY_OPTIONS}
                            value={getCountryCodeByName(item.country || '')}
                            onChange={(val) => updateRepeatableItem(field.key, idx, 'country', getCountryNameByCode(val))}
                            searchable
                          />
                          <Input
                            placeholder="Relationship (e.g. Supplier)"
                            value={item.relationship || ''}
                            onChange={(e) => updateRepeatableItem(field.key, idx, 'relationship', e.target.value)}
                          />
                          <Input
                            placeholder="Payment Purpose"
                            value={item.purpose || ''}
                            onChange={(e) => updateRepeatableItem(field.key, idx, 'purpose', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {itemArray.length < 3 && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => addRepeatableItem(field.key)}
                      className="rounded-xl h-10 text-xs font-bold w-full sm:w-auto"
                      leftIcon={<Plus className="h-4 w-4" />}
                    >
                      Add Another Item
                    </Button>
                  )}
                </div>
              );
            }

            // Standard text / email / number input fallback
            return (
              <Input
                key={field.key}
                label={field.label}
                type={field.type === 'number' ? 'number' : (field.type === 'email' || fKeyLower.includes('email')) ? 'email' : 'text'}
                required={field.required}
                helperText={field.help}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
                value={fieldValue ?? ''}
                onChange={(e) => updateFormField(field.key, e.target.value)}
              />
            );
          })}
        </div>

        {/* Group Footer Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-white/[0.04] gap-4">
          <div>
            {activeGroupIndex > 0 && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setActiveGroupIndex(activeGroupIndex - 1)}
                className="rounded-xl text-xs font-bold px-5 h-11"
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Previous Section
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {activeGroupIndex < groupKeys.length - 1 ? (
              <Button
                type="button"
                onClick={() => {
                  onSaveAndProceed(false);
                  setActiveGroupIndex(activeGroupIndex + 1);
                }}
                isLoading={isSubmitting}
                className="rounded-xl text-xs font-bold px-6 h-11"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Save & Next Section
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => onSaveAndProceed(true)}
                isLoading={isSubmitting}
                className="rounded-xl text-xs font-bold px-6 h-11 bg-primary-500 hover:bg-primary-400 text-white"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                {hasDocuments ? 'Save & Proceed to Documents' : 'Save & Proceed to Biometrics'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
