import { Demo } from "../entries/tree-view";
export default {
  title: "Library/Display and navigation/Tree view",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Workspace", "Files", "Rules", "Save fails"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Workspace" } };
export const Mode1 = { args: { initialTab: "Files" } };
export const Mode2 = { args: { initialTab: "Rules" } };
export const Mode3 = { args: { initialTab: "Save fails" } };
