import { Demo } from "../entries/referral";
export default {
  title: "Library/Blocks/Referral",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Friend joins", "Unlock", "Invite limit"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Friend joins" } };
export const Mode1 = { args: { initialTab: "Unlock" } };
export const Mode2 = { args: { initialTab: "Invite limit" } };
