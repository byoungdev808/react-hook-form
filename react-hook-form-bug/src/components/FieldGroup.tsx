import { memo, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField } from './FormField';
import type { FormValues } from '../types';

export const FieldGroup = memo(({ index }: { index: number }) => {
  console.log(`📦 FieldGroup Rendering at index ${index}`);
  
  const { control } = useFormContext<FormValues>();
  
  // Memoize the fields array to prevent re-renders
  const fields = useMemo(() => (
    ['firstName', 'lastName', 'working'] as const
  ), []);
  
  return (
    <div className="space-y-4">
      {fields.map((fieldName) => (
        <FormField
          key={fieldName}
          name={fieldName}
          index={index}
          control={control}
        />
      ))}
    </div>
  );
});

FieldGroup.displayName = 'FieldGroup'; 