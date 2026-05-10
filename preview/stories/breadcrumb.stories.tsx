import { Demo } from "../entries/breadcrumb";
export default {
  title: "Library/Display and navigation/Breadcrumb",
  component: Demo,
  argTypes: { initialTab: { control: "select", options: ["Short", "Long"] } },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Short" } };
export const Mode1 = { args: { initialTab: "Long" } };
