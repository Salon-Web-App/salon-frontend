export default function AboutSection({ info }) {
  if (!info || !info.name) return null;

  return (
    <section className="card space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">About {info.name}</h2>
      {info.aboutText && <p className="text-gray-600 leading-relaxed">{info.aboutText}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 pt-2">
        {info.address && (
          <div>
            <span className="font-medium text-gray-900">Location: </span>
            {info.mapUrl ? (
              <a
                href={info.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="text-brand-600 underline"
              >
                {info.address}
              </a>
            ) : (
              info.address
            )}
          </div>
        )}
        {info.phone && (
          <div>
            <span className="font-medium text-gray-900">Phone: </span>
            <a href={`tel:${info.phone}`} className="text-brand-600 underline">
              {info.phone}
            </a>
          </div>
        )}
        {info.email && (
          <div>
            <span className="font-medium text-gray-900">Email: </span>
            <a href={`mailto:${info.email}`} className="text-brand-600 underline">
              {info.email}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
