"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { ChatHistory } from "../../registry/components/chat-history";

export function Demo() {
  const [active, setActive] = useState("1");
  const [value, setValue] = useState(() => [
    { id: "1", title: "A new direction", updatedAt: Date.now() },
    {
      id: "2",
      title: "Ideas for the next release",
      updatedAt: Date.now() - 86400000,
    },
    {
      id: "3",
      title: "Planning the launch",
      updatedAt: Date.now() - 172800000,
    },
  ]);
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <ChatHistory
          chats={value}
          activeId={active}
          onSelect={setActive}
          onNew={() =>
            setValue([
              {
                id: String(Date.now()),
                title: "New conversation",
                updatedAt: Date.now(),
              },
              ...value,
            ])
          }
          onRename={async (id, title) =>
            setValue(
              value.map((chat) => (chat.id === id ? { ...chat, title } : chat)),
            )
          }
          onDelete={async (id) =>
            setValue(value.filter((chat) => chat.id !== id))
          }
        />
      </div>
    </div>
  );
}
