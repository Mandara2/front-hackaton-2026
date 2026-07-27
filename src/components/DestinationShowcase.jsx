import { getImageUrl, handleImageError } from "../utils/image";

export default function DestinationShowcase({ properties, loading, t, onSelect }) {
  const featured = (properties ?? []).slice(0, 3);

  if (!loading && featured.length === 0) {
    return (
      <div className="text-center py-20" style={{ color: "#6b8f4e" }}>
        <p>{t.noDestinations}</p>
      </div>
    );
  }

  if (loading && featured.length === 0) {
    return (
      <div className="text-center py-20" style={{ color: "#6b8f4e" }}>
        <p>{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {featured.map((property) => (
        <button
          key={property.id}
          type="button"
          onClick={() => onSelect(property)}
          className="group relative w-full h-56 md:h-64 rounded-2xl overflow-hidden text-left"
        >
          <img
            src={getImageUrl(property)}
            alt={property.name}
            onError={(e) => handleImageError(e, `showcase ${property.name}`)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(8,15,8,0.92) 10%, rgba(8,15,8,0.15) 70%)" }}
          />
          <div className="absolute bottom-5 left-6 right-6">
            <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: "#86bb4a" }}>
              {property.type}
            </span>
            <h3 className="text-xl md:text-2xl font-bold" style={{ color: "#e8f5d0", fontFamily: "'Playfair Display', serif" }}>
              {property.name}
            </h3>
            <p className="text-sm max-w-xl" style={{ color: "#8aab6a" }}>
              {property.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
