export type InventoryStatus = "current" | "network" | "pick";

export const inventoryStatusContent: Record<
  InventoryStatus,
  {
    label: string;
    badge: string;
    disclosure: string;
  }
> = {
  current: {
    label: "Current Inventory",
    badge: "Available Now",
    disclosure: "In hand, inspected, and ready to ship.",
  },
  network: {
    label: "Collector Network",
    badge: "Available Through Our Network",
    disclosure:
      "Available through our trusted collector network. Final availability and timeline confirmed before purchase.",
  },
  pick: {
    label: "Mir’s Picks",
    badge: "Curator’s Pick",
    disclosure:
      "Curated by GCT as an interesting market opportunity or collector-worthy piece. Not currently in stock.",
  },
};

export const inventoryStatusOptions = [
  { value: "current", label: inventoryStatusContent.current.label },
  { value: "network", label: inventoryStatusContent.network.label },
  { value: "pick", label: inventoryStatusContent.pick.label },
] as const;

export const inventoryWatches = [
  {
    brand: "M.A.D.Editions",
    model: "Grow Your Dreams M.A.D.1S",
    reference: "Yinka Ilori | Nature",
    inventoryStatus: "current",
    availabilityNote: inventoryStatusContent.current.disclosure,
    sourceType: "GCT owned inventory",
    isOwnedByGCT: true,
    canShipImmediately: true,
    description:
      "Yinka Ilori's Grow Your Dreams take on the M.A.D.1S turns the platform into something playful without losing the mechanical strangeness that makes the model compelling. This Nature configuration pairs a green rotor with purple and red rubber straps, so the watch reads more like a wearable design object than a conventional sports piece while still carrying real horological substance.",
    details: [
      "Yinka Ilori collaboration | Nature edition",
      "42mm stainless steel case with HyCeram bezel accents",
      "Swiss-made La Joux-Perret G101 automatic movement",
      "68-hour power reserve",
      "Rotating hours cylinder with Super-LumiNova numerals",
      "30m water resistance",
      "Mismatched purple and red rubber straps, plus white straps shown",
      "Stainless steel folding buckle and presentation kit shown",
    ],
    heroPhoto: 0,
    photos: [
      {
        src: "/collection/mad-editions-yinka-ilori-mad-1s-1.jpg",
        alt: "M.A.D.Editions Grow Your Dreams M.A.D.1S Nature edition front view with green rotor and yellow bezel accent",
        width: 1200,
        height: 1200,
        className: "aspect-square",
      },
      {
        src: "/collection/mad-editions-yinka-ilori-mad-1s-2.jpg",
        alt: "Side profile of the M.A.D.Editions Grow Your Dreams M.A.D.1S showing the purple strap and lateral time display",
        width: 1200,
        height: 1200,
        className: "aspect-square",
      },
      {
        src: "/collection/mad-editions-yinka-ilori-mad-1s-3.jpg",
        alt: "Underside view of the M.A.D.Editions Grow Your Dreams M.A.D.1S with open clasp and caseback details",
        width: 1200,
        height: 1200,
        className: "aspect-square",
      },
      {
        src: "/collection/mad-editions-yinka-ilori-mad-1s-4.jpg",
        alt: "Crown-side profile of the M.A.D.Editions Grow Your Dreams M.A.D.1S with red strap and Yinka Ilori motif",
        width: 1200,
        height: 1200,
        className: "aspect-square",
      },
      {
        src: "/collection/mad-editions-yinka-ilori-mad-1s-5.jpg",
        alt: "Presentation view of the M.A.D.Editions Grow Your Dreams M.A.D.1S with extra white straps and Yinka Ilori patch",
        width: 1200,
        height: 1200,
        className: "aspect-square",
      },
    ],
  },
  {
    brand: "Rado",
    model: "Captain Cook High-Tech Ceramic Skeleton",
    reference: "R32192152",
    inventoryStatus: "current",
    availabilityNote: inventoryStatusContent.current.disclosure,
    sourceType: "GCT owned inventory",
    isOwnedByGCT: true,
    canShipImmediately: true,
    description:
      "The Rado Captain Cook High-Tech Ceramic Skeleton blends modern materials with aggressive industrial design. Matte black ceramic keeps the watch lightweight and stealthy, while warm rose gold-tone accents add contrast and depth. The open-worked dial and exhibition caseback show the automatic movement from both sides, giving the piece a technical character that feels equal parts motorsport instrumentation and contemporary architecture.",
    details: [
      "43mm high-tech matte black ceramic case and bracelet",
      "Rose gold-tone bezel, crown, and dial accents",
      "Skeletonized automatic movement",
      "Sapphire crystal",
      "Exhibition caseback",
      "300m water resistance",
      "Full set with box and papers",
      "Condition: Excellent pre-owned",
    ],
    heroPhoto: 0,
    photos: [
      {
        src: "/collection/rado-captain-cook-high-tech-ceramic-skeleton-1.jpg",
        alt: "Close-up of the Rado Captain Cook High-Tech Ceramic Skeleton with rose gold-tone bezel accents",
        width: 1536,
        height: 2048,
        className: "aspect-[4/5]",
      },
      {
        src: "/collection/rado-captain-cook-high-tech-ceramic-skeleton-2.jpg",
        alt: "Side view of the Rado Captain Cook High-Tech Ceramic Skeleton showing the ceramic case and rose gold-tone bezel",
        width: 1536,
        height: 2048,
        className: "aspect-[4/5]",
      },
      {
        src: "/collection/rado-captain-cook-high-tech-ceramic-skeleton-3.jpg",
        alt: "Crown-side profile of the Rado Captain Cook High-Tech Ceramic Skeleton",
        width: 1536,
        height: 2048,
        className: "aspect-[4/5]",
      },
      {
        src: "/collection/rado-captain-cook-high-tech-ceramic-skeleton-4.jpg",
        alt: "Rado Captain Cook High-Tech Ceramic Skeleton matte black ceramic bracelet and clasp",
        width: 1536,
        height: 2048,
        className: "aspect-[4/5]",
      },
      {
        src: "/collection/rado-captain-cook-high-tech-ceramic-skeleton-5.jpg",
        alt: "Exhibition caseback of the Rado Captain Cook High-Tech Ceramic Skeleton",
        width: 1335,
        height: 1780,
        className: "aspect-[4/5]",
      },
      {
        src: "/collection/rado-captain-cook-high-tech-ceramic-skeleton-6.jpg",
        alt: "Rado Captain Cook High-Tech Ceramic Skeleton full set with box and papers",
        width: 1536,
        height: 2048,
        className: "aspect-[4/5]",
      },
    ],
  },
] as const;

