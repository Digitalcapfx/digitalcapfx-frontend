import { useState, useCallback } from 'react';

export function useFormErrors() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState('');

  const clearFieldError = useCallback((field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
    setErrorMsg('');
  }, []);

  return {
    errors,
    setErrors,
    errorMsg,
    setErrorMsg,
    clearFieldError,
    clearAllErrors,
  };
}

export default useFormErrors;
