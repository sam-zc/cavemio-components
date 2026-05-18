import { Demo } from "../entries/hover-card";
export default {
  title: "Library/Overlays and feedback/Hover card",
  component: Demo,
  argTypes: { initialTab: { control: "select", options: ["Profile", "Link"] } },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Profile" } };
export const Mode1 = { args: { initialTab: "Link" } };
