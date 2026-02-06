
import { Category, Listing, Wilaya, StoreProfile, Review, ImportRequest, ProSector, SectorRule, Transaction, Payout, PartnerProfile } from './types';

// --- PARTNER PLANS (STEP 3) ---
export const PARTNER_PLANS = [
  {
    id: 'partner_free',
    name: 'Gratuit',
    price: 0,
    priceLabel: '0 DA',
    description: 'Pour démarrer doucement',
    features: [
      { text: 'Visibilité limitée', check: false },
      { text: 'Max 3 mises en relation / mois', check: true },
      { text: 'Profil simple (Pas de badge)', check: true },
      { text: 'Support standard', check: true }
    ],
    buttonLabel: 'Continuer en Gratuit',
    highlight: false
  },
  {
    id: 'partner_active',
    name: 'Partenaire Actif',
    price: 2000,
    priceLabel: '2000 DA / mois',
    description: 'Pour les partenaires sérieux',
    features: [
      { text: 'Visibilité Prioritaire', check: true },
      { text: 'Mises en relation illimitées', check: true },
      { text: 'Badge "Partenaire Actif"', check: true },
      { text: 'Support prioritaire WhatsApp', check: true }
    ],
    buttonLabel: 'Activer mon Badge',
    highlight: true
  }
];

const currentYear = new Date().getFullYear();
const carYears = Array.from({ length: currentYear - 2009 }, (_, i) => (currentYear - i).toString());

// --- PHASE 2: CENTRALIZED RULES (V1.5 STRUCTURE) ---
export const SECTOR_RULES: Record<string, SectorRule> = {
  // ... (rules kept same)
  // --- NOUVEAUX SECTEURS AUTOMOBILES & TRANSPORT ---
  'auto_vente': {
    freeLimit: 2,
    importAutoAllowed: true, // SEUL SECTEUR AUTORISÉ
    csvImportMinPack: 'silver',
    manualValidation: false,
    allowedCategories: ['auto'] // Strict: Only Vehicles
  },
  'auto_location': {
    freeLimit: 1,
    importAutoAllowed: false,
    csvImportMinPack: 'silver',
    manualValidation: false,
    allowedCategories: ['auto'] // Strict: Only Vehicles
  },
  'auto_services': {
    freeLimit: 1,
    importAutoAllowed: false,
    csvImportMinPack: 'none',
    manualValidation: false,
    allowedCategories: ['auto']
  },
  'auto_formation': {
    freeLimit: 1,
    importAutoAllowed: false,
    csvImportMinPack: 'none',
    manualValidation: true,
    allowedCategories: ['jobs_services']
  },
  'transport_logistique': {
    freeLimit: 1,
    importAutoAllowed: false,
    csvImportMinPack: 'silver',
    manualValidation: false,
    allowedCategories: ['jobs_services', 'auto'] // Can post trucks or services
  },
  
  // --- AUTRES SECTEURS ---
  'immobilier': {
    freeLimit: 2,
    importAutoAllowed: false,
    csvImportMinPack: 'gold',
    manualValidation: false,
    allowedCategories: ['real_estate'] // Strict: Only Real Estate
  },
  'tourisme': {
    freeLimit: 1,
    importAutoAllowed: false,
    csvImportMinPack: 'none',
    manualValidation: false,
    allowedCategories: ['real_estate', 'jobs_services'] // Vacation rentals + Services
  },
  'services_essentiels': {
    freeLimit: 1,
    importAutoAllowed: false,
    csvImportMinPack: 'none',
    manualValidation: false,
    allowedCategories: ['jobs_services', 'home_garden']
  },
  'numerique': {
    freeLimit: 1,
    importAutoAllowed: false,
    csvImportMinPack: 'silver',
    manualValidation: false,
    allowedCategories: ['electronics', 'jobs_services']
  },
  'commerce': {
    freeLimit: 1,
    importAutoAllowed: false,
    csvImportMinPack: 'silver',
    manualValidation: false,
    allowedCategories: ['home_garden', 'fashion', 'electronics'] // General commerce
  },
  'liberal': {
    freeLimit: 1,
    importAutoAllowed: false,
    csvImportMinPack: 'none',
    manualValidation: true,
    allowedCategories: ['jobs_services']
  },
  'creation': {
    freeLimit: 1,
    importAutoAllowed: false,
    csvImportMinPack: 'none',
    manualValidation: false,
    allowedCategories: ['jobs_services']
  }
};

