import { Demo } from "../entries/auth-card";
export default {
  title: "Library/Data and app UI/Auth card",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Password", "Code", "Magic link"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Password" } };
export const Mode1 = { args: { initialTab: "Code" } };
export const Mode2 = { args: { initialTab: "Magic link" } };
