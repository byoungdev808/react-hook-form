import { 
  memo, 
  useRef, 
  useEffect, 
  useMemo, 
  useState, 
  forwardRef 
} from 'react';
import { 
  FormProvider, 
  useForm, 
  useFormState, 
  useFormContext, 
  Controller, 
  useFieldArray, 
  UseFormReturn,
  Control
} from "react-hook-form";
import type { FormValues } from "./types";

// Add this at the top
const useRenderCounter = () => {
  const renderCount = useRef(0);
  useEffect(() => {
    renderCount.current += 1;
  });
  return renderCount.current;
};

// Add this CSS animation at the top of your file
const pulseAnimation = `
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4);
    }
    70% {
      box-shadow: 0 0 0 6px rgba(255, 0, 0, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
    }
  }
`;

// Add this CSS animation
const inputPulseAnimation = `
  @keyframes inputPulse {
    0% {
      border-color: red;
      box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4);
    }
    70% {
      border-color: red;
      box-shadow: 0 0 0 6px rgba(255, 0, 0, 0);
    }
    100% {
      border-color: #ccc;
      box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
    }
  }
`;

// Add the style tag to your component
const StyleTag = () => (
  <style>
    {pulseAnimation}
    {inputPulseAnimation}
  </style>
);

// Update AnimatedInput to use forwardRef
const AnimatedInput = memo(forwardRef<
  HTMLInputElement, 
  { isRerendering: boolean } & React.InputHTMLAttributes<HTMLInputElement>
>(({ isRerendering, ...props }, ref) => (
  <input
    {...props}
    ref={ref}
    style={{
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      animation: isRerendering ? 'inputPulse 1s' : 'none',
      transition: 'all 0.3s'
    }}
  />
)));

// Add displayName for better debugging
AnimatedInput.displayName = 'AnimatedInput';