export const PRO_SECTORS: ProSector[] = [
  // ... (sectors kept same)
  // --- STRUCTURE FINALE V1.5 ---
  {
    id: 'auto_vente',
    label: 'Vente & Import de Véhicules',
    icon: 'Car',
    categories: [
      { id: 'concessionnaire', label: 'Concessionnaire automobile' },
      { id: 'vendeur_occasion', label: 'Vendeur de véhicules d’occasion' },
      { id: 'importateur', label: 'Importateur automobile indépendant' },
      { id: 'utilitaires', label: 'Vente de véhicules utilitaires légers' }
    ],
    tags: ['premium']
  },
  {
    id: 'auto_location',
    label: 'Location de Véhicules',
    icon: 'Key',
    categories: [
      { id: 'location_tourisme', label: 'Location de véhicules' },
      { id: 'location_utilitaire', label: 'Location camions & utilitaires' },
      { id: 'location_vtc', label: 'Location avec chauffeur (VTC / événementiel)' },
      { id: 'location_lld', label: 'Location longue durée (LLD pro)' }
    ]
  },
  {
    id: 'auto_services',
    label: 'Services Automobiles',
    icon: 'Wrench',
    categories: [
      { id: 'mecanique', label: 'Garage / Mécanique' },
      { id: 'carrosserie', label: 'Carrosserie / Peinture' },
      { id: 'electricite_auto', label: 'Électricité automobile' },
      { id: 'climatisation_auto', label: 'Climatisation automobile' },
      { id: 'pneumatique', label: 'Pneumatique / Diagnostic' },
      { id: 'pieces_auto', label: 'Vente pièces automobiles' }
    ]
  },
  {
    id: 'auto_formation',
    label: 'Formation Automobile',
    icon: 'Book',
    categories: [
      { id: 'auto_ecole', label: 'Auto-école' },
      { id: 'formation_pro', label: 'Formation conduite professionnelle' },
      { id: 'permis_pl', label: 'Formation permis poids lourds' }
    ]
  },
  {
    id: 'transport_logistique',
    label: 'Transport & Logistique',
    icon: 'Truck',
    categories: [
      { id: 'transport_pl', label: 'Transport / Poids lourds' },
      { id: 'transport_express', label: 'Transport express' },
      { id: 'livraison', label: 'Livraison / Coursier' },
      { id: 'logistique_ecommerce', label: 'Logistique e-commerce' },
      { id: 'demenagement_pro', label: 'Déménagement professionnel' },
      { id: 'transport_frigo', label: 'Transport frigorifique' }
    ]
  },
  
  // --- AUTRES SECTEURS ---
  {
    id: 'immobilier',
    label: 'Immobilier',
    icon: 'Home',
    categories: [
      { id: 'agence_immo', label: 'Agence immobilière' },
      { id: 'promoteur', label: 'Promoteur immobilier' },
      { id: 'location_longue_duree', label: 'Location longue durée' },
      { id: 'gestion_locative', label: 'Gestion locative' },
      { id: 'syndic', label: 'Syndic / Administration de biens' }
    ]
  },
  {
    id: 'tourisme',
    label: 'Vacances & Tourisme',
    icon: 'Palmtree',
    categories: [
      { id: 'location_saisonniere', label: 'Location saisonnière' },
      { id: 'hotel', label: 'Hôtel / Hébergement' },
      { id: 'agence_voyage', label: 'Agence de voyage' },
      { id: 'location_touristique', label: 'Location véhicules touristiques' },
      { id: 'loisirs', label: 'Activités & loisirs touristiques' }
    ]
  },
  {
    id: 'services_essentiels',
    label: 'Services Essentiels',
    icon: 'Hammer',
    categories: [
      { id: 'plomberie', label: 'Plomberie' },
      { id: 'electricite', label: 'Électricité' },
      { id: 'climatisation', label: 'Climatisation (installation / réparation)' },
      { id: 'peinture', label: 'Peinture & finition bâtiment' },
      { id: 'menuiserie', label: 'Menuiserie / Aluminium' },
      { id: 'btp', label: 'Entreprise BTP' },
      { id: 'jardinage', label: 'Jardinage / Paysagisme' },
      { id: 'nettoyage', label: 'Nettoyage professionnel' },
      { id: 'securite', label: 'Sécurité / Gardiennage' }
    ]
  },
  {
    id: 'numerique',
    label: 'Numérique & Électronique',
    icon: 'Monitor',
    categories: [
      { id: 'informatique_reparation', label: 'Informatique / Réparation' },
      { id: 'marketing_digital', label: 'Marketing digital / Web' },
      { id: 'vente_electronique', label: 'Vente matériel électronique' },
      { id: 'telephonie', label: 'Téléphonie & accessoires' },
      { id: 'reseaux_securite', label: 'Réseaux / Caméras / Sécurité IT' }
    ]
  },
  {
    id: 'commerce',
    label: 'Commerce Local',
    icon: 'Store',
    categories: [
      { id: 'commerce_general', label: 'Commerce général' },
      { id: 'grossiste', label: 'Grossiste / Semi-grossiste' },
      { id: 'import_export', label: 'Import / Export (Hors Auto)' },
      { id: 'traiteur', label: 'Traiteur / Restauration' },
      { id: 'coiffure', label: 'Salon de coiffure / Esthétique' },
      { id: 'pharmacie', label: 'Pharmacie / Parapharmacie' }
    ]
  },
  {
    id: 'liberal',
    label: 'Professions Libérales',
    icon: 'Briefcase',
    categories: [
      { id: 'medical', label: 'Cabinet médical / Clinique' },
      { id: 'avocat', label: 'Cabinet d’avocat' },
      { id: 'architecture', label: 'Cabinet d’architecture' },
      { id: 'comptable', label: 'Cabinet comptable' }
    ]
  },
  {
    id: 'creation',
    label: 'Création & Média',
    icon: 'Camera',
    categories: [
      { id: 'photographe', label: 'Photographe' },
      { id: 'videaste', label: 'Vidéaste' },
      { id: 'agence_creative', label: 'Agence créative / Média' }
    ]
  }
];

