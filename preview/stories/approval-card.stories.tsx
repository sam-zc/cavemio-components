import { Demo } from "../entries/approval-card";
export default {
  title: "Library/AI and agents/Approval card",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Pending", "Destructive", "Approved", "Denied", "Expired"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Pending" } };
export const Mode1 = { args: { initialTab: "Destructive" } };
export const Mode2 = { args: { initialTab: "Approved" } };
export const Mode3 = { args: { initialTab: "Denied" } };
export const Mode4 = { args: { initialTab: "Expired" } };
