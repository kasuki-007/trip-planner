import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center text-center px-4">
      <MapPin className="w-12 h-12 text-[#E94560] mb-4" />
      <h1 className="text-8xl font-bold text-[#1A1A2E] mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-[#1A1A2E] mb-2">Page not found</h2>
      <p className="text-[#6B7280] mb-8 max-w-sm">
        Looks like this destination doesn't exist on the map. Let's get you back on track.
      </p>
      <Link
        to="/dashboard"
        className="bg-[#E94560] hover:bg-[#d63651] transition-colors text-white px-6 py-3 rounded-xl font-semibold"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
