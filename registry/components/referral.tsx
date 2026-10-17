"use client";

import * as React from "react";
import { Check, Gift } from "lucide-react";
import { CopyButton } from "./copy-button";
import { NumberRoll } from "./number-roll";
import { StatusButton, type ActionStatus } from "./status-button";
import { TagInput, type TagInputTag } from "./tag-input";
import { TextMorph } from "./text-morph";
import { useRowMotion } from "./use-row-motion";
import {
  EASE_THROW,
  useInteractionReducedMotion,
} from "./imported-ui-interaction-motion";

/* ─────────────────────────────────────────────────────────
 * REFERRAL: a reward that fills as your friends join
 *
 *   pass      the lit surface: what you give and get, your link
 *             with Copy, and a track of notches, one per friend
 *             the reward needs
 *   invite    emails become chips; Send invites goes Sending →
 *             Sent and the friends slide into the list as Invited
 *   joined    when a friend joins, their face lifts out of the
 *             list and flies up into the next notch, which lights;
 *             "Invited" morphs to "Joined" and the count rolls
 *   unlocked  the last notch lands and the notches close in on
 *             the middle and become the Claim button
 *
 * The programme is yours: pass the link and the friends (with
 * their status from your database), and do the work in onInvite
 * and onClaim. Throw an Error and its message shows in place.
 * ───────────────────────────────────────────────────────── */

export interface ReferralFriend {
  id: string;
  email: string;
  name?: string;
  status: "invited" | "joined";
}

export interface ReferralProps {
  /** Your personal invite link. */
  link: string;
  /** Newest first, from your database. */
  friends: ReferralFriend[];
  /** Friends who need to join for the reward. */
  goal: number;
  /** What you get, e.g. "a free month of Pro". */
  reward: string;
  /** What your friends get, e.g. "Friends get 20% off their first year". */
  offer?: string;
  claimed?: boolean;
  /** Send the invites; throw an Error to say why not (the chips stay). */
  onInvite?: (emails: string[]) => Promise<unknown>;
  /** Give the reward; resolve once it's on the account. */
  onClaim?: () => Promise<unknown>;
  className?: string;
}

const EASE = "cubic-bezier(0.16,1,0.3,1)";
const SLOT = 34;
const NO_TAGS: TagInputTag[] = [];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const mix = (color: string, amount: number, into = "transparent") =>
  `color-mix(in oklab, ${color} ${amount}%, ${into})`;
const PASS: React.CSSProperties = {
  backgroundColor: "var(--primary)",
  backgroundImage: `radial-gradient(120% 90% at 100% 0%, ${mix("var(--primary-foreground)", 22)} 0%, transparent 55%), linear-gradient(190deg, transparent 40%, ${mix("black", 24)} 100%)`,
  boxShadow: `inset 0 1px 0 ${mix("var(--primary-foreground)", 36)}, inset 0 0 0 1px ${mix("var(--primary-foreground)", 12)}`,
};
const CARD: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, var(--card), ${mix("var(--card)", 95, "var(--foreground)")})`,
  boxShadow: `0 0 0 1px var(--border), inset 0 1px 0 ${mix("var(--background)", 85)}`,
};
const LIT: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, ${mix("var(--primary-foreground)", 16)}, transparent 60%)`,
  boxShadow: `inset 0 1px 0 ${mix("var(--primary-foreground)", 32)}, inset 0 0 0 1px ${mix("black", 10)}`,
};

function tint(seed: string): React.CSSProperties {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const chart = `var(--chart-${(h % 5) + 1}, var(--primary))`;
  return {
    background: mix(chart, 20, "var(--card)"),
    color: mix(chart, 72, "var(--foreground)"),
    boxShadow: `inset 0 0 0 1px ${mix(chart, 26)}`,
  };
}

const nameOf = (f: ReferralFriend) => f.name ?? f.email.split("@")[0];
const initials = (f: ReferralFriend) =>
  (f.name ?? f.email.split("@")[0].replace(/[._-]+/g, " "))
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

