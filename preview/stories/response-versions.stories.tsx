import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResponseVersionsDemo } from "../response-versions-demo";

const meta = {
  title: "Components/Response Versions",
  component: ResponseVersionsDemo,
  parameters: { layout: "fullscreen" },
  args: {
    initialVersions: false,
    regenerating: false,
    showRegenerate: true,
  },
  decorators: [
    (Story) => (
      <main className="cavemio-demo flex min-h-svh items-center justify-center p-6 sm:p-12">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof ResponseVersionsDemo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {};
export const Versions: Story = { args: { initialVersions: true } };
export const Regenerating: Story = {
  args: { initialVersions: true, regenerating: true },
};
export const BrowseOnly: Story = {
  args: { initialVersions: true, showRegenerate: false },
};
