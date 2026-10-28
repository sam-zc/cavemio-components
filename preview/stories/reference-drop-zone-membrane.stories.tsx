import { Demo } from "../entries/drop-zone-membrane";
export default {
  title: "Reference demos/Inputs and forms/Drop Zone Membrane",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Upload", "Fails once", "Single file"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Upload" } };
export const Mode1 = { args: { initialTab: "Fails once" } };
export const Mode2 = { args: { initialTab: "Single file" } };
