import { Demo } from "../entries/task-progress";
export default {
  title: "Library/AI and agents/Task progress",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Live", "Done", "Error", "Cancelled"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Live" } };
export const Mode1 = { args: { initialTab: "Done" } };
export const Mode2 = { args: { initialTab: "Error" } };
export const Mode3 = { args: { initialTab: "Cancelled" } };
