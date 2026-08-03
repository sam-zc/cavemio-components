import { Demo } from "../entries/password-input";
export default {
  title: "Library/Inputs and forms/Password input",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Sign in", "New password"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Sign in" } };
export const Mode1 = { args: { initialTab: "New password" } };
