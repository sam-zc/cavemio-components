import { StrictMode, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { VideoPlayerDemo, videoSamples } from "../video-player-demo";
import { VideoPlayer } from "../../registry/components/video-player";

const meta = {
  title: "Components/Video Player",
  component: VideoPlayerDemo,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof VideoPlayerDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Formats: Story = { args: { initialDemo: "formats" } };
export const Quality: Story = { args: { initialDemo: "quality" } };
export const Diagnostics: Story = {
  args: { initialDemo: "diagnostics", initialFormat: "dash" },
};
export const Engines: Story = {
  args: { initialDemo: "engines", initialFormat: "hls" },
};
export const Motion: Story = { args: { initialDemo: "motion" } };
export const Drm: Story = { args: { initialDemo: "drm" } };
export const Hls: Story = {
  args: {
    initialFormat: "hls",
    initialEngine: "hls",
    initialDemo: "diagnostics",
  },
};
export const Multiple: Story = {
  render: () => (
    <div className="cavemio-demo grid gap-6 p-6">
      <VideoPlayer source={videoSamples.dash} title="First player" muted />
      <VideoPlayer source={videoSamples.hls} title="Second player" muted />
    </div>
  ),
};
export const Fixture: Story = {
  render: () => (
    <StrictMode>
      <FixtureExample />
    </StrictMode>
  ),
};
function FixtureExample() {
  const [engine, setEngine] = useState<"shaka" | "hls" | "native">("shaka");
  const [format, setFormat] = useState<"dash" | "hls" | "mp4">("dash");
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [fail, setFail] = useState(false);
  const [second, setSecond] = useState(false);
  const [controlled, setControlled] = useState(false);
  const [playing, setPlaying] = useState(false);
  const src = `/video-fixtures/${fail ? "missing" : "sample"}.${format === "dash" ? "mpd" : format === "hls" ? "m3u8" : "mp4"}`;
  return (
    <div className="cavemio-demo mx-auto max-w-4xl space-y-4 p-4">
      {visible && (
        <VideoPlayer
          src={src}
          type={format}
          engine={engine}
          title="Fixture"
          muted
          enableDiagnostics
          reducedMotion={reduced}
          playing={controlled ? playing : undefined}
          onPlayingChange={setPlaying}
        />
      )}
      {second && (
        <VideoPlayer
          src="/video-fixtures/sample.mpd"
          type="dash"
          title="Second fixture"
          muted
        />
      )}
      <div className="flex flex-wrap gap-3 text-xs">
        <select
          aria-label="Fixture engine"
          value={engine}
          onChange={(e) => setEngine(e.target.value as typeof engine)}
        >
          <option>shaka</option>
          <option>hls</option>
          <option>native</option>
        </select>
        <select
          aria-label="Fixture format"
          value={format}
          onChange={(e) => setFormat(e.target.value as typeof format)}
        >
          <option>dash</option>
          <option>hls</option>
          <option>mp4</option>
        </select>
        <button onClick={() => setVisible(!visible)}>
          {visible ? "Unmount" : "Mount"}
        </button>
        <button onClick={() => setReduced(!reduced)}>
          Toggle reduced motion
        </button>
        <button onClick={() => setFail(!fail)}>Toggle bad source</button>
        <button onClick={() => setSecond(!second)}>Toggle second player</button>
        <button onClick={() => setControlled(!controlled)}>
          Toggle controlled playback
        </button>
        <input aria-label="Unrelated text field" />
      </div>
    </div>
  );
}
