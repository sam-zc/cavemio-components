import { Demo } from "../entries/webhooks";
export default {
  title: "Library/Data and app UI/Webhooks",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Endpoints", "First endpoint"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Endpoints" } };
export const Mode1 = { args: { initialTab: "First endpoint" } };