export const currentInventoryWatches = inventoryWatches.filter(
  (watch) => watch.inventoryStatus === "current",
);

export const legacyInventoryWatches = [
  {
    brand: "Christopher Ward",
    model: "C65 Dune Aeolian GMT Blue Dial",
    reference: "Legacy piece",
    category: "GMT",
    description:
      "A blue-dial GMT with a relaxed field-watch attitude, brushed bracelet, and enough travel-watch utility to earn a place in the archive.",
    image: {
      src: "/collection/christopher-ward-c65-dune-aeolian-gmt-blue-dial.png",
      alt: "Christopher Ward C65 Dune Aeolian GMT Blue Dial shown in three archival views",
      width: 1360,
      height: 1156,
      className: "aspect-[4/3]",
    },
  },
  {
    brand: "Maurice Lacroix",
    model: "AIKON Mercury",
    reference: "AI6088-SS002-030-1 | Full Set",
    category: "Free hand",
    description:
      "One of the most unconventional modern complications in contemporary watchmaking: a patented free-hand system where the hour and minute hands drift away from conventional timekeeping and dynamically return when the watch is moved or engaged.",
    image: {
      src: "/collection/maurice-lacroix-aikon-mercury-full-presentation.png",
      alt: "Maurice Lacroix AIKON Mercury shown with dial view, full set, and exhibition caseback",
      width: 1536,
      height: 1024,
      className: "aspect-[3/2]",
    },
  },
  {
    brand: "Omega",
    model: "Speedmaster Reduced",
    reference: "3510.80.00 | Watch, box, card",
    category: "Chronograph",
    description:
      "A blue-dial Speedmaster Reduced with the crisp tri-register layout and compact proportions that make the reference especially wearable, archived with its red Omega box and card.",
    image: {
      src: "/collection/omega-speedmaster-reduced-3510-80-00-box-card.png",
      alt: "Omega Speedmaster Reduced 3510.80.00 with blue dial, red box, and card",
      width: 1402,
      height: 1122,
      className: "aspect-[4/3]",
    },
  },
] as const;

