import { Demo } from "../entries/hold-to-confirm";
export default {
  title: "Library/Buttons and actions/Hold to confirm",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Archive", "Fails once"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Archive" } };
export const Mode1 = { args: { initialTab: "Fails once" } };
