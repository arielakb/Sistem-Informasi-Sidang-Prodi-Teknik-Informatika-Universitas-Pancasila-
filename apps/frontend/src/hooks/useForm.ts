import { useState, useCallback } from 'react';

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
}

type Validator<T> = (values: T) => Partial<Record<keyof T, string>>;

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validator?: Validator<T>
) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
  });

  const setValue = useCallback((field: keyof T, value: any) => {
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, [field]: value },
      touched: { ...prev.touched, [field]: true },
      errors: validator 
        ? { ...prev.errors, [field]: undefined }
        : prev.errors,
    }));
  }, [validator]);

  const validate = useCallback((): boolean => {
    if (!validator) return true;
    
    const errors = validator(state.values);
    setState((prev) => ({ ...prev, errors }));
    
    return Object.keys(errors).length === 0;
  }, [validator, state.values]);

  const handleSubmit = useCallback(async (onSubmit: (values: T) => Promise<void>) => {
    setState((prev) => ({ ...prev, isSubmitting: true }));
    
    const isValid = validate();
    if (!isValid) {
      setState((prev) => ({ ...prev, isSubmitting: false }));
      return false;
    }

    try {
      await onSubmit(state.values);
      return true;
    } catch (error) {
      return false;
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  }, [validate, state.values]);

  const reset = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
    });
  }, [initialValues]);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    setValue,
    validate,
    handleSubmit,
    reset,
  };
}