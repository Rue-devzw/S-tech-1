import assert from "node:assert/strict";
import test from "node:test";
import { departmentForHostname, departmentUrl } from "../../src/lib/site-domains";

test("department hostnames map to the correct site area", () => {
  assert.equal(departmentForHostname("www.s-techsolutions.org"), "corporate");
  assert.equal(departmentForHostname("s-techsolutions.org"), "corporate");
  assert.equal(departmentForHostname("shop.s-techsolutions.org"), "shop");
  assert.equal(departmentForHostname("portal.s-techsolutions.org:443"), "portal");
  assert.equal(departmentForHostname("staff.s-techsolutions.org"), "staff");
});

test("local and preview hosts retain path-based development routing", () => {
  assert.equal(departmentForHostname("localhost:3000"), "local");
  assert.equal(departmentForHostname("s-tech-git-main.vercel.app"), "local");
});

test("department URLs use the configured root domain", () => {
  assert.equal(departmentUrl("corporate", "/about"), "https://www.s-techsolutions.org/about");
  assert.equal(departmentUrl("shop"), "https://shop.s-techsolutions.org/");
  assert.equal(departmentUrl("portal", "register"), "https://portal.s-techsolutions.org/register");
  assert.equal(departmentUrl("staff", "/admin", "example.com"), "https://staff.example.com/admin");
});
