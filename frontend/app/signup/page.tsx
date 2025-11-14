// app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [error, setError] = useState("");
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
            {/* Left illustration / promo (hidden on small screens) */}
            <div className="hidden md:flex flex-col items-start justify-center gap-6 p-10 bg-gradient-to-b from-indigo-600 to-indigo-700 text-white">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M12 2L20 7v6c0 5-4 9-8 9s-8-4-8-9V7l8-5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">Join the community</h3>
                        <p className="text-sm opacity-90">Secure access to your dashboard and projects.</p>
                    </div>
                </div>
                <p className="text-sm opacity-90 max-w-xs">
                    Sign up to get started. Manage your tasks, teams, and workflows in a single place.
                </p>
                <div className="mt-4 w-full">
                    <svg viewBox="0 0 200 100" className="w-full opacity-80" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="g" x1="0" x2="1">
                                <stop offset="0" stopColor="#ffffff" stopOpacity="0.08" />
                                <stop offset="1" stopColor="#000000" stopOpacity="0.02" />
                            </linearGradient>
                        </defs>
                        <rect width="100%" height="100%" rx="8" fill="url(#g)" />
                    </svg>
                </div>
            </div>

            {/* Right: form */}
            <div className="p-6 sm:p-10">
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100">Create your account</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">No credit card required — get started in seconds.</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className="flex flex-col">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Full name</span>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                            />
                        </label>

                        <label className="flex flex-col">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Email</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                            />
                        </label>
                    </div>

                    <label className="flex flex-col">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                        />
                    </label>

                    <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</span>
                        <div className="mt-2 inline-flex rounded-lg p-1 bg-gray-100 dark:bg-gray-800">
                            <button
                                type="button"
                                aria-pressed={role === "user"}
                                onClick={() => setRole("user")}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                                    role === "user"
                                        ? "bg-white dark:bg-indigo-700 text-indigo-700 dark:text-white shadow"
                                        : "text-gray-600 dark:text-gray-300"
                                }`}
                            >
                                User
                            </button>
                            <button
                                type="button"
                                aria-pressed={role === "admin"}
                                onClick={() => setRole("admin")}
                                className={`ml-1 px-4 py-2 rounded-md text-sm font-medium transition ${
                                    role === "admin"
                                        ? "bg-white dark:bg-indigo-700 text-indigo-700 dark:text-white shadow"
                                        : "text-gray-600 dark:text-gray-300"
                                }`}
                            >
                                Admin
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div role="alert" className="text-sm text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium hover:from-indigo-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                        >
                            Create account
                        </button>
                    </div>
                </form>

                <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
                    Already have an account?{" "}
                    <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    </div>
);
}
