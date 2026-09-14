import { Demo } from "../entries/workflow-canvas";
export default {
  title: "Library/Motion and landing/Workflow canvas",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Ready", "Needs retry"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Ready" } };
export const Mode1 = { args: { initialTab: "Needs retry" } };
