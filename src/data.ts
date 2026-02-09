
import { Category, Listing, User, StoreProfile, ProSector, SectorRule, PartnerProfile, ImportRequest, Transaction, Payout, Review, Wilaya } from './types';

// Constants for sellers to use in listings
export const SELLER_INDIVIDUAL: User = {
  id: 'u_indiv_1',
  name: 'Amine Particulier',
  type: 'individual',
  verified: true,
  avatar: 'https://ui-avatars.com/api/?name=Amine+P&background=random'
};

export const SELLER_INDIVIDUAL_2: User = {
  id: 'u_indiv_2',
  name: 'Karim',
  type: 'individual',
  verified: true,
  avatar: 'https://ui-avatars.com/api/?name=Karim&background=random'
};

export const MOCK_STORES: Record<string, StoreProfile> = {
  'u1': {
    id: 'u1',
    name: 'Auto Luxe DZ',
    type: 'pro',
    verified: true,
    avatar: 'https://ui-avatars.com/api/?name=Auto+Luxe&background=0D8ABC&color=fff',
    cover: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&q=80&w=1200',
    bio: 'Spécialiste des véhicules allemands.',
    location: 'Hydra, Alger',
    rating: 4.8,
    reviewCount: 124,
    responseRate: '98%',
    responseTime: '< 1h',
    memberSince: '2023',
    badges: ['Vérifié', 'Premium'],
    phone: '0550000000',
    package_slug: 'gold',
    sectors: ['auto_vente'],
    categories: ['concessionnaire']
  },
  'u2': {
    id: 'u2',
    name: 'Immo Prestige',
    type: 'pro',
    verified: true,
    avatar: 'https://ui-avatars.com/api/?name=Immo+Prestige&background=10b981&color=fff',
    cover: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200',
    bio: 'Votre agence immobilière de confiance.',
    location: 'Oran',
    rating: 4.5,
    reviewCount: 45,
    responseRate: '90%',
    responseTime: '< 3h',
    memberSince: '2022',
    badges: ['Vérifié'],
    phone: '0551111111',
    package_slug: 'silver',
    sectors: ['immobilier'],
    categories: ['agence_immo']
  },
  'u4': {
    id: 'u4',
    name: 'Tech Store',
    type: 'pro',
    verified: true,
    avatar: 'https://ui-avatars.com/api/?name=Tech+Store&background=6366f1&color=fff',
    cover: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=1200',
    bio: 'Smartphones et accessoires.',
    location: 'Sétif',
    rating: 4.2,
    reviewCount: 30,
    responseRate: '95%',
    responseTime: '< 2h',
    memberSince: '2023',
    badges: [],
    phone: '0552222222',
    package_slug: 'free',
    sectors: ['retail'],
    categories: ['telephonie']
  },
  'u7': {
    id: 'u7',
    name: 'Mode Fashion',
    type: 'pro',
    verified: false,
    avatar: 'https://ui-avatars.com/api/?name=Mode+Fashion&background=ec4899&color=fff',
    cover: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200',
    bio: 'Vêtements tendance.',
    location: 'Constantine',
    rating: 0,
    reviewCount: 0,
    responseRate: '-',
    responseTime: '-',
    memberSince: '2024',
    badges: [],
    phone: '0553333333',
    package_slug: 'free',
    sectors: ['retail'],
    categories: ['mode']
  }
};

