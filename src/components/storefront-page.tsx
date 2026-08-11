import type { Prisma, Product } from "@prisma/client";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  Gamepad2,
  Headphones,
  Laptop,
  MessageCircle,
  Search,
  ShoppingBag,
  Smartphone,
  Truck
} from "lucide-react";
import Link from "next/link";
import { PageShell } from "@/components/site-shell";
import { cataloguePhoneProducts } from "@/lib/catalogue-products";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import { hasDatabaseUrl } from "@/server/env";
import { getPublishedProducts } from "@/server/services/shop";
import styles from "./storefront-page.module.css";

type StorefrontProduct = Pick<
  Product,
  | "id"
  | "slug"
  | "name"
  | "brand"
  | "description"
  | "specifications"
  | "category"
  | "condition"
  | "fulfillment"
  | "sellingPrice"
  | "depositPercentage"
  | "stockQuantity"
  | "warrantyDays"
  | "images"
  | "featured"
>;

const fallbackProducts: StorefrontProduct[] = [
  ...cataloguePhoneProducts.map((product) => ({ ...product, id: `catalogue-${product.slug}` })),
  {
    id: "preview-ps5",
    slug: "playstation-5-slim",
    name: "Sony PlayStation 5 Slim Disc Edition 1TB",
    brand: "Sony",
    description: "Bring home fast, immersive game nights with a compact disc-edition console, 1TB SSD storage and support for 4K gaming displays.",
    specifications: { edition: "Disc", storage: "1TB SSD", video: "Up to 4K 120Hz" },
    category: "PLAYSTATION",
    condition: "BRAND_NEW",
    fulfillment: "IN_STOCK",
    sellingPrice: 749,
    depositPercentage: 50,
    stockQuantity: 3,
    warrantyDays: 180,
    featured: true,
    images: ["/uploads/products/playstation-5-slim.webp"]
  },
  {
    id: "preview-laptop",
    slug: "dell-latitude-7420",
    name: "Dell Latitude 7420 Core i7 16GB/512GB",
    brand: "Dell",
    description: "Stay productive across office work, study and travel with a business-class Core i7 laptop, 16GB memory and fast 512GB SSD storage.",
    specifications: { processor: "Intel Core i7", memory: "16GB", storage: "512GB SSD", display: "14-inch FHD" },
    category: "LAPTOP",
    condition: "REFURBISHED",
    fulfillment: "IN_STOCK",
    sellingPrice: 625,
    depositPercentage: 50,
    stockQuantity: 5,
    warrantyDays: 90,
    featured: true,
    images: ["/uploads/products/dell-latitude-7420.webp"]
  },
  {
    id: "preview-headphones",
    slug: "sony-wh-1000xm5",
    name: "Sony WH-1000XM5 Wireless Headphones",
    brand: "Sony",
    description: "Focus on music, calls and deep work with comfortable wireless listening and active noise cancellation.",
    specifications: { connection: "Bluetooth", feature: "Noise cancelling", style: "Over-ear" },
    category: "ACCESSORY",
    condition: "OPEN_BOX",
    fulfillment: "PRE_ORDER_OVERSEAS",
    sellingPrice: 329,
    depositPercentage: 50,
    stockQuantity: 0,
    warrantyDays: 90,
    featured: false,
    images: ["/uploads/products/sony-headphones.webp"]
  }
];

const categoryDetails = [
  { label: "Phones", query: "phone", category: "PHONE", icon: Smartphone, copy: "Flagships and everyday upgrades" },
  { label: "Laptops", query: "laptop", category: "LAPTOP", icon: Laptop, copy: "Work, study and creator machines" },
  { label: "Gaming", query: "playstation", category: "PLAYSTATION", icon: Gamepad2, copy: "Consoles, controllers and play" },
  { label: "Accessories", query: "accessory", category: "ACCESSORY", icon: Headphones, copy: "Audio, power and useful extras" }
] as const;

