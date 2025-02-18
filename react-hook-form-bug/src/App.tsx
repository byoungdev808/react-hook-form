import { useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import PageTest from "./Test";

const Page = () => {
  const methods = useForm({
    defaultValues: {
      array: [],
    },
    shouldUnregister: true,
  });
  const { handleSubmit } = methods;

  const onSubmit = useCallback((data: any) => {
    console.log(data);
  }, []);

  console.log("rerender main form");

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 py-4 relative"
      >
        <PageTest />
      </form>
    </FormProvider>
  );
};

export default Page;
