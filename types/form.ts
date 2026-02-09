
export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'select' 
  | 'radio' 
  | 'checkbox' 
  | 'multiselect' 
  | 'date'
  | 'image-upload'
  | 'availability_calendar' // NEW: For Rental/Vacation context
  | 'separator';

export interface FieldOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string; // Unique key (e.g., 'brand', 'price')
  label: string;
  type: FieldType;
  required?: boolean; // Technical validation (Blocker)
  placeholder?: string;
  
  // UX Priority
  importance?: 'core' | 'recommended' | 'optional'; // Core = "Essentiel Métier", Recommended = "Pour mieux vendre"
  
  // Data Source Logic
  options?: FieldOption[] | string[]; // Static options
  source?: string; // Dynamic source key (e.g., 'brands', 'wilayas')
  dependsOn?: string; // ID of the field this one depends on (e.g., 'model' depends on 'brand')
  
  // Validation
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string; // Regex string
  
  // UI & AI Hints
  suffix?: string; // e.g., "DA", "Km"
  group?: string; // Group ID for visual separation
  aiHint?: string; // 'car_brand', 'pricing' for future AI filling
  hidden?: boolean; // Can be conditional
  ui?: 'chips' | 'dropdown' | 'standard'; // Visual hint
  
  // Pro / Import
  csvColumn?: string; // Override column name if different from ID
  adminOnly?: boolean; // Fields only editable by admin or system
  disabled?: boolean; // UI Lock (e.g. for Auto-filled zones)
}

export interface FormSection {
  id: string;
  title: string;
  icon?: any;
  description?: string;
}

export interface FormSchema {
  id: string;
  sections: FormSection[];
  fields: FormField[];
}
