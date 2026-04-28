import type { Meta, StoryObj } from "@storybook/react-vite";
import { StepTimeline } from "../../registry/components/step-timeline";
import {
  lifecycleSteps,
  RequestLifecycleDemo,
} from "../request-lifecycle-demo";

const meta = {
  title: "Components/Step Timeline",
  component: StepTimeline,
  parameters: { layout: "fullscreen" },
  args: {
    steps: lifecycleSteps,
    defaultValue: "planned",
    autoPlay: false,
    duration: 5500,
    disabled: false,
  },
  render: (args) => (
    <main className="cavemio-demo lifecycle-demo grid min-h-svh place-items-center bg-background p-8">
      <StepTimeline {...args} className="max-w-[480px]" />
    </main>
  ),
} satisfies Meta<typeof StepTimeline>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Demo: Story = {};
export const Autoplay: Story = { args: { autoPlay: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Together: Story = {
  render: () => <RequestLifecycleDemo />,
  parameters: { controls: { disable: true } },
};
