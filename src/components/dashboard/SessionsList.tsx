"use client";

import { useState } from "react";
import { StudySessionCard } from "@/components/dashboard/StudySessionCard";
import type { StudySession } from "@/types";

export function SessionsList({ initial }: { initial: StudySession[] }) {
  const [sessions, setSessions] = useState(initial);

  function handleDelete(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-3">
      {sessions.map((session, i) => (
        <StudySessionCard
          key={session.id}
          session={session}
          animationDelay={`${i * 55}ms`}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
