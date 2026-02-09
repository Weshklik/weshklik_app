
import { TourismZone } from './tourismZones';

/**
 * MAPPING INTELLIGENT WILAYA -> ZONES
 * Source de vérité métier.
 * Une wilaya peut appartenir à plusieurs zones.
 */
export const TOURISM_ZONES_BY_WILAYA: Record<string, TourismZone[]> = {
  // MER & PLAGE (Code Wilaya string '01', '16' etc match with data.ts)
  '02': ["MER_PLAGE"],   // Chlef
  '06': ["MER_PLAGE", "MONTAGNE"], // Béjaïa
  '09': ["MER_PLAGE", "MONTAGNE"], // Blida (Chréa + position)
  '10': ["MER_PLAGE", "MONTAGNE"], // Bouira (Tikjda + Proximité)
  '13': ["MER_PLAGE"], // Tlemcen
  '15': ["MER_PLAGE", "MONTAGNE"], // Tizi Ouzou
  '16': ["MER_PLAGE"], // Alger
  '18': ["MER_PLAGE"], // Jijel
  '19': ["MER_PLAGE", "HAUTS_PLATEAUX"], // Sétif (Nord/Sud)
  '21': ["MER_PLAGE"], // Skikda
  '23': ["MER_PLAGE"], // Annaba
  '24': ["MER_PLAGE", "MONTAGNE"], // Guelma
  '25': ["MONTAGNE"], // Constantine
  '27': ["MER_PLAGE"], // Mostaganem
  '29': ["MONTAGNE"], // Mascara
  '31': ["MER_PLAGE"], // Oran
  '34': ["HAUTS_PLATEAUX"], // Bordj
  '35': ["MER_PLAGE"], // Boumerdes
  '36': ["MER_PLAGE"], // El Tarf
  '42': ["MER_PLAGE"], // Tipaza
  '44': ["MONTAGNE"], // Aïn Defla
  '46': ["MER_PLAGE"], // Aïn Témouchent

  // MONTAGNE (Dominante)
  '04': ["MONTAGNE", "HAUTS_PLATEAUX"], // Oum El Bouaghi
  '05': ["MONTAGNE"], // Batna
  '07': ["MONTAGNE", "PORTE_DU_SUD"], // Biskra
  '12': ["MONTAGNE", "HAUTS_PLATEAUX"], // Tébessa
  '26': ["MONTAGNE"], // Médéa
  '32': ["MONTAGNE", "HAUTS_PLATEAUX"], // El Bayadh
  '38': ["MONTAGNE"], // Tissemsilt
  '43': ["MONTAGNE"], // Mila

  // HAUTS PLATEAUX
  '14': ["HAUTS_PLATEAUX"], // Tiaret
  '17': ["HAUTS_PLATEAUX"], // Djelfa
  '20': ["HAUTS_PLATEAUX"], // Saida
  '22': ["HAUTS_PLATEAUX"], // Sidi Bel Abbes
  '28': ["HAUTS_PLATEAUX"], // M'Sila
  '40': ["HAUTS_PLATEAUX"], // Khenchela
  '41': ["HAUTS_PLATEAUX"], // Souk Ahras

  // PORTE DU SUD
  '03': ["PORTE_DU_SUD"], // Laghouat
  '08': ["PORTE_DU_SUD", "SAHARA_GRAND_SUD"], // Béchar
  '30': ["PORTE_DU_SUD", "SAHARA_GRAND_SUD"], // Ouargla
  '47': ["PORTE_DU_SUD"], // Ghardaïa
  
  // SAHARA & GRAND SUD
  '01': ["SAHARA_GRAND_SUD"],  // Adrar
  '11': ["SAHARA_GRAND_SUD"], // Tamanrasset
  '33': ["SAHARA_GRAND_SUD"], // Illizi
  '37': ["SAHARA_GRAND_SUD"], // Tindouf
  '39': ["SAHARA_GRAND_SUD"], // El Oued
  '45': ["SAHARA_GRAND_SUD"], // Naâma
  '48': ["HAUTS_PLATEAUX"], // Relizane
  
  // NOUVELLES WILAYAS (Approximation)
  '49': ["SAHARA_GRAND_SUD"], // El M'Ghair
  '50': ["SAHARA_GRAND_SUD"], // El Menia
  '51': ["PORTE_DU_SUD"], // Ouled Djellal
  '52': ["PORTE_DU_SUD"], // El Meniaa
  '53': ["SAHARA_GRAND_SUD"], // Bordj Badji Mokhtar
  '54': ["SAHARA_GRAND_SUD"], // Béni Abbès
  '55': ["SAHARA_GRAND_SUD"], // In Salah
  '56': ["SAHARA_GRAND_SUD"], // In Guezzam
  '57': ["SAHARA_GRAND_SUD"], // Timimoun
  '58': ["SAHARA_GRAND_SUD"], // Touggourt
};
