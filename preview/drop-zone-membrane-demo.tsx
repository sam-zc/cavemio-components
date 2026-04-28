import * as React from "react";
import {
  DropZoneMembrane,
  MembraneAttachment,
  type DropZoneMembraneProps,
  type DropZoneMembraneUpload,
  type DropZoneMembraneStatus,
} from "../registry/components/drop-zone-membrane";

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(signal.reason);
    const abort = () => {
      clearTimeout(timer);
      reject(signal.reason);
    };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", abort);
      resolve();
    }, ms);
    signal.addEventListener("abort", abort, { once: true });
  });
}

export const demoUpload: DropZoneMembraneUpload = async (
  _file,
  { signal, progress, processing },
) => {
  for (let step = 1; step <= 16; step++) {
    await wait(180, signal);
    progress(step / 16);
  }
  processing();
  await wait(800, signal);
};

export function DropZoneMembraneDemo({
  failFirst = false,
  ...props
}: DropZoneMembraneProps & { failFirst?: boolean }) {
  const attempted = React.useRef(new WeakSet<File>());
  const upload: DropZoneMembraneUpload = async (file, context) => {
    if (failFirst && !attempted.current.has(file)) {
      attempted.current.add(file);
      for (let step = 1; step <= 6; step++) {
        await wait(180, context.signal);
        context.progress(step / 10);
      }
      throw new Error("Upload failed. Try again.");
    }
    await demoUpload(file, context);
  };
  return (
    <div className="w-full max-w-[480px]">
      <DropZoneMembrane onUpload={upload} {...props} />
      <p className="mt-6 text-center text-xs text-muted-foreground">
        {props.multiple === false
          ? "One file"
          : "Up to " + (props.maxFiles ?? 2) + " files"}{" "}
        · Uploads are simulated in this example.
      </p>
    </div>
  );
}

type Example = {
  id: string;
  file: { name: string; size: number };
  status: DropZoneMembraneStatus;
  progress: number;
};
const examples: Example[] = [
  {
    id: "ready",
    file: { name: "selected-file.pdf", size: 124000 },
    status: "idle",
    progress: 0,
  },
  {
    id: "uploading",
    file: { name: "design-system.zip", size: 2400000 },
    status: "uploading",
    progress: 0.64,
  },
  {
    id: "processing",
    file: { name: "market-research.pdf", size: 780000 },
    status: "processing",
    progress: 1,
  },
  {
    id: "error",
    file: { name: "financial-model.xlsx", size: 152000 },
    status: "error",
    progress: 0.4,
  },
  {
    id: "done",
    file: { name: "uploaded-report.pdf", size: 1800000 },
    status: "done",
    progress: 1,
  },
];

export function AttachmentStatesDemo() {
  const [rows, setRows] = React.useState(examples);
  const jobs = React.useRef(new Map<string, AbortController>());
  React.useEffect(() => () => jobs.current.forEach((job) => job.abort()), []);
  const remove = (id: string) => {
    jobs.current.get(id)?.abort();
    jobs.current.delete(id);
    setRows((list) => list.filter((row) => row.id !== id));
  };
  const start = async (row: Example) => {
    jobs.current.get(row.id)?.abort();
    const job = new AbortController();
    jobs.current.set(row.id, job);
    const patch = (next: Partial<Example>) => {
      if (!job.signal.aborted)
        setRows((list) =>
          list.map((r) => (r.id === row.id ? { ...r, ...next } : r)),
        );
    };
    patch({ status: "uploading", progress: 0 });
    try {
      await demoUpload(new File([], row.file.name), {
        signal: job.signal,
        progress: (progress) => patch({ progress }),
        processing: () => patch({ status: "processing" }),
      });
      patch({ status: "done", progress: 1 });
    } catch {
      /* A removed example cancels its simulated upload. */
    } finally {
      if (jobs.current.get(row.id) === job) jobs.current.delete(row.id);
    }
  };
  return (
    <div className="w-full max-w-[384px]">
      <ul
        aria-label="Attachment states"
        className="flex list-none flex-col gap-2 p-0"
      >
        {rows.map((row) => (
          <li key={row.id}>
            <MembraneAttachment
              {...row}
              onRemove={() => remove(row.id)}
              onRetry={() => void start(row)}
            />
          </li>
        ))}
      </ul>
      <button
        className="mt-6 text-xs text-muted-foreground underline underline-offset-4"
        onClick={() => {
          jobs.current.forEach((job) => job.abort());
          jobs.current.clear();
          setRows(examples);
        }}
      >
        Reset examples
      </button>
    </div>
  );
}
