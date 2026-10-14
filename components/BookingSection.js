"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  MessageSquare,
} from "lucide-react";

import {
  getServices,
  getPackages,
  getAvailability,
  sendOtp,
  verifyOtp,
  createBooking,
} from "../lib/api";

function to24Hour(label) {
  const [time, period] = label.split(" ");
  let [h, m] = time.split(":").map(Number);

  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function BookingSection() {
  const searchParams = useSearchParams();

  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);

  const [availableSlots, setAvailableSlots] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    selection: "",
    date: "",
    time: "",
    notes: "",
  });

  const [otpStage, setOtpStage] = useState("idle");
  const [code, setCode] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /*
   * Load services and packages
   */
  useEffect(() => {
    Promise.all([
      getServices().catch(() => []),
      getPackages().catch(() => []),
    ]).then(([s, p]) => {
      setServices(s);
      setPackages(p);
    });
  }, []);

  /*
   * Read service/package from URL
   */
  useEffect(() => {
    const serviceId = searchParams.get("serviceId");
    const packageId = searchParams.get("package");

    if (serviceId) {
      update("selection", `service:${serviceId}`);
    }

    if (packageId) {
      update("selection", `package:${packageId}`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  /*
   * Update form
   */
  function update(field, value) {
    setForm((f) => ({
      ...f,
      [field]: value,
    }));
  }

  /*
   * Fetch availability whenever:
   *
   * 1. Date changes
   * 2. Service/package changes
   */
  useEffect(() => {
    async function fetchAvailability() {
      // No date selected
      if (!form.date) {
        setAvailableSlots([]);
        update("time", "");
        return;
      }

      // No service/package selected
      if (!form.selection) {
        setAvailableSlots([]);
        update("time", "");
        return;
      }

      const [kind, id] = form.selection.split(":");

      if (!id) {
        setAvailableSlots([]);
        update("time", "");
        return;
      }

      setAvailabilityLoading(true);
      setAvailableSlots([]);

      // Clear previously selected time
      update("time", "");

      try {

        const data = await getAvailability(form.date, id);

        setAvailableSlots(data);
      } catch (err) {
        setAvailableSlots([]);
        setError(err.message || "Unable to fetch available slots");
      } finally {
        setAvailabilityLoading(false);
      }
    }

    fetchAvailability();
  }, [form.date, form.selection]);

  /*
   * Form validation before OTP
   */
  const readyForOtp =
    form.name &&
    form.phone &&
    form.email &&
    form.selection &&
    form.date &&
    form.time;

  /*
   * Send OTP
   */
  async function handleSendCode() {
    setError("");
    setLoading(true);

    try {
      await sendOtp(form.email, "email", "booking_create");

      setOtpStage("sent");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /*
   * Verify OTP
   */
  async function handleVerify() {
    setError("");
    setLoading(true);

    try {
      const { verificationToken: token } = await verifyOtp(
        form.email,
        code,
        "booking_create",
      );

      setVerificationToken(token);
      setOtpStage("verified");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /*
   * Confirm booking
   */
  async function handleConfirm() {
    setError("");
    setLoading(true);

    try {
      const [kind, id] = form.selection.split(":");

      const startTime = form.time;

      const booking = await createBooking({
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email,

        ...(kind === "package" ? { packageId: id } : { serviceId: id }),

        startTime,
        notes: form.notes,

        verificationToken,
        verifiedContact: form.email,
      });

      setApplicationId(booking.applicationId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /*
   * Booking successfully created
   */
  if (applicationId) {
    return (
      <section
        id="booking"
        className="py-24 bg-gradient-to-br from-cream-soft to-white"
      >
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gold/10 text-center">
            <p className="text-2xl font-bold text-charcoal mb-2">
              Booking confirmed! 🎉
            </p>

            <p className="text-charcoal/60 mb-4">Your application ID is</p>

            <p className="text-3xl font-mono font-bold text-gold">
              {applicationId}
            </p>

            <p className="text-sm text-charcoal/50 mt-4">
              Save this ID to check your status or make changes later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="booking"
      className="py-24 bg-gradient-to-br from-cream-soft to-white relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="eyebrow mb-6">Book Appointment</span>

          <h2 className="text-5xl md:text-6xl font-bold text-charcoal mt-6 mb-6">
            Reserve Your Slot
          </h2>

          <div className="section-divider mb-6" />

          <p className="text-xl text-charcoal/60">
            Take the first step towards your transformation
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gold/10">
          <div className="space-y-6">
            {/* Name + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="relative">
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Full Name *
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />

                  <input
                    className="w-full h-12 pl-11 pr-4 border border-gold/20 rounded-lg focus:outline-none focus:border-gold transition-colors bg-white text-charcoal"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="relative">
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Phone Number *
                </label>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />

                  <input
                    className="w-full h-12 pl-11 pr-4 border border-gold/20 rounded-lg focus:outline-none focus:border-gold transition-colors bg-white text-charcoal"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="Your phone number"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Email Address *
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />

                <input
                  className="w-full h-12 pl-11 pr-4 border border-gold/20 rounded-lg focus:outline-none focus:border-gold transition-colors bg-white text-charcoal"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Service / Package */}
            <div className="relative">
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Select Service or Package *
              </label>

              <select
                className="w-full h-12 px-4 border border-gold/20 rounded-lg focus:outline-none focus:border-gold transition-colors bg-white text-charcoal"
                value={form.selection}
                onChange={(e) => update("selection", e.target.value)}
              >
                <option value="">Choose an option</option>

                {services.length > 0 && (
                  <optgroup label="Services">
                    {services.map((s) => (
                      <option key={s.id} value={`service:${s.id}`}>
                        {s.name} - ${Number(s.price).toFixed(0)}
                      </option>
                    ))}
                  </optgroup>
                )}

                {packages.length > 0 && (
                  <optgroup label="Packages">
                    {packages.map((p) => (
                      <option key={p.id} value={`package:${p.id}`}>
                        {p.title} - ${Number(p.offerPrice).toFixed(0)}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div className="relative">
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Preferred Date *
                </label>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />

                  <input
                    className="w-full h-12 pl-11 pr-4 border border-gold/20 rounded-lg focus:outline-none focus:border-gold transition-colors bg-white text-charcoal"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={form.date}
                    onChange={(e) => update("date", e.target.value)}
                  />
                </div>
              </div>

              {/* Time */}
              <div className="relative">
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Preferred Time *
                </label>

                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />

                  <select
                    className="w-full h-12 pl-11 pr-4 border border-gold/20 rounded-lg focus:outline-none focus:border-gold transition-colors bg-white text-charcoal disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                    value={form.time}
                    onChange={(e) => update("time", e.target.value)}
                    disabled={
                      !form.date || !form.selection || availabilityLoading
                    }
                  >
                    {/* No date */}
                    {!form.date && <option value="">Select date first</option>}

                    {/* Date selected but no service */}
                    {form.date && !form.selection && (
                      <option value="">Select service first</option>
                    )}

                    {/* Loading */}
                    {form.date && form.selection && availabilityLoading && (
                      <option value="">Loading available times...</option>
                    )}

                    {/* No loading and no slots */}
                    {form.date &&
                      form.selection &&
                      !availabilityLoading &&
                      availableSlots.length === 0 && (
                        <option value="">No slots available</option>
                      )}

                    {/* Available slots */}
                    {form.date &&
                      form.selection &&
                      !availabilityLoading &&
                      availableSlots.length > 0 && (
                        <>
                          <option value="">Select time</option>

                          {availableSlots.map((slot) => {
                            const startTime = new Date(slot.startTime);

                            return (
                              <option
                                key={`${slot.startTime}-${slot.staffId}`}
                                value={slot.startTime}
                              >
                                {startTime.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </option>
                            );
                          })}
                        </>
                      )}
                  </select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="relative">
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Additional Message
              </label>

              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gold" />

                <textarea
                  className="w-full pl-11 pr-4 py-3 border border-gold/20 rounded-lg focus:outline-none focus:border-gold transition-colors bg-white text-charcoal resize-none"
                  rows={4}
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Any special requests or preferences?"
                />
              </div>
            </div>

            {/* Error */}
            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* OTP */}
            {otpStage !== "verified" && (
              <div className="pt-2">
                {/* Send OTP */}
                {otpStage === "idle" && (
                  <button
                    type="button"
                    className="w-full h-14 bg-gradient-to-r from-gold to-gold-light text-white font-semibold text-lg rounded-full hover:shadow-2xl hover:shadow-gold/30 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!readyForOtp || loading || availabilityLoading}
                    onClick={handleSendCode}
                  >
                    {loading ? "Sending code…" : "Verify & Continue"}
                  </button>
                )}

                {/* Enter OTP */}
                {otpStage === "sent" && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      className="h-12 px-4 border border-gold/20 rounded-lg focus:outline-none focus:border-gold sm:max-w-[180px]"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="6-digit code"
                      value={code}
                      onChange={(e) =>
                        setCode(e.target.value.replace(/\D/g, ""))
                      }
                    />

                    <button
                      type="button"
                      className="flex-1 h-12 bg-gradient-to-r from-gold to-gold-light text-white font-semibold rounded-full hover:shadow-lg hover:shadow-gold/30 transition-all duration-300 disabled:opacity-50"
                      disabled={code.length !== 6 || loading}
                      onClick={handleVerify}
                    >
                      {loading ? "Verifying…" : "Verify Code"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Confirm */}
            {otpStage === "verified" && (
              <button
                type="button"
                className="w-full h-14 bg-gradient-to-r from-gold to-gold-light text-white font-semibold text-lg rounded-full hover:shadow-2xl hover:shadow-gold/30 transition-all duration-500 disabled:opacity-50"
                disabled={loading || !form.date || !form.time}
                onClick={handleConfirm}
              >
                {loading ? "Booking…" : "Confirm Booking"}
              </button>
            )}
          </div>
        </div>

        {/* Phone */}
        <div className="text-center mt-12">
          <p className="text-charcoal/60 mb-4">Or call us directly at</p>

          <a
            href="tel:+10000000000"
            className="text-3xl font-bold text-gold hover:text-gold-light transition-colors"
          >
            Your phone number
          </a>
        </div>
      </div>
    </section>
  );
}
