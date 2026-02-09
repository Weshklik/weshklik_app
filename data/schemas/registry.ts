
import { FormSchema, FormField } from '../../types/form';
import { CATEGORIES, WILAYAS } from '../data'; 
import { vehicleSchema } from '../../form-schemas/vehicle';
import { realEstateSaleSchema } from '../../form-schemas/real-estate';
import { phoneSchema } from '../../form-schemas/phones';
import { carRentalProSchema } from '../../form-schemas/vehicules/location_voitures.pro';
import { vacationRentalProSchema } from '../../form-schemas/vacances/location_vacances.pro';
import { TOURISM_ZONE_LABELS as LABELS } from '../tourismZones';
import { TOURISM_ZONES_BY_WILAYA as ZONE_MAPPING } from '../tourismZoneByLocation';
import { Icons } from '../../components/Icons';

// --- DATA SOURCES (MOCK) ---
const CAR_BRANDS = ['Volkswagen', 'Renault', 'Peugeot', 'Audi', 'Mercedes', 'BMW', 'Toyota', 'Hyundai', 'Kia', 'Seat', 'Skoda', 'Dacia', 'Chery', 'Geely', 'Fiat'];
const CAR_MODELS: Record<string, string[]> = {
    'Volkswagen': ['Golf', 'Polo', 'Tiguan', 'Passat', 'Caddy', 'Touareg'],
    'Renault': ['Clio', 'Megane', 'Symbol', 'Kangoo', 'Duster'],
    'Peugeot': ['208', '308', '3008', 'Partner', '2008'],
    'Audi': ['A3', 'A4', 'Q3', 'Q5', 'A1'],
    // ... others
};
const CAR_OPTIONS = ['Toit ouvrant', 'Jantes Alliage', 'Climatisation', 'Radar de recul', 'Caméra 360', 'Sièges chauffants', 'Digital Cockpit', 'Matrix LED', 'Cuir'];
const COLORS = ['Blanc', 'Noir', 'Gris Argent', 'Gris Souris', 'Bleu', 'Rouge', 'Vert', 'Beige', 'Autre'];

const PHONE_BRANDS = ['Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Realme', 'Huawei', 'Google', 'Infinix', 'Condor', 'Honor'];

// --- SOURCE RESOLVER ---
export const getDataSource = (sourceKey: string, dependencyValue?: any): any[] => {
    switch (sourceKey) {
        // Auto
        case 'brands_auto': return CAR_BRANDS;
        case 'models_by_brand': return dependencyValue ? (CAR_MODELS[dependencyValue] || ['Autre']) : [];
        case 'car_options': return CAR_OPTIONS;
        
        // Phones
        case 'phone_brands': return PHONE_BRANDS;
        
        // Common
        case 'colors': return COLORS;
        case 'wilayas': return WILAYAS.map(w => `${w.code} - ${w.name}`);
        case 'communes_by_wilaya': {
            if (!dependencyValue) return [];
            // Parse "16 - Alger" to get code "16"
            const code = dependencyValue.split(' - ')[0];
            const wilaya = WILAYAS.find(w => w.code === code);
            return wilaya?.communes || [];
        }

        // INTELLIGENT ZONES
        case 'tourism_zones_by_wilaya': {
            if (!dependencyValue) return [];
            const code = dependencyValue.split(' - ')[0];
            const zones = ZONE_MAPPING[code] || [];
            
            // Return formatted options {label: 'Mer & Plage', value: 'MER_PLAGE'}
            return zones.map(z => ({
                label: LABELS[z],
                value: z
            }));
        }
        
        default: return [];
    }
};

// --- GENERIC FALLBACK SCHEMA GENERATOR ---
const generateFallbackSchema = (categoryId: string, subCategoryId: string): FormSchema => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    const subCategory = category?.subCategories?.find(s => s.id === subCategoryId);

    if (!category || !subCategory) {
        // Fallback safety if category not found in data.ts yet (e.g. newly added)
        return {
            id: 'generic_fallback',
            sections: [],
            fields: [
                { id: 'title', label: 'Titre', type: 'text', required: true },
                { id: 'description', label: 'Description', type: 'textarea', required: true }
            ]
        };
    }

    const legacyFields = subCategory.fields || [];
    
    // Map legacy fields to new FormField structure
    const convertedFields: FormField[] = legacyFields.map(f => ({
        id: f.id,
        label: f.label,
        type: f.type as any, // Simple cast for now, types are mostly compatible
        required: f.required,
        options: f.options,
        group: 'specs', // Put everything in specs by default
        suffix: f.id === 'price' ? 'DA' : undefined,
        aiHint: `${categoryId}_${f.id}` // Auto-generate hint for fallback
    }));

    // Add Standard Fields that were hardcoded in PostAd before
    const standardFields: FormField[] = [
        // Identity
        { id: 'title', label: 'Titre', type: 'text', required: true, importance: 'recommended', group: 'identity', aiHint: 'ad_title' },
        { id: 'description', label: 'Description', type: 'textarea', required: true, importance: 'recommended', group: 'identity', aiHint: 'ad_description' },
        { id: 'price', label: 'Prix', type: 'number', required: true, importance: 'core', suffix: 'DA', group: 'pricing', aiHint: 'ad_price' },
        // Location
        { id: 'wilaya', label: 'Wilaya', type: 'select', required: true, importance: 'core', source: 'wilayas', group: 'location', aiHint: 'location_wilaya' },
        { id: 'commune', label: 'Commune', type: 'select', required: true, dependsOn: 'wilaya', source: 'communes_by_wilaya', group: 'location', aiHint: 'location_commune' },
        // Media
        { id: 'images', label: 'Photos', type: 'image-upload', required: true, importance: 'recommended', group: 'media', aiHint: 'ad_images' }
    ];

    return {
        id: `${categoryId}_${subCategoryId}`,
        sections: [
            { id: 'identity', title: 'L\'essentiel', icon: Icons.FileText },
            { id: 'specs', title: 'Détails', icon: Icons.Settings },
            { id: 'pricing', title: 'Prix', icon: Icons.Tag },
            { id: 'location', title: 'Localisation', icon: Icons.MapPin },
            { id: 'media', title: 'Photos', icon: Icons.Camera },
        ],
        fields: [...standardFields, ...convertedFields]
    };
};

// --- MAIN RESOLVER ---
export const getFormSchema = (categoryId: string, subCategoryId: string): FormSchema => {
    // 1. PRO RENTALS (Priority V2)
    if (categoryId === 'auto' && subCategoryId === 'rent') {
        return carRentalProSchema;
    }
    if (categoryId === 'real_estate' && subCategoryId === 'holiday_rent') {
        return vacationRentalProSchema;
    }

    // 2. PRO SALES (Premium V1)
    if (categoryId === 'auto' && subCategoryId === 'car') {
        return vehicleSchema;
    }
    if (categoryId === 'real_estate' && subCategoryId === 'sale') {
        return realEstateSaleSchema;
    }
    if (categoryId === 'phones' && subCategoryId === 'smartphones') {
        return phoneSchema;
    }

    // 3. Return Generic Fallback for others
    return generateFallbackSchema(categoryId, subCategoryId);
};