export const CATEGORIES: Category[] = [
  // ... (categories kept same)
  { 
    id: 'auto', 
    name: 'Véhicules', 
    icon: 'Car', 
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300',
    subCategories: [
      {
        id: 'import_auto',
        name: 'IMPORTATION (Moins de 3 ans)',
        fields: [
          { id: 'origin_country', label: 'Pays de provenance', type: 'select', options: ['Allemagne', 'France', 'Dubaï (EAU)', 'Espagne', 'Italie', 'Belgique'], required: true },
          { id: 'brand', label: 'Marque', type: 'select', options: ['Mercedes', 'BMW', 'Audi', 'Volkswagen', 'Range Rover', 'Toyota', 'Porsche'], required: true },
          { id: 'model', label: 'Modèle', type: 'text', required: true },
          { id: 'vin', label: 'Numéro de série (VIN)', type: 'text', required: true, placeholder: 'Ex: WBA...' },
          { id: 'year', label: 'Année de fabrication', type: 'select', options: ['2025', '2024', '2023', '2022'], required: true },
          { id: 'shipping_status', label: 'Statut du véhicule', type: 'radio', options: ['Sur commande', 'En transit (En route)', 'Disponible (Dédouané)', 'Disponible (Sous douane)'], required: true },
          { id: 'license_required', label: 'Licence requise', type: 'radio', options: ['Oui (Licence Moudjahid)', 'Non (Paiement intégral)', 'Au choix'], required: true },
          { id: 'delivery_time', label: 'Délai de livraison (Jours)', type: 'number' },
          { id: 'price_includes_customs', label: 'Prix affiché', type: 'radio', options: ['Dédouanement inclus (TTC)', 'Hors douane (HT)'], required: true }
        ]
      },
      {
        id: 'cars',
        name: 'Voitures (Occasion / Neuf)',
        fields: [
          { id: 'brand', label: 'Marque', type: 'select', options: ['Renault', 'Peugeot', 'Volkswagen', 'Hyundai', 'Toyota', 'Dacia', 'Audi', 'BMW', 'Mercedes', 'Kia', 'Seat', 'Skoda', 'Chery', 'Geely', 'Fiat', 'Land Rover', 'Nissan'], required: true },
          { id: 'model', label: 'Modèle', type: 'text', placeholder: 'Ex: Clio 4', required: true },
          { id: 'vehicle_type', label: 'Type de véhicule', type: 'select', options: ['Citadine', 'Berline', 'Compacte', 'SUV', '4x4', 'Break', 'Coupé', 'Cabriolet', 'Utilitaire', 'Pick-up'], required: true },
          { id: 'year', label: 'Année de mise en circulation', type: 'select', options: carYears, required: true },
          { id: 'mileage', label: 'Kilométrage', type: 'number', suffix: 'km', required: true },
          { id: 'fuel', label: 'Type de carburant', type: 'select', options: ['Essence', 'Diesel', 'GPL', 'Hybride', 'Électrique'], required: true },
          { id: 'transmission', label: 'Boite de vitesse', type: 'radio', options: ['Manuelle', 'Automatique'], required: true },
          { id: 'engine', label: 'Motorisation', type: 'text', placeholder: 'Ex: 1.5 dCi' },
          { id: 'color', label: 'Couleur', type: 'text' },
          { id: 'options', label: 'Options & Équipements', type: 'text', placeholder: 'Ex: Toit ouvrant, Caméra de recul, Jantes alliage...' }
        ]
      },
      {
        id: 'motorcycles',
        name: 'Motos & Scooters',
        fields: [
          { id: 'brand', label: 'Marque', type: 'select', options: ['Sym', 'VMS', 'Yamaha', 'Honda', 'BMW', 'Kawasaki', 'Piaggio', 'Keeway'], required: true },
          { id: 'model', label: 'Modèle', type: 'text', required: true },
          { id: 'year', label: 'Année', type: 'number', required: true },
          { id: 'mileage', label: 'Kilométrage', type: 'number', suffix: 'km', required: true },
          { id: 'cc', label: 'Cylindrée', type: 'number', suffix: 'cc' },
          { id: 'color', label: 'Couleur', type: 'text' }
        ]
      },
      {
        id: 'trucks',
        name: 'Camions & Engins',
        fields: [
          { id: 'type', label: 'Type', type: 'select', options: ['Camion', 'Camionnette', 'Bus', 'Engin de chantier', 'Semi-remorque', 'Tracteur routier'], required: true },
          { id: 'brand', label: 'Marque', type: 'text', required: true },
          { id: 'year', label: 'Année', type: 'number', required: true },
          { id: 'mileage', label: 'Kilométrage', type: 'number', suffix: 'km' },
          { id: 'fuel', label: 'Carburant', type: 'select', options: ['Diesel', 'Essence', 'GPL'] }
        ]
      },
      {
        id: 'car_rental',
        name: 'Location de Véhicules',
        fields: [
          { id: 'vehicle_type', label: 'Type de véhicule', type: 'select', options: ['Touristique', 'Utilitaire', 'Luxe', 'Mariage', 'Bus'], required: true },
          { id: 'driver', label: 'Chauffeur', type: 'radio', options: ['Sans chauffeur', 'Avec chauffeur'], required: true },
          { id: 'fuel_policy', label: 'Carburant', type: 'select', options: ['Plein / Plein', 'Au kilomètre', 'Inclus'] },
          { id: 'min_duration', label: 'Durée min', type: 'text', placeholder: 'Ex: 2 jours' }
        ]
      },
      {
        id: 'auto_parts',
        name: 'Pièces & Accessoires',
        fields: [
          { id: 'category', label: 'Catégorie', type: 'select', options: ['Pièces Moteur', 'Carrosserie', 'Éclairage', 'Roues & Pneus', 'Accessoires Intérieur', 'Audio & Vidéo', 'Huiles & Filtres'], required: true },
          { id: 'compatible_brand', label: 'Marque compatible', type: 'text', placeholder: 'Ex: Renault, Peugeot...' }
        ]
      }
    ]
  },
  { 
    id: 'real_estate', 
    name: 'Immobilier', 
    icon: 'Home', 
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300',
    subCategories: [
      {
        id: 'apartments_sale',
        name: 'Vente Appartement',
        fields: [
          { id: 'surface', label: 'Surface', type: 'number', suffix: 'm²', required: true },
          { id: 'rooms', label: 'Pièces (F)', type: 'number', required: true },
          { id: 'floor', label: 'Étage', type: 'number' },
          { id: 'papers', label: 'Papiers', type: 'select', options: ['Acte notarié', 'Livret foncier', 'Papier timbré', 'Promesse de vente', 'Décision'], required: true },
          { id: 'project_status', label: 'État d\'avancement', type: 'select', options: ['Fini (Habitable)', 'Semi-fini', 'Sur plan', 'Carcasse'] },
          { id: 'district', label: 'Quartier', type: 'text' }
        ]
      },
      {
        id: 'houses_sale',
        name: 'Vente Maison & Villa',
        fields: [
          { id: 'surface', label: 'Surface Terrain', type: 'number', suffix: 'm²', required: true },
          { id: 'built_surface', label: 'Surface Bâtie', type: 'number', suffix: 'm²' },
          { id: 'rooms', label: 'Pièces', type: 'number' },
          { id: 'floors', label: 'Niveaux (Étages)', type: 'number' },
          { id: 'garage', label: 'Garage', type: 'radio', options: ['Oui', 'Non'] },
          { id: 'garden', label: 'Jardin', type: 'radio', options: ['Oui', 'Non'] },
          { id: 'papers', label: 'Papiers', type: 'select', options: ['Acte notarié', 'Livret foncier', 'Papier timbré', 'Dans l\'indivision'], required: true }
        ]
      },
      {
        id: 'rent',
        name: 'Location (Annuelle)',
        fields: [
          { id: 'property_type', label: 'Type de bien', type: 'select', options: ['Appartement', 'Maison/Villa', 'Studio', 'Niveau de villa'], required: true },
          { id: 'surface', label: 'Surface', type: 'number', suffix: 'm²', required: true },
          { id: 'rooms', label: 'Pièces', type: 'number', required: true },
          { id: 'furnished', label: 'Meublé', type: 'radio', options: ['Oui', 'Non'], required: true },
          { id: 'payment_period', label: 'Paiement', type: 'select', options: ['Mensuel', 'Annuel', 'Semestriel', 'Trimestriel'] },
          { id: 'floor', label: 'Étage', type: 'number' }
        ]
      },
      {
        id: 'holiday_rent',
        name: 'Location Vacances',
        fields: [
          { id: 'type', label: 'Type', type: 'select', options: ['Appartement', 'Bungalow', 'Villa avec piscine', 'Complexe touristique', 'Chambre d\'hôtel'], required: true },
          { 
            id: 'environment', 
            label: 'Type de destination', 
            type: 'select', 
            options: ['Mer / Plage (Littoral)', 'Sud / Sahara (Désert)', 'Montagne (Kabylie, Aurès...)', 'Hauts Plateaux', 'Ville / Urbain', 'Campagne'], 
            required: true 
          },
          { id: 'capacity', label: 'Capacité', type: 'number', suffix: 'personnes' },
          { id: 'pool', label: 'Piscine', type: 'radio', options: ['Oui', 'Non'] },
          { id: 'beach', label: 'Proche mer', type: 'radio', options: ['Oui', 'Non'] },
          { id: 'price_unit', label: 'Prix par', type: 'select', options: ['Nuitée', 'Semaine'] },
          { id: 'arrival_date', label: 'Date d\'arrivée', type: 'date' }
        ]
      },
      {
        id: 'commercial',
        name: 'Locaux & Bureaux',
        fields: [
          { id: 'type', label: 'Type', type: 'select', options: ['Local commercial', 'Bureau', 'Hangar', 'Entrepôt', 'Usine'], required: true },
          { id: 'transaction', label: 'Transaction', type: 'radio', options: ['Vente', 'Location'], required: true },
          { id: 'surface', label: 'Surface', type: 'number', suffix: 'm²', required: true },
          { id: 'floor', label: 'Étage', type: 'number' }
        ]
      },
      {
        id: 'land',
        name: 'Terrains',
        fields: [
          { id: 'surface', label: 'Surface', type: 'number', suffix: 'm²', required: true },
          { id: 'zoning', label: 'Vocation', type: 'select', options: ['Urbain', 'Agricole', 'Industriel', 'Touristique'], required: true },
          { id: 'papers', label: 'Papiers', type: 'select', options: ['Acte dans l\'indivision', 'Acte individuel', 'Papier timbré', 'Livret foncier'], required: true },
          { id: 'facade', label: 'Façade (mètres)', type: 'number' }
        ]
      }
    ]
  },
  { 
    id: 'electronics', 
    name: 'Électronique', 
    icon: 'Smartphone', 
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300',
    subCategories: [
      { 
        id: 'phones', 
        name: 'Téléphones', 
        fields: [
           { id: 'brand', label: 'Marque', type: 'select', options: ['Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Huawei', 'Condor', 'Realme'], required: true },
           { id: 'storage', label: 'Stockage', type: 'select', options: ['64 Go', '128 Go', '256 Go', '512 Go', '1 To'] },
           { id: 'ram', label: 'RAM', type: 'select', options: ['4 Go', '6 Go', '8 Go', '12 Go', '16 Go'] }
        ] 
      },
      { 
        id: 'laptops', 
        name: 'Informatique & Laptops', 
        fields: [
           { id: 'brand', label: 'Marque', type: 'select', options: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI', 'Microsoft'], required: true },
           { id: 'type', label: 'Type', type: 'select', options: ['Portable (Laptop)', 'Bureau (Desktop)', 'Gamer', 'Ultra-portable'], required: true },
           { id: 'processor', label: 'Processeur', type: 'select', options: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'Apple M1/M2/M3'] },
           { id: 'ram', label: 'RAM', type: 'select', options: ['4 Go', '8 Go', '16 Go', '32 Go', '64 Go'] },
           { id: 'gpu', label: 'Carte Graphique', type: 'text' }
        ] 
      },
      { 
        id: 'videogames', 
        name: 'Jeux Vidéo & Consoles', 
        fields: [
            { id: 'type', label: 'Type', type: 'select', options: ['Console', 'Jeu', 'Accessoire', 'Compte'], required: true },
            { id: 'platform', label: 'Plateforme', type: 'select', options: ['PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One', 'Nintendo Switch', 'PC'], required: true }
        ] 
      },
      { 
        id: 'tv', 
        name: 'TV & Son', 
        fields: [
            { id: 'type', label: 'Type', type: 'select', options: ['Téléviseur', 'Home Cinéma', 'Enceinte Bluetooth', 'Casque/Écouteurs', 'Barre de son'], required: true },
            { id: 'brand', label: 'Marque', type: 'text' },
            { id: 'size', label: 'Taille (Pouces)', type: 'number', suffix: '"' }
        ] 
      },
      { 
        id: 'cameras', 
        name: 'Photo & Vidéo', 
        fields: [
            { id: 'type', label: 'Type', type: 'select', options: ['Appareil Photo Reflex', 'Hybride', 'Compact', 'Action Cam', 'Drone', 'Objectif'], required: true },
            { id: 'brand', label: 'Marque', type: 'select', options: ['Canon', 'Nikon', 'Sony', 'Fujifilm', 'GoPro', 'DJI'] }
        ] 
      }
    ]
  },
  { 
    id: 'home_garden', 
    name: 'Maison', 
    icon: 'Sofa', 
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300',
    subCategories: [
          { id: 'appliances', name: 'Electroménager', fields: [
              { id: 'type', label: 'Type', type: 'select', options: ['Réfrigérateur', 'Lave-linge', 'Climatiseur', 'Cuisinière', 'Lave-vaisselle', 'Petit Électro', 'Four', 'Micro-ondes'], required: true },
              { id: 'brand', label: 'Marque', type: 'select', options: ['Samsung', 'LG', 'Whirlpool', 'Condor', 'Brandt', 'Beko', 'Iris', 'Eniem', 'Bosch', 'Arthur Martin', 'Seb', 'Tefal', 'Moulinex'], required: true },
              { id: 'condition', label: 'Etat', type: 'select', options: ['Neuf', 'Bon état', 'Occasion'] },
              { id: 'color', label: 'Couleur', type: 'select', options: ['Blanc', 'Gris / Inox', 'Noir', 'Rouge', 'Autre'] }
          ]},
          { id: 'furniture', name: 'Meubles & Déco', fields: [
              { id: 'type', label: 'Type', type: 'select', options: ['Canapé / Fauteuil', 'Table', 'Lit / Matelas', 'Armoire / Rangement', 'Décoration', 'Tapis'], required: true },
              { id: 'material', label: 'Matière', type: 'text' }
          ]},
          { id: 'kitchen', name: 'Vaisselle & Cuisine', fields: [
              { id: 'type', label: 'Type', type: 'text' }
          ]},
          { id: 'garden', name: 'Jardin & Bricolage', fields: [
              { id: 'type', label: 'Type', type: 'select', options: ['Outils', 'Mobilier de jardin', 'Plantes', 'Piscine', 'Barbecue'] }
          ]}
    ]
  },
  { 
    id: 'fashion', 
    name: 'Mode', 
    icon: 'Shirt', 
    color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-300',
    subCategories: [
          { id: 'men', name: 'Vêtements Homme', fields: [
              { id: 'type', label: 'Type', type: 'text' },
              { id: 'size', label: 'Taille', type: 'text' }
          ]},
          { id: 'women', name: 'Vêtements Femme', fields: [
              { id: 'type', label: 'Type', type: 'text' },
              { id: 'size', label: 'Taille', type: 'text' }
          ]},
          { id: 'shoes', name: 'Chaussures', fields: [
              { id: 'type', label: 'Type', type: 'select', options: ['Baskets', 'Ville', 'Sandales', 'Bottes'] },
              { id: 'size', label: 'Pointure', type: 'number' }
          ]},
          { id: 'accessories', name: 'Montres & Bijoux', fields: [
              { id: 'type', label: 'Type', type: 'text' },
              { id: 'brand', label: 'Marque', type: 'text' }
          ]}
    ]
  },
  { 
    id: 'jobs_services', 
    name: 'Emploi & Services', 
    icon: 'Briefcase', 
    color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300',
    subCategories: [
          { id: 'jobs', name: 'Offres d\'emploi', fields: [
              { id: 'contract_type', label: 'Type de contrat', type: 'select', options: ['CDI', 'CDD', 'Freelance', 'Stage'], required: true },
              { id: 'sector', label: 'Secteur', type: 'text', required: true },
              { id: 'experience', label: 'Expérience requise', type: 'select', options: ['Débutant', '1-3 ans', '3-5 ans', '+5 ans'] }
          ]},
          { id: 'services', name: 'Prestations de services', fields: [
              { id: 'type', label: 'Type de service', type: 'select', options: ['Transport', 'Déménagement', 'Nettoyage', 'Réparation', 'Cours particuliers'], required: true },
              { id: 'availability', label: 'Disponibilité', type: 'text' }
          ]}
    ]
  }
];

