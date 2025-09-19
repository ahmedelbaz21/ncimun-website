// app/page.tsx

import Link from 'next/link';
import Image from 'next/image'; // Import the Image component

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 text-center">
      
     {/*  {/* Add the logo here *
      <div className="mb-4">
        <Image
          src="/ncimun 2.jpeg" // This points to the logo.png file in your 'public' folder
          alt="NCIMUN Logo"
          width={150}
          height={150}
          priority // Helps load the logo faster
        />
      </div> */}

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
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-lg transition-transform hover:scale-105"
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