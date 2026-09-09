


import { useState, useCallback } from 'react';

export type ValidationRule = (value: any) => string | null;

export interface FormField {
  value: any;
  error: string | null;
  touched: boolean;
}

export interface FormState {
  [key: string]: FormField;
}

export interface UseFormOptions {
  initialValues: Record<string, any>;
  validationRules?: Record<string, ValidationRule[]>;
  onSubmit?: (values: Record<string, any>) => Promise<void> | void;
}






export const useForm = (options: UseFormOptions) => {
  const { initialValues, validationRules = {}, onSubmit } = options;

  
  const [formState, setFormState] = useState<FormState>(() => {
    const state: FormState = {};
    Object.keys(initialValues).forEach((key) => {
      state[key] = {
        value: initialValues[key],
        error: null,
        touched: false,
      };
    });
    return state;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  
  const validateField = useCallback(
    (fieldName: string, value: any): string | null => {
      const rules = validationRules[fieldName];
      if (!rules) return null;

      for (const rule of rules) {
        const error = rule(value);
        if (error) return error;
      }

      return null;
    },
    [validationRules]
  );

  
  const handleChange = useCallback(
    (fieldName: string, value: any) => {
      setFormState((prev) => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          value,
          error: null, 
        },
      }));
    },
    []
  );

  
  const handleBlur = useCallback(
    (fieldName: string) => {
      setFormState((prev) => {
        const field = prev[fieldName];
        const error = validateField(fieldName, field.value);

        return {
          ...prev,
          [fieldName]: {
            ...field,
            error,
            touched: true,
          },
        };
      });
    },
    [validateField]
  );

  
  const validateForm = useCallback((): boolean => {
    let isValid = true;
    const newState: FormState = {};

    Object.keys(formState).forEach((fieldName) => {
      const field = formState[fieldName];
      const error = validateField(fieldName, field.value);

      newState[fieldName] = {
        ...field,
        error,
        touched: true,
      };

      if (error) isValid = false;
    });

    setFormState(newState);
    return isValid;
  }, [formState, validateField]);

  
  const handleSubmit = useCallback(
    async (e?: any) => {
      if (e?.preventDefault) {
        e.preventDefault();
      }

      setSubmitError(null);

      if (!validateForm()) {
        setSubmitError('Please fix the errors in the form');
        return;
      }

      if (!onSubmit) return;

      try {
        setIsSubmitting(true);

        const values: Record<string, any> = {};
        Object.keys(formState).forEach((key) => {
          values[key] = formState[key].value;
        });

        await onSubmit(values);
      } catch (error: any) {
        setSubmitError(error.message || 'An error occurred');
      } finally {
        setIsSubmitting(false);
      }
    },
    [formState, validateForm, onSubmit]
  );

  
  const resetForm = useCallback(() => {
    const newState: FormState = {};
    Object.keys(initialValues).forEach((key) => {
      newState[key] = {
        value: initialValues[key],
        error: null,
        touched: false,
      };
    });
    setFormState(newState);
    setSubmitError(null);
  }, [initialValues]);

  
  const setFieldValue = useCallback((fieldName: string, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
      },
    }));
  }, []);

  
  const setFieldError = useCallback((fieldName: string, error: string | null) => {
    setFormState((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        error,
      },
    }));
  }, []);

  
  const getFieldProps = useCallback(
    (fieldName: string) => ({
      value: formState[fieldName]?.value || '',
      onChangeText: (value: string) => handleChange(fieldName, value),
      onBlur: () => handleBlur(fieldName),
    }),
    [formState, handleChange, handleBlur]
  );

  
  const getValues = useCallback(() => {
    const values: Record<string, any> = {};
    Object.keys(formState).forEach((key) => {
      values[key] = formState[key].value;
    });
    return values;
  }, [formState]);

  
  const isValid = useCallback(() => {
    return Object.values(formState).every((field) => !field.error);
  }, [formState]);

  
  const isDirty = useCallback(() => {
    return Object.keys(formState).some(
      (key) => formState[key].value !== initialValues[key]
    );
  }, [formState, initialValues]);

  return {
    
    formState,
    isSubmitting,
    submitError,

    
    handleChange,
    handleBlur,
    handleSubmit,

    
    resetForm,
    setFieldValue,
    setFieldError,
    getFieldProps,
    getValues,
    validateForm,
    isValid,
    isDirty,
  };
};

export default useForm;