export const WILAYAS: Wilaya[] = [
  // ... (wilayas kept same)
  { code: '01', name: 'Adrar', communes: ['Adrar', 'Tamest', 'Charouine', 'Reggane'] },
  { code: '02', name: 'Chlef', communes: ['Chlef', 'Tenes', 'El Karimia', 'Ouled Fares'] },
  { code: '06', name: 'Béjaïa', communes: ['Béjaïa', 'Amizour', 'Akbou', 'El Kseur', 'Tichy'] },
  { code: '09', name: 'Blida', communes: ['Blida', 'Boufarik', 'El Affroun', 'Ouled Yaich'] },
  { code: '13', name: 'Tlemcen', communes: ['Tlemcen', 'Maghnia', 'Mansourah', 'Remchi'] },
  { code: '15', name: 'Tizi Ouzou', communes: ['Tizi Ouzou', 'Draâ Ben Khedda', 'Azazga', 'Tigzirt'] },
  { code: '16', name: 'Alger', communes: ['Alger Centre', 'Bab El Oued', 'Hydra', 'El Biar', 'Kouba', 'Hussein Dey', 'Birkhadem', 'Bab Ezzouar', 'Dar El Beida', 'Zeralda', 'Cheraga', 'Dely Ibrahim', 'Reghaia', 'Rouiba'] },
  { code: '19', name: 'Sétif', communes: ['Sétif', 'El Eulma', 'Ain Arnat', 'Ain Oulmene'] },
  { code: '23', name: 'Annaba', communes: ['Annaba', 'El Bouni', 'Sidi Amar', 'Berrahal'] },
  { code: '25', name: 'Constantine', communes: ['Constantine', 'El Khroub', 'Ain Smara', 'Didouche Mourad'] },
  { code: '31', name: 'Oran', communes: ['Oran', 'Es Senia', 'Bir El Djir', 'Arzew', 'Ain Turk'] },
  { code: '33', name: 'Illizi', communes: ['Illizi', 'Djanet', 'In Amenas'] },
  { code: '34', name: 'Bordj Bou Arréridj', communes: ['BBA', 'Ras El Oued', 'Mansoura'] },
  { code: '35', name: 'Boumerdès', communes: ['Boumerdès', 'Boudouaou', 'Dellys', 'Thenia'] },
  { code: '42', name: 'Tipaza', communes: ['Tipaza', 'Cherchell', 'Bou Ismail', 'Kolea', 'Douaouda'] },
  { code: '47', name: 'Ghardaïa', communes: ['Ghardaïa', 'Metlili', 'El Menia', 'Berriane'] },
];