export function Referral({
  link,
  friends,
  goal,
  reward,
  offer,
  claimed: claimedProp,
  onInvite,
  onClaim,
  className = "",
}: ReferralProps) {
  const reduced = useInteractionReducedMotion();
  const baseId = React.useId();
  const [tags, setTags] = React.useState<TagInputTag[]>(NO_TAGS);
  const [invite, setInvite] = React.useState<{
    status: ActionStatus;
    error?: string;
  }>({ status: "idle" });
  const [claim, setClaim] = React.useState<{
    status: ActionStatus;
    error?: string;
  }>({ status: "idle" });
  const [said, setSaid] = React.useState("");
  // Friends whose faces are still flying up to the pass: their notch lights when they land.
  const [landing, setLanding] = React.useState<ReadonlySet<string>>(
    () => new Set(),
  );

  const sectionRef = React.useRef<HTMLElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const ghostRef = React.useRef<HTMLDivElement>(null);
  const slotRefs = React.useRef<(HTMLSpanElement | null)[]>([]);

  // Someone just joined: hold their notch unlit while their face flies up to it (decided while rendering, so it never flashes lit).
  const [seen, setSeen] = React.useState(friends);
  if (friends !== seen) {
    const fresh = friends.filter(
      (f) =>
        f.status === "joined" &&
        seen.some((p) => p.id === f.id && p.status === "invited"),
    );
    setSeen(friends);
    if (fresh.length) {
      setSaid(`${fresh.map(nameOf).join(", ")} joined.`);
      if (!reduced)
        setLanding((s) => new Set([...s, ...fresh.map((f) => f.id)]));
    }
  }

  const joined = friends.filter((f) => f.status === "joined").reverse(); // oldest first, so notches fill in order
  const lit = joined.filter((f) => !landing.has(f.id));
  const done = lit.length >= goal;
  const claimed = claimedProp ?? claim.status === "success";
  const left = Math.max(0, goal - lit.length);

  const ranks = React.useMemo(
    () => new Map(friends.map((f, i) => [f.id, i])),
    [friends],
  );
  useRowMotion(listRef, { reduced, ranks, ghosts: ghostRef });

  // Their face lifts out of their row and flies up to their notch, which lights as it lands.
  const statuses = React.useRef(new Map(friends.map((f) => [f.id, f.status])));
  React.useLayoutEffect(() => {
    const before = statuses.current;
    statuses.current = new Map(friends.map((f) => [f.id, f.status]));
    const fresh = friends.filter(
      (f) => f.status === "joined" && before.get(f.id) === "invited",
    );
    if (!fresh.length || reduced) return;
    const section = sectionRef.current;
    const order = friends.filter((f) => f.status === "joined").reverse();
    const land = (id: string) =>
      setLanding((set) => {
        const next = new Set(set);
        next.delete(id);
        return next;
      });
    if (!section)
      return fresh.forEach((f) => requestAnimationFrame(() => land(f.id)));
    const box = section.getBoundingClientRect();
    // Screen px to the block's own px, so the face lands true inside a scaled or zoomed container too.
    const k = box.width / (section.offsetWidth || box.width) || 1;
    const flights: {
      id: string;
      from: DOMRect;
      to: DOMRect;
      f: ReferralFriend;
    }[] = [];
    for (const f of fresh) {
      const face = listRef.current?.querySelector<HTMLElement>(
        `[data-row-id="${f.id}"] [data-face]`,
      );
      const slot = slotRefs.current[order.indexOf(f)];
      if (face && slot)
        flights.push({
          id: f.id,
          from: face.getBoundingClientRect(),
          to: slot.getBoundingClientRect(),
          f,
        });
      else requestAnimationFrame(() => land(f.id));
    }
    flights.forEach(({ id, from, to, f }, i) => {
      const el = document.createElement("span");
      el.setAttribute("aria-hidden", "true");
      el.textContent = initials(f);
      Object.assign(el.style, tint(f.email), {
        position: "absolute",
        left: `${(from.left - box.left) / k}px`,
        top: `${(from.top - box.top) / k}px`,
        width: `${from.width / k}px`,
        height: `${from.height / k}px`,
        borderRadius: "999px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "11px",
        fontWeight: "500",
        zIndex: "20",
        pointerEvents: "none",
        willChange: "transform",
      });
      section.appendChild(el);
      const dx = (to.left + to.width / 2 - (from.left + from.width / 2)) / k;
      const dy = (to.top + to.height / 2 - (from.top + from.height / 2)) / k;
      const s = to.width / from.width;
      const a = el.animate(
        [
          { transform: "translate(0,0) scale(1)", offset: 0 },
          {
            transform: `translate(${dx * 0.35}px, ${dy * 0.55 - 36}px) scale(${1.25})`,
            offset: 0.45,
          },
          { transform: `translate(${dx}px, ${dy}px) scale(${s})`, offset: 1 },
        ],
        {
          duration: 820,
          delay: 140 + i * 160,
          easing: "cubic-bezier(0.45,0,0.2,1)",
          fill: "forwards",
        },
      );
      a.onfinish = () => {
        land(id);
        el.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 180,
          fill: "forwards",
        }).onfinish = () => el.remove();
      };
      a.oncancel = () => {
        land(id);
        el.remove();
      };
    });
  }, [friends, reduced]);

  const send = async () => {
    const emails = tags.filter((t) => !t.error).map((t) => t.value);
    if (!emails.length || invite.status === "pending") return;
    setInvite({ status: "pending" });
    try {
      await onInvite?.(emails);
      setInvite({ status: "success" });
      setTags(NO_TAGS);
      setSaid(
        `Invited ${emails.length === 1 ? emails[0] : `${emails.length} friends`}.`,
      );
    } catch (e) {
      setInvite({
        status: "error",
        error:
          e instanceof Error && e.message
            ? e.message
            : "Couldn’t send those invites.",
      });
    }
  };

  const claimNow = async () => {
    if (claim.status === "pending" || claimed) return;
    setClaim({ status: "pending" });
    try {
      await onClaim?.();
      setClaim({ status: "success" });
      setSaid(`Claimed ${reward}.`);
    } catch (e) {
      setClaim({
        status: "error",
        error:
          e instanceof Error && e.message
            ? e.message
            : "Couldn’t claim it. Try again.",
      });
    }
  };

  const good = tags.filter((t) => !t.error).length;
  const valid = good > 0;
  const invited = friends.length;

  return (
    <section
      ref={sectionRef}
      aria-labelledby={`${baseId}-title`}
      className={`relative w-full max-w-[420px] rounded-[28px] p-2 text-card-foreground ${className}`}
      style={CARD}
    >
      {/* Its natural width where the parent sizes to its content, without forcing it on narrow screens. */}
      <div
        aria-hidden="true"
        data-natural-width
        className="grid h-0"
        style={{ gridTemplateColumns: "minmax(0, 420px)" }}
      />
      <div className="@container w-full">
        {/* The one lit surface: the pass, with a notch for every friend the reward needs. */}
        <div
          className="rounded-[22px] p-4 text-primary-foreground"
          style={PASS}
        >
          <div className="flex items-center justify-between gap-3 text-[12.5px]">
            <span className="inline-flex items-center gap-1.5 text-primary-foreground/75">
              <Gift aria-hidden="true" className="size-3.5" />
              Invite friends
            </span>
            <span className="tabular-nums text-primary-foreground/75">
              <NumberRoll
                value={Math.min(lit.length, goal)}
                duration={700}
                className="font-medium text-primary-foreground"
              />{" "}
              of {goal} joined
            </span>
          </div>
          <h2
            id={`${baseId}-title`}
            className="mt-2 text-[21px] font-medium leading-[1.15] tracking-[-0.03em]"
          >
            <TextMorph animateWidth={false}>
              {claimed
                ? "Reward claimed"
                : done
                  ? "You unlocked it"
                  : `${left} more ${left === 1 ? "friend" : "friends"}`}
            </TextMorph>
            <span className="block text-primary-foreground/70">
              {claimed ? `Enjoy ${reward}.` : `and you get ${reward}.`}
            </span>
          </h2>

          {/* The track: notches that light as friends join, then close in and become Claim. */}
          <div className="relative mt-4 grid h-[34px]">
            <div
              className="flex items-center [grid-area:1/1]"
              aria-hidden={done || undefined}
            >
              {Array.from({ length: goal }, (_, i) => {
                const f = lit[i];
                const on = Boolean(f);
                const center = (goal - 1) / 2;
                return (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <span
                        className="h-px flex-1"
                        style={{
                          background: lit[i]
                            ? "var(--primary-foreground)"
                            : mix("var(--primary-foreground)", 26),
                          opacity: done ? 0 : 1,
                          transition: reduced
                            ? "none"
                            : `background-color 300ms, opacity 240ms ${EASE}`,
                        }}
                      />
                    )}
                    <span
                      ref={(el) => {
                        slotRefs.current[i] = el;
                      }}
                      className="relative flex shrink-0 items-center justify-center rounded-full text-[11px] font-medium"
                      style={{
                        width: SLOT,
                        height: SLOT,
                        color: "var(--primary)",
                        background: on
                          ? "var(--primary-foreground)"
                          : "transparent",
                        boxShadow: on
                          ? `0 0 0 3px ${mix("var(--primary-foreground)", 20)}`
                          : `inset 0 0 0 1px ${mix("var(--primary-foreground)", 40)}`,
                        opacity: done ? 0 : 1,
                        transform:
                          done && !reduced
                            ? `translateX(calc(${center - i} * (100cqw - ${48 + SLOT}px) / ${Math.max(1, goal - 1)} * 0.9)) scale(0.6)`
                            : "none",
                        transition: reduced
                          ? "opacity 160ms"
                          : `background-color 260ms ${EASE}, box-shadow 420ms ${EASE_THROW}, transform 520ms ${EASE} ${i * 30}ms, opacity 360ms ${EASE} ${120 + i * 30}ms`,
                      }}
                    >
                      {on ? (
                        initials(f)
                      ) : (
                        <span
                          className="text-[14px] leading-none"
                          style={{
                            color: mix("var(--primary-foreground)", 55),
                          }}
                        >
                          +
                        </span>
                      )}
                    </span>
                  </React.Fragment>
                );
              })}
            </div>
            <div
              className="[grid-area:1/1]"
              inert={!done || undefined}
              style={{
                clipPath: done
                  ? "inset(0 0 round 999px)"
                  : `inset(0 calc(50% - ${SLOT / 2}px) round 999px)`,
                opacity: done ? 1 : 0,
                transition: reduced
                  ? "opacity 160ms"
                  : `clip-path 560ms ${EASE} 180ms, opacity 200ms ${EASE} ${done ? 180 : 0}ms`,
              }}
            >
              <StatusButton
                status={claimed ? "success" : claim.status}
                labels={{
                  idle: `Claim ${reward}`,
                  pending: "Claiming",
                  success: "Claimed",
                  error: "Try again",
                }}
                icon={<Gift aria-hidden="true" />}
                onClick={() => void claimNow()}
                className="h-[34px] w-full text-[13.5px] hover:opacity-95"
                style={
                  claim.status === "error"
                    ? { background: "var(--primary-foreground)" }
                    : {
                        background: "var(--primary-foreground)",
                        color: "var(--primary)",
                      }
                }
              />
            </div>
          </div>
          {claim.error && (
            <p
              role="alert"
              className="mt-2 text-[12px] text-primary-foreground/85"
            >
              {claim.error}
            </p>
          )}

          {/* Your link, inset into the pass. */}
          <div
            className="mt-4 flex h-10 items-center gap-2 rounded-full pl-4 pr-1"
            style={{
              background: mix("black", 14),
              boxShadow: `inset 0 1px 0 ${mix("black", 12)}, inset 0 0 0 1px ${mix("var(--primary-foreground)", 10)}`,
            }}
          >
            <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-primary-foreground/90">
              {link.replace(/^https?:\/\//, "")}
            </span>
            <CopyButton
              text={link}
              label="Copy link"
              copiedLabel="Copied"
              showLabel
              size="sm"
              variant="secondary"
              style={{
                background: "var(--primary-foreground)",
                color: "var(--primary)",
              }}
              className="shrink-0 hover:opacity-90"
            />
          </div>
          {offer && (
            <p className="mt-2 px-1 text-[12px] text-primary-foreground/65">
              {offer}
            </p>
          )}
        </div>

        {/* Flat: invite by email, then the people you've asked. */}
        <form
          className="px-2 pt-3"
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
        >
          <TagInput
            value={tags}
            onValueChange={(next) => {
              setTags(next);
              if (invite.status !== "idle" && invite.status !== "pending")
                setInvite({ status: "idle" });
            }}
            label="Invite by email"
            placeholder="friend@company.com"
            separators={/[\s,;]+/}
            normalize={(v) => v.toLowerCase()}
            validate={(v) =>
              !EMAIL.test(v)
                ? `“${v}” isn’t an email address`
                : friends.some((f) => f.email.toLowerCase() === v)
                  ? `${v} is already invited`
                  : null
            }
            disabled={invite.status === "pending"}
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <p
              role={invite.error ? "alert" : undefined}
              className={`min-w-0 text-[12px] ${invite.error ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}
            >
              {invite.error ?? "Paste a list, or press Enter after each."}
            </p>
            <StatusButton
              type="submit"
              status={invite.status}
              labels={{
                idle: good > 1 ? `Send ${good} invites` : "Send invite",
                pending: "Sending",
                success: "Sent",
                error: "Try again",
              }}
              onReset={() => setInvite({ status: "idle" })}
              resetAfter={1600}
              disabled={!valid && invite.status === "idle"}
              className="h-9 shrink-0 px-4 text-[13px] disabled:opacity-45"
              style={invite.status === "error" ? undefined : LIT}
            />
          </div>
        </form>

        {invited > 0 && (
          <div className="px-2 pb-1 pt-3">
            <div className="flex items-baseline justify-between px-1 text-[12px] text-muted-foreground">
              <span>Invited</span>
              <span className="tabular-nums">
                <NumberRoll value={invited} duration={600} />
              </span>
            </div>
            <div className="relative mt-1">
              <div
                ref={ghostRef}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
              />
              <ul ref={listRef} className="relative">
                {friends.map((f) => {
                  const isIn = f.status === "joined";
                  return (
                    <li
                      key={f.id}
                      data-row-id={f.id}
                      className="flex h-11 items-center gap-2.5 border-t border-border/70 px-1 first:border-t-0"
                    >
                      <span
                        data-face
                        aria-hidden="true"
                        className="flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-medium"
                        style={{
                          ...tint(f.email),
                          opacity: landing.has(f.id) ? 0.35 : 1,
                          transition: "opacity 200ms",
                        }}
                      >
                        {initials(f)}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[13.5px]">
                        {f.name ? (
                          <>
                            {f.name}{" "}
                            <span className="text-muted-foreground">
                              {f.email}
                            </span>
                          </>
                        ) : (
                          f.email
                        )}
                      </span>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 text-[12px] ${isIn ? "font-medium text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
                        style={{ transition: "color 300ms" }}
                      >
                        <span
                          className="grid"
                          style={{
                            gridTemplateColumns: isIn ? "1fr" : "0fr",
                            transition: reduced
                              ? "none"
                              : `grid-template-columns 320ms ${EASE}`,
                          }}
                        >
                          <span className="min-w-0 overflow-hidden">
                            <Check
                              aria-hidden="true"
                              className="size-3.5"
                              strokeWidth={2.5}
                            />
                          </span>
                        </span>
                        <TextMorph>{isIn ? "Joined" : "Invited"}</TextMorph>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        <span className="sr-only" role="status">
          {said}
        </span>
      </div>
    </section>
  );
}

export default Referral;
