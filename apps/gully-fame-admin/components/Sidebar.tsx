'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Trophy, 
  Users, 
  Coins, 
  BarChart3, 
  FileText, 
  LogOut,
  X
} from 'lucide-react';
import { UserRole } from '@/lib/types';
import { logoutAdmin, getStoredAdmin } from '@/lib/authApi';
import { hasAccess } from '@/lib/utils';
import { useMobileMenu } from './DashboardLayout';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['admin', 'sponsor'] },
  { name: 'App Content', href: '/app-content', icon: FileText, roles: ['admin'] },
  { name: 'Home Sections', href: '/app-content/home-sections', icon: LayoutDashboard, roles: ['admin'] },
  { name: 'Competitions', href: '/competitions', icon: Trophy, roles: ['admin', 'sponsor'] },
  { name: 'Users', href: '/users', icon: Users, roles: ['admin'] },
  { name: 'Tips & Earnings', href: '/tips', icon: Coins, roles: ['admin'] },
  { name: 'Reports', href: '/reports', icon: BarChart3, roles: ['admin', 'sponsor'] },
  { name: 'Sponsors', href: '/sponsors', icon: Users, roles: ['admin'] },
];

export default function Sidebar({ userRole }: { userRole: UserRole }) {
  const pathname = usePathname();
  const filteredNav = navigation.filter(item => hasAccess(item.roles, userRole));
  const { mobileMenuOpen, setMobileMenuOpen } = useMobileMenu();
  const [userEmail, setUserEmail] = useState<string>('User');

  useEffect(() => {
    const adminData = getStoredAdmin();
    if (adminData?.email) {
      setUserEmail(adminData.email);
    }
  }, []);

  
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  const SidebarContent = () => (
    <>
      <div className="flex h-14 items-center justify-between px-4 border-b border-gray-800">
        <h1 className="text-lg font-bold tracking-tight">Gully Fame</h1>
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-0.5 px-2 py-3 overflow-y-auto">
        {filteredNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-2.5 rounded-md px-2.5 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-800 p-3 space-y-2">
        <div className="flex items-center space-x-2.5">
          <div className="h-7 w-7 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold">
              {userRole === 'admin' ? 'A' : 'S'}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium truncate">
              {userRole === 'admin' ? 'Admin' : 'Sponsor'}
            </p>
            <p className="text-[10px] text-gray-400 truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={logoutAdmin}
          className="w-full flex items-center space-x-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <div className={`${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static h-screen w-56 flex-shrink-0 flex-col bg-gray-900 text-white z-50 md:z-auto transition-transform duration-300 ease-in-out flex`}>
        <SidebarContent />
      </div>
    </>
  );
}
