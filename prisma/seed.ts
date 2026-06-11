import { Prisma, PrismaClient, RoleName } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const password = "OmniTech#2026";

async function upsertRole(name: RoleName, label: string, description: string) {
  return prisma.role.upsert({
    where: { name },
    update: { label, description },
    create: { name, label, description }
  });
}

async function upsertPermission(key: string, label: string, module: string, description?: string) {
  return prisma.permission.upsert({
    where: { key },
    update: { label, module, description },
    create: { key, label, module, description }
  });
}

async function assignRole(userId: string, roleId: string) {
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId, roleId } },
    update: {},
    create: { userId, roleId }
  });
}

async function grant(roleId: string, permissionId: string) {
  await prisma.rolePermission.upsert({
    where: { roleId_permissionId: { roleId, permissionId } },
    update: {},
    create: { roleId, permissionId }
  });
}

type AddressSeedData = Omit<Prisma.CustomerAddressUncheckedCreateInput, "id" | "customerId" | "label" | "createdAt" | "updatedAt">;
type DeviceSeedData = Omit<Prisma.DeviceUncheckedCreateInput, "id" | "customerId" | "serialNumber" | "createdAt" | "updatedAt">;
type SupplierSeedData = Omit<Prisma.SupplierUncheckedCreateInput, "id" | "name" | "createdAt" | "updatedAt">;
type FaqSeedData = Omit<Prisma.FAQUncheckedCreateInput, "id" | "question" | "createdAt" | "updatedAt">;
type TestimonialSeedData = Omit<Prisma.TestimonialUncheckedCreateInput, "id" | "name" | "quote" | "createdAt" | "updatedAt">;

async function ensureCustomerAddress(customerId: string, label: string, data: AddressSeedData) {
  const existing = await prisma.customerAddress.findFirst({ where: { customerId, label } });
  if (existing) return prisma.customerAddress.update({ where: { id: existing.id }, data });
  return prisma.customerAddress.create({ data: { ...data, customerId, label } });
}

async function ensureDevice(customerId: string, serialNumber: string, data: DeviceSeedData) {
  const existing = await prisma.device.findFirst({ where: { customerId, serialNumber } });
  if (existing) return prisma.device.update({ where: { id: existing.id }, data });
  return prisma.device.create({ data: { ...data, customerId, serialNumber } });
}

async function ensureSupplier(name: string, data: SupplierSeedData) {
  const existing = await prisma.supplier.findFirst({ where: { name } });
  if (existing) return prisma.supplier.update({ where: { id: existing.id }, data });
  return prisma.supplier.create({ data: { ...data, name } });
}

async function ensureFaq(question: string, data: FaqSeedData) {
  const existing = await prisma.fAQ.findFirst({ where: { question } });
  if (existing) return prisma.fAQ.update({ where: { id: existing.id }, data });
  return prisma.fAQ.create({ data: { ...data, question } });
}

async function ensureTestimonial(name: string, quote: string, data: TestimonialSeedData) {
  const existing = await prisma.testimonial.findFirst({ where: { name, quote } });
  if (existing) return prisma.testimonial.update({ where: { id: existing.id }, data });
  return prisma.testimonial.create({ data: { ...data, name, quote } });
}

