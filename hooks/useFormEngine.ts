
import { useState, useCallback, useEffect } from 'react';
import { FormSchema } from '../types/form';

export const useFormEngine = (schema: FormSchema | null) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Reset form when schema changes
  useEffect(() => {
    setFormData({});
    setErrors({});
    setTouched({});
  }, [schema?.id]);

  const setFieldValue = useCallback((fieldId: string, value: any) => {
    setFormData(prev => {
      const next = { ...prev, [fieldId]: value };
      
      // Dependency Logic: Clear dependent fields
      // If 'brand' changes, clear 'model'
      if (schema) {
          const dependents = schema.fields.filter(f => f.dependsOn === fieldId);
          dependents.forEach(dep => {
              delete next[dep.id]; // Remove value of dependent field
          });
      }
      return next;
    });

    // Clear error if valid (simple check)
    if (value) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fieldId];
            return newErrors;
        });
    }
  }, [schema]);

  const validate = useCallback(() => {
    if (!schema) return false;
    const newErrors: Record<string, string> = {};
    let isValid = true;

    schema.fields.forEach(field => {
        if (field.required && !formData[field.id]) {
            // Special check for arrays (multiselect/images)
            if (Array.isArray(formData[field.id]) && formData[field.id].length === 0) {
                 newErrors[field.id] = "Ce champ est obligatoire.";
                 isValid = false;
            } else if (!formData[field.id]) {
                 newErrors[field.id] = "Ce champ est obligatoire.";
                 isValid = false;
            }
        }
        
        if (field.min && formData[field.id] < field.min) {
            newErrors[field.id] = `Valeur minimale : ${field.min}`;
            isValid = false;
        }
    });

    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({...acc, [key]: true}), {}));
    
    return isValid;
  }, [schema, formData]);

  return {
    formData,
    errors,
    touched,
    setFieldValue,
    validate,
    reset: () => setFormData({})
  };
};