function humanize(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function productConditionLabel(condition: StorefrontProduct["condition"]) {
  if (condition === "BRAND_NEW") return "Brand New";
  if (condition === "REFURBISHED" || condition === "SOURCED_ONLINE") return "A+ Grade Renewed";
  return humanize(condition);
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function productTitle(product: StorefrontProduct) {
  const alreadyBranded = product.name.toLowerCase().startsWith(product.brand.toLowerCase());
  return alreadyBranded ? product.name : `${product.brand} ${product.name}`;
}

function specificationEntries(value: Prisma.JsonValue) {
  if (!value || Array.isArray(value) || typeof value !== "object") return [];
  return Object.entries(value)
    .filter((entry): entry is [string, string | number] => typeof entry[1] === "string" || typeof entry[1] === "number")
    .slice(0, 2);
}

async function getStorefrontProducts(): Promise<StorefrontProduct[]> {
  if (!hasDatabaseUrl()) return fallbackProducts;

  try {
    const products = await getPublishedProducts();
    if (!products.length) return fallbackProducts;

    const databaseSlugs = new Set(products.map((product) => product.slug));
    return [...products, ...fallbackProducts.filter((product) => !databaseSlugs.has(product.slug))];
  } catch {
    return fallbackProducts;
  }
}

function matchesSearch(product: StorefrontProduct, query: string) {
  const haystack = [
    product.name,
    product.brand,
    product.description,
    humanize(product.category),
    humanize(product.condition),
    ...specificationEntries(product.specifications).flatMap(([key, value]) => [key, String(value)])
  ].join(" ").toLowerCase();

  return haystack.includes(query.toLowerCase());
}

function ProductCard({ product }: { product: StorefrontProduct }) {
  const isInStock = product.fulfillment === "IN_STOCK";
  const title = productTitle(product);
  const specs = specificationEntries(product.specifications);
  const onlineTerms = isInStock
    ? ""
    : ` I understand the ${product.depositPercentage}% deposit, ${100 - product.depositPercentage}% balance on collection and 3 to 14 day shipping estimate.`;
  const message = encodeURIComponent(`Hi OmniTech, I want to order the ${title} (${productConditionLabel(product.condition)}). Please confirm availability, device condition and the final price.${onlineTerms}`);

  return (
    <article className={styles.productCard}>
      <div className={styles.productMedia}>
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={title}
            width={900}
            height={675}
            loading="lazy"
            fetchPriority="low"
            className={styles.productImage}
          />
        ) : (
          <div className={styles.productImageFallback}><ShoppingBag aria-hidden="true" />Image coming soon</div>
        )}
        <span className={styles.categoryBadge}>{humanize(product.category)}</span>
        <span className={styles.conditionBadge}>{productConditionLabel(product.condition)}</span>
      </div>

      <div className={styles.productBody}>
        <p className={isInStock ? styles.inStock : styles.preorder}>
          <span aria-hidden="true" />{isInStock ? "In stock" : "Pre-order · estimated 3-14 days"}
        </p>
        <h3 className={styles.productTitle}>{title}</h3>
        {specs.length > 0 && (
          <ul className={styles.productSpecs} aria-label={`${title} highlights`}>
            {specs.map(([label, value]) => <li key={label}>{value}</li>)}
          </ul>
        )}
        {product.warrantyDays > 0 ? (
          <div className={styles.assuranceLine}>
            <BadgeCheck aria-hidden="true" size={15} />{product.warrantyDays}-day local warranty
          </div>
        ) : !isInStock ? (
          <div className={styles.assuranceLine}>
            <Clock3 aria-hidden="true" size={15} />{product.depositPercentage}% deposit · {100 - product.depositPercentage}% on collection
          </div>
        ) : null}
        <div className={styles.productFooter}>
          <div>
            <span className={styles.priceLabel}>USD</span>
            <p className={styles.price}>{formatPrice(product.sellingPrice)}</p>
          </div>
          {!isInStock && <span className={styles.deposit}>{product.depositPercentage}% deposit</span>}
        </div>
        <a
          href={`https://wa.me/263718704505?text=${message}`}
          target="_blank"
          rel="noreferrer"
          className={styles.productCta}
          aria-label={`Order ${title} via WhatsApp`}
        >
          Order now <ArrowRight aria-hidden="true" size={16} />
        </a>
      </div>
    </article>
  );
}

function PromoProduct({ product, compact = false }: { product?: StorefrontProduct; compact?: boolean }) {
  if (!product) return null;
  const title = productTitle(product);

  return (
    <div className={compact ? styles.promoProductCompact : styles.promoProduct} aria-hidden="true">
      {product.images[0] ? (
        <img
          src={product.images[0]}
          alt=""
          width={900}
          height={675}
          loading={compact ? "lazy" : "eager"}
          fetchPriority={compact ? "low" : "high"}
        />
      ) : <ShoppingBag />}
      {!compact && <span><small>Featured</small><strong>{title}</strong></span>}
    </div>
  );
}

function StoreSearch({ query }: { query: string }) {
  return (
    <form className={styles.searchForm} action="/shop" method="get" role="search">
      <label className={styles.srOnly} htmlFor="store-search">Search the OmniTech store</label>
      <Search aria-hidden="true" size={18} />
      <input id="store-search" name="query" type="search" defaultValue={query} placeholder="Search products and brands" />
      <button type="submit">Search</button>
    </form>
  );
}

