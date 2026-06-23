import { Demo } from "../entries/attachment-chip";
export default {
  title: "Library/AI and agents/Attachment chip",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Live", "Image", "Error"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Live" } };
export const Mode1 = { args: { initialTab: "Image" } };
export const Mode2 = { args: { initialTab: "Error" } };
