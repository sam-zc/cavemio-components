import { Demo } from "../entries/log-stream";
export default {
  title: "Library/Data and app UI/Log stream",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Live", "Burst", "History"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Live" } };
export const Mode1 = { args: { initialTab: "Burst" } };
export const Mode2 = { args: { initialTab: "History" } };
