import { Demo } from "../entries/privacy-mask";
export default {
  title: "Library/Data and app UI/Privacy mask",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["API key", "Balance", "Hold to reveal"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "API key" } };
export const Mode1 = { args: { initialTab: "Balance" } };
export const Mode2 = { args: { initialTab: "Hold to reveal" } };
