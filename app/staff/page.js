"use client";

import { useEffect, useState } from "react";
import { getStaff } from "../../lib/api";
import Link from "next/link";

export default function StaffPage() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStaff()
      .then(setStaffList)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meet Our Master Stylists</h1>
        <p className="text-sm text-gray-500 mt-1">
          Industry professionals dedicated to bringing out your best look.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 animate-pulse">Loading team profiles...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffList.map((member) => (
            <div
              key={member.id}
              className="card overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="h-56 overflow-hidden bg-gray-100 rounded-lg mb-4">
                  <img
                    src={
                      member.photoUrl ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600"
                    }
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-xs text-brand-600 font-medium mt-0.5">
                  {member.role || "Senior Stylist & Colorist"}
                </p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                  {member.bio ||
                    "Passionate about modern cuts, vibrant coloring, and ensuring every client leaves feeling renewed."}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">Expertise: Hair & Care</span>
                <Link
                  href="/#booking"
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  Book with {member.name.split(" ")[0]} &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
