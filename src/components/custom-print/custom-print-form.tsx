"use client";

import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import {
  Input,
  Textarea,
  Field,
} from "@/src/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

import { Checkbox } from "@/src/components/ui/checkbox";

export default function CustomPrintForm() {
  return (
    <Section id="request-form">
      <Container>
        {/* Heading */}

        <div className="max-w-3xl">
          <p
            className="
              body-font
              text-sm
              uppercase
              tracking-[0.35em]
              text-primary
            "
          >
            START YOUR PROJECT
          </p>

          <h2
            className="
              mt-4
              heading-font
              text-5xl
              uppercase
              lg:text-7xl
            "
          >
            Submit Your
            Project Request
          </h2>

          <p
            className="
              mt-6
              body-font
              leading-relaxed
              text-muted-foreground
            "
          >
            Tell us about your project and we&apos;ll review your
            requirements before preparing a personalized quotation.
          </p>
        </div>

        {/* Form */}

        <div className="mt-20 grid gap-12 lg:grid-cols-[2fr_1fr]">

          {/* LEFT */}

          <form
            className="
              space-y-8
              rounded-lg
              border
              border-border
              bg-card/40
              p-8
              backdrop-blur
            "
          >

            {/* Customer Information */}

            <div>
              <h3
                className="
                  heading-font
                  text-2xl
                  uppercase
                "
              >
                Customer Information
              </h3>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
  <Field label="First Name" required>
    <Input
      name="firstName"
      placeholder="Enter your first name"
    />
  </Field>

  <Field label="Last Name">
    <Input
      name="lastName"
      placeholder="Enter your last name"
    />
  </Field>

  <Field label="Email Address" required>
    <Input
      type="email"
      name="email"
      placeholder="Enter your email"
    />
  </Field>

  <Field label="Phone Number" required>
    <Input
      type="tel"
      name="phone"
      placeholder="Enter your phone number"
    />
  </Field>
</div>
            </div>

            {/* Project */}

            <div>

              <h3
                className="
                  heading-font
                  text-2xl
                  uppercase
                "
              >
                Project Details
              </h3>

              <div className="mt-6 space-y-6">
  <Field label="Project Title" required>
    <Input
      name="projectTitle"
      placeholder="Give your project a name"
    />
  </Field>

  <Field label="Project Type" required>
    <Select name="projectType">
      <SelectTrigger className="w-full bg-white/5">
        <SelectValue placeholder="Select project type" />
      </SelectTrigger>

      <SelectContent className="bg-[#111118]">
        <SelectItem value="prototype">Prototype</SelectItem>
        <SelectItem value="miniature">Miniature</SelectItem>
        <SelectItem value="decor">Decor</SelectItem>
        <SelectItem value="functional-part">
          Functional Part
        </SelectItem>
        <SelectItem value="replacement-part">
          Replacement Part
        </SelectItem>
        <SelectItem value="cosplay">Cosplay</SelectItem>
        <SelectItem value="other">Other</SelectItem>
      </SelectContent>
    </Select>
  </Field>

  <Field label="Quantity" required>
    <Input
      type="number"
      name="quantity"
      min={1}
      defaultValue={1}
    />
  </Field>

  <Field
    label="Project Description"
    required
    hint="Tell us about the model, its purpose, approximate size, or anything else we should know."
  >
    <Textarea
      name="description"
      placeholder="Describe your project..."
      rows={6}
    />
  </Field>
</div>

            </div>

            {/* Agreement */}

            <div className="flex items-start gap-3">
  <Checkbox
    id="quote-agreement"
    name="quoteAgreement"
  />

  <label
    htmlFor="quote-agreement"
    className="body-font cursor-pointer text-sm leading-relaxed text-muted-foreground"
  >
    I understand that pricing will be provided after the
    project has been reviewed and discussed with me.
  </label>
</div>

            <button
              className="
                rounded-full
                bg-primary
                px-8
                py-4
                body-font
                text-primary-foreground
                transition-all
                hover:scale-105
              "
            >
              Submit Request
            </button>

          </form>

          {/* RIGHT */}

          <div
            className="
              rounded-lg
              border
              border-border
              bg-card/40
              p-8
              backdrop-blur
              lg:sticky
              lg:top-32
              h-fit
            "
          >

            <h3
              className="
                heading-font
                text-3xl
                uppercase
              "
            >
              Before You Submit
            </h3>

            <div className="mt-8 space-y-6">

              <div>
                <h4 className="heading-font text-xl">
                  Consultation
                </h4>

                <p className="mt-2 body-font text-muted-foreground">
                  We&apos;ll discuss your requirements personally before production begins.
                </p>
              </div>

              <div>
                <h4 className="heading-font text-xl">
                  Personalized Quote
                </h4>

                <p className="mt-2 body-font text-muted-foreground">
                  Every project receives an individual quotation.
                </p>
              </div>

              <div>
                <h4 className="heading-font text-xl">
                  Response Time
                </h4>

                <p className="mt-2 body-font text-muted-foreground">
                  We usually respond within 24 hours.
                </p>
              </div>

              <div>
                <h4 className="heading-font text-xl">
                  Secure Payment
                </h4>

                <p className="mt-2 body-font text-muted-foreground">
                  Payment is only requested after you approve your quotation.
                </p>
              </div>

            </div>

          </div>

        </div>
      </Container>
    </Section>
  );
}