import { Demo } from "../entries/testimonials";
export default {
  title: "Library/Motion and landing/Testimonials",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Autoplay", "Manual"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Autoplay" } };
export const Mode1 = { args: { initialTab: "Manual" } };