export async function StorefrontPage({ route = "home", query = "" }: { route?: "home" | "shop"; query?: string }) {
  const allProducts = await getStorefrontProducts();
  const isHome = route === "home";
  const normalizedQuery = query.trim().slice(0, 80);
  const products = normalizedQuery
    ? allProducts.filter((product) => matchesSearch(product, normalizedQuery))
    : isHome
      ? allProducts.slice(0, 12)
      : allProducts;
  const heroProduct = allProducts.find((product) => product.featured) ?? allProducts[0];
  const supportingProducts = allProducts.filter((product) => product.id !== heroProduct?.id).slice(0, 2);
  const brands = [...new Set(allProducts.map((product) => product.brand))];
  const breadcrumbs = isHome
    ? [{ name: "Home", path: "/" }]
    : [{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }];
  const productListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "OmniTech Solutions technology store",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: productTitle(product),
        description: product.description,
        image: product.images[0],
        brand: { "@type": "Brand", name: product.brand },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: product.sellingPrice,
          availability: product.fulfillment === "IN_STOCK" ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
          url: absoluteUrl(isHome ? "/#products" : "/shop#products")
        }
      }
    }))
  };

  return (
    <PageShell>
      {[breadcrumbJsonLd(breadcrumbs), productListJsonLd].map((document, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(document) }} />
      ))}

      <div className={styles.storefront}>
        <aside className={styles.utilityBar} aria-label="Store benefits">
          <div>
            <span><Clock3 aria-hidden="true" size={15} />Pre-orders estimated in 3-14 days</span>
            <span><BadgeCheck aria-hidden="true" size={15} />A+ renewed unless labelled Brand New</span>
            <span><BadgeCheck aria-hidden="true" size={15} />90% deposit · 10% on collection</span>
          </div>
        </aside>

        <div className={styles.shopToolbar}>
          <StoreSearch query={normalizedQuery} />
          <a className={styles.toolbarHelp} href="https://wa.me/263718704505?text=Hi%20OmniTech%2C%20please%20help%20me%20choose%20the%20right%20device." target="_blank" rel="noreferrer">
            <MessageCircle aria-hidden="true" size={19} />
            <span><small>Need help?</small><strong>Ask on WhatsApp</strong></span>
          </a>
        </div>

        <nav className={styles.categoryNav} aria-label="Shop categories">
          <a href="#categories" className={styles.allCategories}><ShoppingBag aria-hidden="true" size={17} />All categories</a>
          {categoryDetails.map((category) => (
            <Link key={category.label} href={`/shop?query=${category.query}#products`}>{category.label}</Link>
          ))}
          <Link href="/promotions" className={styles.navOffer}>Offers</Link>
        </nav>

        <section className={styles.hero} aria-labelledby="storefront-title">
          <div className={styles.heroPrimary}>
            <div className={styles.heroCopy}>
              <p className={styles.heroKicker}>Local support. Global choice.</p>
              <h1 id="storefront-title">{isHome ? "Top tech, made easy." : "OmniTech Import Store"}</h1>
              <p>Shop catalogue phones with clear USD pricing, formal pre-order terms and device condition stated before you order.</p>
              <a href="#products" className={styles.primaryCta}>Shop now <ArrowRight aria-hidden="true" size={18} /></a>
            </div>
            <PromoProduct product={heroProduct} />
          </div>
          <div className={styles.heroSecondary}>
            <div>
              <span>Gaming hub</span>
              <strong>Bring the next level home.</strong>
              <a href="/shop?query=playstation#products">Shop gaming <ChevronRight aria-hidden="true" size={15} /></a>
            </div>
            <PromoProduct product={supportingProducts[0]} compact />
          </div>
          <div className={styles.heroTertiary}>
            <div>
              <span>Everyday essentials</span>
              <strong>Find the right fit faster.</strong>
              <a href="/shop?query=accessory#products">Explore accessories <ChevronRight aria-hidden="true" size={15} /></a>
            </div>
            <PromoProduct product={supportingProducts[1]} compact />
          </div>
        </section>

        <section id="categories" className={styles.categorySection} aria-labelledby="shop-categories-title">
          <div className={styles.sectionHeading}>
            <div><p>Browse quickly</p><h2 id="shop-categories-title">Popular categories</h2></div>
            <a href="#products">View all products <ArrowRight aria-hidden="true" size={16} /></a>
          </div>
          <div className={styles.categoryGrid}>
            {categoryDetails.map(({ label, query: categoryQuery, category, icon: Icon, copy }) => {
              const count = allProducts.filter((product) => product.category === category).length;
              return (
                <Link key={label} href={`/shop?query=${categoryQuery}#products`} className={styles.categoryCard}>
                  <span><Icon aria-hidden="true" size={28} /></span>
                  <strong>{label}</strong>
                  <small>{count || "More"} {count === 1 ? "product" : "products"}</small>
                  <p>{copy}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <aside className={styles.conditionNotice} aria-labelledby="device-condition-disclaimer">
          <CircleAlert aria-hidden="true" size={26} />
          <div>
            <strong id="device-condition-disclaimer">Device condition disclosure</strong>
            <p>Most devices are supplied as A+ grade renewed unless the product is expressly stated and labelled <b>Brand New</b>. Please check the condition badge on each listing before placing an order.</p>
          </div>
        </aside>

        <aside className={styles.policyNotice} aria-label="Pre-order terms">
          <div><Clock3 aria-hidden="true" size={23} /><span><strong>Pre-order · 3-14 days</strong>Estimated fulfilment and shipping time</span></div>
          <div><BadgeCheck aria-hidden="true" size={23} /><span><strong>90% deposit</strong>Pay the remaining 10% when you collect</span></div>
          <div><Truck aria-hidden="true" size={23} /><span><strong>Delivery outside Harare</strong>$5-$10, depending on the courier charge</span></div>
        </aside>

        <section id="products" className={styles.catalogueSection} aria-labelledby="catalogue-title">
          <div className={styles.sectionHeading}>
            <div>
              <p>{normalizedQuery ? "Search results" : "Fresh picks"}</p>
              <h2 id="catalogue-title">{normalizedQuery ? `Results for “${normalizedQuery}”` : "Trending now"}</h2>
            </div>
            {!normalizedQuery && <span className={styles.stockNote}><Check aria-hidden="true" size={16} />Prices subject to availability</span>}
          </div>
          {products.length ? (
            <div className={styles.productGrid}>
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Search aria-hidden="true" size={28} />
              <h3>No matching products yet</h3>
              <p>Try a brand, category or device type—or ask us to source exactly what you need.</p>
              <Link href="/shop#products">Clear search</Link>
            </div>
          )}
        </section>

        <section className={styles.brandSection} aria-labelledby="brand-title">
          <div className={styles.sectionHeading}>
            <div><p>Trusted choices</p><h2 id="brand-title">Shop by brand</h2></div>
          </div>
          <div className={styles.brandGrid}>
            {brands.map((productBrand) => <Link key={productBrand} href={`/shop?query=${encodeURIComponent(productBrand)}#products`}>{productBrand}</Link>)}
            <span>OmniTech picks</span>
          </div>
        </section>

        <section className={styles.whatsappBanner} aria-labelledby="whatsapp-title">
          <MessageCircle aria-hidden="true" size={36} />
          <div>
            <p>Personal shopping help</p>
            <h2 id="whatsapp-title">Not sure which device is right?</h2>
            <span>Tell us your budget and what you need to do. We’ll help you compare the right options.</span>
          </div>
          <a href="https://wa.me/263718704505?text=Hi%20OmniTech%2C%20please%20help%20me%20choose%20a%20device." target="_blank" rel="noreferrer">Chat with us</a>
        </section>

        <section className={styles.orderSection} aria-labelledby="order-process-title">
          <div className={styles.sectionHeadingCentered}>
            <p>Simple and transparent</p>
            <h2 id="order-process-title">How ordering works</h2>
          </div>
          <ol className={styles.orderSteps}>
            <li><span><Search aria-hidden="true" size={23} /></span><div><strong>Browse & ask</strong><p>Choose a listed product or ask us to source another specification.</p></div></li>
            <li><span><BadgeCheck aria-hidden="true" size={23} /></span><div><strong>Confirm & pay 90%</strong><p>We verify the exact model, condition and price before the deposit is paid.</p></div></li>
            <li><span><Truck aria-hidden="true" size={23} /></span><div><strong>Collect or deliver</strong><p>Pay the final 10% on collection. Outside-Harare delivery adds the courier's $5-$10 charge.</p></div></li>
          </ol>
        </section>

        <section className={styles.supportCta}>
          <div>
            <p>More than a store</p>
            <h2>Get setup, data transfer and technical support too.</h2>
            <span>Your new device can arrive ready for the way you work, study or play.</span>
          </div>
          <div>
            <Link href="/request-service">Request setup <ArrowRight aria-hidden="true" size={17} /></Link>
            <a href="https://wa.me/263718704505?text=Hi%20OmniTech%2C%20I%20need%20help%20buying%20and%20setting%20up%20a%20device." target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" size={17} />Talk to a specialist</a>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
