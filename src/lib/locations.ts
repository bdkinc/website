export interface Location {
  name: string;
  state: string;
  region: string;
  population: number;
  counties?: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const easternShoreLocations: Location[] = [
  // Maryland Eastern Shore
  {
    name: "Cambridge",
    state: "Maryland",
    region: "Eastern Shore",
    population: 13480,
    counties: ["Dorchester"],
    coordinates: { lat: 38.5695, lng: -76.0611 }
  },
  {
    name: "Easton",
    state: "Maryland",
    region: "Eastern Shore",
    population: 17031,
    counties: ["Talbot"],
    coordinates: { lat: 38.7846, lng: -76.0756 }
  },
  {
    name: "Salisbury",
    state: "Maryland",
    region: "Eastern Shore",
    population: 33797,
    counties: ["Wicomico"],
    coordinates: { lat: 38.3610, lng: -75.5994 }
  },
  {
    name: "Ocean City",
    state: "Maryland",
    region: "Eastern Shore",
    population: 6907,
    counties: ["Worcester"],
    coordinates: { lat: 38.3365, lng: -75.0849 }
  },
  {
    name: "Berlin",
    state: "Maryland",
    region: "Eastern Shore",
    population: 4983,
    counties: ["Worcester"],
    coordinates: { lat: 38.3334, lng: -75.2088 }
  },
  {
    name: "West Ocean City",
    state: "Maryland",
    region: "Eastern Shore",
    population: 7368,
    counties: ["Worcester"],
    coordinates: { lat: 38.4332, lng: -75.0986 }
  },
  {
    name: "Snow Hill",
    state: "Maryland",
    region: "Eastern Shore",
    population: 2165,
    counties: ["Worcester"],
    coordinates: { lat: 38.1723, lng: -75.5338 }
  },
  {
    name: "Chestertown",
    state: "Maryland",
    region: "Eastern Shore",
    population: 5219,
    counties: ["Kent"],
    coordinates: { lat: 39.2301, lng: -76.0666 }
  },
  {
    name: "Centreville",
    state: "Maryland",
    region: "Eastern Shore",
    population: 4771,
    counties: ["Queen Anne's"],
    coordinates: { lat: 39.0457, lng: -76.0617 }
  },
  {
    name: "Kent Narrows",
    state: "Maryland",
    region: "Eastern Shore",
    population: 567,
    counties: ["Queen Anne's"],
    coordinates: { lat: 38.9704, lng: -76.2491 }
  },
  {
    name: "Stevensville",
    state: "Maryland",
    region: "Eastern Shore",
    population: 7082,
    counties: ["Queen Anne's"],
    coordinates: { lat: 38.9854, lng: -76.3294 }
  },
  {
    name: "Denton",
    state: "Maryland",
    region: "Eastern Shore",
    population: 4471,
    counties: ["Caroline"],
    coordinates: { lat: 38.8863, lng: -75.8308 }
  },
  {
    name: "Greensboro",
    state: "Maryland",
    region: "Eastern Shore",
    population: 2160,
    counties: ["Caroline"],
    coordinates: { lat: 38.9765, lng: -75.7495 }
  },
  {
    name: "Federalsburg",
    state: "Maryland",
    region: "Eastern Shore",
    population: 2765,
    counties: ["Caroline"],
    coordinates: { lat: 38.6865, lng: -75.7793 }
  },
  {
    name: "Fruitland",
    state: "Maryland",
    region: "Eastern Shore",
    population: 5204,
    counties: ["Wicomico"],
    coordinates: { lat: 38.3229, lng: -75.6208 }
  },
  {
    name: "Hebron",
    state: "Maryland",
    region: "Eastern Shore",
    population: 1097,
    counties: ["Wicomico"],
    coordinates: { lat: 38.4207, lng: -75.6874 }
  },
  {
    name: "Preston",
    state: "Maryland",
    region: "Eastern Shore",
    population: 499,
    counties: ["Caroline"],
    coordinates: { lat: 38.7138, lng: -75.9188 }
  },
  {
    name: "Trappe",
    state: "Maryland",
    region: "Eastern Shore",
    population: 1008,
    counties: ["Talbot"],
    coordinates: { lat: 38.6610, lng: -76.0555 }
  },
  {
    name: "Tilghman Island",
    state: "Maryland",
    region: "Eastern Shore",
    population: 854,
    counties: ["Talbot"],
    coordinates: { lat: 38.7084, lng: -76.3291 }
  },
  
  // Delaware Eastern Shore (Kent County and Sussex County)
  {
    name: "Dover",
    state: "Delaware",
    region: "Eastern Shore",
    population: 39540,
    counties: ["Kent"],
    coordinates: { lat: 39.1612, lng: -75.5264 }
  },
  {
    name: "Milford",
    state: "Delaware",
    region: "Eastern Shore",
    population: 11588,
    counties: ["Kent", "Sussex"],
    coordinates: { lat: 38.9123, lng: -75.4280 }
  },
  {
    name: "Georgetown",
    state: "Delaware",
    region: "Eastern Shore",
    population: 7174,
    counties: ["Sussex"],
    coordinates: { lat: 38.6901, lng: -75.3856 }
  },
  {
    name: "Lewes",
    state: "Delaware",
    region: "Eastern Shore",
    population: 3022,
    counties: ["Sussex"],
    coordinates: { lat: 38.7746, lng: -75.1396 }
  },
  {
    name: "Rehoboth Beach",
    state: "Delaware",
    region: "Eastern Shore",
    population: 1150,
    counties: ["Sussex"],
    coordinates: { lat: 38.7195, lng: -75.1276 }
  },
  {
    name: "Bethany Beach",
    state: "Delaware",
    region: "Eastern Shore",
    population: 1068,
    counties: ["Sussex"],
    coordinates: { lat: 38.5390, lng: -75.0588 }
  },
  {
    name: "Seaford",
    state: "Delaware",
    region: "Eastern Shore",
    population: 8199,
    counties: ["Sussex"],
    coordinates: { lat: 38.6401, lng: -75.6138 }
  },
  {
    name: "Millsboro",
    state: "Delaware",
    region: "Eastern Shore",
    population: 4606,
    counties: ["Sussex"],
    coordinates: { lat: 38.5946, lng: -75.2910 }
  },
  {
    name: "Selbyville",
    state: "Delaware",
    region: "Eastern Shore",
    population: 2459,
    counties: ["Sussex"],
    coordinates: { lat: 38.4601, lng: -75.2265 }
  },
  {
    name: "Milton",
    state: "Delaware",
    region: "Eastern Shore",
    population: 2902,
    counties: ["Sussex"],
    coordinates: { lat: 38.7815, lng: -75.3121 }
  },
  {
    name: "Laurel",
    state: "Delaware",
    region: "Eastern Shore",
    population: 4046,
    counties: ["Sussex"],
    coordinates: { lat: 38.5562, lng: -75.5719 }
  },
  {
    name: "Bridgeville",
    state: "Delaware",
    region: "Eastern Shore",
    population: 2538,
    counties: ["Sussex"],
    coordinates: { lat: 38.7437, lng: -75.6038 }
  },
  {
    name: "Greenwood",
    state: "Delaware",
    region: "Eastern Shore",
    population: 1287,
    counties: ["Sussex"],
    coordinates: { lat: 38.8096, lng: -75.3785 }
  },
  {
    name: "Felton",
    state: "Delaware",
    region: "Eastern Shore",
    population: 1396,
    counties: ["Kent"],
    coordinates: { lat: 39.0162, lng: -75.5763 }
  },
  {
    name: "Harrington",
    state: "Delaware",
    region: "Eastern Shore",
    population: 3658,
    counties: ["Kent"],
    coordinates: { lat: 38.9237, lng: -75.5773 }
  },
  {
    name: "Wyoming",
    state: "Delaware",
    region: "Eastern Shore",
    population: 1408,
    counties: ["Kent"],
    coordinates: { lat: 39.1171, lng: -75.5646 }
  },
  {
    name: "Magnolia",
    state: "Delaware",
    region: "Eastern Shore",
    population: 254,
    counties: ["Kent"],
    coordinates: { lat: 39.0682, lng: -75.4882 }
  },
  {
    name: "Woodside",
    state: "Delaware",
    region: "Eastern Shore",
    population: 81,
    counties: ["Kent"],
    coordinates: { lat: 39.0732, lng: -75.5888 }
  },
  {
    name: "Kent Acres",
    state: "Delaware",
    region: "Eastern Shore",
    population: 1876,
    counties: ["Kent"],
    coordinates: { lat: 39.1604, lng: -75.5099 }
  },
  {
    name: "Highland Acres",
    state: "Delaware",
    region: "Eastern Shore",
    population: 3447,
    counties: ["Kent"],
    coordinates: { lat: 39.1622, lng: -75.5198 }
  },
  {
    name: "Rising Sun-Lebanon",
    state: "Delaware",
    region: "Eastern Shore",
    population: 3368,
    counties: ["Kent"],
    coordinates: { lat: 39.1661, lng: -75.7293 }
  }
];

export const getLocationBySlug = (slug: string): Location | undefined => {
  return easternShoreLocations.find(loc => 
    loc.name.toLowerCase().replace(/\s+/g, '-').replace(/,/g, '') === slug
  );
};
