type CatalogueRange = "Apple Inventory" | "Google Pixel Inventory" | "Samsung Galaxy Inventory";

type CatalogueBrand = "Apple" | "Google" | "Samsung";
type CataloguePhoneTuple = readonly [brand: CatalogueBrand, model: string, storage: string, price: number, note?: "E-SIM"];

type CataloguePhoneRow = {
  brand: CatalogueBrand;
  model: string;
  storage: string;
  price: number;
  range: CatalogueRange;
  note?: "E-SIM";
};

export type CataloguePhoneProduct = {
  slug: string;
  name: string;
  category: "PHONE";
  brand: CatalogueBrand;
  description: string;
  specifications: Record<string, string>;
  condition: "REFURBISHED";
  fulfillment: "PRE_ORDER_OVERSEAS";
  costPrice: number;
  sellingPrice: number;
  depositPercentage: number;
  stockQuantity: number;
  images: string[];
  featured: boolean;
  isPublished: boolean;
  warrantyDays: number;
};

const catalogueTuples: CataloguePhoneTuple[] = [
  ["Apple", "11 Pro Max", "256GB", 282.43],
  ["Apple", "11 Pro Max", "64GB", 263.16],
  ["Apple", "11 Pro", "256GB", 263.16],
  ["Apple", "11 Pro", "64GB", 251.83],
  ["Apple", "11", "128GB", 218.77],
  ["Apple", "11", "64GB", 191.02],
  ["Apple", "12 Pro Max", "128GB", 323.21],
  ["Apple", "12 Pro Max", "256GB", 353.80],
  ["Apple", "12 Pro", "128GB", 301.69],
  ["Apple", "12 Pro", "256GB", 323.21],
  ["Apple", "12", "128GB", 239.37],
  ["Apple", "12", "64GB", 215.69],
  ["Apple", "13 Mini", "256GB", 258.88],
  ["Apple", "13 Pro Max", "128GB", 450.11],
  ["Apple", "13 Pro Max", "256GB", 484.10],
  ["Apple", "13 Pro", "128GB", 397.71],
  ["Apple", "13 Pro", "256GB", 428.56],
  ["Apple", "13", "128GB", 305.15],
  ["Apple", "13", "256GB", 353.80],
  ["Apple", "14 Plus", "128GB", 344.74],
  ["Apple", "14 Plus", "256GB", 376.46],
  ["Apple", "14 Pro Max", "128GB", 521.49],
  ["Apple", "14 Pro Max", "256GB", 549.81],
  ["Apple", "14 Pro", "128GB", 481.83],
  ["Apple", "14 Pro", "256GB", 474.84, "E-SIM"],
  ["Apple", "14", "128GB", 332.93, "E-SIM"],
  ["Apple", "14", "256GB", 394.59],
  ["Apple", "15 Plus", "128GB", 480.70],
  ["Apple", "15 Plus", "256GB", 519.22],
  ["Apple", "15 Pro Max", "256GB", 646.12],
  ["Apple", "15 Pro", "128GB", 548.68],
  ["Apple", "15 Pro", "256GB", 594.00],
  ["Apple", "15", "128GB", 453.51],
  ["Apple", "15", "256GB", 484.10],
  ["Apple", "16 Plus", "128GB", 686.91],
  ["Apple", "16 Plus", "256GB", 710.70],
  ["Apple", "16 Pro Max", "256GB", 835.33],
  ["Apple", "16 Pro", "256GB", 790.01],
  ["Apple", "17 Air", "256GB", 889.71],
  ["Apple", "17 Pro Max", "256GB", 1387.10],
  ["Apple", "17 Pro", "256GB", 1144.64],
  ["Apple", "X", "256GB", 163.46],
  ["Apple", "X", "64GB", 153.26],
  ["Apple", "XR", "128GB", 184.99],
  ["Apple", "XR", "64GB", 166.33],
  ["Apple", "XS Max", "256GB", 199.72],
  ["Apple", "XS Max", "64GB", 195.18],
  ["Apple", "XS", "256GB", 195.18],

  ["Google", "10 Pro XL", "256GB", 783.34],
  ["Google", "10 Pro", "128GB", 629.09],
  ["Google", "9 Pro XL", "128GB", 551.97],
  ["Google", "8", "128GB", 258.88],

  ["Samsung", "A05", "128GB", 89.82],
  ["Samsung", "A05s", "128GB", 95.48],
  ["Samsung", "A06", "128GB", 93.21],
  ["Samsung", "A07", "128GB", 95.48],
  ["Samsung", "A13 5G", "128GB", 100.01],
  ["Samsung", "A14", "128GB", 87.55],
  ["Samsung", "A15 (Org)", "64GB", 127.78],
  ["Samsung", "A15", "128GB", 110.21],
  ["Samsung", "A16", "128GB", 110.21],
  ["Samsung", "A17", "128GB", 115.87],
  ["Samsung", "A23 5G", "128GB", 102.28],
  ["Samsung", "A24 5G", "128GB", 128.34],
  ["Samsung", "A25", "256GB", 115.87],
  ["Samsung", "A32 4G", "128GB", 112.48],
  ["Samsung", "A32 5G", "128GB", 128.34],
  ["Samsung", "A33 5G", "128GB", 164.59],
  ["Samsung", "A51 4G", "128GB", 112.48],
  ["Samsung", "A51 5G", "128GB", 120.41],
  ["Samsung", "A52 5G", "128GB", 136.27],
  ["Samsung", "A53 5G", "128GB", 169.12],
  ["Samsung", "A71 4G", "128GB", 128.34],
  ["Samsung", "A71 5G", "128GB", 136.27],
  ["Samsung", "Note 10 Plus", "256GB", 228.04],
  ["Samsung", "Note 10", "256GB", 171.39],
  ["Samsung", "Note 20 Ultra", "128GB", 291.49],
  ["Samsung", "Note 20 Ultra", "256GB", 303.95],
  ["Samsung", "Note 20", "128GB", 170.26],
  ["Samsung", "Note 20", "256GB", 178.19],
  ["Samsung", "S10 Plus", "128GB", 195.18],
  ["Samsung", "S20 FE", "128GB", 149.86],
  ["Samsung", "S20 Plus", "128GB", 158.93],
  ["Samsung", "S20 Plus", "256GB", 169.12],
  ["Samsung", "S20 Ultra", "128GB", 198.58],
  ["Samsung", "S20 Ultra", "256GB", 208.78],
  ["Samsung", "S20", "128GB", 170.26],
  ["Samsung", "S21 FE", "128GB", 162.33],
  ["Samsung", "S21 Plus", "128GB", 198.58],
  ["Samsung", "S21 Plus", "256GB", 211.05],
  ["Samsung", "S21 Ultra", "128GB", 248.44],
  ["Samsung", "S21 Ultra", "256GB", 294.89],
  ["Samsung", "S21", "256GB", 197.18],
  ["Samsung", "S22 5G", "128GB", 221.87],
  ["Samsung", "S22 Plus", "128GB", 233.71],
  ["Samsung", "S22 Plus", "256GB", 248.44],
  ["Samsung", "S22 Ultra", "128GB", 319.81],
  ["Samsung", "S22 Ultra", "256GB", 381.00],
  ["Samsung", "S22 Ultra", "512GB", 397.71],
  ["Samsung", "S23 FE", "128GB", 274.32],
  ["Samsung", "S23 Plus", "256GB", 384.40],
  ["Samsung", "S23 Ultra", "256GB", 430.85],
  ["Samsung", "S23", "128GB", 289.73],
  ["Samsung", "S24 Ultra", "256GB", 629.09],
  ["Samsung", "S24", "128GB", 351.44],
  ["Samsung", "S25 Ultra", "256GB", 814.20],
  ["Samsung", "S26 Ultra", "256GB", 996.22],
  ["Samsung", "S26 Ultra", "512GB", 999.31],
  ["Samsung", "Z Flip 3", "128GB", 195.18],
  ["Samsung", "Z Flip 3", "256GB", 211.05],
  ["Samsung", "Z Flip 4", "128GB", 217.84],
  ["Samsung", "Z Flip 4", "256GB", 228.04],
  ["Samsung", "Z Flip 5", "256GB", 275.63],
  ["Samsung", "Z Flip 6", "256GB", 397.71],
  ["Samsung", "Z Fold 3", "256GB", 426.32],
  ["Samsung", "Z Fold 4", "256GB", 468.24],
  ["Samsung", "Z Fold 4", "512GB", 484.10],
  ["Samsung", "Z Fold 5", "256GB", 545.79],
  ["Samsung", "Z Fold 6", "256GB", 767.93],
  ["Samsung", "Z Fold 7", "256GB", 1230.69]
];

