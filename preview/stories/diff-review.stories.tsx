import { Demo } from "../entries/diff-review";
export default {
  title: "Library/AI and agents/Diff review",
  component: Demo,
  argTypes: { initialTab: { control: "select", options: ["Text", "Code"] } },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Text" } };
export const Mode1 = { args: { initialTab: "Code" } };
