import { useFormContext } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import type { FormValues } from "../types";

export const useFieldError = (fieldPath: string) => {
  const { formState: { errors }, watch } = useFormContext<FormValues>();
  const [fieldError, setFieldError] = useState<string | undefined>();

  const updateError = useCallback(() => {
    // Parse the field path (e.g., "array.0.firstName")
    const parts = fieldPath.split('.');
    let currentErrors: any = errors;
    
    for (const part of parts) {
      if (!currentErrors) break;
      currentErrors = currentErrors[part];
    }

    setFieldError(currentErrors?.message);
  }, [errors, fieldPath]);

  useEffect(() => {
    updateError();
  }, [updateError]);

  return fieldError;
}; 