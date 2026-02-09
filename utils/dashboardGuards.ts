
import { PackCapabilities } from "./packCapabilities";

export const canAddListing = (used: number, cap: PackCapabilities) =>
  used < cap.maxListings;

export const canImportCSV = (cap: PackCapabilities) =>
  cap.csvImport === true;

export const canUseBoost = (remainingBoosts: number) =>
  remainingBoosts > 0; // paiement viendra plus tard
