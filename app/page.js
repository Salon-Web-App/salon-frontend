"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Suspense } from "react";
import { getServiceIcon } from "../lib/serviceIcons";
import { Star, Users, Award, Quote } from "lucide-react";
import TransformationGallery from "../components/TransformationGallery";
import BookingSection from "../components/BookingSection";
import { getServices, getStaff, getReviews, getTransformations, getPackages } from "../lib/api";
import PackageSection from "../components/PackageSection";

function formatRelativeDate(dateStr) {
  if (!dateStr) return "";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 1) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "1 week ago";
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 60) return "1 month ago";
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} year${days >= 730 ? "s" : ""} ago`;
}

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [transformations, setTransformations] = useState([]);
  const [packages, setPackages] = useState([]);
  useEffect(() => {
    Promise.all([
      getServices().catch(() => []),
      getStaff().catch(() => []),
      getReviews().catch(() => []),
      getTransformations().catch(() => []),
      getPackages().catch(() => []),
    ]).then(([s, st, rv, trans, pkgs]) => {
      setServices(s);
      setStaff(st);
      setReviews(rv);
      setTransformations(trans);
      setPackages(pkgs);
    });
  }, []);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-cream via-white to-cream-soft">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-rose/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container-app relative z-10 py-24 text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-charcoal leading-none mb-4">Beauty</h1>
          <h1 className="text-6xl md:text-8xl font-bold gold-gradient-text leading-none mb-8">
            Redefined
          </h1>
          <div className="section-divider mb-8" />
          <p className="text-xl md:text-2xl text-charcoal/70 mb-12 max-w-3xl mx-auto font-light">
            Where elegance meets expertise. Book your appointment online in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/#booking" className="btn-primary">
              Book Appointment
            </Link>
            <Link href="/#services" className="btn-secondary">
              Explore Services
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-12 md:gap-20">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gold/10 rounded-full">
                <Star className="w-6 h-6 text-gold fill-gold" />
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-charcoal">{avgRating}</div>
                <div className="text-sm text-charcoal/60">Rating</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gold/10 rounded-full">
                <Users className="w-6 h-6 text-gold" />
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-charcoal">{reviews.length}+</div>
                <div className="text-sm text-charcoal/60">Happy Clients</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gold/10 rounded-full">
                <Award className="w-6 h-6 text-gold" />
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-charcoal">{staff.length}</div>
                <div className="text-sm text-charcoal/60">Expert Stylists</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 bg-white">
        <div className="container-app">
          <div className="text-center mb-16">
            <span className="eyebrow mb-6">Our Services</span>
            <h2 className="text-5xl md:text-6xl font-bold text-charcoal mt-6 mb-6">
              Signature Treatments
            </h2>
            <div className="section-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => {
              const Icon = getServiceIcon(service.icon);
              return (
                <Link
                  key={service.id}
                  href={`/services/${service.id}`}
                  className="card relative group"
                >
                  <div className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-gold/5 rounded-full">
                    <span className="text-gold font-bold text-sm">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="w-14 h-14 bg-gradient-to-br from-gold to-gold-light rounded-2xl flex items-center justify-center mb-6 rotate-12 group-hover:rotate-0 group-hover:shadow-lg group-hover:shadow-gold/30 transition-transform duration-500">
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {service.category && (
                    <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                      {service.category}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-charcoal mt-2 mb-3 leading-tight">
                    {service.name}
                  </h3>
                  <p className="text-sm text-charcoal/60 leading-relaxed mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gold/10">
                    <span className="text-2xl font-bold text-gold">
                      ${Number(service.price).toFixed(0)}
                    </span>
                    <span className="text-xs text-charcoal/50">{service.durationMinutes} min</span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold-light/0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <TransformationGallery items={transformations} />

      {/* Team */}
      <section id="team" className="py-24 bg-white">
        <div className="container-app">
          <div className="text-center mb-16">
            <span className="eyebrow mb-6">Meet Our Team</span>
            <h2 className="text-5xl md:text-6xl font-bold text-charcoal mt-6 mb-6">
              Expert Artists
            </h2>
            <div className="section-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {staff.map((member) => (
              <div
                key={member.id}
                className="group relative bg-gradient-to-br from-cream to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative h-[400px] overflow-hidden">
                  {member.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cream to-cream-soft flex items-center justify-center text-6xl text-gold font-bold">
                      {member.name?.[0]}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-60" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                  {member.specialty && (
                    <p className="text-gold font-semibold text-sm mb-2">{member.specialty}</p>
                  )}
                  {member.experience && (
                    <div className="text-xs text-white/80 mb-3">
                      <span className="font-semibold">{member.experience}</span> Experience
                    </div>
                  )}
                  {member.bio && (
                    <p className="text-sm text-white/90 leading-relaxed">{member.bio}</p>
                  )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold-light/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-24 bg-gradient-to-br from-cream via-white to-cream-soft">
        <div className="container-app">
          <div className="text-center mb-16">
            <span className="eyebrow mb-6">Testimonials</span>
            <h2 className="text-5xl md:text-6xl font-bold text-charcoal mt-6 mb-6">
              Client Stories
            </h2>
            <div className="section-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gold/10"
              >
                <div className="absolute -top-4 left-8 w-12 h-12 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center shadow-lg">
                  <Quote className="w-6 h-6 text-white" />
                </div>

                <div className="flex items-center gap-1 mb-4 mt-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < r.rating ? "text-gold fill-gold" : "text-gold/20"}`}
                    />
                  ))}
                </div>

                <p className="text-charcoal/80 leading-relaxed mb-6 italic">
                  &ldquo;{r.comment}&ldquo;
                </p>

                {r.booking?.service?.name && (
                  <div className="inline-block px-3 py-1 bg-gold/10 rounded-full mb-4">
                    <span className="text-xs font-semibold text-gold">
                      {r.booking.service.name}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gold/10">
                  <div>
                    <h4 className="font-bold text-charcoal">
                      {r.booking?.customerName || "Verified Client"}
                    </h4>
                    <p className="text-sm text-charcoal/50">{formatRelativeDate(r.createdAt)}</p>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold-light/0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none" />
              </div>
            ))}
            {reviews.length === 0 && (
              <p className="text-charcoal/60 col-span-full text-center">No reviews yet.</p>
            )}
          </div>
        </div>
      </section>

      <PackageSection packages={packages} />

      {/* Booking */}
      <Suspense fallback={null}>
        <BookingSection />
      </Suspense>
    </div>
  );
}
