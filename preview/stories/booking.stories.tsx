import { Demo } from "../entries/booking";
export default {
  title: "Library/Blocks/Booking",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Book a call", "Time taken", "Fully booked"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Book a call" } };
export const Mode1 = { args: { initialTab: "Time taken" } };
export const Mode2 = { args: { initialTab: "Fully booked" } };
