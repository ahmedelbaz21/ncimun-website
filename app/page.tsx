import Link from "next/link";

export default function HomePage() {
  return (
    <main className="homepage">
      <div className="hero-center">
        <img src="/logo.png" alt="NCIMUN Logo" className="hero-logo" />

       
        <p className="tagline">
          The official portal for delegate registration and management
        </p>

        <div className="hero-buttons">
          <Link href="/register" className="btn btn-primary">
            Register Now
          </Link>
          <Link href="/status" className="btn btn-secondary">
            Choose Council
          </Link>
           <Link href="/bus_route" className="btn btn-primary">
            Choose Bus Routes
          </Link>
        </div>
      </div>
    </main>
  );
}
