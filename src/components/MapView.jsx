import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { Bird, ArrowLeft, X, MapPin, Calendar, Users, Loader2 } from "lucide-react";
import { TOURISM_POINTS, MAP_CENTER_CALDAS, MAP_DEFAULT_ZOOM } from "../data/mapPoints";
import { postBookings, getPropertyMedia } from "../api/client";
import { getImageUrl, handleImageError } from "../utils/image";
import MediaCarousel, { normalizeCarouselItems } from "./MediaCarousel";
import "leaflet/dist/leaflet.css";

const today = () => new Date().toISOString().slice(0, 10);

// Escapa comillas para poder interpolar la URL de forma segura dentro del atributo style
const escapeForAttr = (str) =>
  String(str).replace(/"/g, "%22").replace(/'/g, "%27");

// Marcador circular con la foto del lugar, más una colita apuntando a la coordenada exacta
const createPhotoIcon = (point) =>
  L.divIcon({
    className: "caldas-map-pin",
    html: `<div class="caldas-photo-pin-wrap">
      <div class="caldas-photo-pin-thumb" style="background-image:url('${escapeForAttr(getImageUrl(point))}')"></div>
      <div class="caldas-photo-pin-tail"></div>
    </div>`,
    iconSize: [44, 54],
    iconAnchor: [22, 54],
  });

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points?.length) return;
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });
  }, [map, points]);
  return null;
}

