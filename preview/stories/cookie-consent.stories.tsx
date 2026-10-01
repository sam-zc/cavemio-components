import { Demo } from "../entries/cookie-consent";
export default {
  title: "Library/Blocks/Cookie consent",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Choose", "Not saved"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Choose" } };
export const Mode1 = { args: { initialTab: "Not saved" } };
