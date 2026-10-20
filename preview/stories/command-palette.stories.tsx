import type { Meta, StoryObj } from "@storybook/react-vite";
import { CommandPaletteDemo } from "../command-palette-demo";

const meta = {
  title: "Components/Command Palette",
  component: CommandPaletteDemo,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <main className="cavemio-demo flex min-h-svh items-center justify-center p-6 sm:p-12">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof CommandPaletteDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Demo: Story = {
  args: {
    defaultOpen: false,
    showcase: true,
    controlled: false,
    empty: false,
    longContent: false,
    simulateSyncFailure: false,
  },
};
