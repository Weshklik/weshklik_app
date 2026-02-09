
import { FormSchema } from '../types/form';
import { Icons } from '../components/Icons';

export const phoneSchema: FormSchema = {
  id: 'phones_smartphones',
  sections: [
    { id: 'specs', title: 'Modèle', icon: Icons.Smartphone, description: 'Détails du téléphone' },
    { id: 'condition', title: 'État', icon: Icons.Shield, description: 'État esthétique et fonctionnel' },
    { id: 'offer', title: 'Offre', icon: Icons.Tag },
    { id: 'location', title: 'Localisation', icon: Icons.MapPin },
    { id: 'media', title: 'Photos', icon: Icons.Camera }
  ],
  fields: [
    // --- SPECS ---
    {
      id: 'brand',
      label: 'Marque',
      type: 'select',
      group: 'specs',
      required: true,
      importance: 'core',
      source: 'phone_brands',
      aiHint: 'phone_brand'
    },
    {
      id: 'model',
      label: 'Modèle',
      type: 'text', 
      group: 'specs',
      required: true,
      importance: 'core',
      placeholder: 'Ex: iPhone 14 Pro Max',
      aiHint: 'phone_model'
    },
    {
      id: 'storage',
      label: 'Stockage',
      type: 'select',
      group: 'specs',
      required: true,
      importance: 'core',
      options: ['64 Go', '128 Go', '256 Go', '512 Go', '1 To'],
      ui: 'chips',
      aiHint: 'phone_storage'
    },
    {
      id: 'color',
      label: 'Couleur',
      type: 'text',
      group: 'specs',
      placeholder: 'Ex: Noir Sidéral, Or...',
      aiHint: 'phone_color'
    },

    // --- CONDITION ---
    {
      id: 'condition',
      label: 'État du produit',
      type: 'select',
      group: 'condition',
      required: true,
      importance: 'core',
      options: [
          'Neuf (Sous blister)', 
          'Neuf (Jamais utilisé)', 
          'Excellent état', 
          'Bon état', 
          'État correct', 
          'Pour pièces'
      ],
      aiHint: 'item_condition'
    },
    {
      id: 'battery_health',
      label: 'État batterie (%)',
      type: 'number',
      group: 'condition',
      importance: 'recommended',
      min: 0,
      max: 100,
      suffix: '%',
      aiHint: 'phone_battery'
    },
    {
        id: 'accessories',
        label: 'Accessoires fournis',
        type: 'multiselect',
        group: 'condition',
        options: ['Boîte d\'origine', 'Chargeur', 'Câble', 'Écouteurs', 'Coque', 'Facture d\'achat'],
        ui: 'chips',
        aiHint: 'phone_accessories'
    },

    // --- OFFER ---
    {
      id: 'title',
      label: 'Titre',
      type: 'text',
      group: 'offer',
      required: true,
      importance: 'recommended',
      placeholder: 'Ex: iPhone 14 Pro 128Go Noir comme neuf',
      aiHint: 'ad_title'
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      group: 'offer',
      required: true,
      importance: 'recommended',
      aiHint: 'ad_description'
    },
    {
      id: 'price',
      label: 'Prix',
      type: 'number',
      group: 'offer',
      required: true,
      importance: 'core',
      suffix: 'DA',
      aiHint: 'ad_price'
    },
    {
      id: 'exchange',
      label: 'Accepte l\'échange',
      type: 'checkbox',
      group: 'offer',
      aiHint: 'ad_exchange_accepted'
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

    // --- MEDIA ---
    {
      id: 'images',
      label: 'Photos',
      type: 'image-upload',
      group: 'media',
      required: true,
      importance: 'recommended',
      max: 5,
      aiHint: 'ad_images'
    }
  ]
};
