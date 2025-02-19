import { memo, useCallback, useEffect } from 'react';
import { Control, Controller, useFormState } from 'react-hook-form';
import type { FormValues } from '../types';

export const FormField = memo(({ 
  name, 
  index, 
  control 
}: { 
  name: keyof FormValues['array'][number];
  index: number;
  control: Control<FormValues>;
}) => {
  console.log(`🔄 FormField Rendering - ${name} at index ${index}`);

  // Subscribe to ONLY this specific field's error with exact path
  const { errors } = useFormState({
    control,
    name: `array.${index}.${name}` as const,
    exact: true // Important: Only subscribe to exact field changes
  });

  useEffect(() => {
    console.log(`⚡ Error changed for ${name} at index ${index}:`, 
      errors?.array?.[index]?.[name]?.message
    );
  }, [errors, index, name]);

  // Memoize error access
  const fieldError = errors?.array?.[index]?.[name]?.message;

  // Memoize render function to prevent Controller re-renders
  const renderField = useCallback(({ field }) => (
    <div>
      <input
        {...field}
        placeholder={name}
        className={`p-2 border rounded ${fieldError ? 'border-red-500' : 'border-gray-300'}`}
      />
      {fieldError && (
        <div className="text-red-500 text-sm mt-1">{fieldError}</div>
      )}
    </div>
  ), [fieldError, name]);

  return (
    <Controller
      control={control}
      name={`array.${index}.${name}` as const}
      render={renderField}
    />
  );
});

FormField.displayName = 'FormField'; 