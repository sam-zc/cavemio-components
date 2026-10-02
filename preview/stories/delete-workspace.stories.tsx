import { Demo } from "../entries/delete-workspace";
export default {
  title: "Library/Blocks/Delete workspace",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Delete", "Not deleted"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Delete" } };
export const Mode1 = { args: { initialTab: "Not deleted" } };
