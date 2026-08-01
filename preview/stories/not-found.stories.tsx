import { Demo } from "../entries/not-found";
export default {
  title: "Library/Blocks/Not found",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Search", "Offline"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Search" } };
export const Mode1 = { args: { initialTab: "Offline" } };
