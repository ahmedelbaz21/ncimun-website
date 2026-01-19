"use client";

import Link from "next/link";

export default function SetupPage() {
  return (
    <main className="homepage">
      <div className="hero-center">
        
        <h1 className="page-title">Delegate Setup</h1>

        <p className="tagline">
          Complete the steps below to finalize your participation
        </p>

        <div className="hero-buttons flex flex-col gap-4">
          {/* Step 1 */}
          <div className="step-block">
            <h2 className="step-title">Step 1: Choose Council</h2>
            <Link href="/councils" className="btn btn-secondary">
              Choose Council
            </Link>
          </div>

          {/* Step 2 */}
          <div className="step-block">
            <h2 className="step-title">Step 2: Choose Bus Route</h2>
            <Link href="/bus_route" className="btn btn-primary">
              Choose Bus Routes
            </Link>
          </div>

          {/* Step 3 */}
          <div className="step-block">
            <h2 className="step-title">Step 3: Check Your Info</h2>
            <Link href="/Delegate-info" className="btn btn-secondary">
              View Info
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
