'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BarChart3, LogOut, Menu, X, Home, Leaf } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const navItems = [
    { href: '/partner/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/dashboard', label: 'Back to User', icon: Home },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-bg-primary">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-30 h-screen w-64 transform bg-bg-secondary border-r border-border-primary transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between border-b border-border-primary p-4">
            <Link
              href="/partner/dashboard"
              className="flex items-center gap-2 font-bold text-primary hover:opacity-80 transition-opacity"
            >
              <Leaf className="h-6 w-6" />
              <span className="hidden sm:inline">GreenCitizen</span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-secondary hover:text-primary"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive(href)
                    ? 'bg-primary text-white'
                    : 'text-secondary hover:bg-bg-tertiary'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="border-t border-border-primary p-4">
            <Button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="border-b border-border-primary bg-bg-primary p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-secondary hover:text-primary"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold text-primary">Partner Portal</h1>
            <div className="text-xs text-tertiary">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-bg-primary">
          {children}
        </main>
      </div>
    </div>
  );
}