export const CATEGORIES: Category[] = [
  {
    id: 'auto',
    name: 'Véhicules',
    icon: 'Car',
    color: 'blue',
    subCategories: [
      { id: 'car', name: 'Voitures', fields: [] },
      { id: 'rent', name: 'Location', fields: [] },
      { id: 'moto', name: 'Motos', fields: [] },
      { id: 'truck', name: 'Camions', fields: [] },
      { id: 'parts', name: 'Pièces détachées', fields: [] },
      { id: 'import_auto', name: 'Import Auto', fields: [] }
    ]
  },
  {
    id: 'real_estate',
    name: 'Immobilier',
    icon: 'Home',
    color: 'emerald',
    subCategories: [
      { id: 'sale', name: 'Vente', fields: [] },
      { id: 'rent', name: 'Location', fields: [] },
      { id: 'holiday_rent', name: 'Location Vacances', fields: [] },
      { id: 'commercial', name: 'Bureaux & Commerce', fields: [] },
      { id: 'land', name: 'Terrains', fields: [] }
    ]
  },
  {
    id: 'phones',
    name: 'Téléphones',
    icon: 'Smartphone',
    color: 'purple',
    subCategories: [
      { id: 'smartphones', name: 'Smartphones', fields: [] },
      { id: 'accessories', name: 'Accessoires', fields: [] }
    ]
  },
  {
    id: 'informatics',
    name: 'Informatique',
    icon: 'Laptop',
    color: 'indigo',
    subCategories: [
      { id: 'laptops', name: 'PC Portables', fields: [] },
      { id: 'components', name: 'Composants', fields: [] }
    ]
  },
  {
    id: 'home',
    name: 'Maison',
    icon: 'Sofa',
    color: 'orange',
    subCategories: [
        { id: 'furniture', name: 'Meubles', fields: [] },
        { id: 'appliances', name: 'Electroménager', fields: [] }
    ]
  },
  {
    id: 'services',
    name: 'Services',
    icon: 'Briefcase',
    color: 'gray',
    subCategories: [
        { id: 'transport', name: 'Transport & Déménagement', fields: [] },
        { id: 'construction', name: 'Travaux & Rénovation', fields: [] },
        { id: 'repair', name: 'Réparation', fields: [] },
        { id: 'events', name: 'Evénements', fields: [] }
    ]
  },
  {
    id: 'jobs',
    name: 'Emploi',
    icon: 'Briefcase',
    color: 'sky',
    subCategories: [
        { id: 'offers', name: 'Offres d\'emploi', fields: [] },
        { id: 'requests', name: 'Demandes d\'emploi', fields: [] },
        { id: 'training', name: 'Formations', fields: [] }
    ]
  }
];

