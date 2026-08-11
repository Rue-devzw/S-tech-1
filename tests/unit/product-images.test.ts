import assert from "node:assert/strict";
import test from "node:test";
import { deleteProductImage, isManagedProductImageUrl, saveProductImage } from "../../src/server/product-images";

const githubEnvironment = {
  PRODUCT_IMAGE_STORAGE: "github",
  GITHUB_REPOSITORY_OWNER: "StriveRue",
  GITHUB_REPOSITORY_NAME: "S-tech",
  GITHUB_REPOSITORY_BRANCH: "product-media",
  GITHUB_PRODUCT_IMAGES_PATH: "public/uploads/products",
  GITHUB_CONTENTS_TOKEN: "test-token"
} as const;

function configureGitHubStorage() {
  const previous = Object.fromEntries(Object.keys(githubEnvironment).map((key) => [key, process.env[key]]));
  Object.assign(process.env, githubEnvironment);
  return () => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  };
}

test("managed product image URLs are restricted to the configured GitHub repository", () => {
  const restore = configureGitHubStorage();
  try {
    assert.equal(isManagedProductImageUrl("/uploads/products/seeded.webp"), true);
    assert.equal(
      isManagedProductImageUrl("https://raw.githubusercontent.com/StriveRue/S-tech/product-media/public/uploads/products/phone.webp"),
      true
    );
    assert.equal(
      isManagedProductImageUrl("https://raw.githubusercontent.com/another/repository/product-media/public/uploads/products/phone.webp"),
      false
    );
  } finally {
    restore();
  }
});

test("GitHub storage uploads validated images through the Contents API", async () => {
  const restore = configureGitHubStorage();
  const originalFetch = globalThis.fetch;
  let request: { url: string; init?: RequestInit } | undefined;
  globalThis.fetch = async (input, init) => {
    request = { url: String(input), init };
    return Response.json({ content: { sha: "new-revision" } }, { status: 201 });
  };

  try {
    const pngHeader = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
    const result = await saveProductImage(new File([pngHeader], "phone.png", { type: "image/png" }));

    assert.match(result.url, /^https:\/\/raw\.githubusercontent\.com\/StriveRue\/S-tech\/product-media\/public\/uploads\/products\/.+\.png$/);
    assert.equal(request?.init?.method, "PUT");
    assert.match(request?.url ?? "", /^https:\/\/api\.github\.com\/repos\/StriveRue\/S-tech\/contents\/public\/uploads\/products\//);
    const body = JSON.parse(String(request?.init?.body));
    assert.equal(body.branch, "product-media");
    assert.equal(body.content, Buffer.from(pngHeader).toString("base64"));
    assert.equal((request?.init?.headers as Record<string, string>).Authorization, "Bearer test-token");
  } finally {
    globalThis.fetch = originalFetch;
    restore();
  }
});

test("GitHub storage looks up the revision before deleting an image", async () => {
  const restore = configureGitHubStorage();
  const originalFetch = globalThis.fetch;
  const methods: string[] = [];
  globalThis.fetch = async (_input, init) => {
    methods.push(init?.method ?? "GET");
    if (!init?.method) return Response.json({ sha: "current-revision" });
    return Response.json({ commit: { sha: "delete-revision" } });
  };

  try {
    const removed = await deleteProductImage(
      "https://raw.githubusercontent.com/StriveRue/S-tech/product-media/public/uploads/products/phone.webp"
    );
    assert.equal(removed, true);
    assert.deepEqual(methods, ["GET", "DELETE"]);
  } finally {
    globalThis.fetch = originalFetch;
    restore();
  }
});
