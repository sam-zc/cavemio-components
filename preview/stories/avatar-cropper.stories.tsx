import { Demo } from "../entries/avatar-cropper";
export default {
  title: "Library/Inputs and forms/Avatar cropper",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Profile photo", "Editing", "Workspace logo", "Save fails"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Profile photo" } };
export const Mode1 = { args: { initialTab: "Editing" } };
export const Mode2 = { args: { initialTab: "Workspace logo" } };
export const Mode3 = { args: { initialTab: "Save fails" } };
