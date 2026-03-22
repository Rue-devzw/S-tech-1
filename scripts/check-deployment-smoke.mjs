import "dotenv/config";

function getArgValue(flag) {
  const direct = process.argv.find((argument) => argument.startsWith(`${flag}=`));
  if (direct) {
    return direct.slice(flag.length + 1);
  }

  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const baseUrl = (
  process.argv[2] ||
  getArgValue("--base-url") ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:9002"
).replace(/\/$/, "");

async function fetchText(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    headers: {
      Accept: "text/html,application/json,text/plain,application/xml",
    },
    cache: "no-store",
  });

  const body = await response.text();

  return {
    pathname,
    ok: response.ok,
    status: response.status,
    body,
  };
}

function createResult(name, passed, detail) {
  return {
    name,
    passed,
    detail,
  };
}

const checks = [];

const home = await fetchText("/");
checks.push(
  createResult(
    "home",
    home.ok && /S-Tech Studios|<html/i.test(home.body),
    `GET / returned ${home.status}.`
  )
);

const store = await fetchText("/store");
checks.push(
  createResult(
    "store",
    store.ok && /Solutions|Store|Marketplace/i.test(store.body),
    `GET /store returned ${store.status}.`
  )
);

const login = await fetchText("/login");
checks.push(
  createResult(
    "login",
    login.ok && /sign in|login/i.test(login.body),
    `GET /login returned ${login.status}.`
  )
);

const robots = await fetchText("/robots.txt");
checks.push(
  createResult(
    "robots",
    robots.ok && /Sitemap:/i.test(robots.body),
    `GET /robots.txt returned ${robots.status}.`
  )
);

const sitemap = await fetchText("/sitemap.xml");
checks.push(
  createResult(
    "sitemap",
    sitemap.ok && /<urlset/i.test(sitemap.body),
    `GET /sitemap.xml returned ${sitemap.status}.`
  )
);

const listingsResponse = await fetchText("/api/listings");
let listingId = null;
let listingName = null;

if (listingsResponse.ok) {
  try {
    const payload = JSON.parse(listingsResponse.body);
    const listing = Array.isArray(payload?.listings) ? payload.listings[0] : null;
    if (listing && typeof listing.id === "string") {
      listingId = listing.id;
      listingName = typeof listing.name === "string" ? listing.name : null;
    }
    checks.push(
      createResult(
        "listings-api",
        Array.isArray(payload?.listings) && payload.listings.length > 0,
        `GET /api/listings returned ${payload?.listings?.length ?? 0} listing(s).`
      )
    );
  } catch {
    checks.push(
      createResult(
        "listings-api",
        false,
        "GET /api/listings did not return valid JSON."
      )
    );
  }
} else {
  checks.push(
    createResult(
      "listings-api",
      false,
      `GET /api/listings returned ${listingsResponse.status}.`
    )
  );
}

if (listingId) {
  const listingPage = await fetchText(`/listing/${listingId}`);
  checks.push(
    createResult(
      "listing-detail",
      listingPage.ok &&
        (listingName ? listingPage.body.includes(listingName) : listingPage.body.length > 0),
      `GET /listing/${listingId} returned ${listingPage.status}.`
    )
  );
} else {
  checks.push(
    createResult(
      "listing-detail",
      false,
      "Could not determine a listing id from /api/listings."
    )
  );
}

const failures = checks.filter((check) => !check.passed);

console.log(
  JSON.stringify(
    {
      baseUrl,
      ok: failures.length === 0,
      checks,
    },
    null,
    2
  )
);

if (failures.length > 0) {
  process.exit(1);
}
