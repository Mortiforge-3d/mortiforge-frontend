export type ProductVariant = {
  color: string;
  hex: string;
  images: string[];
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  price: number;
  category: string;
  variants: ProductVariant[];
  dimensions: string;
  materials: string;
};

export const PRODUCTS = [
  {
    id: "1",
    slug: "cyber-skull",
    title: "Cyber Skull",
    category: "Decor",
    variants: [
      {
        color: "red",
        hex: "#D61E1E",
        images: [
          "/products/penstand.jpeg",
          "/products/pen-stand2.webp",
          "/products/pen-stand3.webp",
          "/products/pen-stand4.webp",
        ],
      },
      {
        color: "blue",
        hex: "#2c19dd",
        images: [
          "/products/pen-stand2.webp",
          "/products/penstand.jpeg",
          "/products/pen-stand3.webp",
          "/products/pen-stand4.webp",
        ],
      },
      {
        color: "green",
        hex: "#12da5e",
        images: [
          "/products/pen-stand3.webp",
          "/products/penstand.jpeg",
          "/products/pen-stand2.webp",
          "/products/pen-stand4.webp",
        ],
      },
      {
        color: "orange",
        hex: "#e48212",
        images: [
          "/products/pen-stand4.webp",
          "/products/penstand.jpeg",
          "/products/pen-stand2.webp",
          "/products/pen-stand3.webp",
        ],
      },
    ],
    dimensions: "15cm × 15cm × 20cm",
    materials: "PLA",
    price: 1499,
  },

  {
    id: "2",
    slug: "robot-bust",
    title: "Robot Bust",
    category: "Figures",
    variants: [
      {
        color: "red",
        hex: "#D61E1E",
        images: [
          "/products/penstand.jpeg",
          "/products/pen-stand2.webp",
          "/products/pen-stand3.webp",
          "/products/pen-stand4.webp",
        ],
      },
      {
        color: "blue",
        hex: "#2c19dd",
        images: [
          "/products/pen-stand2.webp",
          "/products/penstand.jpeg",
          "/products/pen-stand3.webp",
          "/products/pen-stand4.webp",
        ],
      },
      {
        color: "green",
        hex: "#12da5e",
        images: [
          "/products/pen-stand3.webp",
          "/products/penstand.jpeg",
          "/products/pen-stand2.webp",
          "/products/pen-stand4.webp",
        ],
      },
      {
        color: "orange",
        hex: "#e48212",
        images: [
          "/products/pen-stand4.webp",
          "/products/penstand.jpeg",
          "/products/pen-stand2.webp",
          "/products/pen-stand3.webp",
        ],
      },
    ],
    dimensions: "15cm × 15cm × 20cm",
    materials: "PLA+",
    price: 1799,
  },

  {
    id: "3",
    slug: "dragon-model",
    title: "Dragon Model",
    category: "Figures",
    variants: [
      {
        color: "red",
        hex: "#D61E1E",
        images: [
          "/products/penstand.jpeg",
          "/products/pen-stand2.webp",
          "/products/pen-stand3.webp",
          "/products/pen-stand4.webp",
        ],
      },
      {
        color: "blue",
        hex: "#2c19dd",
        images: [
          "/products/pen-stand2.webp",
          "/products/penstand.jpeg",
          "/products/pen-stand3.webp",
          "/products/pen-stand4.webp",
        ],
      },
      {
        color: "green",
        hex: "#12da5e",
        images: [
          "/products/pen-stand3.webp",
          "/products/penstand.jpeg",
          "/products/pen-stand2.webp",
          "/products/pen-stand4.webp",
        ],
      },
      {
        color: "orange",
        hex: "#e48212",
        images: [
          "/products/pen-stand4.webp",
          "/products/penstand.jpeg",
          "/products/pen-stand2.webp",
          "/products/pen-stand3.webp",
        ],
      },
    ],
    dimensions: "15cm × 15cm × 20cm",
    materials: "Resin",
    price: 2299,
  },

  {
    id: "4",
    slug: "mech-core",
    title: "Mech Core",
    category: "Props",
    variants: [
      {
        color: "red",
        hex: "#D61E1E",
        images: [
          "/products/penstand.jpeg",
          "/products/pen-stand2.webp",
          "/products/pen-stand3.webp",
          "/products/pen-stand4.webp",
        ],
      },
      {
        color: "blue",
        hex: "#2c19dd",
        images: [
          "/products/pen-stand2.webp",
          "/products/penstand.jpeg",
          "/products/pen-stand3.webp",
          "/products/pen-stand4.webp",
        ],
      },
      {
        color: "green",
        hex: "#12da5e",
        images: [
          "/products/pen-stand3.webp",
          "/products/penstand.jpeg",
          "/products/pen-stand2.webp",
          "/products/pen-stand4.webp",
        ],
      },
      {
        color: "orange",
        hex: "#e48212",
        images: [
          "/products/pen-stand4.webp",
          "/products/penstand.jpeg",
          "/products/pen-stand2.webp",
          "/products/pen-stand3.webp",
        ],
      },
    ],
    dimensions: "15cm × 15cm × 20cm",
    materials: "PLA",
    price: 1999,
  },

  {
    id: "5",
    slug: "space-helmet",
    title: "Space Helmet",
    category: "Props",
    variants: [
      {
        color: "red",
        hex: "#D61E1E",
        images: [
          "/products/penstand.jpeg",
          "/products/pen-stand2.webp",
          "/products/pen-stand3.webp",
          "/products/pen-stand4.webp",
        ],
      },
      {
        color: "blue",
        hex: "#2c19dd",
        images: [
          "/products/pen-stand2.webp",
          "/products/penstand.jpeg",
          "/products/pen-stand3.webp",
          "/products/pen-stand4.webp",
        ],
      },
      {
        color: "green",
        hex: "#12da5e",
        images: [
          "/products/pen-stand3.webp",
          "/products/penstand.jpeg",
          "/products/pen-stand2.webp",
          "/products/pen-stand4.webp",
        ],
      },
      {
        color: "orange",
        hex: "#e48212",
        images: [
          "/products/pen-stand4.webp",
          "/products/penstand.jpeg",
          "/products/pen-stand2.webp",
          "/products/pen-stand3.webp",
        ],
      },
    ],
    dimensions: "15cm × 15cm × 20cm",
    materials: "PLA+",
    price: 3499,
  },

  {
    id: "6",
    slug: "samurai-mask",
    title: "Samurai Mask",
    category: "Decor",
    variants: [
      {
        color: "red",
        hex: "#D61E1E",
        images: [
          "/products/penstand.jpeg",
          "/products/pen-stand2.webp",
          "/products/pen-stand3.webp",
          "/products/pen-stand4.webp",
        ],
      },
      {
        color: "blue",
        hex: "#2c19dd",
        images: [
          "/products/pen-stand2.webp",
          "/products/penstand.jpeg",
          "/products/pen-stand3.webp",
          "/products/pen-stand4.webp",
        ],
      },
      {
        color: "green",
        hex: "#12da5e",
        images: [
          "/products/pen-stand3.webp",
          "/products/penstand.jpeg",
          "/products/pen-stand2.webp",
          "/products/pen-stand4.webp",
        ],
      },
      {
        color: "orange",
        hex: "#e48212",
        images: [
          "/products/pen-stand4.webp",
          "/products/penstand.jpeg",
          "/products/pen-stand2.webp",
          "/products/pen-stand3.webp",
        ],
      },
    ],
    dimensions: "15cm × 15cm × 20cm",
    materials: "PLA",
    price: 2499,
  },
];