function catalogueRange(brand: CatalogueBrand): CatalogueRange {
  if (brand === "Apple") return "Apple Inventory";
  if (brand === "Google") return "Google Pixel Inventory";
  return "Samsung Galaxy Inventory";
}

const catalogueRows: CataloguePhoneRow[] = catalogueTuples.map(([brand, model, storage, price, note]) => ({
  brand,
  model,
  storage,
  price,
  range: catalogueRange(brand),
  ...(note ? { note } : {})
}));

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function productName(row: CataloguePhoneRow) {
  const family = row.brand === "Apple" ? "iPhone " : row.brand === "Google" ? "Pixel " : "";
  const connectivity = row.note === "E-SIM" ? " eSIM" : "";
  return `${row.brand} ${family}${row.model} ${row.storage}${connectivity}`;
}

function productDescription(row: CataloguePhoneRow) {
  const name = productName(row);
  const note = row.note ? ` This catalogue variant includes ${row.note} support.` : "";

  return `${name} smartphone with ${row.storage} storage.${note} This listing is supplied as an A+ grade refurbished device unless it is expressly labelled Brand New. Available by pre-order with an estimated fulfilment time of 3 to 14 days. A 90% deposit secures the order and the remaining 10% is due on collection. Final availability and condition are confirmed before payment.`;
}

const featuredModels = new Set(["Apple 17 Pro Max", "Google 10 Pro XL", "Samsung S26 Ultra"]);

export const cataloguePhoneProducts: CataloguePhoneProduct[] = catalogueRows.map((row) => {
  const name = productName(row);
  const slug = slugify([row.brand, row.model, row.storage, row.note].filter(Boolean).join(" "));

  return {
    slug,
    name,
    category: "PHONE",
    brand: row.brand,
    description: productDescription(row),
    specifications: {
      storage: row.storage,
      availability: "Pre-order",
      condition: "A+ grade refurbished",
      shippingTime: "3-14 days",
      paymentTerms: "90% deposit, 10% on collection",
      deliveryOutsideHarare: "$5-$10 courier fee",
      catalogueRange: row.range,
      ...(row.note ? { notes: row.note } : {})
    },
    condition: "REFURBISHED",
    fulfillment: "PRE_ORDER_OVERSEAS",
    // The customer catalogue supplies retail prices only. Keep cost neutral until an admin records the actual sourcing cost.
    costPrice: row.price,
    sellingPrice: row.price,
    depositPercentage: 90,
    stockQuantity: 0,
    images: [],
    featured: featuredModels.has(`${row.brand} ${row.model}`),
    isPublished: true,
    warrantyDays: 0
  };
});

export const CATALOGUE_PHONE_COUNT = cataloguePhoneProducts.length;
