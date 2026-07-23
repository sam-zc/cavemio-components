import { Demo } from "../entries/live-activity";
export default {
  title: "Library/Display and navigation/Live activity",
  component: Demo,
  argTypes: { initialTab: { control: "select", options: ["Agent", "Upload"] } },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Agent" } };
export const Mode1 = { args: { initialTab: "Upload" } };
