
import { FormSchema } from '../types/form';
import { Icons } from '../components/Icons';

const CURRENT_YEAR = new Date().getFullYear();

export const vehicleSchema: FormSchema = {
  id: 'auto_car',
  sections: [
    { id: 'identity', title: 'Véhicule', icon: Icons.Car, description: 'Identification du véhicule' },
    { id: 'specs', title: 'Caractéristiques', icon: Icons.Settings, description: 'Détails techniques' },
    { id: 'pricing', title: 'Prix & Offre', icon: Icons.Tag, description: 'Votre proposition' },
    { id: 'location', title: 'Localisation', icon: Icons.MapPin, description: 'Où voir le véhicule ?' },
    { id: 'media', title: 'Photos', icon: Icons.Camera, description: 'Mettez votre bien en valeur' }
  ],
  fields: [
    // --- IDENTITY SECTION ---
    {
      id: 'brand',
      label: 'Marque',
      type: 'select',
      group: 'identity',
      required: true,
      importance: 'core', // KEY FIELD
      source: 'brands_auto', 
      aiHint: 'car_brand',
      ui: 'dropdown'
    },
    {
      id: 'model',
      label: 'Modèle',
      type: 'select',
      group: 'identity',
      required: true,
      importance: 'core', // KEY FIELD
      dependsOn: 'brand', 
      source: 'models_by_brand', 
      aiHint: 'car_model',
      ui: 'dropdown'
    },
    {
      id: 'year',
      label: 'Année',
      type: 'number',
      group: 'identity',
      required: true,
      importance: 'core', // KEY FIELD
      min: 1980,
      max: CURRENT_YEAR,
      placeholder: 'Ex: 2022',
      aiHint: 'car_year'
    },
    {
      id: 'trim',
      label: 'Finition / Version',
      type: 'text',
      group: 'identity',
      placeholder: 'Ex: R-Line, GTD, Allure...',
      aiHint: 'car_trim'
    },

    // --- SPECS SECTION ---
    {
      id: 'fuel',
      label: 'Énergie',
      type: 'select',
      group: 'specs',
      required: true,
      importance: 'core', // KEY FIELD
      options: ['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL'],
      ui: 'chips',
      aiHint: 'car_fuel'
    },
    {
      id: 'transmission',
      label: 'Boîte de vitesse',
      type: 'select',
      group: 'specs',
      required: true,
      importance: 'core',
      options: ['Manuelle', 'Automatique'],
      ui: 'chips',
      aiHint: 'car_transmission'
    },
    {
      id: 'mileage',
      label: 'Kilométrage',
      type: 'number',
      group: 'specs',
      required: true,
      importance: 'core',
      suffix: 'Km',
      min: 0,
      max: 1000000,
      aiHint: 'car_mileage'
    },
    {
      id: 'color',
      label: 'Couleur',
      type: 'select',
      group: 'specs',
      source: 'colors',
      aiHint: 'car_color'
    },
    {
      id: 'papers',
      label: 'Papiers',
      type: 'select',
      group: 'specs',
      options: ['Carte Grise', 'Licence Moudjahid', 'Carte Jaune', 'Crédit bancaire'],
      aiHint: 'car_papers'
    },
    {
      id: 'options',
      label: 'Options & Équipements',
      type: 'multiselect',
      group: 'specs',
      importance: 'recommended', // Helps sell better
      source: 'car_options',
      ui: 'chips',
      aiHint: 'car_options'
    },

    // --- PRICING SECTION ---
    {
      id: 'title',
      label: 'Titre de l\'annonce',
      type: 'text',
      group: 'pricing',
      required: true,
      importance: 'recommended',
      placeholder: 'Ex: Golf 8 R-Line 2023 toit ouvrant',
      aiHint: 'ad_title',
      minLength: 10,
      maxLength: 100
    },
    {
      id: 'description',
      label: 'Description détaillée',
      type: 'textarea',
      group: 'pricing',
      required: true,
      importance: 'recommended',
      minLength: 20,
      maxLength: 2000,
      placeholder: 'Décrivez l\'état général, l\'entretien, les défauts éventuels...',
      aiHint: 'ad_description'
    },
    {
      id: 'price',
      label: 'Prix',
      type: 'number',
      group: 'pricing',
      required: true,
      importance: 'core', // Crucial
      suffix: 'DA',
      min: 10000, // Minimum realistic price
      aiHint: 'ad_price'
    },
    {
      id: 'negotiable',
      label: 'Négociable',
      type: 'checkbox',
      group: 'pricing',
      aiHint: 'ad_negotiable'
    },

    // --- LOCATION SECTION ---
    {
      id: 'wilaya',
      label: 'Wilaya',
      type: 'select',
      group: 'location',
      required: true,
      importance: 'core',
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

    // --- MEDIA SECTION ---
    {
      id: 'images',
      label: 'Photos du véhicule',
      type: 'image-upload',
      group: 'media',
      required: true,
      importance: 'recommended', // Highly influential on sales
      max: 10,
      aiHint: 'ad_images'
    }
  ]
};
