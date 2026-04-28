import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { CavemioAnswerPaper } from "../../registry/components/cavemio-answer-paper";
import { AnswerPaperDemo, riceAnswerLevels } from "../answer-paper-demo";

const meta = {
  title: "Components/Answer Paper",
  component: CavemioAnswerPaper,
  tags: ["!autodocs"],
  parameters: {
    layout: "fullscreen",
    controls: {
      include: [
        "level",
        "paperColor",
        "paperRadius",
        "textColor",
        "handleColor",
        "disabled",
      ],
    },
  },
  args: {
    levels: riceAnswerLevels,
    level: 3,
    paperColor: "var(--card)",
    paperRadius: 14,
    textColor: "var(--foreground)",
    handleColor: "var(--accent-ink)",
    disabled: false,
  },
  argTypes: {
    levels: { table: { disable: true } },
    level: { control: { type: "range", min: 0, max: 3, step: 1 } },
    paperColor: { control: "color" },
    paperRadius: { control: { type: "range", min: 0, max: 60, step: 1 } },
    textColor: { control: "color" },
    handleColor: { control: "color" },
    onLevelChange: { table: { disable: true } },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <AnswerPaperDemo
        {...args}
        onLevelChange={(level) => updateArgs({ level })}
      />
    );
  },
} satisfies Meta<typeof CavemioAnswerPaper>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Demo: Story = {};
