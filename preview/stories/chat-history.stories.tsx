import { Demo } from "../entries/chat-history";
export default {
  title: "Library/AI and agents/Chat history",
  component: Demo,
  argTypes: { initialTab: { control: "select", options: ["Live", "Search"] } },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Live" } };
export const Mode1 = { args: { initialTab: "Search" } };
