import { UtensilsCrossed, Car, Hotel, Eye, ShoppingBag, Sparkles, HelpCircle } from 'lucide-react';

const iconMap = {
  food: <UtensilsCrossed className="w-3.5 h-3.5" />,
  transport: <Car className="w-3.5 h-3.5" />,
  stay: <Hotel className="w-3.5 h-3.5" />,
  sightseeing: <Eye className="w-3.5 h-3.5" />,
  activity: <Sparkles className="w-3.5 h-3.5" />,
  shopping: <ShoppingBag className="w-3.5 h-3.5" />,
  other: <HelpCircle className="w-3.5 h-3.5" />,
};

const colorMap = {
  food: 'bg-orange-100 text-orange-600',
  transport: 'bg-sky-100 text-sky-600',
  stay: 'bg-indigo-100 text-indigo-600',
  sightseeing: 'bg-emerald-100 text-emerald-600',
  activity: 'bg-violet-100 text-violet-600',
  shopping: 'bg-pink-100 text-pink-600',
  other: 'bg-gray-100 text-gray-500',
};


export function ActivityTypeIcon({ type, className }) {
  const color = colorMap[type] ?? colorMap.other;
  const icon = iconMap[type] ?? iconMap.other;
  return (
    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${color} ${className ?? ''}`}>
      {icon}
    </div>
  );
}
