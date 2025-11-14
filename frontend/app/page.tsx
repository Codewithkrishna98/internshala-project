// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8">
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white/70 dark:bg-gray-900/60 rounded-2xl shadow-xl p-8 backdrop-blur-md border border-gray-100/60">
          <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="shrink-0">
          <div className="h-24 w-24 rounded-full bg-linear-to-br from-indigo-500 to-green-500 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg">
            JW
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 dark:text-white">
            Welcome to JWT Based Auth
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Sign up as a User or Admin, then visit the Dashboard. Secure, simple, and fast.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Made by Kishan Gupta • krishngupta189@gmail.com
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
          href="/signup"
          className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow"
          aria-label="Sign up"
            >
          Sign up
            </Link>

            <Link
          href="/login"
          className="inline-flex items-center gap-2 px-5  text-gray-500 py-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg"
          aria-label="Login"
            >
          Login
            </Link>

            <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
          aria-label="Dashboard"
            >
          Dashboard
            </Link>
          </div>
        </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">JWT Security</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Stateless tokens for secure auth.</p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Role Based</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">User & Admin access control.</p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Responsive</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Looks great on any device.</p>
        </div>
          </div>
        </div>
      </div>
    </main>
  );
}