export const MOCK_STORES: Record<string, StoreProfile> = {
  // ... (mock stores kept same)
  'u1': {
    id: 'u1',
    name: 'Auto Luxe DZ',
    type: 'pro',
    avatar: 'https://ui-avatars.com/api/?name=Auto+Luxe&background=0D8ABC&color=fff',
    cover: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?q=80&w=2128&auto=format&fit=crop',
    bio: 'Spécialiste de l\'importation de véhicules neufs et occasion d\'Allemagne et de Dubaï. Garantie 12 mois.',
    location: 'Hydra, Alger',
    rating: 4.8,
    reviewCount: 124,
    responseRate: '98%',
    responseTime: '1 heure',
    memberSince: '2021',
    verified: true,
    badges: ['Vendeur Vérifié', 'Importateur Agréé', 'Top Réactivité'],
    phone: '0550 12 34 56',
    openingHours: 'Sam - Jeu : 09h00 - 18h00',
    package_slug: 'gold',
    sector: 'auto_vente',
    categories: ['concessionnaire']
  },
  'u4': {
    id: 'u4',
    name: 'Tech Zone',
    type: 'pro',
    avatar: 'https://ui-avatars.com/api/?name=Tech+Zone&background=6366f1&color=fff',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
    bio: 'Votre destination pour le High-Tech : Smartphones, Laptops et Gaming.',
    location: 'Sétif Centre',
    rating: 4.6,
    reviewCount: 89,
    responseRate: '95%',
    responseTime: '2 heures',
    memberSince: '2022',
    verified: true,
    badges: ['Vendeur Vérifié'],
    phone: '0661 22 33 44',
    package_slug: 'silver',
    sector: 'numerique',
    categories: ['informatique_reparation', 'vente_electronique']
  },
  'u7': {
    id: 'u7',
    name: 'Immo Prestige',
    type: 'pro',
    avatar: 'https://ui-avatars.com/api/?name=Immo+P&background=10b981&color=fff',
    cover: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop',
    bio: 'Agence immobilière agréée. Vente, location et gestion de biens de luxe.',
    location: 'Oran (Front de Mer)',
    rating: 4.9,
    reviewCount: 42,
    responseRate: '90%',
    responseTime: '4 heures',
    memberSince: '2020',
    verified: true,
    badges: ['Agence Agréée'],
    phone: '0770 99 88 77',
    package_slug: 'silver',
    sector: 'immobilier',
    categories: ['agence_immo', 'location_longue_duree']
  },
  'u2': {
      id: 'u2',
      name: 'Samir Particulier',
      type: 'individual',
      verified: true,
      avatar: 'https://ui-avatars.com/api/?name=Samir+B',
      cover: '',
      bio: '',
      location: 'Alger',
      rating: 0,
      reviewCount: 0,
      responseRate: '',
      responseTime: '',
      memberSince: '2023',
      badges: [],
      phone: ''
  },
  // --- TEST ACCOUNTS ---
  'test_auto_import': {
    id: 'test_auto_import',
    name: 'Import Expert Pro',
    type: 'pro',
    avatar: 'https://ui-avatars.com/api/?name=Import+Pro&background=0D8ABC&color=fff',
    cover: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000',
    bio: 'Spécialiste Import Allemagne/Dubai',
    location: 'Alger',
    rating: 5,
    reviewCount: 10,
    responseRate: '100%',
    responseTime: '1h',
    memberSince: '2023',
    badges: ['Importateur Agréé'],
    phone: '0550000001',
    package_slug: 'gold',
    sector: 'auto_vente', // Allowed to import
    categories: ['importateur'],
    verified: true
  },
  'test_auto_local': {
    id: 'test_auto_local',
    name: 'Auto Loc & Occasion',
    type: 'pro',
    avatar: 'https://ui-avatars.com/api/?name=Auto+Loc&background=2563eb&color=fff',
    cover: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000',
    bio: 'Vente occasion locale et location.',
    location: 'Oran',
    rating: 4,
    reviewCount: 5,
    responseRate: '90%',
    responseTime: '2h',
    memberSince: '2022',
    badges: [],
    phone: '0550000002',
    package_slug: 'silver',
    sector: 'auto_location', // NOT Allowed to import
    categories: ['location_tourisme'],
    verified: true
  },
  'test_immo': {
    id: 'test_immo',
    name: 'Immo Pro Gold',
    type: 'pro',
    avatar: 'https://ui-avatars.com/api/?name=Immo+Pro&background=10b981&color=fff',
    cover: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000',
    bio: 'Agence immobilière haut de gamme.',
    location: 'Constantine',
    rating: 4.5,
    reviewCount: 20,
    responseRate: '95%',
    responseTime: '3h',
    memberSince: '2021',
    badges: [],
    phone: '0550000003',
    package_slug: 'gold',
    sector: 'immobilier', // NOT Allowed to import auto
    categories: ['agence_immo'],
    verified: true
  }
};

