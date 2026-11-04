"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import { Input, Textarea, Field } from "@/src/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

const projectTypes = [
  { value: "prototype", label: "Prototype" },
  { value: "miniature", label: "Miniature" },
  { value: "decor", label: "Decor" },
  { value: "functional-part", label: "Functional Part" },
  { value: "replacement-part", label: "Replacement Part" },
  { value: "cosplay", label: "Cosplay" },
  { value: "other", label: "Other" },
];

export default function CustomPrintForm() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [projectType, setProjectType] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (status === "loading") return;

    if (!session?.user) {
      await signIn(undefined, {
        callbackUrl: "/custom-print#request-form",
      });
      return;
    }

    if (!agreed) {
      setMessage("Please accept the quotation agreement.");
      return;
    }

    if (!projectType) {
      setMessage("Please select a project type.");
      return;
    }

    const formData = new FormData(event.currentTarget);

    const payload = {
      title: String(formData.get("projectTitle") ?? ""),
      projectType,
      quantity,
      description: String(formData.get("description") ?? ""),
    };

    setLoading(true);

    try {
      const response = await fetch("/api/print-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Unable to submit your request.");
        return;
      }

      router.push("/customer/requests");
      router.refresh();
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section id="request-form">
      <Container>
        <div className="max-w-3xl">
          <p className="body-font text-sm uppercase tracking-[0.35em] text-primary">
            START YOUR PROJECT
          </p>

          <h2 className="mt-4 heading-font text-5xl uppercase lg:text-7xl">
            Submit Your Project Request
          </h2>

          <p className="mt-6 body-font leading-relaxed text-muted-foreground">
            Tell us about your project and we&apos;ll review your
            requirements before preparing a personalized quotation.
          </p>
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-[2fr_1fr]">
          <form
            onSubmit={handleSubmit}
            className="space-y-8 rounded-lg border border-border bg-card/40 p-8 backdrop-blur"
          >
            <div>
              <h3 className="heading-font text-2xl uppercase">
                Customer Information
              </h3>

              {session?.user ? (
                <p className="mt-4 body-font text-sm text-muted-foreground">
                  Submitting as {session.user.name || session.user.email}
                </p>
              ) : (
                <p className="mt-4 body-font text-sm text-muted-foreground">
                  Please sign in to submit your project request.
                </p>
              )}
            </div>

            <div>
              <h3 className="heading-font text-2xl uppercase">
                Project Details
              </h3>

              <div className="mt-6 space-y-6">
                <Field label="Project Title" required>
                  <Input
                    name="projectTitle"
                    placeholder="Give your project a name"
                    minLength={3}
                    maxLength={120}
                    required
                  />
                </Field>

                <Field label="Project Type" required>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger className="w-full bg-white/5">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>

                    <SelectContent className="bg-[#111118]">
                      {projectTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Quantity" required>
                  <Input
                    type="number"
                    min={1}
                    max={1000}
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    required
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
                    minLength={20}
                    maxLength={3000}
                    required
                  />
                </Field>
              </div>
            </div>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
                className="mt-1 accent-primary"
              />

              <span className="body-font cursor-pointer text-sm leading-relaxed text-muted-foreground">
                I understand that pricing will be provided after the
                project has been reviewed and discussed with me.
              </span>
            </label>

            {message && (
              <p role="alert" className="text-sm text-red-500">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || status === "loading"}
              className="rounded-full bg-primary px-8 py-4 body-font text-primary-foreground transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Submitting..."
                : session?.user
                  ? "Submit Request"
                  : "Sign In to Submit"}
            </button>
          </form>

          <div className="h-fit rounded-lg border border-border bg-card/40 p-8 backdrop-blur lg:sticky lg:top-32">
            <h3 className="heading-font text-3xl uppercase">
              Before You Submit
            </h3>

            <div className="mt-8 space-y-6">
              <div>
                <h4 className="heading-font text-xl">Consultation</h4>
                <p className="mt-2 body-font text-muted-foreground">
                  We&apos;ll discuss your requirements personally before
                  production begins.
                </p>
              </div>

              <div>
                <h4 className="heading-font text-xl">Personalized Quote</h4>
                <p className="mt-2 body-font text-muted-foreground">
                  Every project receives an individual quotation.
                </p>
              </div>

              <div>
                <h4 className="heading-font text-xl">Response Time</h4>
                <p className="mt-2 body-font text-muted-foreground">
                  We usually respond within 24 hours.
                </p>
              </div>

              <div>
                <h4 className="heading-font text-xl">Secure Payment</h4>
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