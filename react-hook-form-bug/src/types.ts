export interface FormValues {
  array: Array<{
    firstName: string;
    lastName: string;
    working: string;
  }>;
}

export interface InputProps {
  field: {
    onChange: (value: any) => void;
    onBlur: () => void;
    value: string;
    name: string;
    ref: React.Ref<any>;
  };
  error?: string;
} 