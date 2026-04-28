import type { Meta, StoryObj } from "@storybook/react-vite";
import { DropZoneMembrane } from "../../registry/components/drop-zone-membrane";
import {
  AttachmentStatesDemo,
  DropZoneMembraneDemo,
} from "../drop-zone-membrane-demo";
import { AttachmentTransitionsDemo } from "../attachment-transitions-demo";

const meta = {
  title: "Components/Drop Zone Membrane",
  component: DropZoneMembrane,
  parameters: {
    layout: "fullscreen",
    controls: {
      include: [
        "disabled",
        "multiple",
        "maxFiles",
        "maxSize",
        "accept",
        "title",
        "hint",
        "autoUpload",
      ],
    },
  },
  args: {
    disabled: false,
    multiple: true,
    maxFiles: 2,
    maxSize: 10_000_000,
    accept: "image/*,.pdf",
    title: "Drop files here",
    hint: "images or PDFs, up to 10 MB",
    autoUpload: true,
  },
  decorators: [
    (Story) => (
      <main className="cavemio-demo flex min-h-svh items-center justify-center p-6 sm:p-12">
        <Story />
      </main>
    ),
  ],
  render: (args) => <DropZoneMembraneDemo {...args} />,
} satisfies Meta<typeof DropZoneMembrane>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {};
export const AttachmentStates: Story = {
  render: () => <AttachmentStatesDemo />,
};
export const AttachmentTransitions: Story = {
  parameters: { controls: { disable: true } },
  render: () => <AttachmentTransitionsDemo />,
};
export const ErrorAndRetry: Story = {
  render: (args) => <DropZoneMembraneDemo {...args} failFirst />,
};
export const ManualUpload: Story = { args: { autoUpload: false } };
export const SelectionOnly: Story = {
  render: (args) => (
    <div className="w-full max-w-[480px]">
      <DropZoneMembrane {...args} />
    </div>
  ),
};
export const SingleFile: Story = {
  args: {
    multiple: false,
    hint: "images or PDFs, up to 10 MB · replaces the previous file",
  },
};
export const Disabled: Story = { args: { disabled: true } };
