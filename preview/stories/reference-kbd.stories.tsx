import { Demo } from "../entries/kbd";
export default {
  title: "Reference demos/Display and navigation/Kbd",
  component: Demo,
  argTypes: { initialTab: { control: "select", options: ["Shortcuts"] } },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Shortcuts" } };
