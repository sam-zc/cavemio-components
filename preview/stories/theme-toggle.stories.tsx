import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ThemeToggleDemo } from "../theme-toggle-demo";
import { ThemeToggle } from "../../registry/components/theme-toggle";

const meta = {
  title: "Components/Theme Toggle",
  component: ThemeToggleDemo,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <main className="cavemio-demo flex min-h-svh w-full items-center justify-center">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof ThemeToggleDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithoutWipe: Story = { args: { initialWipe: false } };
export const Dark: Story = { args: { initialTheme: "dark" } };
export const Disabled: Story = { args: { disabled: true } };
export const Uncontrolled: Story = {
  render: () => <ThemeToggle />,
};
export const Multiple: Story = {
  render: () => (
    <div className="flex gap-6 rounded-2xl bg-muted p-6">
      <ThemeToggle />
      <ThemeToggle defaultTheme="dark" />
    </div>
  ),
};

function PageExample({ circular = true }: { circular?: boolean }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [visible, setVisible] = useState(true);
  const [changes, setChanges] = useState(0);
  return (
    <section
      data-page-theme={theme}
      style={{
        background: theme === "dark" ? "#0a0a0a" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#171717",
      }}
      className="flex min-h-[70vh] w-[min(80vw,800px)] flex-col items-center justify-center gap-6 rounded-3xl p-8"
    >
      <h1 className="text-2xl">Your app owns the theme</h1>
      <p>The component owns the optional circular reveal.</p>
      {visible && (
        <div className="flex gap-6">
          {[0, 1].map((index) => (
            <ThemeToggle
              key={index}
              theme={theme}
              pageTransition={circular ? "circular" : "none"}
              onThemeChange={(next) => {
                setTheme(next);
                setChanges((count) => count + 1);
              }}
            />
          ))}
        </div>
      )}
      <p role="status">
        {theme} · {changes} changes
      </p>
      <button onClick={() => setVisible(!visible)}>
        {visible ? "Unmount toggles" : "Mount toggles"}
      </button>
    </section>
  );
}

export const CircularPage: Story = {
  render: () => <PageExample />,
  parameters: {
    docs: {
      description: {
        story:
          'Set pageTransition="circular" and apply theme styles synchronously in onThemeChange. This example uses React state; a root class/data attribute works too. Both toggles share the app state. The wipe is limited to this Storybook iframe. Reduced motion, unavailable APIs, hidden documents, and failed captures switch immediately. Async providers need an adapter; avoid overlapping router transitions. Use an allowed nonce with a strict style CSP.',
      },
    },
  },
};

export const WithoutPageTransition: Story = {
  render: () => <PageExample circular={false} />,
  parameters: {
    docs: {
      description: {
        story:
          'The default pageTransition="none" switches the app colors immediately while retaining the icon morph. Use this for deferred providers, router-owned transitions, or when no page animation is wanted.',
      },
    },
  },
};
