import { Demo } from "../entries/kanban-board";
export default {
  title: "Library/Data and app UI/Kanban board",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Pipeline", "Issues", "Column limit", "Save fails"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Pipeline" } };
export const Mode1 = { args: { initialTab: "Issues" } };
export const Mode2 = { args: { initialTab: "Column limit" } };
export const Mode3 = { args: { initialTab: "Save fails" } };
