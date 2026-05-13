import { Demo } from "../entries/context-menu";
export default {
  title: "Library/Overlays and feedback/Context menu",
  component: Demo,
  argTypes: { initialTab: { control: "select", options: ["Files"] } },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Files" } };
