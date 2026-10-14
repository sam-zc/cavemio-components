import { Demo } from "../entries/notification-inbox";
export default {
  title: "Library/Overlays and feedback/Notification inbox",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Inbox", "Live", "Caught up"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Inbox" } };
export const Mode1 = { args: { initialTab: "Live" } };
export const Mode2 = { args: { initialTab: "Caught up" } };
