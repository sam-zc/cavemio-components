import { Demo } from "../entries/number-roll";
export default {
  title: "Reference demos/Motion and landing/Number Roll",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Try it", "Currency", "Compact", "Live"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Try it" } };
export const Mode1 = { args: { initialTab: "Currency" } };
export const Mode2 = { args: { initialTab: "Compact" } };
export const Mode3 = { args: { initialTab: "Live" } };
