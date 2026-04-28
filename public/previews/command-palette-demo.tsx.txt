import { useRef, useState } from "react";
import {
  Palette,
  FilePlus2,
  RefreshCw,
  Download,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import {
  CommandPalette,
  type CommandItem,
} from "../registry/components/command-palette";

// Small original preview illustrations, kept out of the installed component.
function ProjectThumbnail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="1" y="2" width="22" height="20" rx="4" fill="var(--accent)" />
      <rect x="4" y="5" width="16" height="3" rx="1" fill="var(--accent-ink)" />
      <rect x="4" y="10" width="7" height="9" rx="1.5" fill="var(--primary)" />
      <path
        d="M14 11h5m-5 4h5m-5 4h3"
        stroke="var(--accent-ink)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DocumentThumbnail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="1"
        width="18"
        height="22"
        rx="3"
        fill="color-mix(in srgb, var(--warning) 12%, var(--background))"
      />
      <rect x="6" y="5" width="6" height="5" rx="1" fill="var(--warning)" />
      <path
        d="M6 14h12M6 18h8"
        stroke="var(--warning)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CommandPaletteDemo({
  open: openProp,
  onOpenChange,
  defaultOpen = false,
  showcase = true,
  controlled = false,
  empty = false,
  longContent = false,
  simulateSyncFailure = false,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  showcase?: boolean;
  controlled?: boolean;
  empty?: boolean;
  longContent?: boolean;
  simulateSyncFailure?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [selected, setSelected] = useState(
    "Find a project, open a document, or run an action.",
  );
  const attempts = useRef(0);
  const [helpOpen, setHelpOpen] = useState(false);
  const initialScopes = ["Projects", "Documents", "Actions"];
  const [scopes, setScopes] = useState(initialScopes);
  const items: CommandItem[] = empty
    ? []
    : [
        {
          id: "project",
          icon: <ProjectThumbnail />,
          group: "Projects",
          label: "Website redesign",
          description: "12 open tasks · Design team",
          keywords: ["home", "project", "website", "design"],
          onSelect: () => setSelected("Opened Website redesign"),
        },
        {
          id: "docs",
          icon: <DocumentThumbnail />,
          group: "Documents",
          label: "Brand guidelines",
          description: longContent
            ? "Logo usage, color palettes, typography, voice, and everything the design team needs to keep the next launch consistent."
            : "Logos, colors & typography",
          keywords: ["help", "brand", "style guide", "logos"],
          onSelect: () => setSelected("Opened Brand guidelines"),
        },
        {
          id: "theme",
          icon: <Palette />,
          group: "Actions",
          label: "Change appearance",
          description: "Choose your workspace theme",
          keywords: ["theme", "dark", "light", "settings"],
          items: [
            {
              id: "light",
              icon: <Sun />,
              label: "Light",
              onSelect: () => setSelected("Appearance set to Light"),
            },
            {
              id: "dark",
              icon: <Moon />,
              label: "Dark",
              onSelect: () => setSelected("Appearance set to Dark"),
            },
            {
              id: "system",
              icon: <Monitor />,
              label: "System",
              onSelect: () => setSelected("Appearance follows your system"),
            },
          ],
        },
        {
          id: "save",
          icon: <FilePlus2 />,
          group: "Actions",
          label: "Create a design brief",
          description: "Start from the team template",
          onSelect: async ({ signal }) => {
            await new Promise((resolve) => setTimeout(resolve, 650));
            if (!signal.aborted) setSelected("Created a new design brief");
          },
        },
        {
          id: "retry",
          icon: <RefreshCw />,
          group: "Actions",
          label: "Sync shared files",
          description: "Get the latest team updates",
          onSelect: async ({ signal }) => {
            await new Promise((resolve) => setTimeout(resolve, 350));
            if (signal.aborted) return;
            if (simulateSyncFailure && ++attempts.current === 1)
              throw new Error("File sync unavailable");
            setSelected("Shared files are up to date");
          },
        },
        {
          id: "slow",
          icon: <Download />,
          group: "Actions",
          label: "Export project",
          description: "Package the website design assets",
          onSelect: async ({ signal }) => {
            await new Promise<void>((resolve) => setTimeout(resolve, 2000));
            if (!signal.aborted)
              setSelected("Website redesign export is ready");
          },
        },
        ...(longContent
          ? Array.from({ length: 12 }, (_, i) => ({
              id: `archive-${i}`,
              group: "Archive",
              label: `Project ${i + 1}: ${"A long project name ".repeat(5)}`,
              onSelect: () => setSelected(`Opened archive ${i + 1}`),
            }))
          : []),
      ];
  return (
    <div className="command-palette-demo flex flex-col items-center gap-5">
      {controlled && (
        <button
          type="button"
          className="rounded-lg border border-border px-4 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setOpen(true)}
        >
          Open commands
        </button>
      )}
      <CommandPalette
        placeholder="Search projects, docs, and actions…"
        filtersLabel="Search in"
        items={
          showcase
            ? items.filter((item) => scopes.includes(item.group ?? ""))
            : items
        }
        filters={
          showcase ? scopes.map((label) => ({ id: label, label })) : undefined
        }
        onFilterRemove={(id) =>
          setScopes((current) => current.filter((scope) => scope !== id))
        }
        footer={
          <div>
            <p>
              Need a hand?{" "}
              <button
                type="button"
                aria-expanded={helpOpen}
                className="rounded-sm text-foreground underline underline-offset-4 hover:text-foreground/80 focus-visible:outline-2 focus-visible:outline-ring"
                onClick={() => setHelpOpen((value) => !value)}
              >
                Workspace help
              </button>
            </p>
            {helpOpen && (
              <p className="mt-2 max-w-sm" role="status">
                Search “brand” to find the guidelines, “export” to package
                assets, or “theme” to change appearance. Remove a chip to
                exclude that category.
              </p>
            )}
          </div>
        }
        defaultOpen={defaultOpen}
        showTrigger={!controlled}
        open={openProp ?? (controlled ? open : undefined)}
        onOpenChange={(next) => {
          if (controlled) setOpen(next);
          onOpenChange?.(next);
        }}
      />
      {showcase && scopes.length < initialScopes.length && (
        <button
          type="button"
          className="text-xs text-muted-foreground underline focus-visible:outline-2 focus-visible:outline-ring"
          onClick={() => setScopes(initialScopes)}
        >
          Search all categories
        </button>
      )}
      <p
        className="text-center text-xs text-muted-foreground"
        data-demo-result=""
      >
        {selected}
      </p>
    </div>
  );
}
