"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Clock, Menu, X } from "lucide-react";

const LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#team", label: "Team" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/status", label: "My Booking" },
  { href: "/#contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gold/20">
      <div className="container-app py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold gold-gradient-text">
          Makeup Studio
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-charcoal hover:text-gold transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/#booking"
          className="hidden md:inline-flex px-6 py-2.5 bg-gradient-to-r from-gold to-gold-light text-white text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-gold/30 transition-all duration-300 hover:scale-105"
        >
          Book Now
        </Link>

        <button
          type="button"
          className="md:hidden p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? (
            <X className="w-6 h-6 text-charcoal" />
          ) : (
            <Menu className="w-6 h-6 text-charcoal" />
          )}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-gold/10 bg-white">
          <div className="container-app flex flex-col py-2">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 text-base font-medium text-charcoal hover:text-gold"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#booking"
              className="py-3 text-base font-semibold text-gold"
              onClick={() => setOpen(false)}
            >
              Book Now
            </Link>
          </div>
        </nav>
      )}

      <div className="hidden lg:block border-t border-gold/10 bg-cream/50">
        <div className="container-app py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-charcoal/70">
            <MapPin className="w-3.5 h-3.5 text-gold" />
            <span>Your studio address here</span>
          </div>
          <div className="flex items-center gap-2 text-charcoal/70">
            <Phone className="w-3.5 h-3.5 text-gold" />
            <span>Your phone number</span>
          </div>
          <div className="flex items-center gap-2 text-charcoal/70">
            <Clock className="w-3.5 h-3.5 text-gold" />
            <span>Mon-Sat: 9:00 AM - 8:00 PM</span>
          </div>
        </div>
      </div>
    </header>
  );
}
