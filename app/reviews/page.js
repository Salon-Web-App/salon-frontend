"use client";

import { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";
import { getReviews, submitReview } from "../../lib/api";

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

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    applicationId: "",
    rating: 5,
    comment: "",
  });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getReviews()
      .then(setReviews)
      .catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setStatus("");
    setLoading(true);
    try {
      const result = await submitReview(form);
      setStatus(result.message || "Thanks for your review!");
      setForm({ applicationId: "", rating: 5, comment: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-app space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-charcoal mb-6">What our customers say</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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

              <p className="text-charcoal/80 leading-relaxed mb-6 italic">"{r.comment}"</p>

              {r.booking?.service?.name && (
                <div className="inline-block px-3 py-1 bg-gold/10 rounded-full mb-4">
                  <span className="text-xs font-semibold text-gold">{r.booking.service.name}</span>
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
          {reviews.length === 0 && <p className="text-sm text-charcoal/60">No reviews yet.</p>}
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-charcoal mb-4">Leave a review</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-charcoal">Application ID</span>
            <input
              className="input-field mt-1"
              value={form.applicationId}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  applicationId: e.target.value.toUpperCase(),
                }))
              }
              placeholder="APP-7F3A2"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-charcoal">Rating</span>
            <select
              className="input-field mt-1"
              value={form.rating}
              onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-charcoal">Comment (optional)</span>
            <textarea
              className="input-field mt-1 h-auto py-3"
              rows={3}
              value={form.comment}
              onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
            />
          </label>

          <button className="btn-primary" disabled={loading}>
            {loading ? "Submitting…" : "Submit Review"}
          </button>

          {status && <p className="text-sm text-green-700">{status}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
}
