import { forwardRef, memo } from "react";
import {
  Control,
  Controller,
  useFieldArray,
  useFormContext,
} from "react-hook-form";

const InputControlled = memo(
  forwardRef(({ error, ...props }: any, ref) => {
    console.log("InputControlled rerender");

    return (
      <div>
        <input {...props} ref={ref} />
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
    control: Control<any>;
    index: number;
    name: string;
  }) => {
    console.log("ControllerInput rerender", index, name);
    return (
      <Controller
        control={control}
        name={`array.${index}.${name}`}
        render={({ field, fieldState: { error } }) => (
          <InputControlled
            field={field}
            ref={field.ref}
            error={error?.message}
          />
        )}
      />
    );
  }
);

/*const Input = forwardRef((props: any, ref) => {
  return <input type="text" {...props} ref={ref} />;
});*/

const Edit = memo(({ index }: { index: number }) => {
  const { control } = useFormContext();
  console.log("Edit rerender", index);

  return (
    <div>
      <ControllerInput control={control} index={index} name="firstName" />
      <ControllerInput control={control} index={index} name="lastName" />
      <ControllerInput control={control} index={index} name="working" />
    </div>
  );
});

const PageTest = memo(() => {
  const { control } = useFormContext();
  console.log("rerender because useFormContext");
  return <Test control={control} />;
});

const Test = memo(({ control }: { control: Control<any> }) => {
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

const Fields = memo(({ fields, remove }: { fields: any; remove: any }) => {
  return (
    <>
      {fields.map((field: any, index: number) => (
        <Field key={field.id} index={index} remove={remove} />
      ))}
    </>
  );
});

const Field = memo(({ index, remove }: { index: number; remove: any }) => {
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
