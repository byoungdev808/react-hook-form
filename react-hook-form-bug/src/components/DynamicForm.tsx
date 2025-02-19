import { memo, useCallback } from 'react';
import { useFieldArray, useForm, FormProvider, useFormContext } from 'react-hook-form';
import { FieldGroup } from './FieldGroup';
import type { FormValues } from '../types';

export const DynamicForm = () => {
  const methods = useForm<FormValues>({
    defaultValues: {
      array: []
    },
    mode: 'onChange'
  });

  return (
    <FormProvider {...methods}>
      <FormContent />
    </FormProvider>
  );
};

const FormContent = memo(() => {
  console.log('🏁 FormContent Rendering');
  
  const { control } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "array",
    shouldUnregister: true
  });

  const handleAppend = useCallback(() => {
    append({ firstName: '', lastName: '', working: '' });
  }, [append]);

  const handleRemove = useCallback((index: number) => {
    remove(index);
  }, [remove]);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={handleAppend}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Field Group
      </button>

      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border rounded">
          <FieldGroup index={index} />
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
});

FormContent.displayName = 'FormContent'; 