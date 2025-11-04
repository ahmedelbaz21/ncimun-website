import Link from "next/link";
import { ClipboardList, Bus, Info, UserPlus } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-yellow-500 text-white">
      <div className="text-center space-y-6">
        <img src="/logo.png" alt="NCIMUN Logo" className="mx-auto w-32" />

        <p className="text-lg">
          The official portal for delegate registration and management
        </p>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <Link href="/register" className="flex flex-col items-center p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition">
            <UserPlus size={32} />
            <span className="mt-2">Register</span>
          </Link>
          <Link href="/status" className="flex flex-col items-center p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition">
            <ClipboardList size={32} />
            <span className="mt-2">Choose Council</span>
          </Link>
          <Link href="/bus_route" className="flex flex-col items-center p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition">
            <Bus size={32} />
            <span className="mt-2">Bus Routes</span>
          </Link>
          <Link href="/Delegate-info" className="flex flex-col items-center p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition">
            <Info size={32} />
            <span className="mt-2">View Info</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
