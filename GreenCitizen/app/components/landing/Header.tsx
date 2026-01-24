'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Leaf, Menu, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'For Citizens', href: '#citizens' },
    { label: 'For Partners', href: '#partners' },
    { label: 'Features', href: '#features' },
    { label: 'About', href: '#about' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-bg-primary border-b border-border-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-primary hidden sm:inline">GreenCitizen</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-secondary hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
            Login
          </Button>
          <Button className="bg-primary text-white hover:bg-primary-dark">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-secondary hover:text-primary transition-colors"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border-primary bg-bg-secondary">
          <nav className="flex flex-col p-4 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-secondary hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            
            <div className="border-t border-border-primary pt-4 space-y-3">
              <Button variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary/10">
                Login
              </Button>
              <Button className="w-full bg-primary text-white hover:bg-primary-dark">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;