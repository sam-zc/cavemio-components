import { Demo } from "../entries/faq-accordion";
export default {
  title: "Library/Motion and landing/FAQ accordion",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Single", "Multiple"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Single" } };
export const Mode1 = { args: { initialTab: "Multiple" } };
