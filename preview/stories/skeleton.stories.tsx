import { Demo } from "../entries/skeleton";
export default {
  title: "Library/Display and navigation/Skeleton",
  component: Demo,
  argTypes: { initialTab: { control: "select", options: ["Card", "List"] } },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Card" } };
export const Mode1 = { args: { initialTab: "List" } };
