'use client';

import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Heart } from 'lucide-react';
import ManasLogo from '@/components/ManasLogo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-slate-900 text-slate-300">
      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600"></div>

      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary-500/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-primary-400/5 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="mb-6">
              <ManasLogo variant="footer" />
            </div>
            <p className="mb-6 leading-relaxed text-slate-400">
              Breaking social barriers and creating meaningful connections for widows and divorced women since 2022.
            </p>

            <div className="flex gap-3">
              {[
                { icon: FaFacebook, href: 'https://facebook.com', label: 'Facebook' },
                { icon: FaXTwitter, href: 'https://x.com', label: 'X (Twitter)' },
                { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
                { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                { icon: FaYoutube, href: 'https://youtube.com', label: 'YouTube' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:bg-primary-600 hover:text-white"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-6 flex items-center gap-2 font-display text-lg font-bold text-white">
              <span className="h-0.5 w-8 rounded bg-primary-500"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/view-profiles', label: 'View Profiles' },
                { href: '/get-involved', label: 'Get Involved' },
                { href: '/media', label: 'Media' },
                { href: '/contact', label: 'Contact' },
                { href: '/privacy-policy', label: 'Privacy Policy' },
                { href: '/child-safety-standards', label: 'Child Safety Standards' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-slate-400 transition-colors duration-300 hover:text-primary-400"
                  >
                    <svg
                      className="-ml-6 h-4 w-4 opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:opacity-100"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 flex items-center gap-2 font-display text-lg font-bold text-white">
              <span className="h-0.5 w-8 rounded bg-primary-400"></span>
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/contact', label: 'Contact Us' },
                { href: '/get-involved', label: 'Volunteer' },
                { href: '/get-involved', label: 'Donate' },
                { href: '/media', label: 'Success Stories' },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-slate-400 transition-colors duration-300 hover:text-primary-400"
                  >
                    <svg
                      className="-ml-6 h-4 w-4 opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:opacity-100"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 flex items-center gap-2 font-display text-lg font-bold text-white">
              <span className="h-0.5 w-8 rounded bg-primary-500"></span>
              Get in Touch
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:manasfoundation2025@gmail.com"
                  className="group flex items-start gap-3 text-slate-400 transition-colors duration-300 hover:text-white"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-800 transition-colors duration-300 group-hover:bg-primary-600/20">
                    <svg className="h-5 w-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="mb-1 text-xs text-slate-500">Email</div>
                    <div className="text-sm">manasfoundation2025@gmail.com</div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="group flex items-start gap-3 text-slate-400 transition-colors duration-300 hover:text-white"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-800 transition-colors duration-300 group-hover:bg-primary-600/20">
                    <svg className="h-5 w-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="mb-1 text-xs text-slate-500">Phone</div>
                    <div className="text-sm">+91-98765-43210</div>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-slate-400">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-800">
                    <svg className="h-5 w-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="mb-1 text-xs text-slate-500">Location</div>
                    <div className="text-sm">Buldhana, Maharashtra, India</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-8 border-t border-slate-800 pt-8">
          <div className="rounded-2xl bg-slate-800/50 p-6 md:p-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div>
                <h4 className="mb-2 font-display text-lg font-bold text-white">Stay Updated</h4>
                <p className="text-sm text-slate-400">
                  Subscribe to our newsletter for updates on our initiatives and success stories.
                </p>
              </div>
              <div className="flex w-full gap-3 md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-white placeholder-slate-400 transition-all duration-300 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 md:w-64"
                />
                <button type="button" className="btn-primary !whitespace-nowrap !py-3">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 md:flex-row">
          <p className="text-center text-sm text-slate-500 md:text-left">
            © {currentYear} MANAS Foundation. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-end">
            <Link
              href="/privacy-policy"
              className="text-sm text-slate-500 transition-colors duration-200 hover:text-primary-400"
            >
              Privacy Policy
            </Link>
            <Link
              href="/child-safety-standards"
              className="text-sm text-slate-500 transition-colors duration-200 hover:text-primary-400"
            >
              Child Safety
            </Link>
            <p className="flex items-center gap-1 text-sm text-slate-500">
              Made with{' '}
              <Heart className="mx-1 inline h-4 w-4 animate-pulse fill-current text-primary-400" /> for empowering women
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
