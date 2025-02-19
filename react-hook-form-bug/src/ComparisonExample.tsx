// ❌ PROBLEMATIC APPROACH
// Causes unnecessary re-renders
const ProblematicForm = () => {
  const methods = useForm();
  // This causes ALL components to re-render
  const { formState: { errors } } = methods;

  useEffect(() => {
    // Show alert for demonstration
    if (Object.keys(errors).length > 0) {
      alert("❌ Problem: All form fields re-rendered!");
    }
  }, [errors]);

  return (
    <FormProvider {...methods}>
      <form>
        {/* Every field re-renders when any error changes */}
        <div style={{background: 'pink'}}>
          <h3>Problem: Everything Re-renders</h3>
          <input {...register('field1')} />
          <input {...register('field2')} />
          {errors.field1 && 
            <span>Error: {errors.field1.message}</span>}
        </div>
      </form>
    </FormProvider>
  );
};

// ✅ OPTIMIZED SOLUTION
// Only re-renders affected components
const OptimizedForm = () => {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <form>
        {/* Each field manages its own errors */}
        <div style={{background: 'lightgreen'}}>
          <h3>Solution: Isolated Updates</h3>
          <OptimizedField name="field1" />
          <OptimizedField name="field2" />
        </div>
      </form>
    </FormProvider>
  );
};

// Optimized field component
const OptimizedField = memo(({ name }) => {
  // Only subscribes to its own errors
  const { errors } = useFormState({
    name
  });

  useEffect(() => {
    // Show alert for demonstration
    if (errors?.[name]) {
      alert(`✅ Success: Only ${name} re-rendered!`);
    }
  }, [errors, name]);

  return (
    <div>
      <Controller
        name={name}
        render={({ field }) => (
          <input {...field} />
        )}
      />
      {errors?.[name] && 
        <span>Error: {errors[name].message}</span>}
    </div>
  );
}); 