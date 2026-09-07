import { Demo } from "../entries/voice-note";
export default {
  title: "Library/AI and agents/Voice note",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Chat", "Voicemail"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Chat" } };
export const Mode1 = { args: { initialTab: "Voicemail" } };
