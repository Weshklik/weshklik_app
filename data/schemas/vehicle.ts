
import { FormSchema } from '../../types/form';
import { Icons } from '../../components/Icons';

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
      source: 'brands_auto', // Dynamic Source
      aiHint: 'car_brand'
    },
    {
      id: 'model',
      label: 'Modèle',
      type: 'select',
      group: 'identity',
      required: true,
      dependsOn: 'brand', // Dependency
      source: 'models_by_brand', // Dynamic Source
      aiHint: 'car_model'
    },
    {
      id: 'year',
      label: 'Année',
      type: 'number',
      group: 'identity',
      required: true,
      min: 1980,
      max: new Date().getFullYear(),
      placeholder: 'Ex: 2022'
    },
    {
      id: 'trim',
      label: 'Finition / Version',
      type: 'text',
      group: 'identity',
      placeholder: 'Ex: R-Line, GTD, Allure...'
    },

    // --- SPECS SECTION ---
    {
      id: 'fuel',
      label: 'Énergie',
      type: 'select',
      group: 'specs',
      required: true,
      options: ['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL'],
      ui: 'chips'
    },
    {
      id: 'transmission',
      label: 'Boîte de vitesse',
      type: 'select',
      group: 'specs',
      required: true,
      options: ['Manuelle', 'Automatique'],
      ui: 'chips'
    },
    {
      id: 'mileage',
      label: 'Kilométrage',
      type: 'number',
      group: 'specs',
      required: true,
      suffix: 'Km',
      min: 0
    },
    {
      id: 'color',
      label: 'Couleur',
      type: 'select',
      group: 'specs',
      source: 'colors'
    },
    {
      id: 'papers',
      label: 'Papiers',
      type: 'select',
      group: 'specs',
      options: ['Carte Grise', 'Licence Moudjahid', 'Carte Jaune', 'Crédit bancaire']
    },
    {
      id: 'options',
      label: 'Options & Équipements',
      type: 'multiselect',
      group: 'specs',
      source: 'car_options',
      ui: 'chips'
    },

    // --- PRICING SECTION ---
    {
      id: 'title',
      label: 'Titre de l\'annonce',
      type: 'text',
      group: 'pricing',
      required: true,
      placeholder: 'Ex: Golf 8 R-Line 2023 toit ouvrant',
      aiHint: 'generate_title'
    },
    {
      id: 'description',
      label: 'Description détaillée',
      type: 'textarea',
      group: 'pricing',
      required: true,
      minLength: 20,
      placeholder: 'Décrivez l\'état général, l\'entretien, les défauts éventuels...'
    },
    {
      id: 'price',
      label: 'Prix',
      type: 'number',
      group: 'pricing',
      required: true,
      suffix: 'DA',
      min: 0
    },
    {
      id: 'negotiable',
      label: 'Négociable',
      type: 'checkbox',
      group: 'pricing'
    },

    // --- LOCATION SECTION ---
    {
      id: 'wilaya',
      label: 'Wilaya',
      type: 'select',
      group: 'location',
      required: true,
      source: 'wilayas'
    },
    {
      id: 'commune',
      label: 'Commune',
      type: 'select',
      group: 'location',
      required: true,
      dependsOn: 'wilaya',
      source: 'communes_by_wilaya'
    },

    // --- MEDIA SECTION ---
    {
      id: 'images',
      label: 'Photos du véhicule',
      type: 'image-upload',
      group: 'media',
      required: true,
      max: 10
    }
  ]
};
