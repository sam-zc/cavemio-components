import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineRewrite } from "../../registry/components/inline-rewrite";
import {
  InlineRewriteDemo,
  InlineRewriteToneDemo,
  lengthVersions,
} from "../inline-rewrite-demo";

const meta = {
  title: "Components/Inline Rewrite",
  component: InlineRewrite,
  parameters: {
    layout: "fullscreen",
    controls: { include: ["label", "description", "highlight"] },
  },
  args: {
    versions: lengthVersions,
    label: "Length",
    description: "Adjust how much detail the paragraph includes.",
    highlight: true,
  },
  decorators: [
    (Story) => (
      <main className="cavemio-demo flex min-h-svh items-center justify-center p-6 sm:p-12">
        <Story />
      </main>
    ),
  ],
  render: (args) => <InlineRewriteDemo {...args} />,
} satisfies Meta<typeof InlineRewrite>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Length: Story = {};
export const Tone: Story = {
  args: {
    label: "Tone",
    description: "Adjust the tone from formal to playful.",
  },
  render: ({ label, description, highlight }) => (
    <InlineRewriteToneDemo
      label={label}
      description={description}
      highlight={highlight}
    />
  ),
};
export const WithoutHighlight: Story = { args: { highlight: false } };
