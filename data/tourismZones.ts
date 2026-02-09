
// Source de vérité pour les zones touristiques en Algérie
// Utilisé pour le filtrage intelligent et le SEO local

export type TourismZone =
  | "MER_PLAGE"
  | "MONTAGNE"
  | "HAUTS_PLATEAUX"
  | "PORTE_DU_SUD"
  | "SAHARA_GRAND_SUD";

export const TOURISM_ZONE_LABELS: Record<TourismZone, string> = {
  "MER_PLAGE": "Mer & Plage (Littoral)",
  "MONTAGNE": "Montagne (Atlas, Kabylie, Aurès)",
  "HAUTS_PLATEAUX": "Hauts Plateaux",
  "PORTE_DU_SUD": "Porte du Sud & Oasis",
  "SAHARA_GRAND_SUD": "Sahara & Grand Sud"
};
