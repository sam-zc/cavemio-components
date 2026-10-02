import { Demo } from "../entries/doc-comments";
export default {
  title: "Library/Data and app UI/Doc comments",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Review", "New comment", "Crowded margin", "Save fails"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Review" } };
export const Mode1 = { args: { initialTab: "New comment" } };
export const Mode2 = { args: { initialTab: "Crowded margin" } };
export const Mode3 = { args: { initialTab: "Save fails" } };
