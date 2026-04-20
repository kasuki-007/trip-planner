import { Link } from 'react-router-dom';
import { MapPin, Users, DollarSign, CheckSquare, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Itinerary Builder',
    description: 'Plan day-by-day activities with drag-and-drop reordering and real-time collaboration.',
  },
  {
    icon: DollarSign,
    title: 'Budget Tracker',
    description: 'Log shared expenses, split costs automatically, and visualize spending by category.',
  },
  {
    icon: CheckSquare,
    title: 'Shared Checklists',
    description: 'Keep packing lists and to-dos in sync across your entire travel group.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Invite friends with role-based access — owners, editors, and viewers.',
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white">
      {/* Nav */}
      <header className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-[#E94560]" />
          <span className="font-bold text-xl">TripSync</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link
            to="/register"
            className="bg-[#E94560] hover:bg-[#d63651] transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-8 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 text-[#E94560] px-3 py-1 rounded-full text-sm font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-[#E94560] animate-pulse" />
          Now in Phase 1
        </div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Plan trips together,<br />
          <span className="text-[#E94560]">effortlessly.</span>
        </h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto mb-10">
          TripSync is a collaborative trip-planning platform where groups manage itineraries, split budgets, and share documents — all in one place.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-[#E94560] hover:bg-[#d63651] transition-colors text-white px-6 py-3 rounded-xl font-semibold"
          >
            Start planning free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 transition-colors text-white px-6 py-3 rounded-xl font-semibold"
          >
            Sign in
          </Link>
        </div>
      </main>

      {/* Features */}
      <section className="bg-[#F8F9FA] text-[#1A1A2E] py-20">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-3">Everything your trip needs</h2>
          <p className="text-center text-[#6B7280] mb-12">All the tools to manage a group trip in one collaborative workspace.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white rounded-xl border border-[#E0E0E0] p-5">
                <div className="w-10 h-10 rounded-lg bg-[#E94560]/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#E94560]" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-[#6B7280]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1A1A2E] py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to sync your next adventure?</h2>
        <p className="text-gray-300 mb-8">Join for free and start planning with your group today.</p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 bg-[#E94560] hover:bg-[#d63651] transition-colors text-white px-8 py-3 rounded-xl font-semibold"
        >
          Create your account <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <footer className="text-center text-gray-500 text-sm py-6 border-t border-white/10">
        © 2026 TripSync
      </footer>
    </div>
  );
}