export default function MapView({ onBack, t, matchIds }) {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [reserving, setReserving] = useState(false);
  const [booked, setBooked] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [dynamicMediaItems, setDynamicMediaItems] = useState([]);

  const pointsToShow = useMemo(
    () =>
      matchIds?.length > 0
        ? TOURISM_POINTS.filter((_, i) => matchIds.includes(i + 1))
        : TOURISM_POINTS,
    [matchIds]
  );

  const iconsById = useMemo(() => {
    const map = new Map();
    pointsToShow.forEach((point) => {
      map.set(point.id, createPhotoIcon(point));
    });
    return map;
  }, [pointsToShow]);

  const canHover = useMemo(
    () => (typeof window !== "undefined" && window.matchMedia?.("(hover: hover) and (pointer: fine)").matches) ?? false,
    []
  );

  const propertyId = selectedPoint ? TOURISM_POINTS.findIndex((p) => p.id === selectedPoint.id) + 1 : 0;
  const canReserve = checkIn && checkOut && checkOut > checkIn && guests >= 1;

  useEffect(() => {
    if (!selectedPoint) return;
    setBooked(false);
    setBookingError(null);
    setCheckIn("");
    setCheckOut("");
    setGuests(2);
    setGuestName("");
    setBookingMessage("");
    setDynamicMediaItems([]);
  }, [selectedPoint?.id]);

  useEffect(() => {
    if (!propertyId || propertyId < 1) return;
    getPropertyMedia(propertyId).then((res) => {
      const items = Array.isArray(res?.items) ? res.items : [];
      setDynamicMediaItems(items);
    }).catch(() => setDynamicMediaItems([]));
  }, [propertyId]);

  return (
    <div className="flex flex-col h-full w-full" style={{ background: "#f5f5f4" }}>
      {/* Barra superior */}
      <header
        className="flex items-center justify-between px-4 py-3 z-[1000] shrink-0"
        style={{ background: "rgba(255,255,255,0.98)", borderBottom: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
          style={{ background: "#fff", color: "#1a1a1a", border: "1px solid rgba(0,0,0,0.1)", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
        >
          <ArrowLeft size={18} />
          {t?.navExplore ?? "Explorar"}
        </button>
        <div className="flex items-center gap-2">
          <Bird size={20} style={{ color: "#5a8a2a" }} />
          <span className="font-bold" style={{ color: "#1a1a1a", fontFamily: "'Playfair Display', serif" }}>
            {t?.mapTitle ?? "Mapa · Caldas"}
          </span>
        </div>
        <div className="w-20" />
      </header>

      {/* Mapa — tema claro */}
      <div className="flex-1 min-h-0 relative flex">
        <div className="flex-1 min-w-0 min-h-0">
          <MapContainer
            center={MAP_CENTER_CALDAS}
            zoom={MAP_DEFAULT_ZOOM}
            className="h-full w-full map-container-light"
            style={{ background: "#e8e6e3" }}
            scrollWheelZoom
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            <FitBounds points={pointsToShow} />
            {pointsToShow.map((point) => (
              <Marker
                key={point.id}
                position={[point.lat, point.lng]}
                icon={iconsById.get(point.id)}
                eventHandlers={{
                  click: () => setSelectedPoint(point),
                }}
              >
                {canHover && (
                  <Tooltip direction="top" offset={[0, -58]} opacity={1} className="caldas-photo-tooltip">
                    <div className="caldas-photo-tooltip-card">
                      <img
                        src={getImageUrl(point)}
                        alt={point.name}
                        onError={(e) => handleImageError(e, `marker preview ${point.name}`)}
                      />
                      <span>{point.name}</span>
                    </div>
                  </Tooltip>
                )}
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Barra lateral — datos del punto al hacer clic */}
        <aside
          className="absolute top-0 right-0 bottom-0 z-[1000] w-full max-w-md flex flex-col bg-white shadow-xl transition-transform duration-300 ease-out overflow-hidden"
          style={{
            transform: selectedPoint ? "translateX(0)" : "translateX(100%)",
            borderLeft: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          {selectedPoint && (
            <>
              <div className="flex items-center justify-between p-4 shrink-0" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                <h2 className="text-lg font-bold truncate pr-2" style={{ color: "#1a1a1a", fontFamily: "'Playfair Display', serif" }}>
                  {selectedPoint.name}
                </h2>
                <button
                  type="button"
                  onClick={() => setSelectedPoint(null)}
                  className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
                  style={{ color: "#374151" }}
                  aria-label="Cerrar"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <MediaCarousel
                  key={selectedPoint.id}
                  items={(() => {
                    const baseURL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
                    const staticUrls = (selectedPoint.gallery && selectedPoint.gallery.length > 0)
                      ? selectedPoint.gallery
                      : [getImageUrl(selectedPoint)];
                    const dynamicWithAbsUrl = dynamicMediaItems.map((i) => ({
                      url: i.url?.startsWith("/") && baseURL ? baseURL + i.url : i.url,
                      type: i.type || "image",
                    }));
                    return normalizeCarouselItems([...staticUrls, ...dynamicWithAbsUrl], baseURL);
                  })()}
                  alt={selectedPoint.name}
                />
                <div className="flex items-center gap-2 text-sm" style={{ color: "#5a8a2a" }}>
                  <MapPin size={16} />
                  <span className="font-medium">{selectedPoint.municipality}, Caldas</span>
                </div>
                <div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(134,187,74,0.2)", color: "#2d5016" }}
                  >
                    {selectedPoint.type}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                  {selectedPoint.description}
                </p>
                {selectedPoint.tags && selectedPoint.tags.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold mb-2" style={{ color: "#6b7280" }}>
                      Etiquetas
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPoint.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1 rounded-full"
                          style={{ background: "rgba(134,187,74,0.15)", color: "#2d5016", border: "1px solid rgba(134,187,74,0.3)" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reservación: calendario y envío al backend */}
                <div
                  className="rounded-xl p-4 space-y-3 mt-4"
                  style={{ background: "rgba(134,187,74,0.08)", border: "1px solid rgba(134,187,74,0.2)" }}
                >
                  <p className="text-sm font-semibold" style={{ color: "#2d5016" }}>
                    {t?.reserveNow ?? "Reservar ahora"}
                  </p>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium" style={{ color: "#374151" }}>
                      {t?.checkIn ?? "Check-in"}
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} style={{ color: "#5a8a2a" }} />
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={today()}
                        className="flex-1 py-2 px-3 rounded-lg text-sm border"
                        style={{ borderColor: "rgba(134,187,74,0.3)", background: "#fff", color: "#1a1a1a" }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium" style={{ color: "#374151" }}>
                      {t?.checkOut ?? "Check-out"}
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} style={{ color: "#5a8a2a" }} />
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || today()}
                        className="flex-1 py-2 px-3 rounded-lg text-sm border"
                        style={{ borderColor: "rgba(134,187,74,0.3)", background: "#fff", color: "#1a1a1a" }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium" style={{ color: "#374151" }}>
                      {t?.guests ?? "Huéspedes"}
                    </label>
                    <div className="flex items-center gap-2">
                      <Users size={16} style={{ color: "#5a8a2a" }} />
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value) || 1)}
                        className="flex-1 py-2 px-3 rounded-lg text-sm border"
                        style={{ borderColor: "rgba(134,187,74,0.3)", background: "#fff", color: "#1a1a1a" }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium" style={{ color: "#374151" }}>
                      {t?.guestName ?? "Nombre del huésped (opcional)"}
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder={t?.guestNamePlaceholder ?? "Ej. Juan Pérez"}
                      className="w-full py-2 px-3 rounded-lg text-sm border"
                      style={{ borderColor: "rgba(134,187,74,0.3)", background: "#fff", color: "#1a1a1a" }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium" style={{ color: "#374151" }}>
                      {t?.bookingMessage ?? "Mensaje o notas (opcional)"}
                    </label>
                    <textarea
                      value={bookingMessage}
                      onChange={(e) => setBookingMessage(e.target.value)}
                      placeholder={t?.bookingMessagePlaceholder ?? "Ej. Llegada por la tarde"}
                      rows={2}
                      className="w-full py-2 px-3 rounded-lg text-sm border resize-none"
                      style={{ borderColor: "rgba(134,187,74,0.3)", background: "#fff", color: "#1a1a1a" }}
                    />
                  </div>
                  {bookingError && (
                    <p className="text-xs" style={{ color: "#dc2626" }}>
                      {bookingError}
                    </p>
                  )}
                  {booked ? (
                    <div
                      className="py-3 rounded-xl text-center text-sm font-medium"
                      style={{ background: "rgba(134,187,74,0.2)", color: "#2d5016", border: "1px solid rgba(134,187,74,0.4)" }}
                    >
                      {t?.reserveConfirmed ?? "¡Reserva confirmada!"}
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={!canReserve || reserving}
                      onClick={async () => {
                        if (!canReserve || reserving) return;
                        setBookingError(null);
                        setReserving(true);
                        try {
                          await postBookings({
                            propertyId,
                            checkIn,
                            checkOut,
                            guests,
                            ...(guestName.trim() && { guestName: guestName.trim() }),
                            ...(bookingMessage.trim() && { message: bookingMessage.trim() }),
                          });
                          setBooked(true);
                        } catch (err) {
                          setBookingError(err?.message ?? "Error al reservar");
                        } finally {
                          setReserving(false);
                        }
                      }}
                      className="w-full py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{ background: "linear-gradient(135deg,#86bb4a,#5a8a2a)", color: "#fff" }}
                    >
                      {reserving ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          {t?.reserving ?? "Reservando…"}
                        </>
                      ) : (
                        t?.reserveNow ?? "Reservar ahora"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
