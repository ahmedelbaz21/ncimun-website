// app/page.tsx

import Link from 'next/link';
// The unused 'Image' import has been removed

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 text-center">
      
      <div className="mb-4">
        <img
          src="/NCIMUN1.png" // Using a regular img tag is simpler here
          alt="NCIMUN Logo"
          width={150}
          height={150}
        />
      </div>

      <div className="mb-10">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Welcome to <span className="text-blue-500">NCIMUN</span>
        </h1>
        <p className="mt-4 text-xl text-slate-300">
          The official portal for delegate registration and management.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/register"
          className="px-8 py-4 bg-ncimun-gold hover:opacity-90 text-ncimun-blue font-bold rounded-lg text-lg transition-transform hover:scale-105"
        >
          Register Now
        </Link>
        <Link
          href="/status"
          className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-transform hover:scale-105"
        >
          Check Status / Log In
        </Link>
      </div>
    </main>
  );
}