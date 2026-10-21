import { Demo } from "../entries/username";
export default {
  title: "Library/Blocks/Username",
  component: Demo,
  argTypes: { initialTab: { control: "select", options: ["Pick", "Taken"] } },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Pick" } };
export const Mode1 = { args: { initialTab: "Taken" } };
