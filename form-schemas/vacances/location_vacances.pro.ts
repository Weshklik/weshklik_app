
import { FormSchema } from '../../types/form';
import { Icons } from '../../components/Icons';

export const vacationRentalProSchema: FormSchema = {
  id: 'real_estate_holiday_rent_pro',
  sections: [
    { id: 'location', title: 'Localisation', icon: Icons.MapPin, description: 'Situation géographique' },
    { id: 'property', title: 'Le Logement', icon: Icons.Home, description: 'Type et capacité' },
    { id: 'pricing', title: 'Tarifs', icon: Icons.Tag, description: 'Prix de la nuitée' },
    { id: 'availability', title: 'Planning', icon: Icons.Calendar, description: 'Disponibilités' },
    { id: 'media', title: 'Photos', icon: Icons.Camera }
  ],
  fields: [
    // --- LOCATION (Intelligent Zone) ---
    {
      id: 'wilaya',
      label: 'Wilaya',
      type: 'select',
      group: 'location',
      required: true,
      importance: 'core',
      source: 'wilayas',
      aiHint: 'location_wilaya',
      csvColumn: 'Wilaya'
    },
    {
      id: 'commune',
      label: 'Commune',
      type: 'select',
      group: 'location',
      required: true,
      dependsOn: 'wilaya',
      source: 'communes_by_wilaya',
      aiHint: 'location_commune',
      csvColumn: 'Commune'
    },
    {
      id: 'tourism_zone',
      label: 'Zone Touristique',
      type: 'select', // Locked select
      group: 'location',
      required: true,
      dependsOn: 'wilaya',
      source: 'tourism_zones_by_wilaya', // Intelligent Source
      disabled: true, // Auto-filled and locked for consistency
      importance: 'core',
      aiHint: 'tourism_zone',
      csvColumn: 'Zone_Touristique'
    },
    {
        id: 'address_detail',
        label: 'Adresse / Repère',
        type: 'text',
        group: 'location',
        placeholder: 'Ex: Résidence El Bahia, Vue sur mer',
        importance: 'recommended'
    },

    // --- PROPERTY ---
    {
      id: 'property_type',
      label: 'Type de logement',
      type: 'select',
      group: 'property',
      required: true,
      options: ['Appartement', 'Villa', 'Bungalow', 'Niveau de Villa', 'Studio', 'Chalet'],
      ui: 'chips',
      aiHint: 'property_type',
      csvColumn: 'Type_Bien'
    },
    {
      id: 'capacity',
      label: 'Capacité (Personnes)',
      type: 'number',
      group: 'property',
      required: true,
      min: 1,
      max: 20,
      suffix: 'Pers.',
      aiHint: 'capacity_persons',
      csvColumn: 'Capacite'
    },
    {
      id: 'rooms',
      label: 'Chambres',
      type: 'number',
      group: 'property',
      required: true,
      min: 0, // 0 for studio
      aiHint: 'property_rooms'
    },
    {
      id: 'amenities',
      label: 'Équipements',
      type: 'multiselect',
      group: 'property',
      options: ['Piscine', 'Wifi', 'Climatisation', 'Vue Mer', 'Garage', 'Barbecue', 'Jardin'],
      ui: 'chips',
      aiHint: 'property_amenities'
    },

    // --- PRICING ---
    {
      id: 'price_per_night',
      label: 'Prix par nuit',
      type: 'number',
      group: 'pricing',
      required: true,
      importance: 'core',
      suffix: 'DA',
      min: 1000,
      aiHint: 'price_night',
      csvColumn: 'Prix_Nuit'
    },
    {
      id: 'cleaning_fee',
      label: 'Frais de ménage',
      type: 'number',
      group: 'pricing',
      suffix: 'DA',
      placeholder: 'Optionnel',
      aiHint: 'cleaning_fee'
    },
    {
      id: 'min_nights',
      label: 'Nuits minimum',
      type: 'number',
      group: 'pricing',
      min: 1,
      placeholder: '1',
      aiHint: 'min_nights'
    },

    // --- AVAILABILITY ---
    {
      id: 'availability',
      label: 'Calendrier des disponibilités',
      type: 'availability_calendar',
      group: 'availability',
      required: true,
      importance: 'core',
      aiHint: 'availability_periods'
    },
    {
        id: 'check_times',
        label: 'Horaires (Arrivée / Départ)',
        type: 'text',
        group: 'availability',
        placeholder: 'Ex: 14h00 / 11h00'
    },

    // --- MEDIA ---
    {
      id: 'images',
      label: 'Photos',
      type: 'image-upload',
      group: 'media',
      required: true,
      max: 10,
      aiHint: 'ad_images'
    }
  ]
};
