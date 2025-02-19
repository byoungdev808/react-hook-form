import { forwardRef, memo, useState, useEffect } from "react";
import {
  Control,
  Controller,
  useFieldArray,
  useFormContext,
  useFormState,
} from "react-hook-form";
import logger from "./utils/logger";
import { FormValues } from "./types";

// Type the input props
interface InputProps {
  error?: string;
  field: {
    name: string;
    onChange: (value: any) => void;
    onBlur: () => void;
    value: any;
    ref: React.Ref<HTMLInputElement>;
  };
}

const InputControlled = memo(
  forwardRef<HTMLInputElement, InputProps>(({ error, field, ...props }, ref) => {
    logger.render(`InputControlled(${field.name})`);

    return (
      <div>
        <input {...field} {...props} ref={ref} />
        {error && <span className="text-red-500">{error}</span>}
      </div>
    );
  })
);

const ControllerInput = memo(
  ({
    control,
    index,
    name,
  }: {
    control: Control<FormValues>;
    index: number;
    name: keyof FormValues['array'][number];
  }) => {
    // This subscribes to specific field errors only
    const { errors } = useFormState({
      control,
      name: `array.${index}.${name}` as const
    });

    logger.render(`ControllerInput(${name}-${index})`);
    
    return (
      <div>
        <Controller<FormValues>
          control={control}
          name={`array.${index}.${name}` as const}
          render={({ field }) => (
            <InputControlled 
              field={{
                ...field,
                value: field.value || ''
              }} 
              error={errors?.array?.[index]?.[name]?.message}
              ref={field.ref} 
            />
          )}
        />
      </div>
    );
  }
);

/*const Input = forwardRef((props: any, ref) => {
  return <input type="text" {...props} ref={ref} />;
});*/

const Edit = memo(({ index }: { index: number }) => {
  const { control } = useFormContext<FormValues>();
  logger.render(`Edit(${index})`);

  return (
    <div>
      <ControllerInput control={control} index={index} name="firstName" />
      <ControllerInput control={control} index={index} name="lastName" />
      <ControllerInput control={control} index={index} name="working" />
    </div>
  );
});

const PageTest = memo(() => {
  const { control } = useFormContext<FormValues>();
  console.log("rerender because useFormContext");
  return <Test control={control} />;
});

const Test = memo(({ control }: { control: Control<FormValues> }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "array",
  });
  console.log("Test");

  return (
    <>
      <button
        type="button"
        onClick={() => {
          append({
            firstName: "",
            lastName: "",
            working: "",
          });
        }}
      >
        append
      </button>
      <br />
      <Fields fields={fields} remove={remove} />
    </>
  );
});

const Fields = memo(({ fields, remove }: { 
  fields: Record<'id', string>[]; 
  remove: (index: number) => void;
}) => {
  return (
    <>
      {fields.map((field, index) => (
        <Field key={field.id} index={index} remove={remove} />
      ))}
    </>
  );
});

const Field = memo(({ 
  index, 
  remove 
}: { 
  index: number; 
  remove: (index: number) => void;
}) => {
  return (
    <fieldset>
      <Edit index={index} />
      <button className="remove" type="button" onClick={() => remove(index)}>
        Remove
      </button>
    </fieldset>
  );
});


export default PageTest;
