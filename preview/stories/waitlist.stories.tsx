import { Demo } from "../entries/waitlist";
export default {
  title: "Library/Blocks/Waitlist",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Join", "Admitted"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Join" } };
export const Mode1 = { args: { initialTab: "Admitted" } };
