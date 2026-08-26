export type ProcessStep = {
  id: string;
  title: string;
  description: string;
};

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: "01",
    title: "Submit Request",
    description:
      "Tell us about your project, share your requirements, and submit your custom print request through our website.",
  },
  {
    id: "02",
    title: "Project Consultation",
    description:
      "Our team reviews your request and contacts you to discuss the project, clarify requirements, and, if needed, collect your design files directly.",
  },
  {
    id: "03",
    title: "Receive Quote",
    description:
      "After reviewing the project, we'll prepare a personalized quotation with pricing, estimated production time, and any additional notes.",
  },
  {
    id: "04",
    title: "Approve & Pay",
    description:
      "Once you're satisfied with the quotation, approve it from your request page and complete the payment securely online.",
  },
  {
    id: "05",
    title: "Printing & Delivery",
    description:
      "Production begins after payment confirmation. We'll keep you updated until your custom print is completed, shipped, and delivered.",
  },
];

export const PROJECT_TYPES = [
  "Prototype",
  "Decor",
  "Miniature",
  "Functional Part",
  "Replacement Part",
  "Cosplay",
  "Educational Model",
  "Other",
];