// Update the RenderIndicator component
const RenderIndicator = ({ name, count }: { name: string; count: number }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger animation on count change
  useEffect(() => {
    if (count > 1) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [count]);

  return (
    <div style={{ 
      fontSize: '12px', 
      padding: '4px 8px',
      margin: '4px 0',
      backgroundColor: count > 1 ? '#ffe0e0' : '#e0ffe0',
      borderRadius: '4px',
      display: 'inline-block',
      animation: isAnimating ? 'pulse 1s' : 'none',
      border: isAnimating ? '1px solid red' : '1px solid transparent'
    }}>
      {name}: {count} renders
      {count > 1 && ' 🔄'}
    </div>
  );
};

// Left side: Client's Current Code
const ProblematicForm = () => {
  const methods = useForm<FormValues>({
    defaultValues: {
      array: []  // Start empty like original
    }
  });

  return (
    <FormProvider {...methods}>
      <div style={{ background: '#ffebee', padding: '15px', borderRadius: '8px' }}>
        <h3>❌ Current Implementation (with re-render issue)</h3>
        <pre style={{ background: '#fff', padding: '10px' }}>
          {`// This causes unnecessary re-renders
const { formState: { errors } } = useFormContext();
// Every error change triggers ALL fields to re-render`}
        </pre>
        
        <ProblematicTest methods={methods} />
        <div style={{ marginTop: '10px', color: 'red', fontSize: '0.9em' }}>
          ⚠️ All fields re-render when any error occurs
        </div>
      </div>
    </FormProvider>
  );
};

const ProblematicTest = memo(({ methods }: { methods: UseFormReturn<FormValues> }) => {
  const { control } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "array"
  });
  const renderCount = useRenderCounter();

  return (
    <div>
      <RenderIndicator name="Test Component" count={renderCount} />
      <div className="mb-4">
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => append({ firstName: "", lastName: "", working: "" })}
        >
          Append
        </button>
      </div>
      <div className="mt-4">
        {fields.map((field, index) => (
          <div key={field.id} className="mb-4 p-4 border rounded">
            <div className="mb-2">
              <ErrorTriggerButton methods={methods} index={index} />
            </div>
            <ProblematicField index={index} />
            <button
              type="button"
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => remove(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

const ProblematicField = memo(({ index }: { index: number }) => {
  console.log(`❌ ProblematicField ${index} rendering`);
  const { formState: { errors }, register } = useFormContext<FormValues>();
  const renderCount = useRenderCounter();
  const [isRerendering, setIsRerendering] = useState(false);

  useEffect(() => {
    console.log(`❌ ProblematicField ${index} detected error change:`, errors);
  }, [errors, index]);

  useEffect(() => {
    setIsRerendering(true);
    const timer = setTimeout(() => setIsRerendering(false), 1000);
    return () => clearTimeout(timer);
  }, [errors]);

  return (
    <div className="space-y-2">
      <RenderIndicator name={`Field ${index}`} count={renderCount} />
      <div className="space-y-2">
        <div>
          <AnimatedInput 
            {...register(`array.${index}.firstName`)} 
            placeholder="First Name"
            isRerendering={isRerendering}
          />
          {errors?.array?.[index]?.firstName?.message && (
            <div className="text-red-500 text-sm">{errors.array[index].firstName.message}</div>
          )}
        </div>
        <div>
          <AnimatedInput 
            {...register(`array.${index}.lastName`)} 
            placeholder="Last Name"
            isRerendering={isRerendering}
          />
          {errors?.array?.[index]?.lastName?.message && (
            <div className="text-red-500 text-sm">{errors.array[index].lastName.message}</div>
          )}
        </div>
        <div>
          <AnimatedInput 
            {...register(`array.${index}.working`)} 
            placeholder="Working"
            isRerendering={isRerendering}
          />
          {errors?.array?.[index]?.working?.message && (
            <div className="text-red-500 text-sm">{errors.array[index].working.message}</div>
          )}
        </div>
      </div>
    </div>
  );
});

// Right side: Optimized Solution
const OptimizedForm = () => {
  const methods = useForm<FormValues>({
    defaultValues: {
      array: []  // Start empty like original
    }
  });

  return (
    <FormProvider {...methods}>
      <div style={{ background: '#e8f5e9', padding: '15px', borderRadius: '8px' }}>
        <h3>✅ Optimized Solution (no re-render issue)</h3>
        <pre style={{ background: '#fff', padding: '10px' }}>
          {`// This only re-renders the specific field
const { errors } = useFormState({
  name: \`array.\${index}.\${fieldName}\`
});`}
        </pre>
        
        <OptimizedTest methods={methods} />
        <div style={{ marginTop: '10px', color: 'green', fontSize: '0.9em' }}>
          ✨ Only affected field re-renders
        </div>
      </div>
    </FormProvider>
  );
};

const OptimizedTest = memo(({ methods }: { methods: UseFormReturn<FormValues> }) => {
  const { control } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "array"
  });
  const renderCount = useRenderCounter();

  return (
    <div>
      <RenderIndicator name="Test Component" count={renderCount} />
      <div className="mb-4">
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => append({ firstName: "", lastName: "", working: "" })}
        >
          Append
        </button>
      </div>
      <div className="mt-4">
        {fields.map((field, index) => (
          <div key={field.id} className="mb-4 p-4 border rounded">
            <div className="mb-2">
              <ErrorTriggerButton methods={methods} index={index} />
            </div>
            <OptimizedField index={index} />
            <button
              type="button"
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => remove(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

const OptimizedField = memo(({ index }: { index: number }) => {
  const { control } = useFormContext<FormValues>();
  const renderCount = useRenderCounter();

  return (
    <div className="space-y-2">
      <RenderIndicator name={`Field ${index}`} count={renderCount} />
      {(['firstName', 'lastName', 'working'] as const).map((fieldName) => (
        <OptimizedInput 
          key={fieldName}
          control={control}
          index={index}
          name={fieldName}
        />
      ))}
    </div>
  );
});

const OptimizedInput = memo(({ control, index, name }: { 
  control: Control<FormValues>; 
  index: number; 
  name: keyof FormValues['array'][number];
}) => {
  console.log(`✅ OptimizedInput ${name} at index ${index} rendering`);
  
  const { errors } = useFormState({
    control,
    name: `array.${index}.${name}` as const,
    exact: true
  });

  const renderCount = useRenderCounter();
  const [isRerendering, setIsRerendering] = useState(false);

  useEffect(() => {
    if (errors?.array?.[index]?.[name]) {
      console.log(`✅ OptimizedInput ${name} at ${index} error:`, 
        errors.array[index][name].message
      );
    }
  }, [errors, index, name]);

  useEffect(() => {
    setIsRerendering(true);
    const timer = setTimeout(() => setIsRerendering(false), 1000);
    return () => clearTimeout(timer);
  }, [errors]);

  return (
    <div className="space-y-1">
      <RenderIndicator name={`${name} input`} count={renderCount} />
      <Controller
        control={control}
        name={`array.${index}.${name}` as const}
        render={({ field }) => (
          <div>
            <AnimatedInput 
              {...field} 
              placeholder={name}
              isRerendering={isRerendering}
            />
            {errors?.array?.[index]?.[name]?.message && (
              <div className="text-red-500 text-sm">
                {errors.array[index][name].message}
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
});

// Update ErrorTriggerButton to handle multiple fields
const ErrorTriggerButton = ({ methods, index }: { methods: UseFormReturn<FormValues>; index: number }) => {
  const fields = ['firstName', 'lastName', 'working'] as const;
  
  return (
    <div className="flex gap-2">
      {fields.map(fieldName => (
        <button
          key={fieldName}
          type="button"
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={() => {
            methods.setError(`array.${index}.${fieldName}`, {
              type: 'manual',
              message: `Error in ${fieldName}`
            });
          }}
        >
          Error {fieldName}
        </button>
      ))}
      <button
        type="button"
        className="bg-gray-500 text-white px-4 py-2 rounded"
        onClick={() => methods.clearErrors()}
      >
        Clear Errors
      </button>
    </div>
  );
};

// Fix the useFormErrors hook with proper typing
const useFormErrors = (fieldPath: string) => {
  const { formState } = useFormContext<FormValues>();
  
  return useMemo(() => {
    const parts = fieldPath.split('.');
    let current: any = formState.errors;
    
    for (const part of parts) {
      if (!current) return undefined;
      current = current[part];
    }
    
    return current?.message as string | undefined;
  }, [formState.errors, fieldPath]);
};

const BetterField = memo(({ index }: { index: number }) => {
  const { formState, control } = useFormContext<FormValues>();
  const renderCount = useRenderCounter();

  // Split into individual components to prevent shared re-renders
  return (
    <div className="space-y-2">
      <RenderIndicator name={`Field ${index}`} count={renderCount} />
      <div className="space-y-2">
        <BetterInput name="firstName" index={index} control={control} />
        <BetterInput name="lastName" index={index} control={control} />
        <BetterInput name="working" index={index} control={control} />
      </div>
    </div>
  );
});

const BetterInput = memo(({ 
  name, 
  index, 
  control 
}: { 
  name: keyof FormValues['array'][number];
  index: number;
  control: Control<FormValues>;
}) => {
  // Subscribe to only this specific field's error
  const { errors } = useFormState({
    control,
    name: `array.${index}.${name}` as const,
    exact: true // Important: Only subscribe to exact field
  });

  const renderCount = useRenderCounter();
  const error = errors?.array?.[index]?.[name];

  return (
    <div>
      <RenderIndicator name={`${name} input`} count={renderCount} />
      <Controller
        control={control}
        name={`array.${index}.${name}` as const}
        render={({ field }) => (
          <AnimatedInput 
            {...field}
            placeholder={name}
            isRerendering={!!error}
          />
        )}
      />
      {error?.message && (
        <div className="text-red-500 text-sm">{error.message}</div>
      )}
    </div>
  );
});

export const ComparisonDemo = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto space-y-8">
      <StyleTag />
      <div className="flex flex-col gap-8">
        <div className="border-2 border-red-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-600 mb-4">❌ Problem: Re-render on ANY Error Change</h3>
          <pre className="bg-gray-100 p-4 rounded mb-4 text-sm">
            {`// ❌ BAD: This subscribes to ALL errors
const { formState: { errors } } = useFormContext();

// Problem: When ANY error changes:
// 1. ALL fields re-render
// 2. Performance suffers with more fields
// 3. React Hook Form can't optimize`}
          </pre>
          <ProblematicForm />
        </div>

        <div className="border-2 border-green-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-600 mb-4">✅ Solution: Subscribe to Specific Fields</h3>
          <pre className="bg-gray-100 p-4 rounded mb-4 text-sm">
            {`// ✅ GOOD: Subscribe only to needed fields
const { errors } = useFormState({
  name: \`array.\${index}.\${fieldName}\`
});

// Benefits:
// 1. Only affected field re-renders
// 2. Better performance
// 3. React Hook Form can optimize`}
          </pre>
          <OptimizedForm />
        </div>
      </div>
    </div>
  );
};