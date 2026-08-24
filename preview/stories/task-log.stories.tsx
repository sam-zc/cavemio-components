import { Demo } from "../entries/task-log";
export default {
  title: "Library/AI and agents/Task log",
  component: Demo,
  argTypes: { initialTab: { control: "select", options: ["Live", "Done"] } },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Live" } };
export const Mode1 = { args: { initialTab: "Done" } };
