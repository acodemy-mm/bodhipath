"use client";

import {
  PageHeader,
  Surface,
  EmptyState,
} from "@/components/gamification-ui";
import {
  BellIcon,
  FireIcon,
  LeafIcon,
  TrophyIcon,
} from "@/components/reference-icons";
import { useAppStore } from "@/lib/store";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  unread?: boolean;
  icon: "habit" | "streak" | "level" | "event";
};

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    title: "Morning habits waiting",
    body: "Complete today’s preset prayer checklist to keep your path warm.",
    time: "Just now",
    unread: true,
    icon: "habit",
  },
  {
    id: "n2",
    title: "Streak reminder",
    body: "A single mindful step today protects your daily streak.",
    time: "2h ago",
    unread: true,
    icon: "streak",
  },
  {
    id: "n3",
    title: "Level progress",
    body: "Keep practicing — your Bodhi Tree grows with Merit.",
    time: "Yesterday",
    icon: "level",
  },
  {
    id: "n4",
    title: "Community event soon",
    body: "Event details will appear when the Event section opens.",
    time: "2d ago",
    icon: "event",
  },
];

function NotificationIcon({ type }: { type: NotificationItem["icon"] }) {
  if (type === "streak") return <FireIcon />;
  if (type === "level") return <LeafIcon />;
  if (type === "event") return <TrophyIcon />;
  return <BellIcon />;
}

export default function NotificationsPage() {
  const { profile } = useAppStore();
  if (!profile) return null;

  const unreadCount = NOTIFICATIONS.filter((item) => item.unread).length;

  return (
    <section className="gamify-page animate-grow-in">
      <PageHeader
        title="Notifications"
        description={
          unreadCount
            ? `${unreadCount} new update${unreadCount === 1 ? "" : "s"}`
            : "You’re all caught up"
        }
      />

      {NOTIFICATIONS.length === 0 ? (
        <EmptyState>No notifications yet.</EmptyState>
      ) : (
        <div className="grid gap-2">
          {NOTIFICATIONS.map((item) => (
            <Surface
              key={item.id}
              strong={Boolean(item.unread)}
              className="flex items-start gap-3 p-4"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-tree/20 text-accent-merit">
                <NotificationIcon type={item.icon} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-cream">{item.title}</p>
                  {item.unread ? (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent-danger" />
                  ) : null}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                  {item.body}
                </p>
                <p className="mt-2 text-xs text-text-tertiary">{item.time}</p>
              </div>
            </Surface>
          ))}
        </div>
      )}
    </section>
  );
}