async function seedRegionalExamples(args: { adminId: string; technicianId: string; salesId: string }) {
  const categories = {
    electronics: await prisma.serviceCategory.upsert({
      where: { slug: "electronics-repairs" },
      update: { name: "Electronics Repairs", description: "Phones, laptops, PCs, TVs, accessories and general electronics.", sortOrder: 1, isActive: true },
      create: { name: "Electronics Repairs", slug: "electronics-repairs", description: "Phones, laptops, PCs, TVs, accessories and general electronics.", sortOrder: 1 }
    }),
    ict: await prisma.serviceCategory.upsert({
      where: { slug: "ict-support" },
      update: { name: "ICT Support", description: "Onsite computer support, maintenance plans, backups, printers and business helpdesk.", sortOrder: 2, isActive: true },
      create: { name: "ICT Support", slug: "ict-support", description: "Onsite computer support, maintenance plans, backups, printers and business helpdesk.", sortOrder: 2 }
    }),
    networking: await prisma.serviceCategory.upsert({
      where: { slug: "networking-infrastructure" },
      update: { name: "Networking Infrastructure", description: "Wi-Fi, cabling, routers, switches, CCTV/network support and site maintenance.", sortOrder: 3, isActive: true },
      create: { name: "Networking Infrastructure", slug: "networking-infrastructure", description: "Wi-Fi, cabling, routers, switches, CCTV/network support and site maintenance.", sortOrder: 3 }
    }),
    starlink: await prisma.serviceCategory.upsert({
      where: { slug: "starlink-services" },
      update: { name: "Starlink Services", description: "Independent Starlink-related site surveys, installations, relocation and troubleshooting.", sortOrder: 4, isActive: true },
      create: { name: "Starlink Services", slug: "starlink-services", description: "Independent Starlink-related site surveys, installations, relocation and troubleshooting.", sortOrder: 4 }
    }),
    digital: await prisma.serviceCategory.upsert({
      where: { slug: "digital-builds" },
      update: { name: "Web, Software and AI", description: "Websites, web apps, mobile apps, AI assistants, automation and digital systems.", sortOrder: 5, isActive: true },
      create: { name: "Web, Software and AI", slug: "digital-builds", description: "Websites, web apps, mobile apps, AI assistants, automation and digital systems.", sortOrder: 5 }
    })
  };

  const services = {
    phoneRepair: await prisma.service.upsert({
      where: { slug: "phone-screen-battery-repair" },
      update: { categoryId: categories.electronics.id, name: "Phone screen, battery and charging repair", summary: "Screen replacement, batteries, charging ports, speaker faults and water-damage checks.", description: "Phone repair intake with condition photos, diagnosis, parts approval, testing and warranty terms.", basePrice: 15, estimatedHours: 2, isActive: true },
      create: { categoryId: categories.electronics.id, name: "Phone screen, battery and charging repair", slug: "phone-screen-battery-repair", summary: "Screen replacement, batteries, charging ports, speaker faults and water-damage checks.", description: "Phone repair intake with condition photos, diagnosis, parts approval, testing and warranty terms.", basePrice: 15, estimatedHours: 2 }
    }),
    tvRepair: await prisma.service.upsert({
      where: { slug: "tv-electronics-repair" },
      update: { categoryId: categories.electronics.id, name: "TV and general electronics repair", summary: "TV no-power faults, backlight issues, audio/video faults and board-level inspection.", description: "Bench diagnostics and repair workflow for TVs and general electronics.", basePrice: 25, estimatedHours: 3, isActive: true },
      create: { categoryId: categories.electronics.id, name: "TV and general electronics repair", slug: "tv-electronics-repair", summary: "TV no-power faults, backlight issues, audio/video faults and board-level inspection.", description: "Bench diagnostics and repair workflow for TVs and general electronics.", basePrice: 25, estimatedHours: 3 }
    }),
    onsiteSupport: await prisma.service.upsert({
      where: { slug: "business-ict-maintenance" },
      update: { categoryId: categories.ict.id, name: "Business ICT maintenance", summary: "Recurring support for computers, printers, backups, email and user support.", description: "Scheduled ICT maintenance for SMEs, clinics, schools and offices.", basePrice: 80, estimatedHours: 4, isFieldService: true, isActive: true },
      create: { categoryId: categories.ict.id, name: "Business ICT maintenance", slug: "business-ict-maintenance", summary: "Recurring support for computers, printers, backups, email and user support.", description: "Scheduled ICT maintenance for SMEs, clinics, schools and offices.", basePrice: 80, estimatedHours: 4, isFieldService: true }
    }),
    networkInstall: await prisma.service.upsert({
      where: { slug: "network-wifi-cabling-installation" },
      update: { categoryId: categories.networking.id, name: "Network, Wi-Fi and cabling installation", summary: "Routers, switches, access points, structured cabling and coverage planning.", description: "Network installation and maintenance for offices, schools, churches, lodges, farms and clinics.", basePrice: 150, estimatedHours: 5, isFieldService: true, isActive: true },
      create: { categoryId: categories.networking.id, name: "Network, Wi-Fi and cabling installation", slug: "network-wifi-cabling-installation", summary: "Routers, switches, access points, structured cabling and coverage planning.", description: "Network installation and maintenance for offices, schools, churches, lodges, farms and clinics.", basePrice: 150, estimatedHours: 5, isFieldService: true }
    }),
    starlinkSurvey: await prisma.service.upsert({
      where: { slug: "starlink-site-survey-relocation" },
      update: { categoryId: categories.starlink.id, name: "Starlink site survey and relocation support", summary: "Clear-sky checks, mounting advice, cable-route planning and relocation troubleshooting.", description: "Independent Starlink-related support without claiming official partnership.", basePrice: 45, estimatedHours: 2, isFieldService: true, isActive: true },
      create: { categoryId: categories.starlink.id, name: "Starlink site survey and relocation support", slug: "starlink-site-survey-relocation", summary: "Clear-sky checks, mounting advice, cable-route planning and relocation troubleshooting.", description: "Independent Starlink-related support without claiming official partnership.", basePrice: 45, estimatedHours: 2, isFieldService: true }
    }),
    website: await prisma.service.upsert({
      where: { slug: "business-website-portal" },
      update: { categoryId: categories.digital.id, name: "Business website and customer portal", summary: "SEO-ready websites, service portals, landing pages and conversion-focused content.", description: "Website and portal builds for local businesses, schools, churches and service providers.", basePrice: 350, estimatedHours: 20, isActive: true },
      create: { categoryId: categories.digital.id, name: "Business website and customer portal", slug: "business-website-portal", summary: "SEO-ready websites, service portals, landing pages and conversion-focused content.", description: "Website and portal builds for local businesses, schools, churches and service providers.", basePrice: 350, estimatedHours: 20 }
    }),
    automation: await prisma.service.upsert({
      where: { slug: "ai-workflow-automation" },
      update: { categoryId: categories.digital.id, name: "AI and workflow automation", summary: "AI assistants, reports, reminders, form intake and workflow automation.", description: "Practical automation for SMEs that need repeatable digital operations.", basePrice: 250, estimatedHours: 12, isActive: true },
      create: { categoryId: categories.digital.id, name: "AI and workflow automation", slug: "ai-workflow-automation", summary: "AI assistants, reports, reminders, form intake and workflow automation.", description: "Practical automation for SMEs that need repeatable digital operations.", basePrice: 250, estimatedHours: 12 }
    })
  };

  const suppliers = {
    zedParts: await ensureSupplier("ZedLink Electronics Wholesale", {
      contactName: "Nyasha Dube",
      email: "sales@zedlink.example",
      phone: "+263 78 410 1122",
      address: "Graniteside, Harare",
      notes: "Fictional supplier for phone screens, batteries and laptop parts."
    }),
    byosTech: await ensureSupplier("ByoTech Cabling & Power", {
      contactName: "Mandla Ncube",
      email: "orders@byotech.example",
      phone: "+263 77 620 4410",
      address: "Belmont, Bulawayo",
      notes: "Fictional supplier for cabling, cabinets, UPS and networking consumables."
    }),
    solarNet: await ensureSupplier("SolarNet Farm ICT Supplies", {
      contactName: "Rudo Chikomo",
      email: "procurement@solarnet.example",
      phone: "+263 71 890 3301",
      address: "Mutare Road, Marondera",
      notes: "Fictional supplier for field installation accessories and rural ICT support."
    })
  };

  const inventoryItems = [
    { supplierId: suppliers.zedParts.id, sku: "PHONE-SCR-SAM-A12", name: "Samsung A12 replacement screen", category: "Phone parts", description: "Aftermarket display assembly for common A-series repairs.", quantityOnHand: 6, reorderLevel: 3, unitCost: 28, sellingPrice: 45, location: "Harare workshop Bin P1" },
    { supplierId: suppliers.zedParts.id, sku: "BAT-IPH-11", name: "iPhone 11 battery", category: "Phone parts", description: "Replacement battery with adhesive strips.", quantityOnHand: 3, reorderLevel: 2, unitCost: 24, sellingPrice: 42, location: "Harare workshop Bin P2" },
    { supplierId: suppliers.zedParts.id, sku: "SSD-500-SATA", name: "500GB SATA SSD", category: "Computer parts", description: "SSD upgrade for older desktops and laptops.", quantityOnHand: 8, reorderLevel: 4, unitCost: 33, sellingPrice: 55, location: "Main store" },
    { supplierId: suppliers.zedParts.id, sku: "RAM-DDR4-8GB", name: "8GB DDR4 laptop RAM", category: "Computer parts", description: "Common laptop memory upgrade.", quantityOnHand: 5, reorderLevel: 3, unitCost: 20, sellingPrice: 36, location: "Main store" },
    { supplierId: suppliers.byosTech.id, sku: "CAT6-305M", name: "Cat6 cable roll 305m", category: "Networking", description: "Indoor Cat6 UTP cable for structured cabling.", quantityOnHand: 2, reorderLevel: 1, unitCost: 82, sellingPrice: 120, location: "Field store" },
    { supplierId: suppliers.byosTech.id, sku: "AP-WIFI6-INDOOR", name: "Indoor Wi-Fi 6 access point", category: "Networking", description: "Ceiling/wall access point for schools and offices.", quantityOnHand: 4, reorderLevel: 2, unitCost: 68, sellingPrice: 105, location: "Field store" },
    { supplierId: suppliers.byosTech.id, sku: "UPS-1000VA", name: "1000VA line-interactive UPS", category: "Power", description: "Backup power for routers, small servers and tills.", quantityOnHand: 3, reorderLevel: 2, unitCost: 70, sellingPrice: 115, location: "Field store" },
    { supplierId: suppliers.solarNet.id, sku: "STAR-POLE-MOUNT", name: "Starlink pole mount accessories", category: "Starlink", description: "Pole mount clamps, sealant and cable-management pack.", quantityOnHand: 5, reorderLevel: 3, unitCost: 38, sellingPrice: 65, location: "Installation kit shelf" },
    { supplierId: suppliers.solarNet.id, sku: "MESH-EXT-DUAL", name: "Dual-band mesh extender", category: "Networking", description: "Wi-Fi coverage extension for lodges, homes and small offices.", quantityOnHand: 6, reorderLevel: 2, unitCost: 45, sellingPrice: 78, location: "Installation kit shelf" }
  ];

  for (const item of inventoryItems) {
    const inventory = await prisma.inventoryItem.upsert({
      where: { sku: item.sku },
      update: item,
      create: item
    });
    const movement = await prisma.stockMovement.findFirst({ where: { inventoryItemId: inventory.id, reference: `OPENING-${item.sku}` } });
    if (!movement) {
      await prisma.stockMovement.create({
        data: {
          inventoryItemId: inventory.id,
          supplierId: item.supplierId,
          type: "PURCHASE",
          quantity: item.quantityOnHand,
          unitCost: item.unitCost,
          reference: `OPENING-${item.sku}`,
          notes: "Opening seed stock for development and staging demonstrations."
        }
      });
    }
  }

  const customers = [
    {
      phone: "+263 77 445 0192",
      type: "SCHOOL" as const,
      name: "Mrs Farai Chirwa",
      email: "admin@msasaacademy.example",
      organization: "Msasa Community Academy",
      notes: "School computer lab and Wi-Fi support. Prefers email quotations and WhatsApp visit reminders.",
      address: { label: "School campus", line1: "15 Mutare Road", city: "Harare", province: "Harare", type: "SERVICE" as const },
      device: { type: "NETWORK_EQUIPMENT", make: "TP-Link", model: "Lab router and switches", serialNumber: "MSASA-NET-001", conditionNotes: "Mixed router and switch equipment in computer lab.", accessories: "Router, 2 switches, patch leads" },
      service: services.networkInstall,
      requestNumber: "REQ-2026-MSASA01",
      jobNumber: "JOB-2026-MSASA01",
      quotationNumber: "QTE-2026-MSASA01",
      invoiceNumber: "INV-2026-MSASA01",
      paymentNumber: "PAY-2026-MSASA01",
      receiptNumber: "RCT-2026-MSASA01",
      appointmentTitle: "School Wi-Fi and lab cabling survey",
      requestTitle: "Computer lab Wi-Fi drops during lessons",
      description: "School computer lab needs stable Wi-Fi, cleaner cabling and router documentation before exams.",
      jobType: "NETWORK_INSTALLATION" as const,
      status: "APPROVED" as const,
      priority: "HIGH" as const,
      total: 420,
      paid: 200,
      location: "Msasa Community Academy, Harare"
    },
    {
      phone: "+263 71 302 8841",
      type: "CLINIC" as const,
      name: "Sister Chipo Mataruse",
      email: "reception@nyamapandahealth.example",
      organization: "Nyamapanda Rural Clinic",
      notes: "Clinic uses desktops for patient records and requires careful appointment timing.",
      address: { label: "Clinic reception", line1: "Nyamapanda Growth Point", city: "Nyamapanda", province: "Mashonaland East", type: "SERVICE" as const },
      device: { type: "PC", make: "Dell", model: "OptiPlex 3060", serialNumber: "CLINIC-PC-003", conditionNotes: "Slow startup and failing hard drive noise.", accessories: "Keyboard, mouse, power cable" },
      service: services.onsiteSupport,
      requestNumber: "REQ-2026-CLINIC01",
      jobNumber: "JOB-2026-CLINIC01",
      quotationNumber: "QTE-2026-CLINIC01",
      invoiceNumber: "INV-2026-CLINIC01",
      paymentNumber: "PAY-2026-CLINIC01",
      receiptNumber: "RCT-2026-CLINIC01",
      appointmentTitle: "Clinic desktop SSD upgrade and backup check",
      requestTitle: "Clinic reception computer is very slow",
      description: "Reception computer takes long to start and freezes when opening patient record spreadsheets.",
      jobType: "FIELD_REPAIR" as const,
      status: "COMPLETED" as const,
      priority: "URGENT" as const,
      total: 145,
      paid: 145,
      location: "Nyamapanda Rural Clinic"
    },
    {
      phone: "+263 78 502 7740",
      type: "FARM" as const,
      name: "Tendai Mlambo",
      email: "tendai@mazoefresh.example",
      organization: "Mazowe Fresh Produce Farm",
      notes: "Farm office and packing shed connectivity. Often available early morning.",
      address: { label: "Farm office", line1: "Plot 22, Mazowe Road", city: "Mazowe", province: "Mashonaland Central", type: "INSTALLATION" as const },
      device: { type: "Starlink kit", make: "Starlink", model: "Standard Kit", serialNumber: "FARM-STAR-044", conditionNotes: "Kit already activated by customer.", accessories: "Router, dish, cable, power supply" },
      service: services.starlinkSurvey,
      requestNumber: "REQ-2026-FARM01",
      jobNumber: "JOB-2026-FARM01",
      quotationNumber: "QTE-2026-FARM01",
      invoiceNumber: "INV-2026-FARM01",
      paymentNumber: "PAY-2026-FARM01",
      receiptNumber: "RCT-2026-FARM01",
      appointmentTitle: "Farm Starlink relocation and coverage plan",
      requestTitle: "Relocate Starlink to packing shed",
      description: "Customer wants the Starlink kit moved from farmhouse to packing shed with Wi-Fi coverage for office and weighing area.",
      jobType: "STARLINK_INSTALLATION" as const,
      status: "IN_PROGRESS" as const,
      priority: "NORMAL" as const,
      total: 210,
      paid: 0,
      location: "Mazowe Fresh Produce Farm"
    },
    {
      phone: "+263 77 918 6603",
      type: "CHURCH" as const,
      name: "Pastor Kudakwashe Nyoni",
      email: "office@newhopeassembly.example",
      organization: "New Hope Assembly",
      notes: "Weekend availability. Needs streaming support and office Wi-Fi separation.",
      address: { label: "Church office", line1: "Lobengula Street", city: "Bulawayo", province: "Bulawayo", type: "SERVICE" as const },
      device: { type: "NETWORK_EQUIPMENT", make: "MikroTik", model: "hEX + access points", serialNumber: "NHA-NET-2026", conditionNotes: "Existing router shared by office and media desk.", accessories: "Router, 1 AP, 1 switch" },
      service: services.networkInstall,
      requestNumber: "REQ-2026-CHURCH01",
      jobNumber: "JOB-2026-CHURCH01",
      quotationNumber: "QTE-2026-CHURCH01",
      invoiceNumber: "INV-2026-CHURCH01",
      paymentNumber: "PAY-2026-CHURCH01",
      receiptNumber: "RCT-2026-CHURCH01",
      appointmentTitle: "Church streaming network setup",
      requestTitle: "Separate office Wi-Fi from livestream network",
      description: "Church needs separate Wi-Fi for admin office, guest users and livestream media desk.",
      jobType: "NETWORK_INSTALLATION" as const,
      status: "QUOTED" as const,
      priority: "NORMAL" as const,
      total: 360,
      paid: 0,
      location: "New Hope Assembly, Bulawayo"
    },
    {
      phone: "+263 73 640 2198",
      type: "SME" as const,
      name: "Ruvimbo Ndlovu",
      email: "hello@ruvibakes.example",
      organization: "Ruvi Bakes",
      notes: "Bakery needs website, WhatsApp lead capture and simple order workflow.",
      address: { label: "Bakery shop", line1: "Jason Moyo Avenue", city: "Bulawayo", province: "Bulawayo", type: "BILLING" as const },
      device: { type: "SOFTWARE_PROJECT", make: "OmniTech", model: "Website build", serialNumber: "RUVIBAKES-WEB-001", conditionNotes: "New digital project.", accessories: "Brand photos and menu spreadsheet" },
      service: services.website,
      requestNumber: "REQ-2026-RUVI01",
      jobNumber: "JOB-2026-RUVI01",
      quotationNumber: "QTE-2026-RUVI01",
      invoiceNumber: "INV-2026-RUVI01",
      paymentNumber: "PAY-2026-RUVI01",
      receiptNumber: "RCT-2026-RUVI01",
      appointmentTitle: "Bakery website discovery call",
      requestTitle: "Website and WhatsApp enquiry page for bakery",
      description: "Bakery needs a clean website with menu, gallery, WhatsApp order CTA and basic SEO.",
      jobType: "SOFTWARE_PROJECT" as const,
      status: "ASSIGNED" as const,
      priority: "NORMAL" as const,
      total: 650,
      paid: 325,
      location: "Ruvi Bakes, Bulawayo"
    },
    {
      phone: "+263 77 105 4020",
      type: "HOME" as const,
      name: "Anesu Dlamini",
      email: "anesu.dlamini@example.com",
      organization: "",
      notes: "Walk-in phone repair customer. Prefers SMS or WhatsApp updates.",
      address: { label: "Home", line1: "Mkoba 14", city: "Gweru", province: "Midlands", type: "SERVICE" as const },
      device: { type: "PHONE", make: "Samsung", model: "Galaxy A12", serialNumber: "SM-A12-ANESU", conditionNotes: "Cracked screen and small dent on frame.", accessories: "Phone only" },
      service: services.phoneRepair,
      requestNumber: "REQ-2026-PHONE01",
      jobNumber: "JOB-2026-PHONE01",
      quotationNumber: "QTE-2026-PHONE01",
      invoiceNumber: "INV-2026-PHONE01",
      paymentNumber: "PAY-2026-PHONE01",
      receiptNumber: "RCT-2026-PHONE01",
      appointmentTitle: "Phone screen replacement collection",
      requestTitle: "Samsung A12 cracked screen",
      description: "Phone screen cracked after a fall. Touch still works but glass is loose near the top corner.",
      jobType: "BENCH_REPAIR" as const,
      status: "READY_FOR_COLLECTION" as const,
      priority: "NORMAL" as const,
      total: 60,
      paid: 60,
      location: "Gweru walk-in counter"
    }
  ];

  for (const item of customers) {
    const customer = await prisma.customer.upsert({
      where: { phone: item.phone },
      update: {
        type: item.type,
        name: item.name,
        email: item.email,
        organization: item.organization || undefined,
        notes: item.notes,
        consentToNotify: true
      },
      create: {
        type: item.type,
        name: item.name,
        email: item.email,
        phone: item.phone,
        organization: item.organization || undefined,
        notes: item.notes,
        consentToNotify: true
      }
    });

    await ensureCustomerAddress(customer.id, item.address.label, {
      type: item.address.type,
      line1: item.address.line1,
      city: item.address.city,
      province: item.address.province,
      country: "Zimbabwe",
      isDefault: true
    });

    const device = await ensureDevice(customer.id, item.device.serialNumber, {
      type: item.device.type,
      make: item.device.make,
      model: item.device.model,
      conditionNotes: item.device.conditionNotes,
      accessories: item.device.accessories
    });

    const request = await prisma.serviceRequest.upsert({
      where: { requestNumber: item.requestNumber },
      update: {
        customerId: customer.id,
        serviceId: item.service.id,
        deviceId: device.id,
        title: item.requestTitle,
        description: item.description,
        status: item.status === "COMPLETED" ? "COMPLETED" : item.status === "QUOTED" ? "QUOTED" : "TRIAGED",
        priority: item.priority,
        intakeChannel: "Website",
        locationNote: item.location
      },
      create: {
        requestNumber: item.requestNumber,
        customerId: customer.id,
        serviceId: item.service.id,
        deviceId: device.id,
        createdById: args.salesId,
        title: item.requestTitle,
        description: item.description,
        status: item.status === "COMPLETED" ? "COMPLETED" : item.status === "QUOTED" ? "QUOTED" : "TRIAGED",
        priority: item.priority,
        intakeChannel: "Website",
        locationNote: item.location
      }
    });

    const job = await prisma.jobCard.upsert({
      where: { jobNumber: item.jobNumber },
      update: {
        requestId: request.id,
        customerId: customer.id,
        deviceId: device.id,
        assignedToId: args.technicianId,
        type: item.jobType,
        status: item.status,
        priority: item.priority,
        faultReported: item.description,
        scheduledFor: new Date("2026-06-05T08:00:00.000Z"),
        completedAt: item.status === "COMPLETED" ? new Date("2026-05-25T14:30:00.000Z") : undefined
      },
      create: {
        jobNumber: item.jobNumber,
        requestId: request.id,
        customerId: customer.id,
        deviceId: device.id,
        assignedToId: args.technicianId,
        type: item.jobType,
        status: item.status,
        priority: item.priority,
        faultReported: item.description,
        scheduledFor: new Date("2026-06-05T08:00:00.000Z"),
        completedAt: item.status === "COMPLETED" ? new Date("2026-05-25T14:30:00.000Z") : undefined
      }
    });

    const statusHistory = await prisma.jobStatusHistory.findFirst({ where: { jobCardId: job.id, toStatus: item.status } });
    if (!statusHistory) {
      await prisma.jobStatusHistory.create({
        data: {
          jobCardId: job.id,
          fromStatus: "CREATED",
          toStatus: item.status,
          changedById: args.adminId,
          note: `Seeded realistic ${item.organization || item.name} workflow example.`
        }
      });
    }

    const quotation = await prisma.quotation.upsert({
      where: { quotationNumber: item.quotationNumber },
      update: {
        customerId: customer.id,
        jobCardId: job.id,
        status: item.status === "QUOTED" ? "SENT" : item.status === "COMPLETED" || item.paid > 0 ? "ACCEPTED" : "SENT",
        subtotal: item.total,
        discount: 0,
        tax: 0,
        total: item.total,
        acceptedAt: item.paid > 0 ? new Date("2026-05-24T10:00:00.000Z") : undefined,
        notes: "Fictional development quotation using USD amounts common for local service workflows."
      },
      create: {
        quotationNumber: item.quotationNumber,
        customerId: customer.id,
        jobCardId: job.id,
        status: item.status === "QUOTED" ? "SENT" : item.status === "COMPLETED" || item.paid > 0 ? "ACCEPTED" : "SENT",
        subtotal: item.total,
        discount: 0,
        tax: 0,
        total: item.total,
        validUntil: new Date("2026-06-30T23:59:59.000Z"),
        acceptedAt: item.paid > 0 ? new Date("2026-05-24T10:00:00.000Z") : undefined,
        notes: "Fictional development quotation using USD amounts common for local service workflows.",
        items: {
          create: [
            { itemType: "SERVICE", description: item.requestTitle, quantity: 1, unitPrice: Math.round(item.total * 0.65), total: Math.round(item.total * 0.65), sortOrder: 1 },
            { itemType: "PART", description: "Parts, materials or project setup allowance", quantity: 1, unitPrice: item.total - Math.round(item.total * 0.65), total: item.total - Math.round(item.total * 0.65), sortOrder: 2 }
          ]
        }
      }
    });

    const invoice = await prisma.invoice.upsert({
      where: { invoiceNumber: item.invoiceNumber },
      update: {
        customerId: customer.id,
        jobCardId: job.id,
        quotationId: quotation.id,
        status: item.paid >= item.total ? "PAID" : item.paid > 0 ? "PARTIALLY_PAID" : "SENT",
        subtotal: item.total,
        discount: 0,
        tax: 0,
        total: item.total,
        paidAmount: item.paid,
        balanceDue: item.total - item.paid,
        issuedAt: new Date("2026-05-24T12:00:00.000Z"),
        dueAt: new Date("2026-06-24T23:59:59.000Z")
      },
      create: {
        invoiceNumber: item.invoiceNumber,
        customerId: customer.id,
        jobCardId: job.id,
        quotationId: quotation.id,
        status: item.paid >= item.total ? "PAID" : item.paid > 0 ? "PARTIALLY_PAID" : "SENT",
        subtotal: item.total,
        discount: 0,
        tax: 0,
        total: item.total,
        paidAmount: item.paid,
        balanceDue: item.total - item.paid,
        issuedAt: new Date("2026-05-24T12:00:00.000Z"),
        dueAt: new Date("2026-06-24T23:59:59.000Z")
      }
    });

    if (item.paid > 0) {
      const payment = await prisma.payment.upsert({
        where: { paymentNumber: item.paymentNumber },
        update: {
          customerId: customer.id,
          invoiceId: invoice.id,
          recordedById: args.adminId,
          method: item.paid >= 200 ? "BANK_TRANSFER" : "ECOCASH",
          status: "CONFIRMED",
          amount: item.paid,
          providerReference: `${item.paymentNumber}-REF`,
          paidAt: new Date("2026-05-25T09:00:00.000Z")
        },
        create: {
          paymentNumber: item.paymentNumber,
          customerId: customer.id,
          invoiceId: invoice.id,
          recordedById: args.adminId,
          method: item.paid >= 200 ? "BANK_TRANSFER" : "ECOCASH",
          status: "CONFIRMED",
          amount: item.paid,
          providerReference: `${item.paymentNumber}-REF`,
          paidAt: new Date("2026-05-25T09:00:00.000Z")
        }
      });

      await prisma.receipt.upsert({
        where: { receiptNumber: item.receiptNumber },
        update: { customerId: customer.id, invoiceId: invoice.id, paymentId: payment.id, amount: item.paid },
        create: { receiptNumber: item.receiptNumber, customerId: customer.id, invoiceId: invoice.id, paymentId: payment.id, amount: item.paid }
      });
    }

    await prisma.appointment.create({
      data: {
        customerId: customer.id,
        serviceRequestId: request.id,
        jobCardId: job.id,
        assignedToId: args.technicianId,
        title: item.appointmentTitle,
        status: item.status === "COMPLETED" ? "COMPLETED" : "CONFIRMED",
        startsAt: new Date("2026-06-05T08:00:00.000Z"),
        endsAt: new Date("2026-06-05T10:00:00.000Z"),
        location: item.location,
        notes: "Seed appointment for realistic scheduling dashboard data."
      }
    });
  }

  const promotions = [
    { title: "Clinic and school ICT maintenance month", slug: "clinic-school-ict-maintenance-month", audience: "Schools, clinics and training centres", offer: "Preventive computer checks, backup review, printer support and network health report.", channelPlan: "Email outreach, WhatsApp poster and follow-up calls to administrators.", status: "ACTIVE" as const, startsAt: new Date("2026-06-01T00:00:00.000Z"), endsAt: new Date("2026-06-30T23:59:59.000Z") },
    { title: "Farm connectivity readiness check", slug: "farm-connectivity-readiness-check", audience: "Farms and agri-businesses", offer: "Starlink-related site survey, Wi-Fi coverage review and power protection recommendations.", channelPlan: "Facebook post, farmer groups, WhatsApp broadcast and sales follow-up.", status: "DRAFT" as const, startsAt: new Date("2026-07-01T00:00:00.000Z"), endsAt: new Date("2026-08-15T23:59:59.000Z") },
    { title: "SME website and automation starter", slug: "sme-website-automation-starter", audience: "Retailers, bakeries, salons and service SMEs", offer: "Starter website, WhatsApp enquiry CTA and simple customer intake workflow.", channelPlan: "Portfolio landing page, boosted social content and referral offer.", status: "ACTIVE" as const, startsAt: new Date("2026-05-15T00:00:00.000Z"), endsAt: new Date("2026-07-15T23:59:59.000Z") }
  ];

  for (const promotion of promotions) {
    await prisma.promotion.upsert({ where: { slug: promotion.slug }, update: promotion, create: promotion });
  }

  const project = await prisma.portfolioProject.upsert({
    where: { slug: "ruvi-bakes-website" },
    update: {
      category: "WEBSITE",
      clientSector: "Food and retail",
      summary: "A clean bakery website with WhatsApp enquiry CTA, menu structure and local SEO-ready content.",
      challenge: "The bakery relied on social posts only and had no central place for menus, seasonal cakes or enquiries.",
      solution: "OmniTech structured the website around product categories, trust signals, photos, WhatsApp contact and search-ready service pages.",
      toolsUsed: ["Next.js", "Responsive design", "SEO content", "WhatsApp CTA"],
      outcome: "A more professional digital front door and a reusable foundation for future online ordering.",
      visibility: "ANONYMIZED",
      featured: true,
      published: true
    },
    create: {
      title: "Bakery website and WhatsApp enquiry flow",
      slug: "ruvi-bakes-website",
      category: "WEBSITE",
      clientName: "Ruvi Bakes",
      clientSector: "Food and retail",
      summary: "A clean bakery website with WhatsApp enquiry CTA, menu structure and local SEO-ready content.",
      challenge: "The bakery relied on social posts only and had no central place for menus, seasonal cakes or enquiries.",
      solution: "OmniTech structured the website around product categories, trust signals, photos, WhatsApp contact and search-ready service pages.",
      toolsUsed: ["Next.js", "Responsive design", "SEO content", "WhatsApp CTA"],
      outcome: "A more professional digital front door and a reusable foundation for future online ordering.",
      imageUrl: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1200&q=80",
      beforeImageUrls: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80"],
      afterImageUrls: ["https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1200&q=80"],
      visibility: "ANONYMIZED",
      showClientName: false,
      featured: true,
      sortOrder: 40,
      published: true,
      publishedAt: new Date()
    }
  });

  await ensureTestimonial("Mrs Farai Chirwa", "The lab Wi-Fi is more reliable and the team left us with clear notes for future support.", {
    company: "Msasa Community Academy",
    clientSector: "Education",
    rating: 5,
    consentToPublish: true,
    privacyLabel: "School Administrator",
    published: true,
    publishedAt: new Date()
  });
  await ensureTestimonial("Ruvimbo Ndlovu", "OmniTech translated our bakery idea into a practical website and enquiry flow we can actually manage.", {
    projectId: project.id,
    company: "Fictional SME bakery",
    clientSector: "Food and retail",
    rating: 5,
    consentToPublish: true,
    privacyLabel: "Founder",
    published: true,
    publishedAt: new Date()
  });
  await ensureTestimonial("Sister Chipo Mataruse", "The computer upgrade was handled carefully around our clinic schedule and the reception team noticed the difference immediately.", {
    company: "Fictional rural clinic",
    clientSector: "Healthcare",
    rating: 4,
    consentToPublish: true,
    privacyLabel: "Clinic Reception Lead",
    published: true,
    publishedAt: new Date()
  });

  const faqs = [
    { question: "Can OmniTech repair phones, laptops and TVs?", answer: "Yes. OmniTech handles phones, PCs, laptops, TVs and general electronics through a documented intake, diagnosis, quotation, repair, testing and warranty workflow.", category: "Repairs", sortOrder: 1 },
    { question: "Does OmniTech sell or install Starlink as an official partner?", answer: "OmniTech provides independent Starlink-related kit support, site survey, installation, relocation and troubleshooting services. It does not claim official Starlink partnership unless explicitly configured and displayed later.", category: "Starlink", sortOrder: 2 },
    { question: "Can a school or clinic book onsite ICT maintenance?", answer: "Yes. Schools, clinics and SMEs can book onsite maintenance for computers, printers, backups, Wi-Fi, routers and recurring support.", category: "ICT Support", sortOrder: 3 },
    { question: "Can I approve a quotation before work begins?", answer: "Yes. Work that requires paid approval follows quotation review and customer approval before repair or installation continues.", category: "Billing", sortOrder: 4 },
    { question: "Can OmniTech build websites and automation systems?", answer: "Yes. OmniTech builds websites, portals, software systems, AI-assisted workflows and automation tools for SMEs and organisations.", category: "Software and AI", sortOrder: 5 },
    { question: "What payment methods can be recorded?", answer: "The platform can record cash, bank transfer, EcoCash, card, Paynow, Stripe and other payment methods, depending on enabled providers.", category: "Billing", sortOrder: 6 }
  ];

  for (const faq of faqs) {
    await ensureFaq(faq.question, { answer: faq.answer, category: faq.category, sortOrder: faq.sortOrder, isActive: true });
  }
}