// --- MOCK PARTNERS (PARTENAIRES D'ACHAT) ---
export const MOCK_PARTNERS: PartnerProfile[] = [
  {
    id: 'p_1',
    name: 'Karim Service',
    type: 'individual',
    isPartner: true,
    partnerStatus: 'approved',
    partnerPlan: 'partner_active',
    subscriptionStatus: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Karim+S&background=10b981&color=fff',
    verified: true,
    wilayasCovered: ['16', '09', '42'], // Alger, Blida, Tipaza
    paymentMethods: ['Espèces (Main propre)', 'CCP / BaridiMob'],
    commissionRate: '5% (Min 500 DA)',
    maxBudget: 200000,
    responseTime: '30 min',
    bio: 'Disponible sur Alger centre et environs. Paiement cash main à main ou CCP. Sérieux et rapide.',
    rating: 4.9,
    reviewCount: 45,
    completedTransactions: 120,
    phone: '0550123456',
    isProbation: false
  },
  {
    id: 'p_2',
    name: 'Oran Express',
    type: 'individual', // Can be a small pro too
    isPartner: true,
    partnerStatus: 'approved',
    partnerPlan: 'partner_active',
    subscriptionStatus: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Oran+Exp&background=f59e0b&color=fff',
    verified: true,
    wilayasCovered: ['31', '22'], // Oran, SBA
    paymentMethods: ['CCP / BaridiMob', 'Paysera / Wise'],
    commissionRate: 'Fixe 1000 DA',
    maxBudget: 500000,
    responseTime: '2h',
    bio: 'Je peux payer vos achats en ligne (AliExpress, Amazon, Sites FR) ou locaux.',
    rating: 4.7,
    reviewCount: 22,
    completedTransactions: 50,
    phone: '0560123456',
    isProbation: false
  },
  {
    id: 'p_3',
    name: 'Sétif Confiance',
    type: 'individual',
    isPartner: true,
    partnerStatus: 'approved',
    partnerPlan: 'partner_free',
    subscriptionStatus: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Sétif+C&background=3b82f6&color=fff',
    verified: true,
    wilayasCovered: ['19'], // Setif
    paymentMethods: ['Espèces (Main propre)'],
    commissionRate: '7%',
    maxBudget: 100000,
    responseTime: '1h',
    bio: 'Remise en main propre sur Sétif ville uniquement.',
    rating: 5.0,
    reviewCount: 10,
    completedTransactions: 30,
    phone: '0540123456',
    isProbation: false
  },
  {
    id: 'p_new',
    name: 'Nouveau Partenaire (Probation)',
    type: 'individual',
    isPartner: true,
    partnerStatus: 'approved',
    partnerPlan: 'partner_free',
    subscriptionStatus: 'active',
    avatar: 'https://ui-avatars.com/api/?name=New+P&background=gray&color=fff',
    verified: false,
    wilayasCovered: ['16'],
    paymentMethods: ['Espèces (Main propre)'],
    commissionRate: '500 DA',
    maxBudget: 20000, // Limit due to probation
    responseTime: '4h',
    bio: 'Je commence mon activité sur WeshKlik. Sérieux.',
    rating: 0,
    reviewCount: 0,
    completedTransactions: 0,
    phone: '0555555555',
    isProbation: true // Flagged as New/Probation
  }
];

