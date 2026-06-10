import { Demo } from "../entries/swipe-actions";
export default {
  title: "Library/Data and app UI/Swipe actions",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Inbox", "Fails once"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Inbox" } };
export const Mode1 = { args: { initialTab: "Fails once" } };
