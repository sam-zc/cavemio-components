import { Demo } from "../entries/stepper-input";
export default {
  title: "Library/Inputs and forms/Stepper input",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Seat count", "Radius scale", "Bounded limit"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Seat count" } };
export const Mode1 = { args: { initialTab: "Radius scale" } };
export const Mode2 = { args: { initialTab: "Bounded limit" } };
