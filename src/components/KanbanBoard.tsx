"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { STAGES, STAGE_LABELS, type Stage } from "@/lib/constants";
import type { JobCardDTO } from "@/lib/types";
import { AddJobModal } from "@/components/AddJobModal";

export function KanbanBoard() {
  const [jobCards, setJobCards] = useState<JobCardDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  async function loadJobCards() {
    try {
      const res = await fetch("/api/job-cards");
      const data = await res.json();
      if (res.ok) setJobCards(data.jobCards);
      else setError("Could not load your board. Please refresh and try again.");
    } catch {
      setError("Could not reach the server. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobCards();
  }, []);

  async function moveCard(cardId: string, stage: Stage) {
    setJobCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, stage } : c))
    );
    try {
      const res = await fetch(`/api/job-cards/${cardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
      if (!res.ok) {
        setError("Could not update the card. Please refresh and try again.");
        loadJobCards();
      }
    } catch {
      setError("Could not reach the server. Please refresh and try again.");
      loadJobCards();
    }
  }

  function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    moveCard(draggableId, destination.droppableId as Stage);
  }

  if (loading) {
    return <p className="px-4 py-6 text-sm text-slate-500">Loading your board…</p>;
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Application Board</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          + Add Job
        </button>
      </div>

      {error && (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-4">
          {STAGES.map((stage) => {
            const cards = jobCards.filter((c) => c.stage === stage);
            return (
              <div key={stage} className="flex w-64 shrink-0 flex-col">
                <div className="mb-2 flex items-center justify-between px-1">
                  <h2 className="text-sm font-semibold text-slate-700">
                    {STAGE_LABELS[stage]}
                  </h2>
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {cards.length}
                  </span>
                </div>
                <Droppable droppableId={stage}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex min-h-[120px] flex-col gap-2 rounded-xl bg-slate-100 p-2"
                    >
                      {cards.map((card, index) => (
                        <Draggable key={card.id} draggableId={card.id} index={index}>
                          {(dragProvided, dragSnapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              className={`rounded-lg border border-slate-200 bg-white p-3 shadow-sm ${
                                dragSnapshot.isDragging ? "ring-2 ring-indigo-400" : ""
                              }`}
                            >
                              <div className="flex items-start gap-1">
                                <Link
                                  href={`/jobs/${card.id}`}
                                  className="block min-w-0 flex-1"
                                >
                                  <p className="text-sm font-semibold text-slate-900">
                                    {card.title}
                                  </p>
                                  <p className="text-xs text-slate-500">{card.company}</p>
                                  {card.resumeVersion && (
                                    <p className="mt-1 truncate text-xs text-indigo-600">
                                      📄 {card.resumeVersion.fileName}
                                    </p>
                                  )}
                                </Link>
                                <span
                                  {...dragProvided.dragHandleProps}
                                  aria-label="Drag to move"
                                  className="-mr-1 -mt-1 shrink-0 cursor-grab select-none rounded p-1.5 text-slate-300 hover:bg-slate-100 hover:text-slate-500 active:cursor-grabbing"
                                >
                                  ⠿
                                </span>
                              </div>
                              <select
                                value={card.stage}
                                onChange={(e) =>
                                  moveCard(card.id, e.target.value as Stage)
                                }
                                className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600"
                              >
                                {STAGES.map((s) => (
                                  <option key={s} value={s}>
                                    {STAGE_LABELS[s]}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {cards.length === 0 && (
                        <p className="px-1 py-2 text-center text-xs text-slate-400">
                          No jobs here yet
                        </p>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {showAddModal && (
        <AddJobModal
          onClose={() => setShowAddModal(false)}
          onCreated={(card) => {
            setJobCards((prev) => [card, ...prev]);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}
