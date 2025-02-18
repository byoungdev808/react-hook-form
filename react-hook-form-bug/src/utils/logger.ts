const logger = {
  render: (componentName: string) => {
    console.log(`🔄 ${componentName} rendered at ${new Date().toISOString()}`);
  },
  formState: (action: string, data: any) => {
    console.log(`📝 Form State ${action}:`, data);
  }
};

export default logger; 