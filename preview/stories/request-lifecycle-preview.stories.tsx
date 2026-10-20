import type { Meta, StoryObj } from "@storybook/react-vite";
import { RequestLifecyclePreview } from "../../registry/components/request-lifecycle-preview";
import { lifecycleData, RequestLifecycleDemo } from "../request-lifecycle-demo";

const meta = {
  title: "Components/Request Lifecycle Preview",
  component: RequestLifecyclePreview,
  parameters: { layout: "fullscreen" },
  args: { stage: "shipped", data: lifecycleData },
  argTypes: {
    stage: {
      control: "select",
      options: ["asked", "planned", "shipped", "answered"],
    },
  },
  render: (args) => (
    <main className="cavemio-demo lifecycle-demo grid min-h-svh place-items-center bg-background p-5">
      <RequestLifecyclePreview {...args} className="max-w-[608px]" />
    </main>
  ),
} satisfies Meta<typeof RequestLifecyclePreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Demo: Story = {};
export const Asked: Story = { args: { stage: "asked" } };
export const Planned: Story = { args: { stage: "planned" } };
export const Shipped: Story = { args: { stage: "shipped" } };
export const Answered: Story = { args: { stage: "answered" } };
export const Together: Story = {
  render: () => <RequestLifecycleDemo />,
  parameters: { controls: { disable: true } },
};
export const LongContent: Story = {
  args: {
    data: {
      ...lifecycleData,
      title: "A mobile workspace for your whole team",
      description:
        "Bring all of your projects, conversations, files, notifications, and saved views with you. Keep everything in sync across your devices, even when your team is working across different time zones.",
      release: {
        ...lifecycleData.release,
        title: "Introducing a complete mobile workspace for every team",
        description:
          "Your team's entire workspace is now available on iPhone and Android. Browse every project, reply to conversations, share files with your colleagues, and keep up with everything that matters while you are away from your desk. All your existing projects and preferences are ready when you sign in.",
      },
    },
  },
};
