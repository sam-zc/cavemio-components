import { Demo } from "../entries/combobox";
export default {
  title: "Library/Inputs and forms/Combobox",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Repositories", "Assignee", "Labels"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Repositories" } };
export const Mode1 = { args: { initialTab: "Assignee" } };
export const Mode2 = { args: { initialTab: "Labels" } };
