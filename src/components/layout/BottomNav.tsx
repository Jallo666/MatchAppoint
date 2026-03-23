import { NavLink } from 'react-router-dom';
import { Calendar, Users, UserCircle } from 'lucide-react';

const tabs = [
  { to: '/calendar', icon: Calendar, label: 'Calendario' },
  { to: '/students', icon: Users, label: 'Allievi' },
  { to: '/profile', icon: UserCircle, label: 'Profilo' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200 shadow-lg z-40"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch h-16">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive ? 'text-tennis-yellow-dark' : 'text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className={`text-[10px] font-medium ${isActive ? 'text-tennis-yellow-dark' : 'text-gray-400'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
