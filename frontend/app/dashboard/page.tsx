
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import CreateItemForm from "../components/CreateItemForm";

type User = { name: string; email: string; role: string } | null;
type Item = { _id: string; title: string; description?: string; createdAt: string; owner?: any };

export default function DashboardPage() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [items, setItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API || "";

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(`${API}/api/auth/me`, { credentials: "include" });
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUser(data.user ?? null);
      } catch (err) {
        console.error(err);
        router.push("/login");
      }
    };
    fetchMe();
  }, [API, router]);

  useEffect(() => {
    if (user === undefined) return; // wait until auth resolved
    if (!user) return; // not logged in
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchItems = async () => {
    if (!user) return;
    setLoadingItems(true);
    setError(null);
    try {
      // fetch only the current user's items (backend supports ?mine=true)
      const res = await fetch(`${API}/api/items?mine=true&limit=20`, { credentials: "include" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to load items");
      }
      const data = await res.json();
      setItems(data.items || []);
    } catch (err: any) {
      setError(err?.message || "Could not fetch items");
    } finally {
      setLoadingItems(false);
    }
  };

  if (user === undefined) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    return <div className="p-8">Redirecting to login...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <Header name={user.name} role={user.role} />

        <main className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Hero */}
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-lg">
                <div
                    className="flex items-center justify-center w-20 h-20 rounded-full bg-white/20 text-2xl font-semibold"
                    aria-hidden
                >
                    {user.name
                        .split(" ")
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold">Welcome, {user.name}!</h2>
                    <p className="mt-1 text-indigo-100">
                        {user.role === "admin"
                            ? "Manage your posts and users from the admin dashboard."
                            : "View your dashboard, activity and quick actions."}
                    </p>
                </div>
                <div className="mt-3 md:mt-0">
                    <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {user.role.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Grid: left = content, right = quick info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 border ">
                <div className="lg:col-span-2 space-y-6">
                    {/* Create Item Card */}
                    <div className="bg-white rounded-lg p-5 shadow-sm border">
                        <h3 className="text-lg font-semibold mb-3 text-gray-700">Create an Item</h3>
                        <CreateItemForm onCreated={fetchItems} />
                    </div>

                    {/* Items list */}
                    <section className="bg-white rounded-lg p-5 shadow-sm border">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium text-gray-500 ">Your Items</h2>
                            <div className="text-sm text-gray-500">{items.length} total</div>
                        </div>

                        {loadingItems ? (
                            <div className="text-gray-600">Loading items...</div>
                        ) : error ? (
                            <div className="text-sm text-red-600">{error}</div>
                        ) : items.length === 0 ? (
                            <div className="text-sm text-gray-600">You don't have any items yet.</div>
                        ) : (
                            <div className="space-y-3">
                                {items.map((it) => (
                                    <div
                                        key={it._id}
                                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 rounded border hover:shadow-sm transition"
                                    >
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center font-medium">
                                                    {it.title.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-800">{it.title}</div>
                                                    <div className="text-sm text-gray-500">{it.description || "-"}</div>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-gray-400">
                                                Created: {new Date(it.createdAt).toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded text-sm font-medium hover:bg-indigo-100"
                                                onClick={() => router.push(`/items/${it._id}`)}
                                            >
                                                View
                                            </button>
                                            <button
                                                className="text-white bg-indigo-600 px-3 py-1 rounded text-sm font-medium hover:bg-indigo-700"
                                                onClick={() => router.push(`/items/${it._id}/edit`)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="text-red-600 bg-red-50 px-3 py-1 rounded text-sm font-medium hover:bg-red-100"
                                                onClick={async () => {
                                                    if (!confirm("Delete this item?")) return;
                                                    try {
                                                        const res = await fetch(`${API}/api/items/${it._id}`, {
                                                            method: "DELETE",
                                                            credentials: "include",
                                                        });
                                                        if (!res.ok) {
                                                            const data = await res.json().catch(() => null);
                                                            throw new Error(data?.message || "Delete failed");
                                                        }
                                                        fetchItems();
                                                    } catch (err: any) {
                                                        alert(err?.message || "Delete failed");
                                                    }
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

               
            </div>
        </main>
    </div>
  );
}









// // app/dashboard/page.tsx


// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Header from "../components/Header";

// type User = { name: string; email: string; role: string } | null;

// export default function DashboardPage() {
//   const [user, setUser] = useState<User | undefined>(undefined);
//   const router = useRouter();
//   const API = process.env.NEXT_PUBLIC_API || "";

//   useEffect(() => {
//     // fetch the /me endpoint, include cookies
//     const fetchMe = async () => {
//       try {
//         const res = await fetch(`${API}/api/auth/me`, {
//           method: "GET",
//           credentials: "include",
//         });
//         if (!res.ok) {
//           // not authorized -> redirect to login
//           router.push("/login");
//           return;
//         }
//         const data = await res.json();
//         setUser(data.user ?? null);
//       } catch (err) {
//         console.error(err);
//         router.push("/login");
//       }
//     };
//     fetchMe();
//   }, [API, router]);

//   // loading while we check auth
//   if (user === undefined) {
//     return <div className="p-8">Loading...</div>;
//   }

//   if (!user) {
//     return <div className="p-8">Redirecting to login...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Header name={user.name} role={user.role} />
//       <main className="max-w-6xl mx-auto p-6">
//         {/* Hero */}
//         <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-lg">
//           <div
//             className="flex items-center justify-center w-20 h-20 rounded-full bg-white/20 text-2xl font-semibold"
//             aria-hidden
//           >
//             {user.name
//               .split(" ")
//               .map((s) => s[0])
//               .slice(0, 2)
//               .join("")
//               .toUpperCase()}
//           </div>
//           <div className="flex-1">
//             <h2 className="text-2xl md:text-3xl font-bold">
//               Welcome  {user.name}!
//             </h2>
//             <p className="mt-1 text-indigo-100">
//               {user.role === "admin"
//                 ? "Manage your post."
//                 : "View your dashboard, activity and quick actions."}
//             </p>
//           </div>
//           <div className="mt-3 md:mt-0">
//             <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
//               {user.role.toUpperCase()}
//             </span>
//           </div>
//         </div>

//         {/* Stats */}
//         {/* <section className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
//           <div className="bg-white rounded-lg p-5 shadow-sm border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500">Projects</p>
//                 <p className="text-2xl font-bold mt-1">12</p>
//               </div>
//               <div className="text-indigo-600 bg-indigo-50 p-2 rounded">
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 00-2-2H5l7-7 7 7h-2a2 2 0 00-2 2v6" />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg p-5 shadow-sm border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500">Active Sessions</p>
//                 <p className="text-2xl font-bold mt-1">3</p>
//               </div>
//               <div className="text-green-600 bg-green-50 p-2 rounded">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg p-5 shadow-sm border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500">Notifications</p>
//                 <p className="text-2xl font-bold mt-1">7</p>
//               </div>
//               <div className="text-yellow-600 bg-yellow-50 p-2 rounded">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </section> */}

//         {/* Main content */}
//         <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Recent Activity */}
//           {/* <div className="bg-white rounded-lg p-6 shadow-sm border">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-semibold">Recent Activity</h3>
//               <button className="text-sm text-indigo-600 hover:underline">View all</button>
//             </div>
//             <ul className="mt-4 space-y-4">
//               <li className="flex items-start gap-3">
//                 <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-medium">PR</div>
//                 <div>
//                   <p className="text-sm"><strong>Pull request</strong> merged into main</p>
//                   <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
//                 </div>
//               </li>
//               <li className="flex items-start gap-3">
//                 <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-medium">DB</div>
//                 <div>
//                   <p className="text-sm">Database backup completed</p>
//                   <p className="text-xs text-gray-500 mt-1">Yesterday</p>
//                 </div>
//               </li>
//               <li className="flex items-start gap-3">
//                 <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center font-medium">NL</div>
//                 <div>
//                   <p className="text-sm">New login from unknown device</p>
//                   <p className="text-xs text-gray-500 mt-1">3 days ago</p>
//                 </div>
//               </li>
//             </ul>
//           </div> */}

//           {/* Quick actions & Profile */}
//           {/* <aside className="space-y-6">
//             <div className="bg-white rounded-lg p-6 shadow-sm border">
//               <h4 className="text-lg font-semibold">Quick Actions</h4>
//               <div className="mt-4 flex flex-col sm:flex-row gap-3">
//                 <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">Create Project</button>
//                 <button className="flex-1 border border-gray-200 py-2 px-4 rounded hover:bg-gray-50">Invite Member</button>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg p-6 shadow-sm border">
//               <h4 className="text-lg font-semibold">Profile</h4>
//               <div className="mt-4 flex items-center gap-4">
//                 <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-medium text-xl">
//                   {user.name
//                     .split(" ")
//                     .map((s) => s[0])
//                     .slice(0, 2)
//                     .join("")
//                     .toUpperCase()}
//                 </div>
//                 <div>
//                   <p className="font-medium">{user.name}</p>
//                   <p className="text-sm text-gray-500">{user.email}</p>
//                   <p className="mt-2 text-xs inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded">{user.role}</p>
//                 </div>
//               </div>
//             </div>
//           </aside> */}
//         </section>

//       </main>
//     </div>
//   );
// }
