import { ReactNode } from 'react';
import { Plane } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AuthLayout({ children, heading, subheading }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#1A1A2E] via-[#16213E] to-[#0F0F1A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#E94560] flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-2xl text-white">TripSync</span>
          </Link>
          <h1 className="text-2xl font-bold text-white text-center">{heading}</h1>
          {subheading && <p className="text-white/60 text-sm mt-1 text-center">{subheading}</p>}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
