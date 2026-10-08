import { Demo } from "../entries/integrations";
export default {
  title: "Library/Data and app UI/Integrations",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Integrations", "Errors"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Integrations" } };
export const Mode1 = { args: { initialTab: "Errors" } };
