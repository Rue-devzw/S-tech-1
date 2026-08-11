import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

export const productImageUrlPrefix = "/uploads/products/";
export const maxProductImageBytes = 4 * 1024 * 1024;

const githubApiVersion = "2022-11-28";
const githubApiBaseUrl = "https://api.github.com";
const defaultGitHubImagePath = "public/uploads/products";
const safeGitHubName = /^[a-zA-Z0-9_.-]+$/;
const safeGitHubPath = /^[a-zA-Z0-9_.-]+(?:\/[a-zA-Z0-9_.-]+)*$/;

const imageTypes = {
  "image/jpeg": { extension: "jpg", signature: (bytes: Uint8Array) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff },
  "image/png": { extension: "png", signature: (bytes: Uint8Array) => bytes.slice(0, 8).every((byte, index) => byte === [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a][index]) },
  "image/webp": { extension: "webp", signature: (bytes: Uint8Array) => Buffer.from(bytes.slice(0, 4)).toString() === "RIFF" && Buffer.from(bytes.slice(8, 12)).toString() === "WEBP" }
} as const;

type GitHubConfig = {
  owner: string;
  repository: string;
  branch: string;
  directory: string;
  token?: string;
};

function productImageDirectory() {
  return path.join(process.cwd(), "public", "uploads", "products");
}

function productImageStorageMode() {
  const mode = process.env.PRODUCT_IMAGE_STORAGE?.trim().toLowerCase() || "local";
  if (mode !== "local" && mode !== "github") {
    throw new Error('PRODUCT_IMAGE_STORAGE must be either "local" or "github".');
  }
  return mode;
}

function githubConfig(requireToken = false): GitHubConfig {
  const config: GitHubConfig = {
    owner: process.env.GITHUB_REPOSITORY_OWNER?.trim() || "",
    repository: process.env.GITHUB_REPOSITORY_NAME?.trim() || "",
    branch: process.env.GITHUB_REPOSITORY_BRANCH?.trim() || "main",
    directory: (process.env.GITHUB_PRODUCT_IMAGES_PATH?.trim() || defaultGitHubImagePath).replace(/^\/+|\/+$/g, ""),
    token: process.env.GITHUB_CONTENTS_TOKEN?.trim()
  };

  if (
    !safeGitHubName.test(config.owner) ||
    !safeGitHubName.test(config.repository) ||
    !safeGitHubName.test(config.branch) ||
    !safeGitHubPath.test(config.directory) ||
    (requireToken && !config.token)
  ) {
    throw new Error("GitHub product image storage is not configured correctly.");
  }

  return config;
}

function githubContentApiUrl(config: GitHubConfig, filename: string) {
  const repositoryPath = `${config.directory}/${filename}`
    .split("/")
    .map(encodeURIComponent)
    .join("/");
  return `${githubApiBaseUrl}/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repository)}/contents/${repositoryPath}`;
}

function githubRawUrlPrefix(config: GitHubConfig) {
  return `https://raw.githubusercontent.com/${config.owner}/${config.repository}/${config.branch}/${config.directory}/`;
}

function githubHeaders(config: GitHubConfig) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${config.token}`,
    "X-GitHub-Api-Version": githubApiVersion,
    "User-Agent": "omnitech-solutions-platform"
  };
}

async function githubError(response: Response, action: string) {
  const body = (await response.json().catch(() => null)) as { message?: unknown } | null;
  const detail = typeof body?.message === "string" ? ` GitHub says: ${body.message}` : "";
  return new Error(`${action} failed (${response.status}).${detail}`);
}

function localImageFilename(url: string) {
  if (!/^\/uploads\/products\/[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(url)) return null;
  return url.slice(productImageUrlPrefix.length);
}

function githubImageFilename(url: string) {
  try {
    const prefix = githubRawUrlPrefix(githubConfig());
    if (!url.startsWith(prefix)) return null;
    const filename = url.slice(prefix.length);
    return /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(filename) ? filename : null;
  } catch {
    return null;
  }
}

export function isManagedProductImageUrl(value: string) {
  return localImageFilename(value) !== null || githubImageFilename(value) !== null;
}

async function saveLocalProductImage(filename: string, bytes: Uint8Array) {
  const directory = productImageDirectory();
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), bytes, { flag: "wx" });
  return `${productImageUrlPrefix}${filename}`;
}

async function saveGitHubProductImage(filename: string, bytes: Uint8Array) {
  const config = githubConfig(true);
  const response = await fetch(githubContentApiUrl(config, filename), {
    method: "PUT",
    headers: { ...githubHeaders(config), "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `Add product image ${filename}`,
      content: Buffer.from(bytes).toString("base64"),
      branch: config.branch
    }),
    cache: "no-store"
  });
  if (!response.ok) throw await githubError(response, "Uploading the product image to GitHub");
  return `${githubRawUrlPrefix(config)}${filename}`;
}

export async function saveProductImage(file: File) {
  const imageType = imageTypes[file.type as keyof typeof imageTypes];
  if (!imageType) throw new Error("Only JPEG, PNG and WebP product images are supported.");
  if (file.size < 12 || file.size > maxProductImageBytes) throw new Error("Product images must be between 12 bytes and 4 MB.");

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!imageType.signature(bytes)) throw new Error("The uploaded file content does not match its image type.");

  const filename = `${Date.now()}-${randomUUID()}.${imageType.extension}`;
  const url = productImageStorageMode() === "github"
    ? await saveGitHubProductImage(filename, bytes)
    : await saveLocalProductImage(filename, bytes);

  return { filename, url, contentType: file.type, size: file.size };
}

async function deleteLocalProductImage(filename: string) {
  try {
    await unlink(path.join(productImageDirectory(), filename));
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw error;
  }
}

async function deleteGitHubProductImage(filename: string) {
  const config = githubConfig(true);
  const apiUrl = githubContentApiUrl(config, filename);
  const lookup = await fetch(`${apiUrl}?ref=${encodeURIComponent(config.branch)}`, {
    headers: githubHeaders(config),
    cache: "no-store"
  });
  if (lookup.status === 404) return false;
  if (!lookup.ok) throw await githubError(lookup, "Looking up the product image on GitHub");

  const content = (await lookup.json()) as { sha?: unknown };
  if (typeof content.sha !== "string" || !content.sha) throw new Error("GitHub did not return the product image revision.");

  const removal = await fetch(apiUrl, {
    method: "DELETE",
    headers: { ...githubHeaders(config), "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `Remove product image ${filename}`,
      sha: content.sha,
      branch: config.branch
    }),
    cache: "no-store"
  });
  if (!removal.ok) throw await githubError(removal, "Deleting the product image from GitHub");
  return true;
}

export async function deleteProductImage(url: string) {
  const localFilename = localImageFilename(url);
  if (localFilename) return deleteLocalProductImage(localFilename);

  const githubFilename = githubImageFilename(url);
  if (githubFilename) return deleteGitHubProductImage(githubFilename);

  throw new Error("Invalid managed product image path.");
}
