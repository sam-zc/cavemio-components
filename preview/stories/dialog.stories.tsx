import { Demo } from "../entries/dialog";
export default {
  title: "Library/Overlays and feedback/Dialog",
  component: Demo,
  argTypes: { initialTab: { control: "select", options: ["Confirm", "Long"] } },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Confirm" } };
export const Mode1 = { args: { initialTab: "Long" } };
