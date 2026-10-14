"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStaffDetail } from "../../../lib/api";

export default function StaffDetailPage({ params }) {
  const [staff, setStaff] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getStaffDetail(params.id)
      .then(setStaff)
      .catch((err) => setError(err.message));
  }, [params.id]);

  if (error)
    return (
      <div className="container-app">
        <p className="text-red-600">{error}</p>
      </div>
    );
  if (!staff)
    return (
      <div className="container-app">
        <p className="text-gray-500">Loading…</p>
      </div>
    );

  return (
    <div className="container-app space-y-8">
      <div className="card flex flex-col sm:flex-row gap-6">
        {staff.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={staff.photoUrl}
            alt={staff.name}
            className="w-full sm:w-48 h-48 object-cover rounded-xl"
          />
        ) : (
          <div className="w-full sm:w-48 h-48 rounded-xl bg-brand-100 flex items-center justify-center text-4xl text-brand-700 font-semibold">
            {staff.name?.[0]}
          </div>
        )}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">{staff.name}</h1>
          {staff.experience && (
            <p className="text-sm text-brand-600 font-medium">
              {staff.experience}
            </p>
          )}
          {staff.bio && <p className="text-gray-600">{staff.bio}</p>}
        </div>
      </div>

      {staff.services?.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Services offered
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {staff.services.map((s) => (
              <Link
                key={s.id}
                href={`/services/${s.id}`}
                className="card hover:ring-2 hover:ring-brand-500 transition"
              >
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-gray-500">
                  ${Number(s.price).toFixed(2)} &middot; {s.durationMinutes} min
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Client reviews</h2>
        {staff.reviews?.length > 0 ? (
          <div className="space-y-3">
            {staff.reviews.map((r) => (
              <div key={r.id} className="card">
                <p className="text-yellow-500">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </p>
                {r.comment && (
                  <p className="text-sm text-gray-700 mt-1">{r.comment}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {r.booking?.customerName}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No reviews yet for {staff.name}.
          </p>
        )}
      </div>

      <Link href="/#booking" className="btn-primary inline-flex">
        Book with {staff.name.split(" ")[0]}
      </Link>
    </div>
  );
}
