import { Demo } from "../entries/feedback";
export default {
  title: "Library/Blocks/Feedback",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Net promoter", "Stars", "Not sent"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Net promoter" } };
export const Mode1 = { args: { initialTab: "Stars" } };
export const Mode2 = { args: { initialTab: "Not sent" } };
