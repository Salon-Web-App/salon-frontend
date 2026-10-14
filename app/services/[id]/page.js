"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getServiceDetail } from "../../../lib/api";

export default function ServiceDetailPage({ params }) {
  const [service, setService] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getServiceDetail(params.id)
      .then(setService)
      .catch((err) => setError(err.message));
  }, [params.id]);

  if (error)
    return (
      <div className="container-app">
        <p className="text-red-600">{error}</p>
      </div>
    );
  if (!service)
    return (
      <div className="container-app">
        <p className="text-gray-500">Loading…</p>
      </div>
    );

  return (
    <div className="container-app space-y-8">
      <div className="card space-y-4">
        {service.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={service.imageUrl}
            alt={service.name}
            className="w-full h-56 object-cover rounded-xl"
          />
        )}
        <div className="flex items-start justify-between">
          {service.category && (
            <span className="text-xs font-semibold text-gold uppercase tracking-wider">
              {service.category}
            </span>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{service.name}</h1>
          <span className="font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-md">
            ${Number(service.price).toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-gray-500">
          {service.durationMinutes} minutes
        </p>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-1">
            Procedure
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {service.description ||
              "Performed using professional techniques and premium products tailored to your needs."}
          </p>
        </div>
      </div>

      {service.staff?.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Staff who can perform this
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {service.staff.map((s) => (
              <Link
                key={s.id}
                href={`/staff/${s.id}`}
                className="card flex items-center gap-3 hover:ring-2 hover:ring-brand-500 transition"
              >
                {s.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.photoUrl}
                    alt={s.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold">
                    {s.name?.[0]}
                  </div>
                )}
                <p className="font-medium">{s.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Link
        href={`/?serviceId=${service.id}#booking`}
        className="btn-primary inline-flex"
      >
        Book This Service
      </Link>
    </div>
  );
}
