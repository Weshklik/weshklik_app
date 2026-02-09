
import { FormSchema } from '../types/form';
import { Icons } from '../components/Icons';

export const realEstateSaleSchema: FormSchema = {
  id: 'real_estate_sale',
  sections: [
    { id: 'identity', title: 'Type de Bien', icon: Icons.Home, description: 'Qu\'est-ce que vous vendez ?' },
    { id: 'specs', title: 'Caractéristiques', icon: Icons.LayoutDashboard, description: 'Surfaces et pièces' },
    { id: 'legal', title: 'Juridique', icon: Icons.FileText, description: 'Papiers et documents' },
    { id: 'pricing', title: 'Prix', icon: Icons.Tag },
    { id: 'location', title: 'Localisation', icon: Icons.MapPin },
    { id: 'media', title: 'Photos', icon: Icons.Camera }
  ],
  fields: [
    // --- IDENTITY ---
    {
      id: 'property_type',
      label: 'Type de bien',
      type: 'select',
      group: 'identity',
      required: true,
      importance: 'core',
      options: ['Appartement', 'Villa', 'Niveau de Villa', 'Studio', 'Duplex', 'Terrain', 'Local Commercial'],
      aiHint: 'property_type',
      ui: 'chips'
    },
    
    // --- SPECS ---
    {
      id: 'surface',
      label: 'Surface habitable',
      type: 'number',
      group: 'specs',
      required: true,
      importance: 'core',
      suffix: 'm²',
      min: 9,
      aiHint: 'property_area'
    },
    {
      id: 'rooms',
      label: 'Nombre de pièces (F)',
      type: 'number',
      group: 'specs',
      required: true,
      importance: 'core',
      min: 1,
      max: 20,
      placeholder: 'Ex: 3 pour F3',
      aiHint: 'property_rooms'
    },
    {
      id: 'floor',
      label: 'Étage',
      type: 'number',
      group: 'specs',
      dependsOn: 'property_type', 
      min: 0,
      max: 30,
      aiHint: 'property_floor'
    },
    {
      id: 'amenities',
      label: 'Commodités',
      type: 'multiselect',
      group: 'specs',
      importance: 'recommended',
      options: ['Garage', 'Jardin', 'Piscine', 'Ascenseur', 'Chauffage central', 'Climatisation', 'Vue sur mer', 'Meublé'],
      ui: 'chips',
      aiHint: 'property_amenities'
    },

    // --- LEGAL ---
    {
      id: 'papers',
      label: 'Documents juridiques',
      type: 'multiselect',
      group: 'legal',
      required: true,
      importance: 'core', // Critical in Real Estate
      options: ['Acte notarié', 'Livret foncier', 'Papier timbré', 'Promesse de vente', 'Décision', 'Dans l\'indivision'],
      aiHint: 'property_papers'
    },

    // --- PRICING ---
    {
      id: 'title',
      label: 'Titre de l\'annonce',
      type: 'text',
      group: 'pricing',
      required: true,
      importance: 'recommended',
      placeholder: 'Ex: F4 spacieux à Oran centre vue mer',
      aiHint: 'ad_title',
      minLength: 10
    },
    {
      id: 'description',
      label: 'Description détaillée',
      type: 'textarea',
      group: 'pricing',
      required: true,
      importance: 'recommended',
      placeholder: 'Quartier, voisins, proximité écoles...',
      aiHint: 'ad_description'
    },
    {
      id: 'price',
      label: 'Prix total',
      type: 'number',
      group: 'pricing',
      required: true,
      importance: 'core',
      suffix: 'DA',
      min: 0,
      aiHint: 'ad_price'
    },
    {
      id: 'price_unit',
      label: 'Unité de prix',
      type: 'radio',
      group: 'pricing',
      options: ['Total', 'Par m²'], 
      aiHint: 'ad_price_unit'
    },

    // --- LOCATION ---
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
    {
        id: 'district',
        label: 'Quartier / Cité',
        type: 'text',
        group: 'location',
        aiHint: 'location_district'
    },

    // --- MEDIA ---
    {
      id: 'images',
      label: 'Photos du bien',
      type: 'image-upload',
      group: 'media',
      required: true,
      importance: 'recommended',
      max: 15,
      aiHint: 'ad_images'
    }
  ]
};
