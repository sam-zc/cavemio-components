import { Demo } from "../entries/clarifying-question";
export default {
  title: "Reference demos/AI and agents/Clarifying Question",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Single", "Multiple", "Answered"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Single" } };
export const Mode1 = { args: { initialTab: "Multiple" } };
export const Mode2 = { args: { initialTab: "Answered" } };