export const MOCK_REVIEWS: Review[] = [
  { id: 'r1', author: 'Karim M.', rating: 5, comment: 'Service impeccable, véhicule conforme à la description.', date: 'Il y a 2 jours' },
  { id: 'r2', author: 'Nadia S.', rating: 4, comment: 'Très bon accueil, mais un peu d\'attente pour la livraison.', date: 'Il y a 1 semaine' },
  { id: 'r3', author: 'Mohamed B.', rating: 5, comment: 'Je recommande vivement, transaction sécurisée.', date: 'Il y a 3 semaines' }
];

export const MOCK_LISTINGS: Listing[] = [
  // ... (listings kept same)
  {
    id: '1',
    title: 'Volkswagen Golf 8 R-Line 2023',
    price: 6800000,
    currency: 'DZD',
    category: 'auto',
    subCategory: 'import_auto',
    location: 'Alger',
    commune: 'Hydra',
    image: 'https://images.unsplash.com/photo-1706646193717-36e257b44746?q=80&w=2070&auto=format&fit=crop',
    date: 'Aujourd\'hui',
    isPromoted: true,
    seller: MOCK_STORES['u1'],
    description: 'Golf 8 R-Line Importation Allemagne. \nToit ouvrant panoramique, Jantes 18", Cockpit Digital Pro. \nVéhicule sous douane, livraison sous 20 jours.',
    specs: {
      'Année': '2023',
      'Kilométrage': '0 km',
      'Carburant': 'Essence',
      'Boite': 'Automatique',
      'Pays de provenance': 'Allemagne',
      'Statut du véhicule': 'Sur commande'
    }
  },
  {
    id: '2',
    title: 'Appartement F4 Haut Standing - Oran',
    price: 24000000,
    currency: 'DZD',
    category: 'real_estate',
    subCategory: 'apartments_sale',
    location: 'Oran',
    commune: 'Bir El Djir',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop',
    date: 'Hier',
    isPromoted: true,
    seller: MOCK_STORES['u7'],
    description: 'Magnifique F4 de 145m² dans une résidence clôturée et gardée. \nCuisine équipée, Chauffage central, Suite parentale. \nVue dégagée sur mer.',
    specs: {
      'Surface': '145 m²',
      'Pièces': '4',
      'Étage': '5ème',
      'Papiers': 'Acte notarié'
    }
  },
  {
    id: '3',
    title: 'MacBook Pro M2 16"',
    price: 450000,
    currency: 'DZD',
    category: 'electronics',
    subCategory: 'laptops',
    location: 'Sétif',
    commune: 'Sétif Centre',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=1926&auto=format&fit=crop',
    date: 'Il y a 2 jours',
    seller: MOCK_STORES['u4'],
    specs: {
      'Marque': 'Apple',
      'Processeur': 'M2 Pro',
      'RAM': '16 Go',
      'Stockage': '512 Go SSD'
    }
  },
  {
    id: '4',
    title: 'Renault Clio 4 GT Line',
    price: 2100000,
    currency: 'DZD',
    category: 'auto',
    subCategory: 'cars',
    location: 'Blida',
    commune: 'Ouled Yaich',
    image: 'https://images.unsplash.com/photo-1623869675781-804f84b3d52d?q=80&w=2070&auto=format&fit=crop',
    date: 'Il y a 3 jours',
    seller: MOCK_STORES['u2'],
    specs: {
      'Année': '2019',
      'Kilométrage': '85 000 km',
      'Carburant': 'Diesel',
      'Boite': 'Manuelle'
    }
  },
  {
     id: '5',
     title: 'Villa avec Piscine - Tipaza',
     price: 35000,
     currency: 'DZD',
     category: 'real_estate',
     subCategory: 'holiday_rent',
     location: 'Tipaza',
     commune: 'Bou Ismail',
     image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop',
     date: 'Aujourd\'hui',
     seller: MOCK_STORES['u2'], // Individual
     description: 'Superbe villa pour vos vacances en famille. \nPiscine sans vis-à-vis, 3 chambres, Garage. \nProche de la plage (5 min à pied).',
     specs: {
         'Type': 'Villa avec piscine',
         'Capacité': '8 personnes',
         'Piscine': 'Oui',
         'Prix par': 'Nuitée',
         'Type de destination': 'Mer / Plage (Littoral)'
     }
  },
  // --- NOUVELLES ANNONCES POUR TESTER LES BADGES ---
  {
    id: '6',
    title: 'Mercedes-Benz Classe C 200 AMG 2024',
    price: 11500000,
    currency: 'DZD',
    category: 'auto',
    subCategory: 'import_auto',
    location: 'Alger',
    commune: 'Hydra',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop',
    date: 'Aujourd\'hui',
    isPromoted: true,
    seller: MOCK_STORES['u1'],
    description: 'Importation Dubaï. Finition AMG Line, Toit panoramique, Burmester Sound System.',
    specs: {
      'Année': '2024',
      'Kilométrage': '0 km',
      'Pays de provenance': 'Dubaï (EAU)',
      'Statut du véhicule': 'En transit (En route)',
      'Prix affiché': 'Dédouanement inclus (TTC)'
    }
  },
  {
    id: '7',
    title: 'iPhone 15 Pro Max 256Go Titane Naturel',
    price: 285000,
    currency: 'DZD',
    category: 'electronics',
    subCategory: 'phones',
    location: 'Sétif',
    commune: 'Sétif Centre',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070&auto=format&fit=crop',
    date: 'Hier',
    seller: MOCK_STORES['u4'], // Tech Zone (Pro)
    specs: {
      'Marque': 'Apple',
      'Stockage': '256 Go',
      'Etat': 'Neuf (Scellé)'
    }
  },
  {
    id: '8',
    title: 'PlayStation 5 Édition Standard + 2 Manettes',
    price: 95000,
    currency: 'DZD',
    category: 'electronics',
    subCategory: 'videogames',
    location: 'Blida',
    commune: 'Boufarik',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=2072&auto=format&fit=crop',
    date: 'Il y a 2 jours',
    seller: MOCK_STORES['u2'], // Particulier
    specs: {
      'Type': 'Console',
      'Plateforme': 'PlayStation 5',
      'Etat': 'Bon état'
    }
  }
];