export const collectionWatches = [
  {
    brand: "Omega",
    model: "Constellation Megaquartz Day-Date",
    reference: "To be confirmed",
    description:
      "A 1976 Omega Constellation Megaquartz day-date with a brushed silver dial, faceted cushion case, and black leather strap. The appeal is in the proportions and finishing more than spectacle, with a quietly architectural case profile that feels completely rooted in Omega's quartz-era experimentation.",
    heroPhoto: 0,
    photos: [
      {
        src: "/images/omega-constellation-quartz/omega-constellation-quartz-hero.jpg",
        alt: "Omega Constellation Megaquartz day-date from 1976 on a suede watch stand",
        width: 940,
        height: 705,
        className: "aspect-[4/3]",
      },
      {
        src: "/images/omega-constellation-quartz/omega-constellation-quartz-angle.jpg",
        alt: "Angled view of the 1976 Omega Constellation Megaquartz day-date showing the faceted case and black leather strap",
        width: 900,
        height: 1125,
        className: "aspect-[4/5]",
      },
      {
        src: "/images/omega-constellation-quartz/omega-constellation-quartz-dial-detail.jpg",
        alt: "Close dial detail of the 1976 Omega Constellation Megaquartz day-date with brushed silver finish and day-date window",
        width: 2560,
        height: 3200,
        className: "aspect-[4/5]",
      },
    ],
  },
  {
    brand: "Rolex",
    model: "Datejust 36",
    reference: "126231",
    description:
      "A two-tone Datejust 36 with Everose Rolesor warmth, a fluted bezel, Jubilee bracelet, white Roman dial, and classic 36mm proportions. It sits in the sweet spot between dress-watch polish and daily-wear Rolex familiarity.",
    heroPhoto: 0,
    photos: [
      {
        src: "/images/datejust-126231/datejust-126231-desktop-hero.jpg",
        alt: "Rolex Datejust 36 reference 126231 angled on a tabletop with the Jubilee bracelet open",
        width: 1800,
        height: 1254,
        className: "aspect-[10/7]",
      },
      {
        src: "/images/datejust-126231/datejust-126231-wrist-01-v2-web.jpg",
        alt: "Rolex Datejust 36 reference 126231 on wrist three-quarter view",
        width: 1600,
        height: 1600,
        className: "aspect-square",
      },
      {
        src: "/images/datejust-126231/datejust-126231-desktop-winder.jpg",
        alt: "Rolex Datejust 36 reference 126231 shown on a watch winder",
        width: 1305,
        height: 1800,
        className: "aspect-[3/4]",
      },
    ],
  },
  {
    brand: "Breitling",
    model: "Superocean Heritage '57",
    reference: "A10370161C1X1",
    description:
      "A blue-dial Superocean Heritage with polished vintage dive-watch lines, a brown leather strap, and the kind of wrist presence that feels relaxed without going quiet.",
    heroPhoto: 2,
    photos: [
      {
        src: "/collection/breitling-superocean-heritage-57-1.jpg",
        alt: "Angled close-up of a Breitling Superocean Heritage '57 on a brown leather strap",
        width: 912,
        height: 1196,
        className: "aspect-[4/5]",
      },
      {
        src: "/collection/breitling-superocean-heritage-57-2.jpg",
        alt: "Straight-on dial view of the Breitling Superocean Heritage '57 reference A10370161C1X1",
        width: 1152,
        height: 1152,
        className: "aspect-square",
      },
      {
        src: "/collection/breitling-superocean-heritage-57-3.jpg",
        alt: "Breitling Superocean Heritage '57 displayed on a watch stand",
        width: 992,
        height: 1176,
        className: "aspect-[4/5]",
      },
    ],
  },
  {
    brand: "Chopard",
    model: "Mille Miglia GT XL",
    reference: "168459-3005",
    description:
      "A motorsport-minded chronograph with a tire-tread rubber strap, layered gray dial, and red Mille Miglia accents that make the whole piece feel properly mechanical.",
    heroPhoto: 0,
    photos: [
      {
        src: "/collection/chopard-mille-miglia-gt-xl-1.jpg",
        alt: "Chopard Mille Miglia GT XL reference 168459-3005 displayed on a watch stand",
        width: 1060,
        height: 1326,
        className: "aspect-[4/5]",
      },
      {
        src: "/collection/chopard-mille-miglia-gt-xl-2.jpg",
        alt: "Low side view of the Chopard Mille Miglia GT XL on a tire-tread rubber strap",
        width: 849,
        height: 1060,
        className: "aspect-[4/5]",
      },
      {
        src: "/collection/chopard-mille-miglia-gt-xl-3.jpg",
        alt: "Close-up of the Chopard Mille Miglia GT XL chronograph dial",
        width: 849,
        height: 1060,
        className: "aspect-[4/5]",
      },
    ],
  },
  {
    brand: "TAG Heuer",
    model: "Formula 1",
    reference: "CAZ101AM.FT8054",
    description:
      "A bright yellow Formula 1 chronograph with a black tachymeter bezel, rubber strap, and the kind of high-contrast energy that makes the watch feel built for weekends.",
    heroPhoto: 1,
    photos: [
      {
        src: "/collection/tag-heuer-formula-1-caz101am-ft8054-original.jpg",
        alt: "TAG Heuer Formula 1 reference CAZ101AM.FT8054 with yellow dial and yellow rubber strap",
        width: 4032,
        height: 3024,
        className: "aspect-[4/3]",
      },
      {
        src: "/collection/tag-heuer-formula-1-caz101am-ft8054-2.jpg",
        alt: "Angled view of the TAG Heuer Formula 1 yellow chronograph on a cushion",
        width: 1084,
        height: 1354,
        className: "aspect-[4/5]",
      },
      {
        src: "/collection/tag-heuer-formula-1-caz101am-ft8054-3.jpg",
        alt: "Close crop of the TAG Heuer Formula 1 yellow chronograph dial and black tachymeter bezel",
        width: 867,
        height: 1084,
        className: "aspect-[4/5]",
      },
    ],
  },
  {
    brand: "M.A.D.Editions",
    model: "M.A.D. 1",
    reference: "M.A.D. 1",
    description:
      "An unconventional collector piece built around the playful side of independent watchmaking, with a visible top-mounted rotor, lateral time display, and a mechanical presence that feels more like kinetic design than a conventional dial.",
    heroPhoto: 0,
    photos: [
      {
        src: "/collection/mad-1-1882.jpg",
        alt: "M.A.D. 1 displayed on a watch stand with the top-mounted rotor visible",
        width: 1536,
        height: 2048,
        className: "aspect-[4/5]",
      },
      {
        src: "/collection/mad-1-1883.jpg",
        alt: "M.A.D. 1 side view on a watch stand with garden background",
        width: 1536,
        height: 2048,
        className: "aspect-[4/5]",
      },
      {
        src: "/collection/mad-1-1891.jpg",
        alt: "Low side profile of the M.A.D. 1 showing the case, rotor, and strap",
        width: 1536,
        height: 2048,
        className: "aspect-[4/5]",
      },
    ],
  },
] as const;
