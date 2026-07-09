import { Demo } from "../entries/cron-input";
export default {
  title: "Library/Inputs and forms/Cron input",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Cron", "Plain English", "Time zones"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Cron" } };
export const Mode1 = { args: { initialTab: "Plain English" } };
export const Mode2 = { args: { initialTab: "Time zones" } };