async function main() {
  const passwordHash = await bcrypt.hash(password, 12);

  const roles = {
    SUPER_ADMIN: await upsertRole("SUPER_ADMIN", "Super Admin", "Full platform control and security oversight."),
    MANAGER: await upsertRole("MANAGER", "Manager", "Approvals, analytics and operational oversight."),
    ADMIN_ASSISTANT: await upsertRole("ADMIN_ASSISTANT", "Admin Assistant", "Daily intake, customer support and operational administration."),
    TECHNICIAN: await upsertRole("TECHNICIAN", "Technician", "Assigned repairs, diagnostics, field visits and evidence."),
    FIELD_INSTALLER: await upsertRole("FIELD_INSTALLER", "Field Installer", "Starlink, networking and on-site installation workflows."),
    SALES_MARKETING: await upsertRole("SALES_MARKETING", "Sales/Marketing", "Leads, quotations, promotions and client follow-up."),
    CUSTOMER: await upsertRole("CUSTOMER", "Customer", "Own requests, quotes, invoices, receipts and warranties."),
    VIEWER_AUDITOR: await upsertRole("VIEWER_AUDITOR", "Viewer/Auditor", "Read-only visibility for reporting, compliance and audit review.")
  };

  const permissions = await Promise.all([
    upsertPermission("dashboard:view", "View dashboard", "dashboard"),
    upsertPermission("customers:manage", "Manage customers", "crm"),
    upsertPermission("requests:manage", "Manage service requests", "requests"),
    upsertPermission("jobs:manage", "Manage all job cards", "jobs"),
    upsertPermission("jobs:update_assigned", "Update assigned jobs", "jobs"),
    upsertPermission("quotes:manage", "Manage quotations", "billing"),
    upsertPermission("invoices:manage", "Manage invoices", "billing"),
    upsertPermission("payments:record", "Record payments", "billing"),
    upsertPermission("inventory:manage", "Manage inventory", "inventory"),
    upsertPermission("field_visits:manage", "Manage field visits", "field-service"),
    upsertPermission("notifications:manage", "Manage notifications", "communications"),
    upsertPermission("content:manage", "Manage public content", "content"),
    upsertPermission("promotions:manage", "Manage promotions", "marketing"),
    upsertPermission("ai:use", "Use AI assistant", "ai"),
    upsertPermission("ai:approve", "Approve customer-facing AI drafts", "ai"),
    upsertPermission("reports:view", "View reports", "reports"),
    upsertPermission("audit:view", "View audit logs", "security"),
    upsertPermission("settings:manage", "Manage settings", "settings")
  ]);

  for (const permission of permissions) {
    await grant(roles.SUPER_ADMIN.id, permission.id);
  }
  for (const key of ["dashboard:view", "customers:manage", "requests:manage", "jobs:manage", "quotes:manage", "invoices:manage", "payments:record", "inventory:manage", "field_visits:manage", "content:manage", "promotions:manage", "notifications:manage", "ai:use", "ai:approve", "reports:view"]) {
    const permission = permissions.find((item) => item.key === key);
    if (permission) await grant(roles.ADMIN_ASSISTANT.id, permission.id);
  }
  for (const key of ["dashboard:view", "reports:view", "jobs:manage", "quotes:manage", "invoices:manage", "field_visits:manage", "notifications:manage", "ai:use", "ai:approve"]) {
    const permission = permissions.find((item) => item.key === key);
    if (permission) await grant(roles.MANAGER.id, permission.id);
  }
  for (const key of ["dashboard:view", "jobs:update_assigned", "field_visits:manage", "ai:use"]) {
    const permission = permissions.find((item) => item.key === key);
    if (permission) await grant(roles.TECHNICIAN.id, permission.id);
  }
  for (const key of ["dashboard:view", "jobs:update_assigned", "ai:use"]) {
    const permission = permissions.find((item) => item.key === key);
    if (permission) await grant(roles.FIELD_INSTALLER.id, permission.id);
  }
  for (const key of ["dashboard:view", "customers:manage", "requests:manage", "quotes:manage", "field_visits:manage", "promotions:manage", "notifications:manage", "ai:use", "ai:approve"]) {
    const permission = permissions.find((item) => item.key === key);
    if (permission) await grant(roles.SALES_MARKETING.id, permission.id);
  }
  for (const key of ["dashboard:view", "reports:view", "audit:view"]) {
    const permission = permissions.find((item) => item.key === key);
    if (permission) await grant(roles.VIEWER_AUDITOR.id, permission.id);
  }

  const admin = await prisma.user.upsert({
    where: { email: "admin@omnitech.io" },
    update: { role: "SUPER_ADMIN" },
    create: {
      name: "Admin Manager",
      email: "admin@omnitech.io",
      passwordHash,
      role: "SUPER_ADMIN"
    }
  });
  await assignRole(admin.id, roles.SUPER_ADMIN.id);

  const technician = await prisma.user.upsert({
    where: { email: "tech@omnitech.io" },
    update: { role: "TECHNICIAN" },
    create: {
      name: "Field Technician",
      email: "tech@omnitech.io",
      phone: "+263 77 111 1111",
      passwordHash,
      role: "TECHNICIAN"
    }
  });
  await assignRole(technician.id, roles.TECHNICIAN.id);

  const sales = await prisma.user.upsert({
    where: { email: "sales@omnitech.io" },
    update: { role: "SALES_MARKETING" },
    create: {
      name: "Sales Consultant",
      email: "sales@omnitech.io",
      passwordHash,
      role: "SALES_MARKETING"
    }
  });
  await assignRole(sales.id, roles.SALES_MARKETING.id);

  const repairCategory = await prisma.serviceCategory.upsert({
    where: { slug: "repairs" },
    update: {},
    create: { name: "Repairs", slug: "repairs", description: "Phones, PCs, laptops, TVs and general electronics.", sortOrder: 1 }
  });
  const connectCategory = await prisma.serviceCategory.upsert({
    where: { slug: "connectivity" },
    update: {},
    create: { name: "Connectivity", slug: "connectivity", description: "Starlink, networks, Wi-Fi and infrastructure.", sortOrder: 2 }
  });
  const buildCategory = await prisma.serviceCategory.upsert({
    where: { slug: "build" },
    update: {},
    create: { name: "Build", slug: "build", description: "Websites, software systems and mobile applications.", sortOrder: 3 }
  });
  const automateCategory = await prisma.serviceCategory.upsert({
    where: { slug: "automation" },
    update: {},
    create: { name: "Automation", slug: "automation", description: "AI applications, workflow automation and digital transformation.", sortOrder: 4 }
  });

  const starlinkService = await prisma.service.upsert({
    where: { slug: "starlink-installation" },
    update: {},
    create: {
      categoryId: connectCategory.id,
      name: "Starlink kit support and installation",
      slug: "starlink-installation",
      summary: "Site survey, mount, cable route, router setup and handover.",
      description: "End-to-end Starlink installation workflow for homes, lodges, farms, schools and businesses.",
      basePrice: 120,
      estimatedHours: 3,
      isFieldService: true
    }
  });

  const laptopService = await prisma.service.upsert({
    where: { slug: "pc-laptop-repairs" },
    update: {},
    create: {
      categoryId: repairCategory.id,
      name: "PC and laptop repairs",
      slug: "pc-laptop-repairs",
      summary: "Diagnostics, upgrades, charging faults, storage, OS rebuilds and component replacement.",
      description: "Workshop repair workflow with diagnosis, customer approval, parts tracking and warranty.",
      basePrice: 20,
      estimatedHours: 2
    }
  });

  await prisma.service.upsert({
    where: { slug: "web-software-mobile" },
    update: {},
    create: {
      categoryId: buildCategory.id,
      name: "Web, software and mobile applications",
      slug: "web-software-mobile",
      summary: "Websites, portals, workflow apps, APIs and integrations.",
      description: "Custom software delivery from discovery through build, handover and support.",
      basePrice: 300
    }
  });

  await prisma.service.upsert({
    where: { slug: "ai-automation" },
    update: {},
    create: {
      categoryId: automateCategory.id,
      name: "AI automation and digital transformation",
      slug: "ai-automation",
      summary: "AI assistants, reporting automation, document workflows and operational systems.",
      description: "Automation services that reduce manual work and create repeatable business processes.",
      basePrice: 250
    }
  });

  await seedRegionalExamples({ adminId: admin.id, technicianId: technician.id, salesId: sales.id });

  const customerUser = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: { role: "CUSTOMER" },
    create: {
      name: "Tariro Moyo",
      email: "customer@example.com",
      phone: "+263 77 222 2222",
      passwordHash,
      role: "CUSTOMER"
    }
  });
  await assignRole(customerUser.id, roles.CUSTOMER.id);

  const customer = await prisma.customer.upsert({
    where: { phone: "+263 77 222 2222" },
    update: { userId: customerUser.id },
    create: {
      userId: customerUser.id,
      type: "LODGE",
      name: "Tariro Moyo",
      email: "customer@example.com",
      phone: "+263 77 222 2222",
      organization: "Green Valley Lodge",
      notes: "Prefers WhatsApp updates for installations and after-service support."
    }
  });

  await prisma.customerAddress.create({
    data: {
      customerId: customer.id,
      type: "INSTALLATION",
      label: "Lodge reception",
      line1: "Borrowdale Road",
      city: "Harare",
      province: "Harare",
      isDefault: true
    }
  });

  const device = await prisma.device.create({
    data: {
      customerId: customer.id,
      type: "Starlink kit",
      make: "Starlink",
      model: "Standard Kit",
      serialNumber: "STAR-SEED-001",
      conditionNotes: "Customer supplied sealed kit."
    }
  });

  const laptopDevice = await prisma.device.create({
    data: {
      customerId: customer.id,
      type: "LAPTOP",
      make: "HP",
      model: "EliteBook",
      serialNumber: "HP-SEED-REPAIR-001",
      conditionNotes: "Scratches on lid, no visible liquid residue.",
      accessories: "Charger, laptop bag"
    }
  });

  const repairJob = await prisma.jobCard.upsert({
    where: { jobNumber: "JOB-2026-REPAIR01" },
    update: {},
    create: {
      jobNumber: "JOB-2026-REPAIR01",
      customerId: customer.id,
      deviceId: laptopDevice.id,
      assignedToId: technician.id,
      type: "BENCH_REPAIR",
      status: "DIAGNOSING",
      priority: "NORMAL",
      faultReported: "Laptop does not charge reliably and shuts down when moved."
    }
  });

  await prisma.repairIntake.upsert({
    where: { intakeNumber: "RIN-2026-SEED01" },
    update: {},
    create: {
      intakeNumber: "RIN-2026-SEED01",
      jobCardId: repairJob.id,
      deviceId: laptopDevice.id,
      deviceType: "LAPTOP",
      faultCategory: "CHARGING_PORT",
      repairStatus: "DIAGNOSING",
      conditionPhotos: [{ filename: "hp-elitebook-front.jpg", url: "/storage/seed/hp-elitebook-front.jpg" }],
      accessoriesReceived: ["Charger", "Laptop bag"],
      faultDescription: "Charging port is loose; device powers off when the charger is moved.",
      receivedById: admin.id,
      technicianId: technician.id,
      labourEstimateHours: 2,
      labourEstimateAmount: 35,
      warrantyTerms: "30-day workmanship warranty after repair completion.",
      receivedAt: new Date()
    }
  });

  await prisma.repairChecklist.create({
    data: {
      jobCardId: repairJob.id,
      type: "DIAGNOSTIC",
      title: "Laptop charging diagnostic",
      items: [
        { label: "Inspect charger and cable", checked: true },
        { label: "Test charging port movement", checked: true },
        { label: "Check battery health", checked: false },
        { label: "Inspect board for liquid damage", checked: false }
      ],
      completedById: technician.id,
      completedAt: new Date(),
      notes: "Port replacement likely required."
    }
  });

  await prisma.repairPartNeed.create({
    data: {
      jobCardId: repairJob.id,
      partName: "HP EliteBook USB-C charging port",
      quantity: 1,
      estimatedUnitCost: 8,
      isRequired: true,
      notes: "Confirm exact board revision before ordering."
    }
  });

  const request = await prisma.serviceRequest.upsert({
    where: { requestNumber: "REQ-2026-SEED01" },
    update: {},
    create: {
      requestNumber: "REQ-2026-SEED01",
      customerId: customer.id,
      serviceId: starlinkService.id,
      deviceId: device.id,
      createdById: sales.id,
      title: "Install Starlink kit at lodge reception",
      description: "Need roof-mounted Starlink installation, internal router placement and guest Wi-Fi handover.",
      status: "TRIAGED",
      priority: "HIGH",
      intakeChannel: "Website",
      locationNote: "Reception building roof, guest Wi-Fi router near front desk."
    }
  });

  const job = await prisma.jobCard.upsert({
    where: { jobNumber: "JOB-2026-SEED01" },
    update: {},
    create: {
      jobNumber: "JOB-2026-SEED01",
      requestId: request.id,
      customerId: customer.id,
      deviceId: device.id,
      assignedToId: technician.id,
      type: "STARLINK_INSTALLATION",
      status: "IN_PROGRESS",
      priority: "HIGH",
      faultReported: request.description,
      scheduledFor: new Date("2026-06-02T08:00:00.000Z")
    }
  });

  await prisma.jobStatusHistory.create({
    data: {
      jobCardId: job.id,
      fromStatus: "CREATED",
      toStatus: "IN_PROGRESS",
      changedById: admin.id,
      note: "Assigned to field technician after intake triage."
    }
  });

  await prisma.diagnosis.create({
    data: {
      jobCardId: job.id,
      technicianId: technician.id,
      status: "FINAL",
      symptoms: "Customer requires stable internet for lodge reception and guest Wi-Fi.",
      findings: "Site needs obstruction check, cable route planning and router placement.",
      recommendation: "Install roof mount, weather-safe cable route and document signal test results.",
      estimatedCost: 180,
      estimatedHours: 3
    }
  });

  const supplier = await prisma.supplier.create({
    data: {
      name: "OmniTech Preferred Parts",
      contactName: "Procurement Desk",
      email: "parts@example.com",
      phone: "+263 77 333 3333"
    }
  });

  const mount = await prisma.inventoryItem.upsert({
    where: { sku: "STAR-MOUNT-001" },
    update: {},
    create: {
      supplierId: supplier.id,
      sku: "STAR-MOUNT-001",
      name: "Starlink roof mount kit",
      category: "Starlink",
      quantityOnHand: 4,
      reorderLevel: 3,
      unitCost: 55,
      sellingPrice: 75,
      location: "Main store"
    }
  });

  await prisma.stockMovement.create({
    data: {
      inventoryItemId: mount.id,
      supplierId: supplier.id,
      jobCardId: job.id,
      type: "USED_ON_JOB",
      quantity: -1,
      unitCost: 55,
      reference: job.jobNumber,
      notes: "Reserved for lodge Starlink installation."
    }
  });

  const quotation = await prisma.quotation.upsert({
    where: { quotationNumber: "QTE-2026-SEED01" },
    update: {},
    create: {
      quotationNumber: "QTE-2026-SEED01",
      customerId: customer.id,
      jobCardId: job.id,
      status: "SENT",
      subtotal: 180,
      discount: 0,
      tax: 0,
      total: 180,
      validUntil: new Date("2026-06-15T23:59:59.000Z"),
      items: {
        create: [
          { description: "Starlink installation labour", quantity: 1, unitPrice: 120, total: 120, sortOrder: 1 },
          { description: "Mounting and cable management materials", quantity: 1, unitPrice: 60, total: 60, sortOrder: 2 }
        ]
      }
    }
  });

  const invoice = await prisma.invoice.upsert({
    where: { invoiceNumber: "INV-2026-SEED01" },
    update: {},
    create: {
      invoiceNumber: "INV-2026-SEED01",
      customerId: customer.id,
      jobCardId: job.id,
      quotationId: quotation.id,
      status: "PARTIALLY_PAID",
      subtotal: 180,
      discount: 0,
      tax: 0,
      total: 180,
      paidAmount: 80,
      balanceDue: 100,
      issuedAt: new Date(),
      dueAt: new Date("2026-06-20T23:59:59.000Z")
    }
  });

  const payment = await prisma.payment.upsert({
    where: { paymentNumber: "PAY-2026-SEED01" },
    update: {},
    create: {
      paymentNumber: "PAY-2026-SEED01",
      customerId: customer.id,
      invoiceId: invoice.id,
      recordedById: admin.id,
      method: "CASH",
      status: "CONFIRMED",
      amount: 80,
      paidAt: new Date()
    }
  });

  await prisma.receipt.upsert({
    where: { receiptNumber: "RCT-2026-SEED01" },
    update: {},
    create: {
      receiptNumber: "RCT-2026-SEED01",
      customerId: customer.id,
      invoiceId: invoice.id,
      paymentId: payment.id,
      amount: 80
    }
  });

  const appointment = await prisma.appointment.create({
    data: {
      customerId: customer.id,
      serviceRequestId: request.id,
      jobCardId: job.id,
      assignedToId: technician.id,
      title: "Starlink installation visit",
      status: "CONFIRMED",
      startsAt: new Date("2026-06-02T08:00:00.000Z"),
      endsAt: new Date("2026-06-02T11:00:00.000Z"),
      location: "Green Valley Lodge reception",
      notes: "Call site contact 30 minutes before arrival."
    }
  });

  const visit = await prisma.fieldVisit.create({
    data: {
      visitNumber: "VIS-2026-SEED01",
      appointmentId: appointment.id,
      customerId: customer.id,
      jobCardId: job.id,
      technicianId: technician.id,
      serviceType: "STARLINK",
      status: "PLANNED",
      siteContact: "Tariro Moyo",
      sitePhone: "+263 77 222 2222",
      address: "Green Valley Lodge, Borrowdale Road, Harare",
      travelNotes: "Use rear service entrance; roof access from courtyard.",
      fieldPhotos: [{ filename: "site-front.jpg", url: "/storage/seed/site-front.jpg", caption: "Reception building access" }],
      outcome: "Pending installation visit."
    }
  });

  await prisma.installationChecklist.create({
    data: {
      fieldVisitId: visit.id,
      type: "STARLINK",
      name: "Starlink commissioning checklist",
      items: [
        { label: "Confirm clear sky view", done: false },
        { label: "Mount securely", done: false },
        { label: "Weatherproof cable route", done: false },
        { label: "Configure router and Wi-Fi name", done: false },
        { label: "Run speed and obstruction tests", done: false },
        { label: "Customer handover completed", done: false }
      ]
    }
  });

  await prisma.followUpTask.create({
    data: {
      fieldVisitId: visit.id,
      jobCardId: job.id,
      assignedToId: technician.id,
      title: "Confirm guest Wi-Fi coverage after installation",
      description: "Run signal test from reception to dining area and note whether mesh extender is required.",
      status: "OPEN",
      dueAt: new Date("2026-06-03T10:00:00.000Z")
    }
  });

  const starlinkDisclaimer =
    "OmniTech Solutions provides independent Starlink-related installation, setup and support services. OmniTech does not claim official Starlink partnership or reseller status unless this is explicitly configured and displayed later.";

  await prisma.starlinkEnquiry.upsert({
    where: { enquiryNumber: "STQ-2026-SEED01" },
    update: {},
    create: {
      enquiryNumber: "STQ-2026-SEED01",
      customerId: customer.id,
      serviceRequestId: request.id,
      jobCardId: job.id,
      enquiryType: "INSTALLATION",
      kitStatus: "Customer supplied kit",
      siteAddress: "Green Valley Lodge, Borrowdale Road, Harare",
      siteContact: "Tariro Moyo",
      sitePhone: "+263 77 222 2222",
      usageGoal: "Reception office and guest Wi-Fi connectivity.",
      notes: `Site needs clear-sky check and guest Wi-Fi coverage plan.\n\nDisclaimer: ${starlinkDisclaimer}`,
      officialDisclaimerAccepted: true
    }
  });

  await prisma.starlinkSiteSurvey.upsert({
    where: { surveyNumber: "STS-2026-SEED01" },
    update: {},
    create: {
      surveyNumber: "STS-2026-SEED01",
      customerId: customer.id,
      jobCardId: job.id,
      fieldVisitId: visit.id,
      obstructionLevel: "MINOR",
      obstructionNotes: "Trees on the western side; roof ridge has clearer view.",
      recommendedMounting: "ROOF",
      roofAccessNotes: "Use ladder from rear courtyard.",
      cableRouteNotes: "Route cable through existing conduit near reception ceiling.",
      powerLocationNotes: "Router power available behind reception desk.",
      photos: [{ filename: "roof-view.jpg", url: "/storage/seed/roof-view.jpg" }],
      completedById: technician.id,
      completedAt: new Date()
    }
  });

  const starlinkPlan = await prisma.starlinkInstallationPlan.upsert({
    where: { planNumber: "STP-2026-SEED01" },
    update: {},
    create: {
      planNumber: "STP-2026-SEED01",
      customerId: customer.id,
      jobCardId: job.id,
      mountingType: "ROOF",
      accessoriesRequired: ["Roof mount", "Cable clips", "Weatherproof sealant", "Mesh extender"],
      wifiCoveragePlan: "Primary router at reception; mesh extender in dining area for guest coverage.",
      routerConfigNotes: "Set business SSID and separate guest SSID; record admin handover notes.",
      meshExtenderPlan: "Place extender halfway between reception and dining area; test signal after setup.",
      setupChecklist: [
        { label: "Confirm mount position", checked: false },
        { label: "Secure dish and cable", checked: false },
        { label: "Configure router SSIDs", checked: false },
        { label: "Run obstruction and speed tests", checked: false },
        { label: "Complete handover", checked: false }
      ]
    }
  });

  await prisma.starlinkSupportTicket.upsert({
    where: { ticketNumber: "STT-2026-SEED01" },
    update: {},
    create: {
      ticketNumber: "STT-2026-SEED01",
      customerId: customer.id,
      jobCardId: job.id,
      status: "OPEN",
      issue: "Customer asked for post-installation guest Wi-Fi coverage check."
    }
  });

  await prisma.starlinkServiceRecord.upsert({
    where: { recordNumber: "STR-2026-SEED01" },
    update: {},
    create: {
      recordNumber: "STR-2026-SEED01",
      customerId: customer.id,
      jobCardId: job.id,
      type: "TROUBLESHOOTING",
      issueSummary: "Guest Wi-Fi coverage weak near dining area.",
      actionsTaken: "Planned mesh extender placement and follow-up signal test.",
      outcome: "Pending field confirmation.",
      createdById: admin.id
    }
  });

  await prisma.warranty.upsert({
    where: { warrantyNumber: "WAR-2026-SEED01" },
    update: {},
    create: {
      warrantyNumber: "WAR-2026-SEED01",
      customerId: customer.id,
      jobCardId: job.id,
      deviceId: device.id,
      status: "ACTIVE",
      coverage: "30-day workmanship warranty for installation labour.",
      terms: "Excludes customer equipment defects, lightning damage and third-party tampering.",
      startsAt: new Date("2026-06-02T00:00:00.000Z"),
      endsAt: new Date("2026-07-02T23:59:59.000Z")
    }
  });

  const requestTemplate = await prisma.messageTemplate.upsert({
    where: { key: "request.received.email" },
    update: {},
    create: {
      key: "request.received.email",
      name: "Request received",
      channel: "EMAIL",
      trigger: "REQUEST_RECEIVED",
      subject: "OmniTech request received: {{requestNumber}}",
      body: "Hello {{customerName}}, we received your request and will contact you shortly.",
      variables: ["requestNumber", "customerName"]
    }
  });

  const triggerTemplates = [
    ["JOB_CREATED", "Job created", "Job created: {{jobNumber}}", "Hello {{customerName}}, OmniTech created job card {{jobNumber}} for your request.", ["jobNumber", "customerName"]],
    ["DIAGNOSIS_COMPLETE", "Diagnosis complete", "Diagnosis complete: {{jobNumber}}", "Diagnosis is complete for {{jobNumber}}. Recommendation: {{recommendation}}", ["jobNumber", "recommendation"]],
    ["QUOTATION_SENT", "Quotation sent", "Quotation ready: {{quotationNumber}}", "Your OmniTech quotation {{quotationNumber}} is ready. Total: {{total}}.", ["quotationNumber", "total"]],
    ["QUOTATION_APPROVED", "Quotation approved", "Quotation approved: {{quotationNumber}}", "Quotation {{quotationNumber}} has been approved. We will continue with the next step.", ["quotationNumber"]],
    ["PARTS_ORDERED", "Parts ordered", "Parts update: {{jobNumber}}", "Parts for {{jobNumber}} have been ordered or reserved.", ["jobNumber"]],
    ["REPAIR_IN_PROGRESS", "Repair in progress", "Work in progress: {{jobNumber}}", "OmniTech has started repair or installation work on {{jobNumber}}.", ["jobNumber"]],
    ["READY_FOR_COLLECTION", "Ready for collection", "Ready for collection: {{jobNumber}}", "{{jobNumber}} is ready for collection. Please contact OmniTech before coming through.", ["jobNumber"]],
    ["INVOICE_ISSUED", "Invoice issued", "Invoice issued: {{invoiceNumber}}", "Invoice {{invoiceNumber}} has been issued. Amount due: {{total}}.", ["invoiceNumber", "total"]],
    ["PAYMENT_RECEIVED", "Payment received", "Payment received: {{receiptNumber}}", "Thank you. Payment for {{invoiceNumber}} was received. Receipt: {{receiptNumber}}.", ["invoiceNumber", "receiptNumber"]],
    ["WARRANTY_EXPIRING", "Warranty expiring", "Warranty reminder: {{warrantyNumber}}", "Your OmniTech warranty {{warrantyNumber}} expires on {{expiryDate}}.", ["warrantyNumber", "expiryDate"]],
    ["FOLLOW_UP_REMINDER", "Follow-up reminder", "Follow-up reminder: {{taskTitle}}", "Reminder: {{taskTitle}} is due on {{dueDate}}.", ["taskTitle", "dueDate"]]
  ] as const;

  for (const [trigger, name, subject, body, variables] of triggerTemplates) {
    await prisma.messageTemplate.upsert({
      where: { key: `${trigger.toLowerCase()}.email` },
      update: {},
      create: {
        key: `${trigger.toLowerCase()}.email`,
        name,
        channel: "EMAIL",
        trigger,
        subject,
        body,
        variables: [...variables]
      }
    });
    await prisma.messageTemplate.upsert({
      where: { key: `${trigger.toLowerCase()}.whatsapp` },
      update: {},
      create: {
        key: `${trigger.toLowerCase()}.whatsapp`,
        name: `${name} WhatsApp`,
        channel: "WHATSAPP",
        trigger,
        body: `${subject}\n${body}`,
        variables: [...variables]
      }
    });
  }

  await prisma.notificationLog.create({
    data: {
      templateId: requestTemplate.id,
      userId: customerUser.id,
      serviceRequestId: request.id,
      trigger: "REQUEST_RECEIVED",
      channel: "EMAIL",
      status: "QUEUED",
      recipient: "customer@example.com",
      subject: "OmniTech request received: REQ-2026-SEED01",
      body: "Hello Tariro Moyo, we received your request and will contact you shortly."
    }
  });

  await prisma.promotion.upsert({
    where: { slug: "back-to-school-laptop-health-check" },
    update: {},
    create: {
      title: "Back-to-school laptop health check",
      slug: "back-to-school-laptop-health-check",
      audience: "Schools and students",
      offer: "Diagnostics, cleaning, storage health check and upgrade recommendations.",
      channelPlan: "Website, WhatsApp broadcast and school outreach email.",
      status: "ACTIVE",
      startsAt: new Date("2026-05-01T00:00:00.000Z"),
      endsAt: new Date("2026-07-31T23:59:59.000Z")
    }
  });

  await prisma.portfolioProject.upsert({
    where: { slug: "green-valley-lodge-starlink" },
    update: {
      category: "STARLINK_INSTALLATION",
      clientSector: "Hospitality",
      challenge: "The lodge needed stable guest connectivity across reception and guest areas with a clean installation that could be supported later.",
      solution: "OmniTech completed the site survey, selected a clear mounting position, routed cable neatly, configured the router and documented handover notes.",
      toolsUsed: ["Starlink", "Roof mount", "Wi-Fi planning", "Installation checklist"],
      outcome: "Reliable guest internet coverage with a documented support path for future troubleshooting.",
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      beforeImageUrls: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"],
      afterImageUrls: ["https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"],
      visibility: "ANONYMIZED",
      featured: true,
      sortOrder: 10
    },
    create: {
      title: "Lodge Starlink deployment",
      slug: "green-valley-lodge-starlink",
      category: "STARLINK_INSTALLATION",
      clientName: "Green Valley Lodge",
      clientSector: "Hospitality",
      summary: "Roof mount, router placement, guest Wi-Fi support and handover documentation.",
      challenge: "The lodge needed stable guest connectivity across reception and guest areas with a clean installation that could be supported later.",
      solution: "OmniTech completed the site survey, selected a clear mounting position, routed cable neatly, configured the router and documented handover notes.",
      toolsUsed: ["Starlink", "Roof mount", "Wi-Fi planning", "Installation checklist"],
      outcome: "Reliable guest internet coverage with a documented support path for future troubleshooting.",
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      beforeImageUrls: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"],
      afterImageUrls: ["https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"],
      visibility: "ANONYMIZED",
      showClientName: false,
      featured: true,
      sortOrder: 10,
      published: true,
      publishedAt: new Date()
    }
  });

  await prisma.portfolioProject.upsert({
    where: { slug: "local-academy-network-refresh" },
    update: {
      category: "NETWORK_INSTALLATION",
      clientSector: "Education",
      challenge: "A school computer lab had unreliable Wi-Fi and no clear record of router, switch and access point settings.",
      solution: "OmniTech audited the network, cleaned up switch placement, improved Wi-Fi coverage and documented the support setup.",
      toolsUsed: ["Router configuration", "Switch cleanup", "Wi-Fi survey", "ICT maintenance"],
      outcome: "More dependable classroom connectivity and a clear maintenance baseline for future support.",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      beforeImageUrls: ["https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80"],
      afterImageUrls: ["https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"],
      visibility: "ANONYMIZED",
      featured: true,
      sortOrder: 20
    },
    create: {
      title: "School network refresh",
      slug: "local-academy-network-refresh",
      category: "NETWORK_INSTALLATION",
      clientSector: "Education",
      summary: "Wi-Fi coverage improvement, router cleanup, support notes and preventive maintenance plan for a school lab.",
      challenge: "A school computer lab had unreliable Wi-Fi and no clear record of router, switch and access point settings.",
      solution: "OmniTech audited the network, cleaned up switch placement, improved Wi-Fi coverage and documented the support setup.",
      toolsUsed: ["Router configuration", "Switch cleanup", "Wi-Fi survey", "ICT maintenance"],
      outcome: "More dependable classroom connectivity and a clear maintenance baseline for future support.",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      beforeImageUrls: ["https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80"],
      afterImageUrls: ["https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"],
      visibility: "ANONYMIZED",
      featured: true,
      sortOrder: 20,
      published: true,
      publishedAt: new Date()
    }
  });

  await prisma.portfolioProject.upsert({
    where: { slug: "sme-workflow-portal" },
    update: {
      category: "SOFTWARE_SYSTEM",
      clientSector: "SME",
      challenge: "A service business was tracking requests, quotes and follow-ups manually across chats and spreadsheets.",
      solution: "OmniTech designed a web portal with request intake, quotation approvals, admin operations views and automation-ready notifications.",
      toolsUsed: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Automation"],
      outcome: "Cleaner customer intake, faster follow-ups and a foundation for subscription-style managed software.",
      imageUrl: "/portfolio/sme-workflow-portal.png",
      beforeImageUrls: ["https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"],
      afterImageUrls: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"],
      visibility: "ANONYMIZED",
      featured: true,
      sortOrder: 30
    },
    create: {
      title: "SME workflow portal",
      slug: "sme-workflow-portal",
      category: "SOFTWARE_SYSTEM",
      clientSector: "SME",
      summary: "Customer intake, quote approval and operations dashboard for a growing local service business.",
      challenge: "A service business was tracking requests, quotes and follow-ups manually across chats and spreadsheets.",
      solution: "OmniTech designed a web portal with request intake, quotation approvals, admin operations views and automation-ready notifications.",
      toolsUsed: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Automation"],
      outcome: "Cleaner customer intake, faster follow-ups and a foundation for subscription-style managed software.",
      imageUrl: "/portfolio/sme-workflow-portal.png",
      beforeImageUrls: ["https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"],
      afterImageUrls: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"],
      visibility: "ANONYMIZED",
      featured: true,
      sortOrder: 30,
      published: true,
      publishedAt: new Date()
    }
  });

  await prisma.portfolioProject.upsert({
    where: { slug: "valley-farm-secrets-website" },
    update: {
      title: "Valley Farm Secrets website",
      category: "WEBSITE",
      clientName: "Valley Farm Secrets",
      clientSector: "Agriculture",
      summary: "Public brand website for valleyfarmsecrets.com with a clean content structure and customer-facing digital presence.",
      challenge: "The brand needed a dedicated online home that could present its identity, content and enquiries outside social channels.",
      solution: "OmniTech built a responsive website foundation with brand-led pages, clear navigation and a structure ready for future product or content growth.",
      toolsUsed: ["Website", "Responsive design", "Brand content", "valleyfarmsecrets.com"],
      outcome: "Valley Farm Secrets gained a real public website that gives customers a direct place to discover and contact the brand.",
      imageUrl: "/portfolio/valley-farm-secrets-services.png",
      beforeImageUrls: ["https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1200&q=80"],
      afterImageUrls: ["https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80"],
      visibility: "PUBLIC",
      showClientName: true,
      featured: true,
      sortOrder: 35,
      published: true,
      publishedAt: new Date()
    },
    create: {
      title: "Valley Farm Secrets website",
      slug: "valley-farm-secrets-website",
      category: "WEBSITE",
      clientName: "Valley Farm Secrets",
      clientSector: "Agriculture",
      summary: "Public brand website for valleyfarmsecrets.com with a clean content structure and customer-facing digital presence.",
      challenge: "The brand needed a dedicated online home that could present its identity, content and enquiries outside social channels.",
      solution: "OmniTech built a responsive website foundation with brand-led pages, clear navigation and a structure ready for future product or content growth.",
      toolsUsed: ["Website", "Responsive design", "Brand content", "valleyfarmsecrets.com"],
      outcome: "Valley Farm Secrets gained a real public website that gives customers a direct place to discover and contact the brand.",
      imageUrl: "/portfolio/valley-farm-secrets-services.png",
      beforeImageUrls: ["https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1200&q=80"],
      afterImageUrls: ["https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80"],
      visibility: "PUBLIC",
      showClientName: true,
      featured: true,
      sortOrder: 35,
      published: true,
      publishedAt: new Date()
    }
  });

  await prisma.portfolioProject.upsert({
    where: { slug: "mussy-consultancy-platform" },
    update: {
      title: "Mussy Consultancy website and app",
      category: "SOFTWARE_SYSTEM",
      clientName: "Mussy Consultancy",
      clientSector: "Education consultancy",
      summary: "Consultancy website and application experience for mussyconsultancy.org, built around enquiries and service trust.",
      challenge: "The consultancy needed a clearer digital presence for prospects to understand services and begin the enquiry process online.",
      solution: "OmniTech delivered a responsive website and application experience with service messaging, enquiry flow and a foundation for ongoing digital operations.",
      toolsUsed: ["Website", "Web app", "Lead capture", "mussyconsultancy.org"],
      outcome: "Mussy Consultancy gained a branded digital channel that supports enquiries and presents the business more professionally.",
      imageUrl: "/portfolio/mussy-consultancy-home.png",
      beforeImageUrls: ["https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"],
      afterImageUrls: ["https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"],
      visibility: "PUBLIC",
      showClientName: true,
      featured: true,
      sortOrder: 36,
      published: true,
      publishedAt: new Date()
    },
    create: {
      title: "Mussy Consultancy website and app",
      slug: "mussy-consultancy-platform",
      category: "SOFTWARE_SYSTEM",
      clientName: "Mussy Consultancy",
      clientSector: "Education consultancy",
      summary: "Consultancy website and application experience for mussyconsultancy.org, built around enquiries and service trust.",
      challenge: "The consultancy needed a clearer digital presence for prospects to understand services and begin the enquiry process online.",
      solution: "OmniTech delivered a responsive website and application experience with service messaging, enquiry flow and a foundation for ongoing digital operations.",
      toolsUsed: ["Website", "Web app", "Lead capture", "mussyconsultancy.org"],
      outcome: "Mussy Consultancy gained a branded digital channel that supports enquiries and presents the business more professionally.",
      imageUrl: "/portfolio/mussy-consultancy-home.png",
      beforeImageUrls: ["https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"],
      afterImageUrls: ["https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"],
      visibility: "PUBLIC",
      showClientName: true,
      featured: true,
      sortOrder: 36,
      published: true,
      publishedAt: new Date()
    }
  });

  await prisma.testimonial.create({
    data: {
      customerId: customer.id,
      name: "Tariro Moyo",
      company: "Green Valley Lodge",
      clientSector: "Hospitality",
      quote: "OmniTech handled the installation neatly and documented every step.",
      rating: 5,
      consentToPublish: true,
      privacyLabel: "Operations Lead",
      published: true,
      publishedAt: new Date()
    }
  });

  await prisma.blogPost.upsert({
    where: { slug: "starlink-site-survey-checklist" },
    update: {
      category: "STARLINK",
      seoTitle: "Starlink Site Survey Checklist | OmniTech Solutions",
      seoDescription: "What to inspect before a Starlink installation: obstructions, roof access, cable route, router placement and power stability.",
      featuredImageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      featuredImageAlt: "Network equipment and installation planning",
      relatedServiceSlug: "starlink-installations"
    },
    create: {
      title: "Starlink site survey checklist",
      slug: "starlink-site-survey-checklist",
      excerpt: "What to inspect before mounting a Starlink kit for a home, lodge, farm or school.",
      body: "Before installing a Starlink kit, check for clear sky view, safe roof access, cable route length, router placement, power stability and who will use the connection. A good survey reduces repeat visits and makes handover easier.",
      category: "STARLINK",
      status: "PUBLISHED",
      seoTitle: "Starlink Site Survey Checklist | OmniTech Solutions",
      seoDescription: "What to inspect before a Starlink installation: obstructions, roof access, cable route, router placement and power stability.",
      featuredImageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      featuredImageAlt: "Network equipment and installation planning",
      relatedServiceSlug: "starlink-installations",
      tags: ["Starlink", "Networking", "Installation"],
      publishedAt: new Date()
    }
  });

  const knowledgePosts = [
    {
      title: "Simple device care habits that prevent common repairs",
      slug: "device-care-habits-prevent-common-repairs",
      excerpt: "Small habits around charging, cleaning, storage and handling can prevent expensive phone, laptop and electronics repairs.",
      body: "Most preventable device faults start with heat, dust, poor charging habits, liquid exposure or rough handling. Keep ports clean, avoid using damaged chargers, protect devices from moisture, and bring intermittent faults in early before they become board-level repairs.",
      category: "DEVICE_CARE",
      relatedServiceSlug: "electronics-repairs",
      tags: ["Device care", "Repairs", "Maintenance"],
      featuredImageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
      featuredImageAlt: "Smartphone being checked on a workbench"
    },
    {
      title: "When a laptop needs cleaning, RAM, SSD or replacement",
      slug: "laptop-performance-cleaning-ram-ssd-replacement",
      excerpt: "A practical guide to diagnosing slow laptops before spending money on upgrades or replacement.",
      body: "Slow laptops are not all the same. Heat and dust cause throttling, low RAM causes freezing, hard drives cause long startup times, and malware or bloated startup apps can make good hardware feel broken. A structured diagnosis helps decide whether cleaning, RAM, SSD, software repair or replacement makes financial sense.",
      category: "LAPTOP_PERFORMANCE",
      relatedServiceSlug: "electronics-repairs",
      tags: ["Laptops", "SSD", "Performance"],
      featuredImageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
      featuredImageAlt: "Laptop on a desk ready for performance checks"
    },
    {
      title: "Networking basics for small offices and schools",
      slug: "networking-basics-small-offices-schools",
      excerpt: "Understand routers, switches, access points, cabling and Wi-Fi coverage before planning a network upgrade.",
      body: "A reliable network starts with the right layout. Routers manage internet traffic, switches connect wired devices, access points provide Wi-Fi, and structured cabling reduces random failures. For schools and offices, documentation and sensible placement matter as much as hardware.",
      category: "NETWORKING",
      relatedServiceSlug: "networking",
      tags: ["Networking", "Wi-Fi", "Infrastructure"],
      featuredImageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      featuredImageAlt: "Network cables connected to infrastructure equipment"
    },
    {
      title: "Cybersecurity basics every small business should know",
      slug: "cybersecurity-basics-small-business",
      excerpt: "Start with strong passwords, backups, updates, device controls and staff awareness before buying complex tools.",
      body: "Cybersecurity does not begin with expensive software. Start with unique passwords, multi-factor authentication where available, regular backups, updated devices, controlled administrator access and staff awareness around links, attachments and payment-change requests.",
      category: "CYBERSECURITY_BASICS",
      relatedServiceSlug: "ict-support",
      tags: ["Cybersecurity", "Backups", "SMEs"],
      featuredImageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
      featuredImageAlt: "Person reviewing security settings on a laptop"
    },
    {
      title: "What a business website needs before design starts",
      slug: "business-website-before-design-starts",
      excerpt: "Clear services, trust signals, contact flows and conversion goals make a website easier to build and easier to use.",
      body: "A good website starts with business clarity. Define your audience, services, proof of work, contact process, frequently asked questions and conversion goals before choosing colours or layouts. This makes design faster and produces a site that actually supports sales.",
      category: "WEBSITES",
      relatedServiceSlug: "web-development",
      tags: ["Websites", "SEO", "Content"],
      featuredImageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
      featuredImageAlt: "Website code and design work on a laptop"
    },
    {
      title: "Business automation tasks worth starting with",
      slug: "business-automation-tasks-worth-starting-with",
      excerpt: "Begin automation with repetitive admin, customer intake, quote follow-ups, reminders and reporting.",
      body: "The best automation projects start with repeated, rule-based work. Customer intake, job-card updates, quotation follow-ups, invoice reminders, report generation and task notifications are strong first targets because they save time without requiring a complete business redesign.",
      category: "BUSINESS_AUTOMATION",
      relatedServiceSlug: "software-ai-systems",
      tags: ["Automation", "Operations", "Workflows"],
      featuredImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      featuredImageAlt: "Business analytics dashboard on a screen"
    },
    {
      title: "AI for SMEs without the hype",
      slug: "ai-for-smes-without-the-hype",
      excerpt: "Small businesses can use AI for drafts, summaries, support triage and reporting without handing over the whole operation.",
      body: "AI works best when it supports a clear workflow. SMEs can use it to draft adverts, summarise job notes, generate customer replies, classify support messages and prepare reports. Keep humans in approval loops and protect customer data.",
      category: "AI_FOR_SMES",
      relatedServiceSlug: "software-ai-systems",
      tags: ["AI", "SMEs", "Productivity"],
      featuredImageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
      featuredImageAlt: "Abstract AI technology interface"
    }
  ] as const;

  for (const post of knowledgePosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        excerpt: post.excerpt,
        body: post.body,
        category: post.category,
        status: "PUBLISHED",
        seoTitle: `${post.title} | OmniTech Solutions`,
        seoDescription: post.excerpt,
        featuredImageUrl: post.featuredImageUrl,
        featuredImageAlt: post.featuredImageAlt,
        relatedServiceSlug: post.relatedServiceSlug,
      tags: [...post.tags],
      publishedAt: new Date()
    },
    create: {
        ...post,
        tags: [...post.tags],
        status: "PUBLISHED",
        seoTitle: `${post.title} | OmniTech Solutions`,
        seoDescription: post.excerpt,
        publishedAt: new Date()
      }
    });
  }

  await prisma.fAQ.create({
    data: {
      question: "Do I need a site survey before Starlink installation?",
      answer: "A site survey is recommended where there may be trees, tall buildings, difficult roof access or long cable routes.",
      category: "Starlink",
      sortOrder: 1
    }
  });

  await prisma.aIInteraction.create({
    data: {
      type: "DIAGNOSTICS",
      provider: "mock",
      model: "seed-assistant",
      prompt: "Suggest a Starlink installation checklist for a lodge reception.",
      response: "Check sky visibility, mount safety, cable routing, router position, speed test and handover.",
      userId: technician.id,
      jobCardId: job.id,
      metadata: { reviewedByHuman: true }
    }
  });

  await prisma.systemSetting.upsert({
    where: { key: "brand.promise" },
    update: { value: "We repair. We connect. We build. We automate." },
    create: {
      key: "brand.promise",
      value: "We repair. We connect. We build. We automate.",
      description: "Primary OmniTech Solutions brand promise."
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "SEED_COMPLETED",
      entity: "System",
      metadata: { seed: "full-omnitech-platform" }
    }
  });

  console.log("Seed complete.");
  console.log(`Admin login: admin@omnitech.io / ${password}`);
  console.log(`Technician login: tech@omnitech.io / ${password}`);
  console.log(`Customer login: customer@example.com / ${password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
