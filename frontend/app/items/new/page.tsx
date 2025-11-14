"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

const schema = z.object({ title: z.string().min(1), description: z.string().optional() });

export default function NewItem() {
  const API = process.env.NEXT_PUBLIC_API || "";
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = schema.safeParse({ title, description });
    if (!validation.success) {
      setErr("Title is required");
      return;
    }
    try {
      const res = await fetch(`${API}/api/items`, {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ title, description })
      });
      if (!res.ok) {
        const data = await res.json().catch(()=>null);
        throw new Error(data?.message || "Create failed");
      }
      router.push("/items");
    } catch (error:any) {
      setErr(error.message);
    }
  };

  return (
    <div className="p-6 max-w-lg">
      <h2 className="text-xl mb-4">Create new item</h2>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="border p-2 w-full rounded"/>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="border p-2 w-full rounded" />
        <div className="flex gap-3">
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Create</button>
          <button type="button" onClick={()=>router.back()} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
