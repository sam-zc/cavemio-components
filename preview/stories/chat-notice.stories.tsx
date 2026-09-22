import { Demo } from "../entries/chat-notice";
export default {
  title: "Library/AI and agents/Error and limit states",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Error", "Offline", "Rate limit", "Long chat"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Error" } };
export const Mode1 = { args: { initialTab: "Offline" } };
export const Mode2 = { args: { initialTab: "Rate limit" } };
export const Mode3 = { args: { initialTab: "Long chat" } };
