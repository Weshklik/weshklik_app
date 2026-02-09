
import { FormSchema } from '../../types/form';
import { Icons } from '../../components/Icons';

export const carRentalProSchema: FormSchema = {
  id: 'auto_rent_pro',
  sections: [
    { id: 'identity', title: 'Véhicule', icon: Icons.Car, description: 'Le véhicule à louer' },
    { id: 'rental_terms', title: 'Conditions & Tarifs', icon: Icons.Tag, description: 'Vos règles de location' },
    { id: 'availability', title: 'Disponibilité', icon: Icons.Calendar, description: 'Gestion du planning' },
    { id: 'location', title: 'Agence', icon: Icons.MapPin, description: 'Lieu de prise en charge' },
    { id: 'media', title: 'Photos', icon: Icons.Camera }
  ],
  fields: [
    // --- IDENTITY ---
    {
      id: 'brand',
      label: 'Marque',
      type: 'select',
      group: 'identity',
      required: true,
      importance: 'core',
      source: 'brands_auto',
      aiHint: 'car_brand',
      csvColumn: 'Marque'
    },
    {
      id: 'model',
      label: 'Modèle',
      type: 'select',
      group: 'identity',
      required: true,
      importance: 'core',
      dependsOn: 'brand',
      source: 'models_by_brand',
      aiHint: 'car_model',
      csvColumn: 'Modele'
    },
    {
      id: 'year',
      label: 'Année',
      type: 'number',
      group: 'identity',
      required: true,
      min: 2015, // Rental fleets usually newer
      max: new Date().getFullYear() + 1,
      aiHint: 'car_year',
      csvColumn: 'Annee'
    },
    {
      id: 'fuel',
      label: 'Carburant',
      type: 'select',
      group: 'identity',
      required: true,
      options: ['Essence', 'Diesel', 'Hybride', 'Électrique'],
      ui: 'chips',
      aiHint: 'car_fuel'
    },
    {
      id: 'transmission',
      label: 'Boîte',
      type: 'select',
      group: 'identity',
      required: true,
      options: ['Manuelle', 'Automatique'],
      ui: 'chips',
      aiHint: 'car_transmission'
    },

    // --- RENTAL TERMS ---
    {
      id: 'price_per_day',
      label: 'Prix par jour',
      type: 'number',
      group: 'rental_terms',
      required: true,
      importance: 'core',
      suffix: 'DA/j',
      min: 2000,
      aiHint: 'rental_price_day',
      csvColumn: 'Prix_Jour'
    },
    {
      id: 'deposit',
      label: 'Caution / Garantie',
      type: 'number',
      group: 'rental_terms',
      required: true,
      importance: 'recommended',
      suffix: 'DA',
      placeholder: 'Ex: 50000',
      aiHint: 'rental_deposit'
    },
    {
        id: 'min_duration',
        label: 'Durée min. (jours)',
        type: 'number',
        group: 'rental_terms',
        min: 1,
        placeholder: '1',
        aiHint: 'rental_min_days'
    },
    {
        id: 'requirements',
        label: 'Conditions requises',
        type: 'multiselect',
        group: 'rental_terms',
        options: ['Permis +2 ans', 'Age +25 ans', 'Passeport obligatoire', 'Chèque de caution'],
        ui: 'chips'
    },
    {
        id: 'delivery',
        label: 'Livraison possible (Aéroport / Gare)', // Specific label for checkbox UI
        type: 'checkbox',
        group: 'rental_terms',
        aiHint: 'rental_delivery'
    },

    // --- AVAILABILITY ---
    {
      id: 'availability',
      label: 'Périodes Disponibles',
      type: 'availability_calendar',
      group: 'availability',
      required: true,
      importance: 'core',
      aiHint: 'availability_periods' // AI can parse "Libre tout le mois d'aout"
    },

    // --- LOCATION ---
    {
      id: 'wilaya',
      label: 'Wilaya Agence',
      type: 'select',
      group: 'location',
      required: true,
      source: 'wilayas',
      aiHint: 'location_wilaya'
    },
    {
      id: 'commune',
      label: 'Commune',
      type: 'select',
      group: 'location',
      required: true,
      dependsOn: 'wilaya',
      source: 'communes_by_wilaya',
      aiHint: 'location_commune'
    },

    // --- MEDIA ---
    {
      id: 'images',
      label: 'Photos',
      type: 'image-upload',
      group: 'media',
      required: true,
      max: 5,
      aiHint: 'ad_images'
    }
  ]
};
