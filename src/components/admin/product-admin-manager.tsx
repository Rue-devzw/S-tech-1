"use client";

import {
  Archive,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  ImagePlus,
  PackagePlus,
  Pencil,
  Search,
  Sparkles,
  Trash2,
  UploadCloud,
  X
} from "lucide-react";
import Link from "next/link";
import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { LoadingButtonContent } from "@/components/brand-loader";

type ProductCategory = "PHONE" | "PLAYSTATION" | "LAPTOP" | "ACCESSORY";
type ProductCondition = "BRAND_NEW" | "REFURBISHED" | "OPEN_BOX" | "SOURCED_ONLINE";
type FulfillmentType = "IN_STOCK" | "PRE_ORDER_OVERSEAS";

export type ManagedProduct = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  brand: string;
  description: string;
  specifications: unknown;
  condition: ProductCondition;
  fulfillment: FulfillmentType;
  costPrice: number;
  sellingPrice: number;
  depositPercentage: number;
  stockQuantity: number;
  images: string[];
  featured: boolean;
  isPublished: boolean;
  warrantyDays: number;
  createdAt: string;
  updatedAt: string;
};

type ProductDraft = Omit<ManagedProduct, "id" | "specifications" | "createdAt" | "updatedAt"> & {
  specificationsText: string;
};

const emptyDraft: ProductDraft = {
  slug: "",
  name: "",
  category: "PHONE",
  brand: "",
  description: "",
  specificationsText: "storage: 128GB\ncolour: Black",
  condition: "BRAND_NEW",
  fulfillment: "IN_STOCK",
  costPrice: 0,
  sellingPrice: 0,
  depositPercentage: 50,
  stockQuantity: 0,
  images: [],
  featured: false,
  isPublished: true,
  warrantyDays: 90
};

function label(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 140);
}

function specificationsToText(value: unknown) {
  if (!value || Array.isArray(value) || typeof value !== "object") return "";
  return Object.entries(value)
    .filter((entry): entry is [string, string | number] => typeof entry[1] === "string" || typeof entry[1] === "number")
    .map(([key, specification]) => `${key}: ${specification}`)
    .join("\n");
}

function parseSpecifications(value: string) {
  const specifications: Record<string, string | number> = {};
  for (const [index, rawLine] of value.split("\n").entries()) {
    const line = rawLine.trim();
    if (!line) continue;
    const separator = line.indexOf(":");
    if (separator < 1 || !line.slice(separator + 1).trim()) {
      throw new Error(`Specification line ${index + 1} must use “name: value”.`);
    }
    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();
    specifications[key] = /^\d+(?:\.\d+)?$/.test(rawValue) ? Number(rawValue) : rawValue;
  }
  return specifications;
}

function draftFromProduct(product: ManagedProduct): ProductDraft {
  return {
    slug: product.slug,
    name: product.name,
    category: product.category,
    brand: product.brand,
    description: product.description,
    specificationsText: specificationsToText(product.specifications),
    condition: product.condition === "SOURCED_ONLINE" ? "REFURBISHED" : product.condition,
    fulfillment: product.fulfillment,
    costPrice: product.costPrice,
    sellingPrice: product.sellingPrice,
    depositPercentage: product.depositPercentage,
    stockQuantity: product.stockQuantity,
    images: product.images,
    featured: product.featured,
    isPublished: product.isPublished,
    warrantyDays: product.warrantyDays
  };
}

function productPayload(draft: ProductDraft) {
  return {
    slug: draft.slug,
    name: draft.name,
    category: draft.category,
    brand: draft.brand,
    description: draft.description,
    specifications: parseSpecifications(draft.specificationsText),
    condition: draft.condition,
    fulfillment: draft.fulfillment,
    costPrice: draft.costPrice,
    sellingPrice: draft.sellingPrice,
    depositPercentage: draft.depositPercentage,
    stockQuantity: draft.stockQuantity,
    images: draft.images,
    featured: draft.featured,
    isPublished: draft.isPublished,
    warrantyDays: draft.warrantyDays
  };
}

