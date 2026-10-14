export default function StaffCard({ staff }) {
  return (
    <div className="card flex items-center gap-4">
      {staff.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={staff.photoUrl} alt={staff.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
      ) : (
        <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold flex-shrink-0">
          {staff.name?.[0]}
        </div>
      )}
      <div>
        <h3 className="font-semibold text-gray-900">{staff.name}</h3>
        {staff.bio && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{staff.bio}</p>}
      </div>
    </div>
  );
}
