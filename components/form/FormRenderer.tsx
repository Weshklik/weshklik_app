
import React, { useEffect } from 'react';
import { FormSchema, FormField } from '../../types/form';
import { getDataSource } from '../../form-schemas/registry';
import { Icons } from '../Icons';

interface FormRendererProps {
  schema: FormSchema;
  formData: Record<string, any>;
  errors: Record<string, string>;
  onChange: (fieldId: string, value: any) => void;
}

export const FormRenderer: React.FC<FormRendererProps> = ({ schema, formData, errors, onChange }) => {

  // AUTO-FILL EFFECT for Intelligent Fields (e.g. Tourism Zone)
  useEffect(() => {
      schema.fields.forEach(field => {
          if (field.source && field.dependsOn && field.disabled) {
              const depValue = formData[field.dependsOn];
              if (depValue) {
                  const options = getDataSource(field.source, depValue);
                  // If options found and current value is empty or not in options
                  // Auto-select the first option if it's a locked field
                  if (options.length > 0) {
                      const currentValue = formData[field.id];
                      const firstOptionValue = typeof options[0] === 'string' ? options[0] : options[0].value;
                      
                      // Auto-set if strictly one option or if specifically requested by UX logic
                      if (options.length === 1 && currentValue !== firstOptionValue) {
                          onChange(field.id, firstOptionValue);
                      }
                  }
              }
          }
      });
  }, [formData, schema, onChange]);

  const renderField = (field: FormField) => {
    // 1. Resolve Data Source (if any)
    let options: string[] | any[] = field.options || [];
    if (field.source) {
       // Pass the value of the dependency if it exists
       const dependencyVal = field.dependsOn ? formData[field.dependsOn] : undefined;
       // Only fetch if dependency is satisfied (if required)
       if (!field.dependsOn || dependencyVal) {
           options = getDataSource(field.source, dependencyVal);
       }
    }

    const value = formData[field.id] || '';
    const error = errors[field.id];

    // 2. Render based on Type
    switch (field.type) {
        case 'select':
            return (
                <div className="relative">
                    <select
                        value={value}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        disabled={(field.dependsOn && !formData[field.dependsOn]) || field.disabled}
                        className={`w-full p-3 bg-gray-50 dark:bg-gray-800 border rounded-xl outline-none appearance-none transition-all ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-500'} disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-900`}
                    >
                        <option value="">{options.length === 0 ? '...' : 'Sélectionner...'}</option>
                        {options.map((opt: any) => (
                            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
                                {typeof opt === 'string' ? opt : opt.label}
                            </option>
                        ))}
                    </select>
                    <Icons.ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
            );

        case 'textarea':
            return (
                <textarea
                    value={value}
                    onChange={(e) => onChange(field.id, e.target.value)}
                    rows={5}
                    placeholder={field.placeholder}
                    className={`w-full p-3 bg-gray-50 dark:bg-gray-800 border rounded-xl outline-none transition-all ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-500'}`}
                />
            );

        case 'number':
            return (
                <div className="relative">
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        placeholder={field.placeholder || '0'}
                        className={`w-full p-3 bg-gray-50 dark:bg-gray-800 border rounded-xl outline-none transition-all font-mono ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-500'}`}
                    />
                    {field.suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">{field.suffix}</span>}
                </div>
            );

        case 'multiselect':
            return (
                <div className="flex flex-wrap gap-2">
                    {options.map((opt: string) => {
                        const isSelected = (value as string[])?.includes(opt);
                        return (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                    const current = (value as string[]) || [];
                                    const next = isSelected ? current.filter(x => x !== opt) : [...current, opt];
                                    onChange(field.id, next);
                                }}
                                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                                    isSelected 
                                    ? 'bg-brand-600 text-white border-brand-600' 
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-brand-300'
                                }`}
                            >
                                {opt}
                            </button>
                        );
                    })}
                </div>
            );
        
        case 'checkbox':
            return (
                <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                    <input 
                        type="checkbox" 
                        checked={!!value}
                        onChange={(e) => onChange(field.id, e.target.checked)}
                        className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{field.label}</span>
                </label>
            );

        case 'image-upload':
            const images = (value as string[]) || [];
            return (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200 dark:border-gray-700">
                            <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                            <button
                                onClick={() => onChange(field.id, images.filter((_, i) => i !== idx))}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Icons.X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    {images.length < (field.max || 5) && (
                        <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-colors">
                            <Icons.Camera className="w-6 h-6 text-gray-400 mb-1" />
                            <span className="text-[10px] text-gray-500 font-bold uppercase">Ajouter</span>
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*" 
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        const reader = new FileReader();
                                        reader.onload = (ev) => onChange(field.id, [...images, ev.target?.result]);
                                        reader.readAsDataURL(e.target.files[0]);
                                    }
                                }}
                            />
                        </label>
                    )}
                </div>
            );

        // --- NEW: AVAILABILITY CALENDAR ---
        case 'availability_calendar':
            // Mock Implementation for MVP - Displays a list of ranges
            // In a real app, integrate 'react-day-picker' or similar
            const ranges = (value as { from: string; to: string }[]) || [];
            
            const addRange = () => {
                // Mock adding next week
                const today = new Date();
                const nextWeek = new Date(today);
                nextWeek.setDate(today.getDate() + 7);
                const weekAfter = new Date(nextWeek);
                weekAfter.setDate(nextWeek.getDate() + 7);
                
                onChange(field.id, [...ranges, { 
                    from: nextWeek.toISOString().split('T')[0], 
                    to: weekAfter.toISOString().split('T')[0] 
                }]);
            };

            return (
                <div className="space-y-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase">Périodes définies</span>
                        <button 
                            type="button" 
                            onClick={addRange}
                            className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded font-bold hover:bg-brand-200 transition-colors"
                        >
                            + Ajouter une période
                        </button>
                    </div>
                    
                    {ranges.length === 0 ? (
                        <p className="text-sm text-gray-400 italic text-center py-4">Aucune période de disponibilité définie.</p>
                    ) : (
                        <div className="space-y-2">
                            {ranges.map((range, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-white dark:bg-gray-900 p-2 rounded border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Icons.Calendar className="w-4 h-4 text-brand-500" />
                                        <span>{range.from}</span>
                                        <Icons.ArrowLeft className="w-3 h-3 rotate-180 text-gray-400" />
                                        <span>{range.to}</span>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => onChange(field.id, ranges.filter((_, i) => i !== idx))}
                                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                                    >
                                        <Icons.Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <p className="text-[10px] text-gray-400 mt-2">
                        * Le calendrier synchronise automatiquement la disponibilité sur la recherche.
                    </p>
                </div>
            );

        default: // Text
            return (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className={`w-full p-3 bg-gray-50 dark:bg-gray-800 border rounded-xl outline-none transition-all ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-500'}`}
                />
            );
    }
  };

  const renderLabel = (field: FormField) => (
    <div className="flex justify-between items-end mb-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.label} {field.required && <span className="text-red-500 text-xs align-top">*</span>}
        </label>
        
        {/* UX Priority Badges */}
        {field.importance === 'core' && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-900/30 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-800">
                Essentiel
            </span>
        )}
        {field.importance === 'recommended' && (
            <span className="text-[10px] font-medium text-green-600 bg-green-50 dark:text-green-300 dark:bg-green-900/30 px-2 py-0.5 rounded border border-green-100 dark:border-green-800 flex items-center gap-1">
                <Icons.Star className="w-3 h-3 fill-current" /> Recommandé
            </span>
        )}
    </div>
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
        {schema.sections.map(section => {
            const sectionFields = schema.fields.filter(f => f.group === section.id);
            if (sectionFields.length === 0) return null;

            const Icon = section.icon || Icons.HelpCircle;

            return (
                <section key={section.id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="p-2 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg">
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{section.title}</h3>
                            {section.description && <p className="text-xs text-gray-500 dark:text-gray-400">{section.description}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sectionFields.map(field => (
                            <div key={field.id} className={['textarea', 'image-upload', 'multiselect', 'availability_calendar'].includes(field.type) ? 'md:col-span-2' : ''}>
                                {renderLabel(field)}
                                {renderField(field)}
                                {errors[field.id] && (
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                        <Icons.AlertCircle className="w-3 h-3" /> {errors[field.id]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            );
        })}
    </div>
  );
};
