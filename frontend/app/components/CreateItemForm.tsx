"use client";
import React, { useState } from "react";

type Props = {
  onCreated?: () => void; // callback to refresh list
};

export default function CreateItemForm({ onCreated }: Props) {
  const API = process.env.NEXT_PUBLIC_API || "";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const clearForm = () => {
    setTitle("");
    setDescription("");
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // simple validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/items`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim() || undefined }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || "Failed to create item");
      }

      clearForm();
      showToast("Item created");
      onCreated?.();
    } catch (err: any) {
      setError(err?.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-medium mb-3 text-gray-500">Create new item</h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full p-2 border rounded text-gray-500"
            disabled={loading}
          />
        </div>

        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full p-2 border rounded text-gray-500"
            rows={3}
            disabled={loading}
          />
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="flex gap-3 items-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 cursor-pointer rounded disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Item"}
          </button>

          <button
            type="button"
            onClick={() => { clearForm(); setError(null); }}
            className="px-3 py-1 border text-gray-400 hover:text-slate-600  cursor-pointer rounded"
            disabled={loading}
          >
            Reset
          </button>

          {toast && <div className="text-sm text-green-600 ml-3">{toast}</div>}
        </div>
      </form>
    </div>
  );
}
