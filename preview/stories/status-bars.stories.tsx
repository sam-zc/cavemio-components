import { Demo } from "../entries/status-bars";
export default {
  title: "Library/Data and app UI/Status bars",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Operational", "Incident", "Outage"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Operational" } };
export const Mode1 = { args: { initialTab: "Incident" } };
export const Mode2 = { args: { initialTab: "Outage" } };
