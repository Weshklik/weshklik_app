
import { FormSchema, FormField } from '../types/form';
import { getDataSource } from '../form-schemas/registry';

export interface CsvValidationResult {
  isValid: boolean;
  totalRows: number;
  validRows: Record<string, any>[];
  errors: { row: number; field: string; message: string; value: any }[];
}

/**
 * 1. Generate a CSV Header string based on the Schema
 * Iterates through all fields in all sections to create columns.
 */
export const generateCsvTemplate = (schema: FormSchema): string => {
    // Flatten fields from all sections (if organized by section) or use direct fields
    // Ideally schema.fields is the flat list as per our definition in types/form.ts
    // but often schemas structure might be section-based visually.
    // Our FormSchema type has `fields` at root level which is perfect.
    
    const headers = schema.fields
        .filter(f => f.type !== 'separator' && f.type !== 'image-upload') // Exclude non-data fields for simple CSV
        .map(f => f.csvColumn || f.id);
    
    return headers.join(',');
};

/**
 * 2. Parse Raw CSV Text to Object Array
 * Simple parser handling comma separation. 
 * Note: Does not handle complex quotes/newlines within cells for this MVP version.
 */
export const parseCsvText = (text: string): Record<string, string>[] => {
    const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(',');
        // Basic check for column count match
        if (currentLine.length === headers.length) {
            const row: Record<string, string> = {};
            headers.forEach((header, index) => {
                row[header] = currentLine[index]?.trim();
            });
            data.push(row);
        }
    }
    return data;
};

/**
 * 3. Validate parsed data against Schema
 * This ensures data integrity for Pro imports using the Single Source of Truth.
 * Handles dependencies (e.g. verifying Model based on Brand in the same row).
 */
export const validateCsvAgainstSchema = (
  rawRows: Record<string, any>[], 
  schema: FormSchema
): CsvValidationResult => {
  
  const validRows: Record<string, any>[] = [];
  const errors: { row: number; field: string; message: string; value: any }[] = [];

  rawRows.forEach((row, index) => {
    const rowNumber = index + 2; // +1 for 0-index, +1 for header
    const cleanRow: Record<string, any> = {};
    let isRowValid = true;

    // Iterate through schema fields
    schema.fields.forEach(field => {
      // Skip non-data fields for CSV
      if (field.type === 'separator' || field.type === 'image-upload') return;

      // 1. Map Column Name
      const colName = field.csvColumn || field.id;
      let value = row[colName];

      // 2. Handling Missing Data
      if (value === undefined || value === null || value === '') {
        if (field.required) {
          errors.push({ row: rowNumber, field: field.label, message: 'Champ requis', value: '(vide)' });
          isRowValid = false;
        }
        return;
      }

      // 3. Type Conversion & Validation
      if (field.type === 'number') {
        // Clean spaces (e.g. "10 000" -> "10000")
        const cleanVal = String(value).replace(/\s/g, '');
        const num = Number(cleanVal);
        
        if (isNaN(num)) {
          errors.push({ row: rowNumber, field: field.label, message: 'Doit être un nombre valide', value });
          isRowValid = false;
        } else {
          // Range check
          if (field.min !== undefined && num < field.min) {
             errors.push({ row: rowNumber, field: field.label, message: `Valeur min : ${field.min}`, value });
             isRowValid = false;
          }
          if (field.max !== undefined && num > field.max) {
             errors.push({ row: rowNumber, field: field.label, message: `Valeur max : ${field.max}`, value });
             isRowValid = false;
          }
          cleanRow[field.id] = num;
        }
      } 
      
      else if (field.type === 'select') {
        // Resolve Options
        let validOptions: any[] = [];
        
        if (field.options) {
            validOptions = field.options;
        } else if (field.source) {
            // Context-aware source resolution!
            // If field depends on another (e.g. Model depends on Brand), use the row's value for the dependency
            const dependencyValue = field.dependsOn ? row[field.dependsOn] : undefined;
            
            // Only fetch source if dependency is satisfied or not required
            if (!field.dependsOn || dependencyValue) {
                validOptions = getDataSource(field.source, dependencyValue);
            }
        }

        // Check existence (Case insensitive for CSV UX)
        if (validOptions.length > 0) {
            const valStr = String(value).trim();
            const exists = validOptions.some(opt => 
                (typeof opt === 'string' ? opt.toLowerCase() === valStr.toLowerCase() : opt.value === valStr)
            );
            
            if (!exists) {
                 errors.push({ 
                     row: rowNumber, 
                     field: field.label, 
                     message: `Valeur inconnue. Options: ${validOptions.slice(0, 3).map(o => typeof o === 'string' ? o : o.label).join(', ')}...`, 
                     value 
                 });
                 isRowValid = false;
            } else {
                // Normalize value to match schema (e.g. "essence" -> "Essence")
                const match = validOptions.find(opt => 
                    (typeof opt === 'string' ? opt.toLowerCase() === valStr.toLowerCase() : opt.value === valStr)
                );
                cleanRow[field.id] = typeof match === 'string' ? match : match.value;
            }
        } else {
            // If no options resolved (maybe invalid dependency), assume raw value but warn if strict
            cleanRow[field.id] = value;
        }
      }
      
      else {
        // Text / Default
        cleanRow[field.id] = value;
      }
    });

    if (isRowValid) {
      validRows.push(cleanRow);
    }
  });

  return {
    isValid: errors.length === 0,
    totalRows: rawRows.length,
    validRows,
    errors
  };
};
