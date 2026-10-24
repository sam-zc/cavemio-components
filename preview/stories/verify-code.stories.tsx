import { Demo } from "../entries/verify-code";
export default {
  title: "Library/Blocks/Verify code",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Verify", "Wrong code", "Resend fails"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Verify" } };
export const Mode1 = { args: { initialTab: "Wrong code" } };
export const Mode2 = { args: { initialTab: "Resend fails" } };