function sortProducts(products: ManagedProduct[]) {
  return [...products].sort((a, b) => Number(b.featured) - Number(a.featured) || b.updatedAt.localeCompare(a.updatedAt));
}

async function responseError(response: Response, fallback: string) {
  const payload = await response.json().catch(() => ({}));
  return typeof payload.error === "string" ? payload.error : fallback;
}

export function ProductAdminManager({ initialProducts }: { initialProducts: ManagedProduct[] }) {
  const [products, setProducts] = useState(() => sortProducts(initialProducts));
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [temporaryImages, setTemporaryImages] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return products;
    return products.filter((product) =>
      [product.name, product.brand, product.slug, product.category].some((value) => value.toLowerCase().includes(needle))
    );
  }, [products, query]);

  const publishedCount = products.filter((product) => product.isPublished).length;
  const lowStockCount = products.filter((product) => product.fulfillment === "IN_STOCK" && product.stockQuantity <= 2).length;

  function flash(message: string, tone: "success" | "error" = "success") {
    setNotice({ message, tone });
    window.setTimeout(() => setNotice(null), 6000);
  }

  async function deleteImageFile(url: string) {
    await fetch("/api/admin/products/images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    }).catch(() => undefined);
  }

  async function resetEditor(cleanTemporary = true) {
    if (cleanTemporary) {
      for (const image of temporaryImages) await deleteImageFile(image);
    }
    setTemporaryImages([]);
    setEditingId(null);
    setDraft(emptyDraft);
  }

  async function editProduct(product: ManagedProduct) {
    await resetEditor();
    setEditingId(product.id);
    setDraft(draftFromProduct(product));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImages(files: FileList | null) {
    if (!files?.length) return;
    if (draft.images.length + files.length > 8) {
      flash("A product can have up to 8 images.", "error");
      return;
    }

    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.set("file", file);
        const response = await fetch("/api/admin/products/images", { method: "POST", body });
        if (!response.ok) throw new Error(await responseError(response, `Could not upload ${file.name}.`));
        const payload = await response.json();
        uploaded.push(payload.image.url);
      }
      setDraft((current) => ({ ...current, images: [...current.images, ...uploaded] }));
      setTemporaryImages((current) => [...current, ...uploaded]);
      flash(`${uploaded.length} product image${uploaded.length === 1 ? "" : "s"} uploaded.`);
    } catch (error) {
      for (const image of uploaded) await deleteImageFile(image);
      flash(error instanceof Error ? error.message : "The images could not be uploaded.", "error");
    } finally {
      setUploading(false);
    }
  }

  async function removeImage(url: string) {
    setDraft((current) => ({ ...current, images: current.images.filter((image) => image !== url) }));
    if (temporaryImages.includes(url)) {
      await deleteImageFile(url);
      setTemporaryImages((current) => current.filter((image) => image !== url));
    }
  }

  function moveImage(index: number, direction: -1 | 1) {
    setDraft((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.images.length) return current;
      const images = [...current.images];
      [images[index], images[target]] = [images[target], images[index]];
      return { ...current, images };
    });
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = productPayload(draft);
      const response = await fetch(editingId ? `/api/admin/products/${editingId}` : "/api/admin/products", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(await responseError(response, "The product could not be saved."));

      const { product } = await response.json();
      setProducts((current) => sortProducts(editingId ? current.map((item) => item.id === product.id ? product : item) : [product, ...current]));
      setTemporaryImages([]);
      flash(editingId ? "Product changes are live in the catalogue." : "Product created and added to the catalogue.");
      setEditingId(product.id);
      setDraft(draftFromProduct(product));
    } catch (error) {
      flash(error instanceof Error ? error.message : "The product could not be saved.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(product: ManagedProduct) {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    setDeletingId(product.id);
    const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    setDeletingId(null);
    if (!response.ok) {
      flash(await responseError(response, "The product could not be deleted."), "error");
      return;
    }
    setProducts((current) => current.filter((item) => item.id !== product.id));
    if (editingId === product.id) await resetEditor(false);
    flash("Product and its unused local images were deleted.");
  }

  function syncAriaInvalid(event: FormEvent<HTMLFormElement>) {
    const control = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    if (!control.matches("input, textarea, select")) return;
    if (control.checkValidity()) control.removeAttribute("aria-invalid");
  }

  return (
    <main className="product-manager mx-auto max-w-7xl px-4 py-8">
      <header className="rounded-lg bg-brand-band p-6 text-white shadow-glow">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-100">Store administration</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Product catalogue</h1>
            <p className="mt-2 max-w-3xl text-white/80">Control every public product detail, stock level, price and locally stored product photograph.</p>
          </div>
          <Link href="/" target="_blank" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/30 bg-white/12 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20">
            <Eye size={17} aria-hidden="true" /> View storefront
          </Link>
        </div>
      </header>

      {notice ? (
        <div role="status" aria-live="polite" className={`mt-5 flex items-center gap-2 rounded-lg border p-4 text-sm font-semibold ${notice.tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}>
          {notice.tone === "success" ? <CheckCircle2 size={18} aria-hidden="true" /> : <Archive size={18} aria-hidden="true" />}
          {notice.message}
        </div>
      ) : null}

      <section className="mt-6 grid gap-4 sm:grid-cols-3" aria-label="Catalogue summary">
        <Metric icon={PackagePlus} label="Total products" value={products.length} />
        <Metric icon={Eye} label="Published" value={publishedCount} />
        <Metric icon={Archive} label="Low stock" value={lowStockCount} />
      </section>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <section className="rounded-lg border border-line bg-white p-5 shadow-lift">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal">Live inventory</p>
              <h2 className="mt-1 text-xl font-bold text-ink">All products</h2>
            </div>
            <button type="button" onClick={() => void resetEditor()} className="inline-flex min-h-11 items-center gap-2 bg-copper px-4 py-2 text-sm font-semibold text-ink">
              <PackagePlus size={17} aria-hidden="true" /> New product
            </button>
          </div>

          <label className="relative mt-4">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-10" type="search" placeholder="Search name, brand, slug or category" />
          </label>

          <div className="mt-4 grid max-h-[72rem] gap-3 overflow-y-auto pr-1">
            {filteredProducts.length ? filteredProducts.map((product) => (
              <article key={product.id} className={`rounded-lg border p-3 transition ${editingId === product.id ? "border-teal bg-teal/5 shadow-sm" : "border-line bg-cloud/60"}`}>
                <div className="flex gap-3">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-slate-100">
                    {product.images[0] ? <img src={product.images[0]} alt="" width={192} height={192} loading="lazy" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-slate-400"><ImagePlus aria-hidden="true" /></div>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-teal">{label(product.category)}</p>
                        <h3 className="mt-1 line-clamp-2 font-bold text-ink">{product.name}</h3>
                      </div>
                      {product.featured ? <Sparkles className="shrink-0 text-copper" size={18} aria-label="Featured" /> : null}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                      <span className="rounded-full bg-white px-2 py-1 text-ink">${product.sellingPrice.toLocaleString()}</span>
                      <span className={`rounded-full px-2 py-1 ${product.isPublished ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>{product.isPublished ? "Published" : "Hidden"}</span>
                      <span className="rounded-full bg-white px-2 py-1 text-slate-600">Stock {product.stockQuantity}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => void editProduct(product)} className="inline-flex min-h-11 items-center justify-center gap-2 border border-line bg-white px-3 py-2 text-sm font-semibold text-ink">
                    <Pencil size={16} aria-hidden="true" /> Edit
                  </button>
                  <button type="button" disabled={deletingId === product.id} onClick={() => void deleteProduct(product)} className="inline-flex min-h-11 items-center justify-center gap-2 border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 disabled:opacity-60">
                    <Trash2 size={16} aria-hidden="true" /> {deletingId === product.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </article>
            )) : <p className="rounded-lg border border-dashed border-line p-6 text-center text-sm text-slate-500">No products match this search.</p>}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-lift xl:sticky xl:top-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal">{editingId ? "Editing product" : "New listing"}</p>
              <h2 className="mt-1 text-xl font-bold text-ink">{editingId ? draft.name || "Product details" : "Add a product"}</h2>
            </div>
            {editingId ? <button type="button" onClick={() => void resetEditor()} className="inline-flex min-h-11 items-center gap-2 border border-line bg-white px-3 py-2 text-sm font-semibold text-slate-700"><X size={17} aria-hidden="true" /> Cancel edit</button> : null}
          </div>

          <form
            className="admin-product-form mt-5"
            onSubmit={saveProduct}
            onInvalid={(event) => (event.target as HTMLInputElement).setAttribute("aria-invalid", "true")}
            onInput={syncAriaInvalid}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <RequiredField label="Product name" id="product-name">
                <input id="product-name" required minLength={3} aria-errormessage="product-name-error" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value, slug: editingId || current.slug ? current.slug : slugify(event.target.value) }))} />
              </RequiredField>
              <RequiredField label="URL slug" id="product-slug">
                <input id="product-slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" aria-errormessage="product-slug-error" value={draft.slug} onChange={(event) => setDraft((current) => ({ ...current, slug: slugify(event.target.value) }))} />
              </RequiredField>
              <RequiredField label="Brand" id="product-brand">
                <input id="product-brand" required minLength={2} aria-errormessage="product-brand-error" value={draft.brand} onChange={(event) => setDraft((current) => ({ ...current, brand: event.target.value }))} />
              </RequiredField>
              <label>Category<select value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value as ProductCategory }))}>{["PHONE", "PLAYSTATION", "LAPTOP", "ACCESSORY"].map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></label>
            </div>

            <RequiredField label="Customer-facing description" id="product-description" className="mt-4">
              <textarea id="product-description" required minLength={12} rows={4} aria-errormessage="product-description-error" value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} placeholder="Describe the product, its main benefit and ideal customer." />
            </RequiredField>

            <label className="mt-4">Specifications <span className="text-xs font-normal text-slate-500">One per line using name: value</span><textarea rows={5} value={draft.specificationsText} onChange={(event) => setDraft((current) => ({ ...current, specificationsText: event.target.value }))} placeholder="processor: Intel Core i7&#10;memory: 16GB&#10;storage: 512GB SSD" /></label>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label>Condition<select value={draft.condition} onChange={(event) => setDraft((current) => ({ ...current, condition: event.target.value as ProductCondition }))}><option value="BRAND_NEW">Brand New</option><option value="REFURBISHED">A+ Grade Refurbished</option><option value="OPEN_BOX">Open Box</option></select></label>
              <label>Fulfilment<select value={draft.fulfillment} onChange={(event) => setDraft((current) => ({ ...current, fulfillment: event.target.value as FulfillmentType }))}>{["IN_STOCK", "PRE_ORDER_OVERSEAS"].map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></label>
              <label>Stock quantity<input type="number" min="0" step="1" value={draft.stockQuantity} onChange={(event) => setDraft((current) => ({ ...current, stockQuantity: Number(event.target.value) }))} /></label>
              <label>Cost price (USD)<input type="number" min="0" step="0.01" value={draft.costPrice} onChange={(event) => setDraft((current) => ({ ...current, costPrice: Number(event.target.value) }))} /></label>
              <RequiredField label="Selling price (USD)" id="selling-price">
                <input id="selling-price" required type="number" min="0.01" step="0.01" aria-errormessage="selling-price-error" value={draft.sellingPrice} onChange={(event) => setDraft((current) => ({ ...current, sellingPrice: Number(event.target.value) }))} />
              </RequiredField>
              <label>Deposit percentage<input type="number" min="0" max="100" step="1" value={draft.depositPercentage} onChange={(event) => setDraft((current) => ({ ...current, depositPercentage: Number(event.target.value) }))} /></label>
              <label>Warranty days<input type="number" min="0" max="3650" step="1" value={draft.warrantyDays} onChange={(event) => setDraft((current) => ({ ...current, warrantyDays: Number(event.target.value) }))} /></label>
            </div>

            <fieldset className="mt-5 rounded-lg border border-line p-4">
              <legend className="px-2 text-sm font-bold text-ink">Product pictures</legend>
              <div className="rounded-lg border border-dashed border-teal/40 bg-teal/5 p-4 text-center">
                <UploadCloud className="mx-auto text-teal" size={28} aria-hidden="true" />
                <label htmlFor="product-images" className="mt-2 block cursor-pointer font-bold text-ink">Upload product images</label>
                <p className="mt-1 text-xs text-slate-500">JPEG, PNG or WebP · maximum 4 MB each · up to 8 images</p>
                <input id="product-images" className="mt-3" type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={uploading || draft.images.length >= 8} onChange={(event) => { void uploadImages(event.target.files); event.target.value = ""; }} />
                {uploading ? <p role="status" className="mt-2 text-sm font-semibold text-teal">Uploading and validating images…</p> : null}
              </div>
              {draft.images.length ? (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {draft.images.map((url, index) => (
                    <figure key={url} className="relative overflow-hidden rounded-lg border border-line bg-cloud">
                      <img src={url} alt={`${draft.name || "Product"} image ${index + 1}`} width={360} height={270} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                      <figcaption className="p-2 text-xs font-semibold text-slate-600">
                        <span>{index === 0 ? "Primary image" : `Image ${index + 1}`}</span>
                        <div className="mt-2 flex gap-1">
                          <button type="button" disabled={index === 0} onClick={() => moveImage(index, -1)} className="grid min-h-11 min-w-11 place-items-center border border-line bg-white text-ink disabled:opacity-35" aria-label={`Move image ${index + 1} earlier`}><ArrowLeft size={16} aria-hidden="true" /></button>
                          <button type="button" disabled={index === draft.images.length - 1} onClick={() => moveImage(index, 1)} className="grid min-h-11 min-w-11 place-items-center border border-line bg-white text-ink disabled:opacity-35" aria-label={`Move image ${index + 1} later`}><ArrowRight size={16} aria-hidden="true" /></button>
                          <button type="button" onClick={() => void removeImage(url)} className="grid min-h-11 min-w-11 place-items-center border border-red-200 bg-red-50 text-red-700" aria-label={`Remove image ${index + 1}`}><Trash2 size={16} aria-hidden="true" /></button>
                        </div>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ) : <p className="mt-3 text-sm text-slate-500">No pictures yet. The storefront will show an image placeholder.</p>}
            </fieldset>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <label className="flex min-h-12 grid-cols-[auto_1fr] items-center gap-3 rounded-lg border border-line bg-cloud px-4"><input className="size-5 w-5" type="checkbox" checked={draft.isPublished} onChange={(event) => setDraft((current) => ({ ...current, isPublished: event.target.checked }))} />{draft.isPublished ? <Eye size={18} aria-hidden="true" /> : <EyeOff size={18} aria-hidden="true" />}Published</label>
              <label className="flex min-h-12 grid-cols-[auto_1fr] items-center gap-3 rounded-lg border border-line bg-cloud px-4"><input className="size-5 w-5" type="checkbox" checked={draft.featured} onChange={(event) => setDraft((current) => ({ ...current, featured: event.target.checked }))} /><Sparkles size={18} aria-hidden="true" />Featured</label>
            </div>

            <button disabled={saving || uploading} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-copper px-5 py-3 text-sm font-bold text-ink disabled:opacity-60">
              <LoadingButtonContent loading={saving} loadingLabel="Saving product">
                {editingId ? "Save product changes" : "Create product"}
              </LoadingButtonContent>
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

function RequiredField({ label: text, id, className = "", children }: { label: string; id: string; className?: string; children: ReactNode }) {
  return (
    <label className={`required-field ${className}`} htmlFor={id}>
      <span>{text} <span aria-hidden="true" className="text-red-600">*</span></span>
      {children}
      <span id={`${id}-error`} className="field-error"><Archive size={14} aria-hidden="true" /> Check this required field.</span>
    </label>
  );
}

function Metric({ icon: Icon, label: text, value }: { icon: typeof PackagePlus; label: string; value: number }) {
  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <Icon className="text-teal" size={22} aria-hidden="true" />
      <p className="mt-3 text-sm font-semibold text-slate-500">{text}</p>
      <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
    </article>
  );
}
