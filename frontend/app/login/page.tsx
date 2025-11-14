// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API || "";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      router.push("/dashboard");
    } catch (err: any) {
      setErr(err.message);
    }
  };
return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black px-4">
        <div className="w-full max-w-md">
            <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-gray-400 mb-6">Sign in to your account</p>
                
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <input 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Email" 
                            className="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Password" 
                            className="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                        />
                    </div>
                    {err && <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-700/50">{err}</div>}
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200">Login</button>
                </form>
      
                <h1 className="mt-6 text-gray-200">Don't have an account?</h1>
                <Link href="/signup" className="text-indigo-600 hover:underline"> Sign up here</Link>
            </div>
        </div>
    </div>
)
};
