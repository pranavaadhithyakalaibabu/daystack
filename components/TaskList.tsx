"use client";

import { useState } from "react";
import PriorityBadge from "@/components/PriorityBadge";
import type { PlannedTask, Priority } from "@/lib/types";

interface TaskListProps {
  tasks: PlannedTask[];
  completedTasks: string[];
  onToggle: (taskId: string) => void;
  onRemove: (index: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onAdd: (task: PlannedTask) => void;
}

export default function TaskList({
  tasks,
  completedTasks,
  onToggle,
  onRemove,
  onReorder,
  onAdd,
}: TaskListProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) {
      setOverIndex(index);
    }
  }

  function handleDrop(e: React.DragEvent, toIndex: number) {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== toIndex) {
      onReorder(dragIndex, toIndex);
    }
    setDragIndex(null);
    setOverIndex(null);
  }

  function handleDragEnd() {
    setDragIndex(null);
    setOverIndex(null);
  }

  return (
    <div className="space-y-3">
      {tasks.length > 0 && (
        <div className="list-group">
          {tasks.map((item, index) => {
            const done = completedTasks.includes(item.task);
            const isDragging = dragIndex === index;
            const isOver = overIndex === index && dragIndex !== index;

            return (
              <div
                key={`${index}-${item.task}`}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                className={`list-row transition-opacity ${isDragging ? "opacity-50" : ""} ${
                  isOver ? "bg-brand/5" : ""
                }`}
              >
                <TaskRow
                  item={item}
                  done={done}
                  dragIndex={index}
                  onDragStart={() => handleDragStart(index)}
                  onDragEnd={handleDragEnd}
                  onToggle={() => onToggle(item.task)}
                  onRemove={() => onRemove(index)}
                />
              </div>
            );
          })}
        </div>
      )}

      {showAdd ? (
        <AddTaskForm
          onSave={(task) => {
            onAdd(task);
            setShowAdd(false);
          }}
          onCancel={() => setShowAdd(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="flex w-full items-center justify-center gap-1.5 rounded-apple-lg bg-surface py-3.5 font-body text-[15px] font-medium text-brand shadow-card transition-colors hover:bg-surface-secondary active:opacity-80"
        >
          <span className="text-lg leading-none">+</span>
          Add Task
        </button>
      )}
    </div>
  );
}

function TaskRow({
  item,
  done,
  dragIndex,
  onDragStart,
  onDragEnd,
  onToggle,
  onRemove,
}: {
  item: PlannedTask;
  done: boolean;
  dragIndex: number;
  onDragStart: () => void;
  onDragEnd: () => void;
  onToggle: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={`task-row flex flex-wrap items-center gap-2 px-3 py-3.5 md:flex-nowrap ${
        done ? "task-row-done" : "task-row-active"
      }`}
    >
      <button
        type="button"
        draggable
        aria-label="Drag to reorder"
        className="flex shrink-0 cursor-grab touch-none p-1 text-muted active:cursor-grabbing"
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", String(dragIndex));
          onDragStart();
        }}
        onDragEnd={onDragEnd}
      >
        <GripIcon />
      </button>

      <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={done}
          onChange={onToggle}
          className="sr-only"
        />
        <span
          className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            done
              ? "border-brand bg-brand text-white"
              : "border-border-strong bg-surface"
          }`}
          aria-hidden
        >
          {done && (
            <svg
              className="h-2.5 w-2.5"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M2 6l3 3 5-5" />
            </svg>
          )}
        </span>
        <span
          className={`font-body text-[17px] leading-snug ${
            done ? "task-label-done" : "text-text"
          }`}
        >
          {item.task}
        </span>
      </label>

      <div
        className={`flex w-full items-center justify-end gap-2 pl-8 md:w-auto md:pl-0 ${
          done ? "opacity-60" : ""
        }`}
      >
        <span className="font-body text-[13px] tabular-nums text-muted">
          {item.estimated_minutes}m
        </span>
        <PriorityBadge priority={item.priority} />
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove task"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-red/10 hover:text-red"
        >
          ×
        </button>
      </div>
    </div>
  );
}

function AddTaskForm({
  onSave,
  onCancel,
}: {
  onSave: (task: PlannedTask) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("med");
  const [minutes, setMinutes] = useState("30");

  function handleSave() {
    if (!text.trim()) return;
    onSave({
      task: text.trim(),
      priority,
      estimated_minutes: Math.max(5, parseInt(minutes, 10) || 30),
    });
    setText("");
    setPriority("med");
    setMinutes("30");
  }

  return (
    <div className="card p-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="New task"
        autoFocus
        className="input-premium mb-3"
      />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(["high", "med", "low"] as Priority[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPriority(p)}
            className={`rounded-full px-3 py-1 font-body text-[13px] font-medium capitalize transition-colors ${
              priority === p
                ? "bg-brand text-white"
                : "bg-surface-secondary text-text-secondary"
            }`}
          >
            {p}
          </button>
        ))}
        <input
          type="number"
          min={5}
          step={5}
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          className="w-16 rounded-apple border border-border bg-surface px-2 py-1 font-body text-[13px] text-text"
          aria-label="Estimated minutes"
        />
        <span className="font-body text-[13px] text-muted">min</span>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={handleSave} className="btn-primary flex-1">
          Add
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
      </div>
    </div>
  );
}

function GripIcon() {
  return (
    <svg width="8" height="14" viewBox="0 0 8 14" fill="currentColor" aria-hidden>
      <circle cx="2" cy="2" r="1.25" />
      <circle cx="6" cy="2" r="1.25" />
      <circle cx="2" cy="7" r="1.25" />
      <circle cx="6" cy="7" r="1.25" />
      <circle cx="2" cy="12" r="1.25" />
      <circle cx="6" cy="12" r="1.25" />
    </svg>
  );
}
