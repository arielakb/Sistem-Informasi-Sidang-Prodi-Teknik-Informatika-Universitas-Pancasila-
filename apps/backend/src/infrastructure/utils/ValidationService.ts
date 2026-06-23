import { ZodSchema, ZodError } from 'zod';

export class ValidationService {
  static validate(schema: any, data: any): { valid: boolean; errors?: any } {
    // If caller provided a Zod schema, use it
    if ((schema as ZodSchema)?.safeParse) {
      try {
        const result = (schema as ZodSchema).safeParse(data);
        if (result.success) return { valid: true };
        return { valid: false, errors: result.error.format() };
      } catch (err) {
        if (err instanceof ZodError) return { valid: false, errors: err.format() };
        return { valid: false, errors: err };
      }
    }

    // Fallback: basic required-fields check for object schema
    if (schema && typeof schema === 'object') {
      const errors: Record<string, string> = {};
      for (const key of Object.keys(schema)) {
        if (schema[key].required && (data[key] === undefined || data[key] === null || data[key] === '')) {
          errors[key] = 'Required';
        }
      }
      return { valid: Object.keys(errors).length === 0, errors: Object.keys(errors).length ? errors : undefined };
    }

    return { valid: true };
  }
}
