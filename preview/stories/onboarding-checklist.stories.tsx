import { Demo } from "../entries/onboarding-checklist";
export default {
  title: "Library/Data and app UI/Onboarding checklist",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Fresh", "Nearly done"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Fresh" } };
export const Mode1 = { args: { initialTab: "Nearly done" } };
