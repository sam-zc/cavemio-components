"use client";

import { useState } from "react";
import { Select } from "../registry/components/select";

const plans = [
  { value: "personal", label: "Personal", description: "For your next idea" },
  { value: "team", label: "Team", description: "Build something together" },
  { value: "studio", label: "Studio", description: "Room for every project" },
];
const languages = [
  "Arabic",
  "Bengali",
  "Chinese",
  "Dutch",
  "English",
  "French",
  "German",
  "Hindi",
  "Italian",
  "Japanese",
  "Korean",
  "Portuguese",
  "Spanish",
  "Tamil",
].map((label) => ({ value: label.toLowerCase(), label }));

export function SelectDemo({
  disabled = false,
  error = false,
}: {
  disabled?: boolean;
  error?: boolean;
}) {
  const [plan, setPlan] = useState("personal");
  return (
    <section
      aria-label="Select examples"
      className="flex w-full max-w-sm flex-col gap-8"
    >
      <Select
        label="Plan"
        options={plans}
        value={plan}
        onValueChange={setPlan}
        disabled={disabled}
        hint="Choose the space that fits your work."
        error={error ? "Choose a plan to continue." : undefined}
      />
      <Select
        label="Language"
        options={languages}
        defaultValue="english"
        disabled={disabled}
      />
      <Select
        label="Sort by"
        block={false}
        size="sm"
        defaultValue="recent"
        disabled={disabled}
        options={[
          { value: "recent", label: "Most recent" },
          { value: "name", label: "Name" },
          { value: "popular", label: "Most popular" },
        ]}
      />
      <p role="status" className="text-sm text-muted-foreground">
        Selected plan: {plans.find((option) => option.value === plan)?.label}
      </p>
    </section>
  );
}
