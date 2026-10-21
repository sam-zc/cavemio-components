import { Demo } from "../entries/team-members";
export default {
  title: "Library/Data and app UI/Team members",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Members", "Seat limit", "Errors"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Members" } };
export const Mode1 = { args: { initialTab: "Seat limit" } };
export const Mode2 = { args: { initialTab: "Errors" } };
