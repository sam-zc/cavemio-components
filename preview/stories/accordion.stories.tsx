import { Demo } from "../entries/accordion";
export default {
  title: "Library/Display and navigation/Accordion",
  component: Demo,
  argTypes: { initialTab: { control: "select", options: ["Rows", "Cards"] } },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Rows" } };
export const Mode1 = { args: { initialTab: "Cards" } };
