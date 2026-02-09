
export type PackCapabilities = {
  maxListings: number;
  csvImport: boolean;
  boostsIncluded: number;
};

export function getPackCapabilities(packId: string): PackCapabilities {
  // Normalize 'free' to 'starter' to match app IDs with the new logic
  const id = packId === 'free' ? 'starter' : packId;

  switch (id) {
    case "starter":
      return { maxListings: 5, csvImport: false, boostsIncluded: 0 };
    case "silver":
      return { maxListings: 50, csvImport: true, boostsIncluded: 3 };
    case "gold":
      return { maxListings: 200, csvImport: true, boostsIncluded: 10 };
    default:
      return { maxListings: 0, csvImport: false, boostsIncluded: 0 };
  }
}
