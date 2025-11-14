// components/Header.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Props = { name: string; role: string };

export default function Header({ name, role }: Props) {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API || "";

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openConfirm = () => {
    setError(null);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        // try to parse server message
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Logout failed");
      }

      setLoading(false);
      setConfirmOpen(false);
      showToast("Logged out successfully");
      // small delay so toast is visible before redirect
      setTimeout(() => {
        router.push("/login");
      }, 500);
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || "Logout error");
    }
  };

  return (
    <>
      <header className="bg-white shadow p-4 flex justify-between items-center mb-6 sticky top-0 z-20">
        {/* Left Side - App Name */}
        <div className="text-lg font-semibold text-gray-700">Assignment From Kishan Gupta</div>

        {/* Right Side - User Info + Logout */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Welcome,{" "}
            <span className="font-medium text-gray-800">{name}</span>{" "}
            <span className="text-gray-500">({role === "admin" ? "Admin" : "User"})</span>
          </div>

          <button
            onClick={openConfirm}
            disabled={loading}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
            aria-label="Logout"
            title="Logout"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-5">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Confirm logout</h3>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to log out?</p>

            {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

            <div className="flex justify-end gap-3">
              <button
                onClick={closeConfirm}
                disabled={loading}
                className="px-3 py-1 rounded border text-gray-600 border-gray-300 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-60 flex items-center gap-2"
              >
                {loading ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.2" />
                    <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                ) : null}
                <span>{loading ? "Logging out..." : "Logout"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed right-4 bottom-6 z-50">
          <div className="bg-green-600 text-white px-4 py-2 rounded shadow">
            {toast}
          </div>
        </div>
      )}
    </>
  );
}
