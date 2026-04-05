'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import ManasLogo from '@/components/ManasLogo';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    {
      href: '/view-profiles',
      label: 'View Profiles',
      onClick: (e: React.MouseEvent) => {
        if (!user) {
          e.preventDefault();
          toast.error('Please log in to view profiles.');
          router.push('/login');
        }
      },
    },
    { href: '/get-involved', label: 'Get Involved' },
    { href: '/media', label: 'Media' },
    { href: '/contact', label: 'Contact' },
  ];

  const authLinks = user
    ? [
        { href: '/profile', label: 'Profile' },
        { onClick: handleLogout, label: 'Logout' },
      ]
    : [
        { href: '/register', label: 'Register for remarriage' },
        { href: '/login', label: 'Login' },
      ];

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 w-full border-b border-border bg-background transition-[box-shadow,padding] duration-300 ease-out ${
        scrolled ? 'shadow-md py-2.5' : 'shadow-sm py-3.5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center">
            <ManasLogo variant="navbar" />
          </div>

          <div className="hidden items-center space-x-2 lg:flex">
            {navLinks.map((link) =>
              link.href ? (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={link.onClick}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    pathname === link.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/80 hover:bg-primary/5 hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={link.onClick}
                  className="rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-all duration-300 hover:bg-primary/5 hover:text-primary"
                >
                  {link.label}
                </button>
              ),
            )}
          </div>

          <div className="hidden items-center space-x-3 lg:flex">
            {authLinks.map((link) =>
              link.href ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 font-medium text-primary transition-all duration-300 hover:bg-primary/10 ${
                    link.href === '/register'
                      ? 'max-w-[11rem] text-center text-xs leading-snug xl:max-w-none xl:text-sm'
                      : 'text-sm'
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={link.onClick}
                  className="rounded-full px-4 py-2 text-sm font-medium text-primary transition-all duration-300 hover:bg-primary/10"
                >
                  {link.label}
                </button>
              ),
            )}
            <button
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
              onClick={() => toast('Donation feature coming soon! 💝')}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Donate
            </button>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <button
              className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
              onClick={() => toast('Donation feature coming soon! 💝')}
            >
              Donate
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-foreground/80 transition-all duration-300 hover:bg-primary/10 hover:text-primary"
              aria-label="Toggle menu"
            >
              <div className="relative h-6 w-6">
                <span
                  className={`absolute left-0 top-1 h-0.5 w-6 bg-current transition-all duration-300 ${isMenuOpen ? 'top-3 rotate-45' : ''}`}
                ></span>
                <span
                  className={`absolute left-0 top-3 h-0.5 w-6 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}
                ></span>
                <span
                  className={`absolute left-0 top-5 h-0.5 w-6 bg-current transition-all duration-300 ${isMenuOpen ? 'top-3 -rotate-45' : ''}`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'pointer-events-none max-h-0 opacity-0'
        }`}
      >
        <div className="glass mx-4 mt-4 overflow-hidden rounded-2xl border border-border/50 shadow-lg">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) =>
              link.href ? (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (link.onClick) link.onClick(e);
                    setIsMenuOpen(false);
                  }}
                  className={`block rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/80 hover:bg-primary/5 hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={() => {
                    if (link.onClick) link.onClick({} as React.MouseEvent);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full rounded-xl px-4 py-3 text-left text-base font-medium text-foreground/80 transition-all duration-200 hover:bg-primary/5 hover:text-primary"
                >
                  {link.label}
                </button>
              ),
            )}
          </div>
          <div className="space-y-3 border-t border-border/50 px-4 py-4">
            {authLinks.map((link) =>
              link.href ? (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-center font-medium text-primary transition-all duration-300 hover:bg-primary/5"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={() => {
                    if (link.onClick) link.onClick();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full rounded-xl px-4 py-3 text-center text-base font-medium text-primary transition-all duration-300 hover:bg-primary/5"
                >
                  {link.label}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
