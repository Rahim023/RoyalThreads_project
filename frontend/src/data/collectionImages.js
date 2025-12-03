/**
 * Collection Images Configuration
 * Maps collection names to their local image paths
 * 
 * IMAGE ORGANIZATION GUIDE:
 * Place your images in: frontend/public/images/collections/{category}/
 * 
 * Women Collection (4 images):
 * - /images/collections/women/women-1.jpg (wedding dress)
 * - /images/collections/women/women-2.jpg (casual/evening)
 * - /images/collections/women/women-3.jpg (elegant gown)
 * - /images/collections/women/women-4.jpg (modern style)
 * 
 * Men Collection (2 images):
 * - /images/collections/men/men-1.jpg (formal style)
 * - /images/collections/men/men-2.jpg (casual style)
 * 
 * Signature Collection (4 images):
 * - /images/collections/signature/signature-1.jpg (bridal lehenga)
 * - /images/collections/signature/signature-2.jpg (embroidered saree)
 * - /images/collections/signature/signature-3.jpg (premium dress)
 * - /images/collections/signature/signature-4.jpg (luxury gown)
 * 
 * Wedding Collection (3 images):
 * - /images/collections/wedding/wedding-1.jpg (bridal outfit)
 * - /images/collections/wedding/wedding-2.jpg (wedding dress)
 * - /images/collections/wedding/wedding-3.jpg (elegant dress)
 */

export const collectionImages = {
  women: [
    "/images/collections/women/women-1.jpg",
    "/images/collections/women/women-2.jpg",
    "/images/collections/women/women-3.jpg",
    "/images/collections/women/women-4.jpg",
  ],
  men: [
    "/images/collections/men/men-1.jpg",
    "/images/collections/men/men-2.jpg",
  ],
  signature: [
    "/images/collections/signature/signature-1.jpg",
    "/images/collections/signature/signature-2.jpg",
    "/images/collections/signature/signature-3.jpg",
    "/images/collections/signature/signature-4.jpg",
  ],
  wedding: [
    "/images/collections/wedding/wedding-1.jpg",
    "/images/collections/wedding/wedding-2.jpg",
    "/images/collections/wedding/wedding-3.jpg",
  ],
};

export const collectionData = [
  {
    id: "women",
    title: "Women's Collection",
    link: "/women",
    images: collectionImages.women,
  },
  {
    id: "men",
    title: "Men's Collection",
    link: "/men",
    images: collectionImages.men,
  },
  {
    id: "signature",
    title: "Signature Series",
    link: "/signature",
    images: collectionImages.signature,
  },
  {
    id: "wedding",
    title: "Wedding Collection",
    link: "/wedding",
    images: collectionImages.wedding,
  },
];
