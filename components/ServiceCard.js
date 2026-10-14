import { Crown } from "lucide-react";

export default function ServiceCard({ service, index = 1 }) {
  const cardData = {
    category: service?.category || "BRIDAL SERVICES",
    name: service?.name || "Bridal Make-up &\nStyling",
    description:
      service?.description ||
      "Complete bridal transformation with premium products and expert styling for your special day",
    price: service?.price ? `NPR ${Number(service.price).toLocaleString()}` : "NPR 15,000",
    duration: service?.duration || "3-4 hours",
    indexNumber: String(service?.id || index).padStart(2, "0"),
  };

  return (
    <div className="group relative w-full max-w-sm rounded-3xl bg-[#FFF8F0]/50 p-6 border border-[#D4AF37]/20 transition-all duration-300 ease-out cursor-pointer hover:-translate-y-2 hover:shadow-xl hover:shadow-[#D4AF37]/10 hover:border-[#D4AF37]/50 hover:bg-[#FFF8F0]">
      {/* Top Header: Icon & Badge */}
      <div className="flex items-center justify-between mb-6">
        {/* Icon Container with Hover Scale & Rotation */}
        <div className="w-14 h-14 rounded-2xl bg-[#D4AF37] flex items-center justify-center text-white shadow-md transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-6 group-hover:bg-[#C9A961] group-hover:shadow-lg group-hover:shadow-[#D4AF37]/30">
          <Crown className="w-7 h-7 text-white transition-transform duration-300 ease-out group-hover:scale-110" />
        </div>

        {/* Number Badge */}
        <span className="w-9 h-9 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-xs font-semibold text-[#D4AF37] transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:text-white">
          {cardData.indexNumber}
        </span>
      </div>

      {/* Category */}
      <span className="block text-xs font-bold tracking-wider text-[#D4AF37] uppercase mb-2">
        {cardData.category}
      </span>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 whitespace-pre-line mb-3 leading-snug transition-colors duration-300 group-hover:text-[#D4AF37]">
        {cardData.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 leading-relaxed mb-6">{cardData.description}</p>

      {/* Divider */}
      <div className="h-px w-full bg-gray-200/60 mb-4 transition-colors duration-300 group-hover:bg-[#D4AF37]/30" />

      {/* Footer: Price & Duration */}
      <div className="flex items-baseline justify-between">
        <span className="text-xl font-bold text-[#D4AF37]">{cardData.price}</span>
        <span className="text-xs text-gray-400">{cardData.duration}</span>
      </div>
    </div>
  );
}
