import { Demo } from "../entries/api-keys";
export default {
  title: "Library/Data and app UI/API keys",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Keys", "First key", "Errors"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Keys" } };
export const Mode1 = { args: { initialTab: "First key" } };
export const Mode2 = { args: { initialTab: "Errors" } };
