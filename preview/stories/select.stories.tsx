import { useState } from "react";
import { Select } from "../../registry/components/select";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectDemo } from "../select-demo";

const meta = {
  title: "Components/Select",
  component: SelectDemo,
  decorators: [
    (Story) => (
      <main className="cavemio-demo flex min-h-svh items-center justify-center p-6">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof SelectDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Demo: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Error: Story = { args: { error: true } };
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div className="w-64 max-w-full">
        <Story />
      </div>
    ),
  ],
};

export const LiveDisabled: Story = {
  render: function LiveDisabledExample() {
    const [disabled, setDisabled] = useState(false);
    const [value, setValue] = useState("personal");
    const [changes, setChanges] = useState(0);
    return (
      <div
        className="flex w-64 flex-col gap-4"
        onKeyDown={(event) => {
          if (event.key === "F8") {
            event.preventDefault();
            setDisabled((current) => !current);
          }
        }}
      >
        <p>Press F8 while the list is open to disable it.</p>
        <Select
          label="Plan"
          options={[
            { value: "personal", label: "Personal" },
            { value: "team", label: "Team" },
          ]}
          value={value}
          disabled={disabled}
          onValueChange={(next) => {
            setValue(next);
            setChanges((count) => count + 1);
          }}
        />
        <button
          type="button"
          onClick={() => setDisabled((current) => !current)}
        >
          {disabled ? "Enable select" : "Disable select"}
        </button>
        <p role="status">
          Selected: {value}. Changes: {changes}.
        </p>
      </div>
    );
  },
};
