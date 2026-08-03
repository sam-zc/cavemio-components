import { Demo } from "../entries/pagination";
export default {
  title: "Library/Display and navigation/Pagination",
  component: Demo,
  argTypes: { initialTab: { control: "select", options: ["Pages"] } },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Pages" } };