export const MOCK_IMPORT_REQUESTS: ImportRequest[] = [
    {
        id: 'req_1',
        clientName: 'Farid H.',
        vehicleType: 'Voiture',
        brand: 'Audi',
        model: 'Q3 Sportback',
        yearMin: '2023',
        budgetMax: 8500000,
        originPreference: 'Europe',
        description: 'Je cherche une Q3 Sportback S-Line noire, toit ouvrant panoramique, max 20 000 km.',
        status: 'new',
        date: 'Il y a 2h',
        wilaya: 'Alger'
    },
    {
        id: 'req_2',
        clientName: 'Amine K.',
        vehicleType: 'Voiture',
        brand: 'Volkswagen',
        model: 'Golf 8 GTD',
        yearMin: '2022',
        budgetMax: 6000000,
        originPreference: 'Europe',
        description: 'Couleur Gris Nardo si possible. Boite auto obligatoire.',
        status: 'replied',
        date: 'Hier',
        wilaya: 'Oran'
    },
    {
        id: 'req_3',
        clientName: 'Sofiane B.',
        vehicleType: 'Moto',
        brand: 'Yamaha',
        model: 'T-Max 560',
        yearMin: '2023',
        budgetMax: 2800000,
        originPreference: 'Europe',
        description: 'Tech Max, Full options.',
        status: 'new',
        date: 'Il y a 3 jours',
        wilaya: 'Annaba'
    }
];

// --- MOCK FINANCE DATA (BANK PLATFORM LEVEL) ---

// 1. Transaction Log
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_59281',
    bookingId: 'bk_101',
    idempotencyKey: 'idemp_key_alpha_1',
    amountTotalDZD: 35000,
    amountCommissionDZD: 5750, // 15% + 500
    amountNetSellerDZD: 29250,
    paymentCurrency: 'DZD',
    paymentAmount: 35000,
    appliedRate: 1,
    sellerId: 'u2',
    buyerId: 'u_indiv_123',
    status: 'CAPTURED',
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-02-15T10:30:05Z',
    metadata: { pspReference: 'satim_88229' }
  },
  {
    id: 'tx_59282',
    bookingId: 'bk_102',
    idempotencyKey: 'idemp_key_beta_2',
    amountTotalDZD: 12000,
    amountCommissionDZD: 2300, // 15% + 500
    amountNetSellerDZD: 9700,
    paymentCurrency: 'EUR',
    paymentAmount: 81.91, // 12000 / 146.5
    appliedRate: 146.50,
    sellerId: 'u7',
    buyerId: 'u_guest_99',
    status: 'CAPTURED',
    createdAt: '2024-02-14T14:15:00Z',
    updatedAt: '2024-02-14T14:15:10Z',
    metadata: { pspReference: 'stripe_pi_332' }
  },
  // ANOMALY MOCK: Failed Payment but Captured State (Impossible state in real life, good for dashboard testing)
  {
    id: 'tx_FAIL_TEST',
    bookingId: 'bk_103',
    idempotencyKey: 'idemp_key_fail_3',
    amountTotalDZD: 50000,
    amountCommissionDZD: -500, // ANOMALY: Negative Commission
    amountNetSellerDZD: 50500,
    paymentCurrency: 'DZD',
    paymentAmount: 50000,
    appliedRate: 1,
    sellerId: 'u1',
    buyerId: 'u_indiv_123',
    status: 'FAILED',
    createdAt: '2024-02-13T09:00:00Z',
    updatedAt: '2024-02-13T09:01:00Z',
    metadata: { anomaly: 'Negative Commission Detected' }
  }
];

// 2. Payouts Log
export const MOCK_PAYOUTS: Payout[] = [
  {
    id: 'po_001',
    sellerId: 'u2',
    amountDZD: 29250,
    status: 'paid',
    periodStart: '2024-02-01',
    periodEnd: '2024-02-15',
    transactionCount: 1,
    generatedAt: '2024-02-16T08:00:00Z'
  },
  {
    id: 'po_002',
    sellerId: 'u7',
    amountDZD: 9700,
    status: 'processing',
    periodStart: '2024-02-01',
    periodEnd: '2024-02-15',
    transactionCount: 1,
    generatedAt: '2024-02-16T08:00:00Z'
  }
];