export const MOCK_LISTINGS: Listing[] = [
  // --- CARS ---
  { 
    id: '1', 
    title: 'Volkswagen Golf 8 R-Line 2023', 
    price: 7500000, 
    currency: 'DZD', 
    category: 'auto', 
    subCategory: 'car',
    location: 'Alger', 
    commune: 'Hydra',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800', 
    date: 'Aujourd\'hui', 
    seller: MOCK_STORES['u1'],
    isPromoted: true,
    specs: { 'Année': '2023', 'Kilométrage': '12 000 km', 'Carburant': 'Essence', 'Boite': 'Automatique' }
  },
  // --- ADDITIONAL LISTINGS ---
  { id: 's_trans_1', title: 'Déménagement 58 Wilayas', price: 0, currency: 'DZD', category: 'services', subCategory: 'transport', location: 'Alger', image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&q=80&w=800', date: 'Disponible', seller: SELLER_INDIVIDUAL_2, description: 'Camion 20m3 avec monte-meuble.', specs: {'Véhicule': 'Camion 20m3'} },
  { id: 's_const_1', title: 'Peintre Décorateur', price: 0, currency: 'DZD', category: 'services', subCategory: 'construction', location: 'Blida', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800', date: 'Disponible', seller: SELLER_INDIVIDUAL, description: 'Peinture moderne, stuc, placoplatre.' },
  { id: 's_repair_1', title: 'Réparation Froid & Climatisation', price: 0, currency: 'DZD', category: 'services', subCategory: 'repair', location: 'Alger', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800', date: '7j/7', seller: SELLER_INDIVIDUAL, description: 'Déplacement à domicile.' },
  { id: 's_event_1', title: 'Traiteur Mariage & Fêtes', price: 0, currency: 'DZD', category: 'services', subCategory: 'events', location: 'Tizi Ouzou', image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800', date: 'Sur devis', seller: SELLER_INDIVIDUAL_2, description: 'Cuisine traditionnelle et moderne.' },
  
  // Real Estate (Rentals for booking flow)
  { 
    id: '2', 
    title: 'Appartement F4 Haut Standing', 
    price: 12000, 
    currency: 'DZD', 
    category: 'real_estate', 
    subCategory: 'holiday_rent',
    location: 'Oran', 
    commune: 'Ain Turk',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800', 
    date: 'Hier', 
    seller: MOCK_STORES['u2'],
    specs: { 'Surface': '120m²', 'Pièces': '4' },
    rentalConfig: {
        pricePer: 'night',
        depositDZD: 20000,
        minDuration: 2,
        options: [
            { id: 'cleaning', label: 'Ménage', priceDZD: 2000, type: 'fixed' },
            { id: 'wifi', label: 'Wifi 4G', priceDZD: 500, type: 'per_day' }
        ]
    }
  },
  { id: '4', title: 'Renault Clio 4 GT Line', price: 2100000, currency: 'DZD', category: 'auto', subCategory: 'car', location: 'Alger', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800', date: '2 jours', seller: SELLER_INDIVIDUAL, specs: { 'Année': '2019', 'Kilométrage': '85 000 km', 'Carburant': 'Diesel' } },
  
  // Import Auto Listing
  {
    id: 'imp_1',
    title: 'Mercedes Classe A 2023 (Import)',
    price: 6500000,
    currency: 'DZD',
    category: 'auto',
    subCategory: 'import_auto',
    location: 'Alger',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800',
    date: 'Aujourd\'hui',
    seller: MOCK_STORES['u1'],
    specs: { 'Année': '2023', 'Pays de provenance': 'Allemagne', 'Carburant': 'Diesel', 'Prix affiché': 'Clé en main' },
    description: 'Véhicule sur commande. Délai 20 jours. Dédouanement inclus.'
  },

  // --- ADDITIONAL JOBS ---
  { id: 'j_offer_2', title: 'Développeur Web Full Stack', price: 0, currency: 'DZD', category: 'jobs', subCategory: 'offers', location: 'Alger', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800', date: 'Il y a 2 jours', seller: MOCK_STORES['u4'], description: 'Agence digitale recrute dev React/Nodejs.', specs: {'Contrat': 'CDI', 'Télétravail': 'Hybride'} },
  { id: 'j_req_2', title: 'Infographiste Freelance disponible', price: 0, currency: 'DZD', category: 'jobs', subCategory: 'requests', location: 'Oran', image: 'https://images.unsplash.com/photo-1626785774573-4b7993143a23?auto=format&fit=crop&q=80&w=800', date: 'Aujourd\'hui', seller: SELLER_INDIVIDUAL, description: 'Création de logos, charte graphique, flyers.', specs: {'Logiciels': 'Adobe Suite'} },
  { id: 'j_train_2', title: 'Cours d\'Anglais Intensif', price: 15000, currency: 'DZD', category: 'jobs', subCategory: 'training', location: 'Constantine', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800', date: 'Inscriptions ouvertes', seller: SELLER_INDIVIDUAL_2, description: 'Préparation TOEFL/IELTS. Groupe de 10 personnes max.', specs: {'Durée': '1 mois'} },

  // --- ADDITIONAL SERVICES ---
  { id: 's_trans_2', title: 'Taxi VTC Aéroport Alger', price: 0, currency: 'DZD', category: 'services', subCategory: 'transport', location: 'Alger', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800', date: '24h/24', seller: SELLER_INDIVIDUAL, description: 'Transport VIP vers aéroport Houari Boumediene.', specs: {'Véhicule': 'Berline Confort'} },
  { id: 's_const_2', title: 'Plombier Chauffagiste Qualifié', price: 0, currency: 'DZD', category: 'services', subCategory: 'construction', location: 'Setif', image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=800', date: 'Disponible', seller: SELLER_INDIVIDUAL_2, description: 'Installation chauffage central et sanitaire.', specs: {'Expérience': '15 ans'} },
  { id: 's_repair_2', title: 'Mécanicien à domicile', price: 0, currency: 'DZD', category: 'services', subCategory: 'repair', location: 'Blida', image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=800', date: 'Urgence 7j/7', seller: MOCK_STORES['u1'], description: 'Diagnostic scanner et petites réparations sur place.', specs: {'Déplacement': 'Oui'} },
  { id: 's_event_2', title: 'Photographe Mariage & Shooting', price: 0, currency: 'DZD', category: 'services', subCategory: 'events', location: 'Bejaia', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800', date: 'Sur RDV', seller: SELLER_INDIVIDUAL, description: 'Pack photos + vidéo drone.', specs: {'Matériel': 'Pro 4K'} }
];

export const WILAYAS: Wilaya[] = [
  { code: '01', name: 'Adrar' },
  { code: '02', name: 'Chlef' },
  { code: '03', name: 'Laghouat' },
  { code: '04', name: 'Oum El Bouaghi' },
  { code: '05', name: 'Batna' },
  { code: '06', name: 'Béjaïa' },
  { code: '07', name: 'Biskra' },
  { code: '08', name: 'Béchar' },
  { code: '09', name: 'Blida' },
  { code: '10', name: 'Bouira' },
  { code: '11', name: 'Tamanrasset' },
  { code: '12', name: 'Tébessa' },
  { code: '13', name: 'Tlemcen' },
  { code: '14', name: 'Tiaret' },
  { code: '15', name: 'Tizi Ouzou' },
  { code: '16', name: 'Alger', communes: ['Alger Centre', 'Hydra', 'El Biar', 'Bab El Oued', 'Kouba'] },
  { code: '17', name: 'Djelfa' },
  { code: '18', name: 'Jijel' },
  { code: '19', name: 'Sétif' },
  { code: '20', name: 'Saïda' },
  { code: '21', name: 'Skikda' },
  { code: '22', name: 'Sidi Bel Abbès' },
  { code: '23', name: 'Annaba' },
  { code: '24', name: 'Guelma' },
  { code: '25', name: 'Constantine' },
  { code: '26', name: 'Médéa' },
  { code: '27', name: 'Mostaganem' },
  { code: '28', name: 'M\'Sila' },
  { code: '29', name: 'Mascara' },
  { code: '30', name: 'Ouargla' },
  { code: '31', name: 'Oran', communes: ['Oran', 'Es Senia', 'Bir El Djir', 'Ain Turk'] },
  { code: '32', name: 'El Bayadh' },
  { code: '33', name: 'Illizi' },
  { code: '34', name: 'Bordj Bou Arréridj' },
  { code: '35', name: 'Boumerdès' },
  { code: '36', name: 'El Tarf' },
  { code: '37', name: 'Tindouf' },
  { code: '38', name: 'Tissemsilt' },
  { code: '39', name: 'El Oued' },
  { code: '40', name: 'Khenchela' },
  { code: '41', name: 'Souk Ahras' },
  { code: '42', name: 'Tipaza' },
  { code: '43', name: 'Mila' },
  { code: '44', name: 'Aïn Defla' },
  { code: '45', name: 'Naâma' },
  { code: '46', name: 'Aïn Témouchent' },
  { code: '47', name: 'Ghardaïa' },
  { code: '48', name: 'Relizane' }
];

export const PRO_SECTORS: ProSector[] = [
  {
    id: 'auto_vente',
    label: 'Vente Auto / Moto',
    icon: 'Car',
    categories: [
      { id: 'concessionnaire', label: 'Concessionnaire / Showroom' },
      { id: 'revendeur', label: 'Revendeur Multimarque' },
      { id: 'pieces_auto', label: 'Pièces Détachées' }
    ],
    capabilities: ['IMPORT_AUTO']
  },
  {
    id: 'auto_location',
    label: 'Location Véhicules',
    icon: 'Key',
    categories: [
      { id: 'agence_location', label: 'Agence de Location' }
    ]
  },
  {
    id: 'immobilier',
    label: 'Immobilier',
    icon: 'Home',
    categories: [
      { id: 'agence_immo', label: 'Agence Immobilière' },
      { id: 'promoteur', label: 'Promoteur Immobilier' }
    ]
  },
  {
    id: 'retail',
    label: 'Commerce & Retail',
    icon: 'ShoppingBag',
    categories: [
      { id: 'telephonie', label: 'Téléphonie & Accessoires' },
      { id: 'informatique', label: 'Informatique & Bureautique' },
      { id: 'electromenager', label: 'Electroménager' },
      { id: 'mode', label: 'Mode & Habillement' },
      { id: 'maison', label: 'Meubles & Déco' }
    ]
  },
  {
    id: 'services',
    label: 'Services',
    icon: 'Briefcase',
    categories: [
      { id: 'transport', label: 'Transport / Déménagement' },
      { id: 'voyage', label: 'Agence de Voyage' },
      { id: 'travaux', label: 'Travaux & Rénovation' }
    ]
  }
];

export const SECTOR_RULES: Record<string, SectorRule> = {
  'auto_vente': {
    freeLimit: 2,
    importAutoAllowed: true,
    csvImportMinPack: 'silver',
    manualValidation: false,
    allowedCategories: ['auto']
  },
  'auto_import': { // Specific capability sector
    freeLimit: 0,
    importAutoAllowed: true,
    csvImportMinPack: 'silver',
    manualValidation: true,
    allowedCategories: ['auto']
  },
  'auto_location': {
    freeLimit: 2,
    importAutoAllowed: false,
    csvImportMinPack: 'silver',
    manualValidation: false,
    allowedCategories: ['auto'],
    allowedSubCategories: ['rent']
  },
  'immobilier': {
    freeLimit: 3,
    importAutoAllowed: false,
    csvImportMinPack: 'gold',
    manualValidation: false,
    allowedCategories: ['real_estate']
  },
  'retail': {
    freeLimit: 5,
    importAutoAllowed: false,
    csvImportMinPack: 'silver',
    manualValidation: false,
    allowedCategories: ['phones', 'informatics', 'home', 'fashion']
  },
  'services': {
    freeLimit: 2,
    importAutoAllowed: false,
    csvImportMinPack: 'none',
    manualValidation: false,
    allowedCategories: ['services']
  }
};

export const MOCK_PARTNERS: PartnerProfile[] = [
  {
    id: 'p_1',
    name: 'Karim Service',
    type: 'individual',
    verified: true,
    isPartner: true,
    partnerStatus: 'approved',
    phone: '0550123456',
    bio: 'Disponible sur Alger centre et environs. Paiement main à main ou CCP. Sérieux et rapide.',
    wilayasCovered: ['16', '09', '35'],
    paymentMethods: ['Espèces (Main propre)', 'CCP / BaridiMob'],
    maxBudget: 200000,
    rating: 4.9,
    reviewCount: 42,
    commissionRate: '500 - 1000 DA',
    completedTransactions: 156,
    responseTime: '15 min',
    subscriptionStatus: 'active',
    partnerPlan: 'partner_active',
    isProbation: false
  },
  {
    id: 'p_2',
    name: 'Oran Express',
    type: 'individual',
    verified: true,
    isPartner: true,
    partnerStatus: 'approved',
    phone: '0551987654',
    bio: 'Achats et livraisons sur Oran. Je peux avancer les frais jusqu\'à 50000 DA.',
    wilayasCovered: ['31', '22', '46'],
    paymentMethods: ['Espèces (Main propre)', 'Paysera / Wise'],
    maxBudget: 50000,
    rating: 4.5,
    reviewCount: 18,
    commissionRate: 'Variable',
    completedTransactions: 34,
    responseTime: '1h',
    subscriptionStatus: 'active',
    partnerPlan: 'partner_free',
    isProbation: true
  }
];

export const PARTNER_PLANS = [
  {
    id: 'partner_free',
    name: 'Standard',
    price: 0,
    description: 'Pour commencer et tester le service.',
    features: [
      { text: 'Visible dans l\'annuaire', check: true },
      { text: 'Badge "Vérifié"', check: true },
      { text: 'Limité à 1 Wilaya', check: false },
      { text: 'Position standard', check: true }
    ],
    buttonLabel: 'Plan Actuel',
    highlight: false
  },
  {
    id: 'partner_active',
    name: 'Partenaire Actif',
    price: 2000,
    description: 'Pour les partenaires sérieux qui veulent plus de clients.',
    features: [
      { text: 'Visible dans l\'annuaire', check: true },
      { text: 'Badge "TOP PARTENAIRE"', check: true },
      { text: 'Multi-Wilayas (jusqu\'à 5)', check: true },
      { text: 'Affichage prioritaire', check: true }
    ],
    buttonLabel: 'Activer (2000 DA)',
    highlight: true
  }
];

export const MOCK_IMPORT_REQUESTS: ImportRequest[] = [
  {
    id: 'req_1',
    clientName: 'Sofiane B.',
    vehicleType: 'Voiture',
    brand: 'Volkswagen',
    model: 'Golf 8 R-Line',
    yearMin: '2023',
    budgetMax: 7000000,
    originPreference: 'Europe',
    description: 'Toit ouvrant obligatoire, couleur noire ou gris nardo.',
    status: 'new',
    date: '2024-02-25',
    wilaya: 'Alger'
  },
  {
    id: 'req_2',
    clientName: 'Entreprise Eurl',
    vehicleType: 'Utilitaire',
    brand: 'Peugeot',
    model: 'Boxer',
    yearMin: '2022',
    budgetMax: 4500000,
    originPreference: 'Europe',
    description: 'L2H2, pour transport de marchandise.',
    status: 'replied',
    date: '2024-02-24',
    wilaya: 'Oran'
  }
];

export const MOCK_REVIEWS: Review[] = [
  { id: 'r1', author: 'Samir', rating: 5, comment: 'Transaction parfaite, très pro.', date: 'Il y a 2 jours' },
  { id: 'r2', author: 'Nassim', rating: 4, comment: 'Bon service, un peu d\'attente.', date: 'Il y a 1 semaine' }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_demo_1',
    bookingId: 'bk_123',
    idempotencyKey: 'idemp_1',
    amountTotalDZD: 15000,
    amountCommissionDZD: 1500,
    amountNetSellerDZD: 13500,
    paymentCurrency: 'DZD',
    paymentAmount: 15000,
    appliedRate: 1,
    sellerId: 'u2',
    buyerId: 'u_indiv_1',
    status: 'CAPTURED',
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-02-20T10:05:00Z'
  },
  {
    id: 'tx_demo_2',
    bookingId: 'bk_124',
    idempotencyKey: 'idemp_2',
    amountTotalDZD: 25000,
    amountCommissionDZD: 2500,
    amountNetSellerDZD: 22500,
    paymentCurrency: 'EUR',
    paymentAmount: 170, // Approx
    appliedRate: 146.5,
    sellerId: 'u2',
    buyerId: 'u_indiv_2',
    status: 'INITIATED',
    createdAt: '2024-02-21T14:00:00Z',
    updatedAt: '2024-02-21T14:00:00Z'
  }
];

export const MOCK_PAYOUTS: Payout[] = [
  {
    id: 'po_1',
    sellerId: 'u2',
    amountDZD: 13500,
    status: 'paid',
    periodStart: '2024-02-01',
    periodEnd: '2024-02-28',
    transactionCount: 1,
    generatedAt: '2024-03-01T09:00:00Z'
  }
];
