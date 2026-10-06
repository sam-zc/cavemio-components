import { Demo } from "../entries/file-share";
export default {
  title: "Library/Blocks/File share",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Share", "Upload drops"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Share" } };
export const Mode1 = { args: { initialTab: "Upload drops" } };
