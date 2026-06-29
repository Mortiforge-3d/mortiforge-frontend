export type FAQ = {
  question: string;
  answer: string;
};

export type FAQCategory = {
  title: string;
  faqs: FAQ[];
};
export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    title: "Products",
    faqs: [
      {
        question: "What materials do you use?",
        answer:
          "We primarily use PLA, PETG, and Resin depending on the product and its intended use.",
      },
      {
        question: "Can I request a different color?",
        answer:
          "Yes. Many products can be printed in different colors depending on material availability.",
      },
      {
        question: "Are your products durable?",
        answer:
          "Yes. Every product is printed using carefully selected settings and quality materials to ensure durability and a clean finish.",
      },
    ],
  },

  {
    title: "Orders & Shipping",
    faqs: [
      {
        question: "How long does printing take?",
        answer:
          "Most products are printed within a few business days. Larger or custom projects may require additional time.",
      },
      {
        question: "How long does shipping take?",
        answer:
          "Shipping times depend on your location and chosen delivery method after dispatch.",
      },
      {
        question: "Can I cancel my order?",
        answer:
          "Orders can usually be cancelled before production begins. Once printing has started, cancellation may not be possible.",
      },
    ],
  },

  {
    title: "Custom Printing",
    faqs: [
      {
        question: "Can I upload my own 3D design?",
        answer:
          "Yes. You can submit STL, OBJ, STEP and other supported files through the Custom Print page.",
      },
      {
        question: "How is custom printing priced?",
        answer:
          "Pricing depends on the model size, material, print time, complexity, and finishing requirements.",
      },
      {
        question: "Can I request design modifications?",
        answer:
          "Yes. Minor adjustments may be possible before printing begins depending on the project.",
      },
    ],
  },
];