"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Item = { _id: string; title: string; description?: string; owner: any; createdAt: string };

export default function ItemsList() {
  const API = process.env.NEXT_PUBLIC_API || "";
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mineOnly, setMineOnly] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (q) params.set("q", q);
      if (mineOnly) params.set("mine", "true");

      const res = await fetch(`${API}/api/items?${params.toString()}`, { credentials: "include" });
      const data = await res.json();
      setItems(data.items || []);
      setPages(data.pagination?.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page, q, mineOnly]);

  return (
    <div className="p-6">
      <div className="flex gap-3 mb-4">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search title..." className="border p-2 rounded"/>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={mineOnly} onChange={(e)=>setMineOnly(e.target.checked)} />
          Mine only
        </label>
        <Link href="/items/new" className="ml-auto bg-indigo-600 text-white px-3 py-1 rounded">New Item</Link>
      </div>

      {loading ? <div>Loading...</div> : (
        <>
          <table className="w-full bg-white shadow rounded">
            <thead>
              <tr className="text-left">
                <th className="p-2">Title</th>
                <th className="p-2">Owner</th>
                <th className="p-2">Created</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(it => (
                <tr key={it._id} className="border-t">
                  <td className="p-2">{it.title}</td>
                  <td className="p-2">{it.owner?.name || it.owner?.email}</td>
                  <td className="p-2">{new Date(it.createdAt).toLocaleString()}</td>
                  <td className="p-2">
                    <Link href={`/items/${it._id}`} className="text-blue-600 mr-3">View</Link>
                    <Link href={`/items/${it._id}/edit`} className="text-indigo-600 mr-3">Edit</Link>
                    <button onClick={async()=>{ if(!confirm("Delete?"))return; await fetch(`${API}/api/items/${it._id}`, { method: "DELETE", credentials: "include"}); fetchItems(); }} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center gap-3 mt-4">
            <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1 border rounded">Prev</button>
            <div>Page {page} of {pages}</div>
            <button disabled={page>=pages} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 border rounded">Next</button>
          </div>
        </>
      )}
    </div>
  );
}
