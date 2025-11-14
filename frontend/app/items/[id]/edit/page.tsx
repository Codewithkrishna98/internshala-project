"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export default function EditItemPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const API = process.env.NEXT_PUBLIC_API || "";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loadingItem, setLoadingItem] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch item
  useEffect(() => {
    const loadItem = async () => {
      try {
        const res = await fetch(`${API}/api/items/${id}`, {
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setTitle(data.item.title);
        setDescription(data.item.description || "");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingItem(false);
      }
    };
    loadItem();
  }, [API, id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);

    const parsed = schema.safeParse({ title, description });
    if (!parsed.success) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API}/api/items/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loadingItem) return <div className="p-6">Loading item...</div>;

  return (
    <div className="p-6 max-w-xl text-gray-500 mx-auto">
      <h2 className="text-xl font-semibold mb-4">Edit Item</h2>

      {error && <div className="text-red-600 mb-3">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={saving}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={saving}
            rows={4}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update"}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => router.back()}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
