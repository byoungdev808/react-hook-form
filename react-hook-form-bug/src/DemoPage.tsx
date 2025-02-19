import { useState } from 'react';

export const DemoPage = () => {
  const [showProblem, setShowProblem] = useState(false);

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {/* Problem Column */}
      <div style={{ 
        flex: 1, 
        padding: '20px',
        border: '2px solid red',
        borderRadius: '8px'
      }}>
        <h2>❌ Problem</h2>
        <pre style={{ background: '#ffebee', padding: '10px' }}>
          {`// This causes re-renders
const { formState: { errors } } = useFormContext();
// Every error change triggers ALL re-renders`}
        </pre>
        <button onClick={() => {
          alert("❌ When errors change:\n- ALL fields re-render\n- Performance suffers\n- UI may freeze");
          setShowProblem(true);
        }}>
          Show Problem
        </button>
        {showProblem && <ProblematicForm />}
      </div>

      {/* Solution Column */}
      <div style={{ 
        flex: 1, 
        padding: '20px',
        border: '2px solid green',
        borderRadius: '8px'
      }}>
        <h2>✅ Solution</h2>
        <pre style={{ background: '#e8f5e9', padding: '10px' }}>
          {`// Only subscribe to specific errors
const { errors } = useFormState({
  name: 'specificField'
});
// Only affected field re-renders`}
        </pre>
        <OptimizedForm />
      </div>
    </div>
  );
}; 