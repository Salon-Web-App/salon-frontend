"use client";

import Link from "next/link";
import { Tag, Clock } from "lucide-react";

export default function PackageSection({ packages }) {
  if (!packages || packages.length === 0) return null;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-rose/5 rounded-full blur-3xl pointer-events-none" />
      <div className="container-app relative z-10">
        <div className="text-center mb-16">
          <span className="eyebrow mb-6">Special Offers</span>
          <h2 className="text-5xl md:text-6xl font-bold text-charcoal mt-6 mb-6">
            Exclusive Packages
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-xl text-charcoal/60 max-w-2xl mx-auto">
            Premium services bundled together at unbeatable prices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="group relative bg-gradient-to-br from-cream to-white p-8 rounded-2xl border border-gold/10 hover:border-gold/30 hover:shadow-2xl transition-all duration-500"
            >
              {pkg.discountLabel && (
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center shadow-xl rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  <span className="text-white font-bold text-sm leading-none text-center px-1">
                    {pkg.discountLabel}
                  </span>
                </div>
              )}

              <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mb-6">
                <Tag className="w-7 h-7 text-gold" />
              </div>

              <h3 className="text-2xl font-bold text-charcoal mb-4">{pkg.title}</h3>
              <p className="text-charcoal/60 leading-relaxed mb-6">{pkg.description}</p>

              {pkg.services?.length > 0 && (
                <ul className="text-sm text-charcoal/60 mb-6 space-y-1">
                  {pkg.services.map((s) => (
                    <li key={s.id}>• {s.name}</li>
                  ))}
                </ul>
              )}

              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold text-gold">
                    ${Number(pkg.offerPrice).toFixed(0)}
                  </span>
                  {pkg.originalPrice && (
                    <span className="text-lg text-charcoal/40 line-through">
                      ${Number(pkg.originalPrice).toFixed(0)}
                    </span>
                  )}
                </div>
              </div>

              {pkg.message && (
                <div className="flex items-center gap-2 text-sm text-charcoal/60 mb-6">
                  <Clock className="w-4 h-4 text-gold" />
                  <span>{pkg.message}</span>
                </div>
              )}

              <Link
                href={`/?package=${pkg.id}#booking`}
                className="block w-full py-3 text-center bg-gradient-to-r from-gold to-gold-light text-white font-semibold rounded-full hover:shadow-lg hover:shadow-gold/30 transition-all duration-300 hover:scale-105"
              >
                Book This Package
              </Link>

              <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold-light/0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
