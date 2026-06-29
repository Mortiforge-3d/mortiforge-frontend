"use client";

import { useState } from "react";

import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";

import { FAQ_CATEGORIES } from "./data";

export function FAQList() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Section className="mb-20">
      <Container>
        <div className="space-y-20">
          {FAQ_CATEGORIES.map((category, categoryIndex) => (
            <div key={category.title}>
              {/* Category Heading */}
              <div className="mb-10 flex items-end gap-6">
                <span
                  className="
                    heading-font
                    text-6xl
                    text-primary/20
                    lg:text-8xl
                  "
                >
                  {String(categoryIndex + 1).padStart(2, "0")}
                </span>

                <div className="mb-[3px] md:mb-[10px]">
                  <p
                    className="
                      body-font
                      text-sm
                      uppercase
                      tracking-[0.35em]
                      text-primary
                    "
                  >
                    Category
                  </p>

                  <h2
                    className="
                      heading-font
                      text-4xl
                      uppercase
                    "
                  >
                    {category.title}
                  </h2>
                </div>
              </div>

              {/* Accordion */}
              <div className="space-y-4">
                {category.faqs.map((faq, index) => {
                  const id = `${category.title}-${index}`;

                  return (
                    <div
                      key={id}
                      className="
                        group
                        overflow-hidden
                        rounded-md
                        border
                        border-border
                        bg-card
                        transition-all
                        duration-300
                        hover:border-primary
                      "
                    >
                      <button
                        onClick={() => setOpen(open === id ? null : id)}
                        className="
                          flex
                          w-full
                          items-center
                          justify-between
                          p-6
                          text-left
                        "
                      >
                        <h3
                          className="
                            body-font
                            text-lg
                            font-medium
                          "
                        >
                          {faq.question}
                        </h3>

                        <span
                          className={`
                            text-3xl
                            text-primary
                            transition-transform
                            duration-300
                            ${open === id ? "rotate-45" : ""}
                          `}
                        >
                          +
                        </span>
                      </button>

                      <div
                        className={`
                          grid
                          transition-all
                          duration-300
                          ${open === id ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
                        `}
                      >
                        <div className="overflow-hidden">
                          <div
                            className="
                              border-t
                              border-border
                              px-6
                              py-5
                            "
                          >
                            <p
                              className="
                                body-font
                                leading-relaxed
                                text-muted-foreground
                              "
                            >
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
