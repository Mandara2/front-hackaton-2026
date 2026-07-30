import { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Search, MapPin, Star, Mic, Bird, Coffee, Wifi, Car, UtensilsCrossed, ChevronRight, X, Calendar, Users, Globe, Languages, Loader2, Sparkles } from "lucide-react";
import { getProperties, postBookings, postSearch } from "./api/client";
import MapView from "./components/MapView";
import DestinationShowcase from "./components/DestinationShowcase";
import { translations, TAG_KEYS } from "./i18n/translations";
import { getImageUrl, handleImageError } from "./utils/image";

const AMENITY_ICONS = {
  wifi: { icon: Wifi, label: "WiFi" },
  parking: { icon: Car, label: "Parqueadero" },
  meals: { icon: UtensilsCrossed, label: "Comidas" },
  birdwatching: { icon: Bird, label: "Aviturismo" },
};

const TAGS = ["Todo", "Aviturismo", "Café de Origen", "Senderismo", "Fotografía", "Cultura"];

function PropertyModal({ property, onClose, onReserve, t }) {
  const [guests, setGuests] = useState(2);
  const [booked, setBooked] = useState(false);
  const [reserving, setReserving] = useState(false);

  const nights = 2;
  const total = property.price * nights;
  const checkIn = "2025-08-15";
  const checkOut = "2025-08-17";

  const handleReserve = async () => {
    setReserving(true);
    try {
      await onReserve({
        propertyId: property.id,
        checkIn,
        checkOut,
        guests,
      });
      setBooked(true);
    } finally {
      setReserving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,12,10,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ background: "#0f1a10", border: "1px solid rgba(134,187,74,0.2)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-90"
          style={{ background: "rgba(255,255,255,0.95)", color: "#0a0f0a", border: "1px solid rgba(0,0,0,0.1)" }}
        >
          <X size={18} />
        </button>

        <div className="relative h-56 overflow-hidden rounded-t-2xl">
          <img
            src={getImageUrl(property)}
            alt={property.name}
            className="w-full h-full object-cover"
            onError={(e) => handleImageError(e, `modal ${property.name}`)}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0f1a10 0%, transparent 60%)" }} />
          <div className="absolute bottom-4 left-5">
            <span
              className="text-xs font-semibold px-2 py-1 rounded-full"
              style={{ background: "rgba(134,187,74,0.2)", color: "#86bb4a", border: "1px solid rgba(134,187,74,0.3)" }}
            >
              {property.type}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <div className="flex items-start justify-between">
              <h2 className="text-2xl font-bold" style={{ color: "#e8f5d0", fontFamily: "'Playfair Display', serif" }}>
                {property.name}
              </h2>
              <div className="text-right">
                <div className="text-xl font-bold" style={{ color: "#86bb4a" }}>
                  ${property.price.toLocaleString()}
                </div>
                <div className="text-xs" style={{ color: "#6b8f4e" }}>{t.copNight}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <MapPin size={13} style={{ color: "#86bb4a" }} />
                <span className="text-sm" style={{ color: "#6b8f4e" }}>{property.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={13} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
                <span className="text-sm font-semibold" style={{ color: "#e8f5d0" }}>{property.rating}</span>
                <span className="text-sm" style={{ color: "#6b8f4e" }}>({property.reviews} {t.reviews})</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {property.tags.map((t) => (
              <span key={t} className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(134,187,74,0.1)", color: "#86bb4a", border: "1px solid rgba(134,187,74,0.2)" }}>
                {t}
              </span>
            ))}
          </div>

          <p className="text-sm leading-relaxed" style={{ color: "#8aab6a" }}>{property.description}</p>

          <div className="grid grid-cols-4 gap-2">
            {property.amenities.map((key) => {
              const a = AMENITY_ICONS[key];
              return (
                <div key={key} className="flex flex-col items-center gap-1 p-2 rounded-xl" style={{ background: "rgba(134,187,74,0.05)", border: "1px solid rgba(134,187,74,0.1)" }}>
                  <a.icon size={16} style={{ color: "#86bb4a" }} />
                  <span className="text-xs" style={{ color: "#6b8f4e" }}>{a.label}</span>
                </div>
              );
            })}
          </div>

          {property.available && (
            <div className="rounded-xl p-4 space-y-3" style={{ background: "rgba(134,187,74,0.05)", border: "1px solid rgba(134,187,74,0.15)" }}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "#6b8f4e" }}>{t.checkIn}</label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(134,187,74,0.2)" }}>
                    <Calendar size={14} style={{ color: "#86bb4a" }} />
                    <span className="text-sm" style={{ color: "#e8f5d0" }}>15 ago 2025</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "#6b8f4e" }}>{t.guests}</label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(134,187,74,0.2)" }}>
                    <Users size={14} style={{ color: "#86bb4a" }} />
                    <span className="text-sm" style={{ color: "#e8f5d0" }}>{guests} {t.guestsCount}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm pt-1">
                <span style={{ color: "#6b8f4e" }}>${property.price.toLocaleString()} × {nights} noches</span>
                <span className="font-bold" style={{ color: "#e8f5d0" }}>${total.toLocaleString()} COP</span>
              </div>

              {!booked ? (
                <button
                  onClick={handleReserve}
                  disabled={reserving}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all"
                  style={{ background: "linear-gradient(135deg, #86bb4a, #5a8a2a)", color: "#0a0f0a" }}
                >
                  {reserving ? t.reserving : t.reserveNow}
                </button>
              ) : (
                <div className="w-full py-3 rounded-xl text-center font-bold text-sm" style={{ background: "rgba(134,187,74,0.15)", color: "#86bb4a", border: "1px solid rgba(134,187,74,0.4)" }}>
                  ✅ {t.reserveConfirmed} Don {property.host.split(" ")[1]} {t.hostNotified}
                </div>
              )}
            </div>
          )}

          {!property.available && (
            <div className="w-full py-3 rounded-xl text-center text-sm" style={{ background: "rgba(255,100,100,0.1)", color: "#ff8080", border: "1px solid rgba(255,100,100,0.2)" }}>
              {t.notAvailable}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm" style={{ color: "#6b8f4e" }}>
            <Globe size={14} />
            <span>{t.translationAvailable} · {t.host}: {property.host}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyCard({ property, onClick, t, isAiSuggested = false, aiPitch = "" }) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "#111d12",
        border: isAiSuggested ? "2px solid rgba(134,187,74,0.8)" : "1px solid rgba(134,187,74,0.15)",
        boxShadow: isAiSuggested ? "0 0 24px rgba(134,187,74,0.4), 0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={getImageUrl(property)}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => handleImageError(e, `card ${property.name}`)}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #111d12 0%, transparent 55%)" }} />

        {!property.available && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(0,0,0,0.7)", color: "#ff8080" }}>
            {t.notAvailableLabel}
          </div>
        )}

        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
          <Bird size={12} style={{ color: "#86bb4a" }} />
          <span className="text-xs font-semibold" style={{ color: "#86bb4a" }}>{property.birds} species</span>
        </div>

        <div className="absolute bottom-3 left-4">
          <div className="flex gap-1 flex-wrap">
            {property.tags.slice(0, 2).map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(134,187,74,0.2)", color: "#86bb4a" }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {isAiSuggested && aiPitch && (
          <div className="rounded-xl px-3 py-2 mb-2" style={{ background: "rgba(134,187,74,0.1)", border: "1px solid rgba(134,187,74,0.3)" }}>
            <div className="flex items-center gap-1.5 text-xs font-semibold mb-1" style={{ color: "#86bb4a" }}>
              <Sparkles size={12} /> {t.aiSugiere}
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "#8aab6a" }}>{aiPitch}</p>
          </div>
        )}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-base leading-tight" style={{ color: "#e8f5d0", fontFamily: "'Playfair Display', serif" }}>
              {property.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={11} style={{ color: "#86bb4a" }} />
              <span className="text-xs" style={{ color: "#6b8f4e" }}>{property.location}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold" style={{ color: "#86bb4a" }}>${(property.price || 0).toLocaleString()}</div>
            <div className="text-xs" style={{ color: "#6b8f4e" }}>{t.copNightShort}</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={12} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
            <span className="text-sm font-semibold" style={{ color: "#e8f5d0" }}>{property.rating ?? 0}</span>
            <span className="text-xs" style={{ color: "#6b8f4e" }}>({property.reviews ?? 0})</span>
          </div>
          <div className="flex items-center gap-1 text-xs" style={{ color: "#86bb4a" }}>
            {t.seeMore} <ChevronRight size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("es");
  const [view, setView] = useState("home");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("Todo");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [aiMatches, setAiMatches] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [focusPropertyId, setFocusPropertyId] = useState(null);
  const [mapClosing, setMapClosing] = useState(false);

  const closeMap = () => {
    setMapClosing(true);
    window.setTimeout(() => {
      setView("home");
      setMapClosing(false);
    }, 480);
  };

  const t = translations[lang];

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (listening) setQuery(transcript);
  }, [listening, transcript]);

  useEffect(() => {
    getProperties()
      .then((res) => setProperties(res.data ?? []))
      .catch((err) => setError(err.message || "Error al cargar"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = (properties ?? []).filter((p) => {
    const matchTag = activeTag === "Todo" || p.tags.includes(activeTag);
    const matchQuery = p.name.toLowerCase().includes(query.toLowerCase()) || p.location.toLowerCase().includes(query.toLowerCase());
    return matchTag && matchQuery;
  });

  const handleReserve = (payload) => postBookings(payload);

  const handleSearchSubmit = async () => {
    if (searchLoading) return;
    const q = query.trim();
    if (q) {
      setSearchLoading(true);
      setApiError(null);
      setAiMatches(null);
      setFocusPropertyId(null);
      try {
        const data = await postSearch(q, lang);
        const matches = Array.isArray(data?.data?.matches) ? data.data.matches : [];
        setAiMatches(matches);
        setApiError(null);
        setView("map");
      } catch (err) {
        setApiError(err?.message || t.apiError);
        setAiMatches([]);
      } finally {
        setSearchLoading(false);
      }
    } else {
      setAiMatches(null);
      setFocusPropertyId(null);
      try {
        await getProperties();
        setView("map");
      } catch (err) {
        setError(err?.message || "Error al buscar");
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#080f08", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0a0f0a; } ::-webkit-scrollbar-thumb { background: #2a4a1a; border-radius: 3px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-slow { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .fade-up-1 { animation-delay: 0.1s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.25s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.4s; opacity: 0; }
      `}</style>

      {/* HERO */}
      <div className="relative min-h-screen flex flex-col justify-center" style={{ minHeight: "100vh" }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=90')`,
          }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(8,15,8,0.3) 0%, rgba(8,15,8,0.6) 50%, rgba(8,15,8,0.95) 100%)" }} />

        {/* NAV */}
        <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-6 z-10">
          <div className="flex items-center gap-2">
            <Bird size={22} style={{ color: "#86bb4a" }} />
            <span className="font-bold text-lg tracking-tight" style={{ color: "#e8f5d0", fontFamily: "'Playfair Display', serif" }}>
              Caldas<span style={{ color: "#86bb4a" }}>Turismo</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span role="button" onClick={() => setView("home")} className="text-base font-bold cursor-pointer transition-colors hover:text-green-400" style={{ color: view === "home" ? "#86bb4a" : "#e8f5d0", fontFamily: "'Playfair Display', serif" }}>{t.navExplore}</span>
            <span role="button" onClick={() => { setAiMatches(null); setFocusPropertyId(null); setView("map"); }} className="text-base font-bold cursor-pointer transition-colors hover:text-green-400" style={{ color: view === "map" ? "#86bb4a" : "#e8f5d0", fontFamily: "'Playfair Display', serif" }}>{t.navMap}</span>
            <div
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full font-medium"
              style={{ background: "rgba(255,255,255,0.08)", color: "#e8f5d0", border: "1px solid rgba(134,187,74,0.35)" }}
            >
              <img src="/imgs/neo-astrum-logo.png" alt="Neo Astrum" className="h-8 w-8 object-contain" />
              <span>Desarrollado por Neo Astrum</span>
            </div>
            <button
              onClick={() => setLang(lang === "es" ? "en" : "es")}
              className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-full font-semibold transition-all hover:opacity-90"
              style={{ background: "rgba(255,255,255,0.08)", color: "#e8f5d0", border: "1px solid rgba(134,187,74,0.35)" }}
              title={lang === "es" ? "English" : "Español"}
            >
              <Languages size={16} />
              {lang === "es" ? "ES" : "EN"}
            </button>
            <button className="text-sm px-4 py-2 rounded-full font-semibold transition-all hover:opacity-90" style={{ background: "rgba(255,255,255,0.08)", color: "#e8f5d0", border: "1px solid rgba(134,187,74,0.35)" }}>
              {t.navHosts}
            </button>
          </div>
        </nav>

        {/* HERO CONTENT */}
        <div className="relative z-10 max-w-4xl mx-auto px-8 pb-12 text-center">
          <h1 className="fade-up fade-up-2 text-5xl md:text-7xl font-black leading-tight mb-4" style={{ color: "#e8f5d0", fontFamily: "'Playfair Display', serif" }}>
            {t.heroTitle1}<br />
            <em style={{ color: "#86bb4a" }}>{t.heroTitle2}</em><br />
            {t.heroTitle3}
          </h1>

          <p className="fade-up fade-up-3 text-base md:text-lg max-w-2xl mx-auto mb-10" style={{ color: "#8aab6a" }}>
            {t.heroSubtitle}
          </p>

          {/* SEARCH BAR — Enter o clic en Buscar: carga y luego abre el mapa */}
          <div className="fade-up fade-up-3 relative max-w-xl mx-auto">
            <div
              className="flex items-center gap-3 px-5 py-4 rounded-2xl"
              style={{ background: "rgba(15,26,16,0.9)", border: "1px solid rgba(134,187,74,0.3)", backdropFilter: "blur(12px)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
            >
              {searchLoading ? (
                <>
                  <Sparkles size={18} className="shrink-0" style={{ color: "#86bb4a" }} />
                  <span className="animate-pulse text-sm flex-1 min-w-0" style={{ color: "#86bb4a" }}>{t.aiReasoning}</span>
                </>
              ) : (
                <Search size={18} style={{ color: "#86bb4a" }} />
              )}
              {!searchLoading && (
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !searchLoading && (e.preventDefault(), handleSearchSubmit())}
                placeholder={t.searchPlaceholder}
                disabled={searchLoading}
                className="flex-1 min-w-0 bg-transparent outline-none text-sm disabled:opacity-70"
                style={{ color: "#e8f5d0" }}
                aria-label={t.searchPlaceholder}
              />
              )}
              <button
                type="button"
                onClick={async () => {
                  if (!browserSupportsSpeechRecognition || searchLoading) return;
                  if (listening) {
                    SpeechRecognition.stopListening();
                    return;
                  }
                  resetTranscript();
                  setQuery("");
                  try {
                    await SpeechRecognition.startListening({
                      language: lang === "es" ? "es-CO" : "en-US",
                      continuous: true,
                    });
                  } catch (err) {
                    console.warn("Speech recognition start error:", err);
                  }
                }}
                disabled={!browserSupportsSpeechRecognition || searchLoading}
                title={!browserSupportsSpeechRecognition ? (lang === "es" ? "Voz no disponible en este navegador" : "Voice not supported in this browser") : listening ? (lang === "es" ? "Detener micrófono" : "Stop microphone") : (lang === "es" ? "Hablar para buscar" : "Speak to search")}
                className="p-1.5 rounded-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: listening ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.2)",
                  color: listening ? "#fef2f2" : "#e8f5d0",
                  border: listening ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.3)",
                }}
              >
                <Mic size={15} className={listening ? "animate-pulse" : ""} />
              </button>
              {listening && (
                <span className="text-xs whitespace-nowrap" style={{ color: "rgba(254,242,242,0.9)" }}>
                  {lang === "es" ? "Escuchando…" : "Listening…"}
                </span>
              )}
              <button
                type="button"
                onClick={handleSearchSubmit}
                disabled={searchLoading}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                style={{ background: "linear-gradient(135deg,#86bb4a,#5a8a2a)", color: "#0a0f0a" }}
              >
                {searchLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {t.searchLoading}
                  </>
                ) : (
                  t.searchButton
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div className="py-6" style={{ background: "rgba(134,187,74,0.05)", borderTop: "1px solid rgba(134,187,74,0.1)", borderBottom: "1px solid rgba(134,187,74,0.1)" }}>
        <div className="max-w-4xl mx-auto px-8 grid grid-cols-3 gap-4 text-center">
          {[
            { value: "433", label: t.statSpecies, sub: t.statCorpocaldas },
            { value: "9.5%", label: t.statWorld, sub: t.statCaldas },
            { value: "UNESCO", label: t.statUnesco, sub: t.statHeritage },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-black" style={{ color: "#86bb4a", fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
              <div className="text-xs font-semibold" style={{ color: "#e8f5d0" }}>{s.label}</div>
              <div className="text-xs" style={{ color: "#6b8f4e" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* LISTINGS */}
      <div className="max-w-5xl mx-auto px-8 py-16">
        {(() => {
          const showTeaser = aiMatches === null && activeTag === "Todo";
          return (
            <>
              {showTeaser ? (
                <div className="mb-8">
                  <h2 className="text-3xl font-black" style={{ color: "#e8f5d0", fontFamily: "'Playfair Display', serif" }}>
                    {t.showcaseTitle}
                  </h2>
                  <p className="text-sm mt-1" style={{ color: "#6b8f4e" }}>
                    {t.showcaseSubtitle}
                  </p>
                </div>
              ) : (
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-black" style={{ color: "#e8f5d0", fontFamily: "'Playfair Display', serif" }}>
                      {t.destinationsTitle}
                    </h2>
                    <p className="text-sm mt-1" style={{ color: "#6b8f4e" }}>
                      {aiMatches !== null ? t.aiPoweredResults : loading ? t.loading : error ? error : `${filtered.length} ${t.propertiesFound}`}
                    </p>
                  </div>
                  <Coffee size={20} style={{ color: "#86bb4a" }} />
                </div>
              )}

              {/* TAG FILTER — siempre visible */}
              <div className="flex gap-2 mb-8 flex-wrap">
                {TAGS.map((tag, i) => (
                  <button
                    key={tag}
                    onClick={() => { setActiveTag(tag); setAiMatches(null); setApiError(null); }}
                    className="text-sm px-4 py-1.5 rounded-full font-medium transition-all"
                    style={
                      activeTag === tag
                        ? { background: "linear-gradient(135deg,#86bb4a,#5a8a2a)", color: "#0a0f0a" }
                        : { background: "transparent", color: "#e8f5d0", border: "1px solid rgba(255,255,255,0.4)" }
                    }
                  >
                    {t[TAG_KEYS[i]]}
                  </button>
                ))}
              </div>

              {loading && (
                <div className="text-center py-20" style={{ color: "#6b8f4e" }}>
                  <Bird size={40} className="mx-auto mb-3 opacity-30 animate-pulse" />
                  <p>{t.loading}</p>
                </div>
              )}

              {error && !loading && (
                <div className="text-center py-20" style={{ color: "#ff8080" }}>
                  <p>{error}</p>
                </div>
              )}

              {apiError && (
                <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: "rgba(255,120,120,0.1)", border: "1px solid rgba(255,120,120,0.3)", color: "#ffa0a0" }}>
                  {apiError}
                </div>
              )}

              {showTeaser ? (
                !loading && !error && (
                  <DestinationShowcase
                    properties={properties}
                    loading={loading}
                    t={t}
                    onSelect={(property) => {
                      setFocusPropertyId(property.id);
                      setView("map");
                    }}
                  />
                )
              ) : (
                <>
                  {aiMatches !== null && aiMatches.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {aiMatches.map((p, idx) => (
                        <PropertyCard
                          key={p.id ?? idx}
                          property={p}
                          onClick={() => setSelectedProperty(p)}
                          t={t}
                          isAiSuggested={idx < 2}
                          aiPitch={idx < 2 ? (p.ai_personalized_pitch ?? "") : ""}
                        />
                      ))}
                    </div>
                  )}

                  {aiMatches !== null && aiMatches.length === 0 && !apiError && (
                    <div className="text-center py-20" style={{ color: "#6b8f4e" }}>
                      <Bird size={40} className="mx-auto mb-3 opacity-30" />
                      <p>{t.aiNoResults}</p>
                    </div>
                  )}

                  {aiMatches === null && !loading && !error && filtered.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {filtered.map((p) => (
                        <PropertyCard key={p.id} property={p} onClick={() => setSelectedProperty(p)} t={t} />
                      ))}
                    </div>
                  )}

                  {aiMatches === null && !loading && !error && filtered.length === 0 && (
                    <div className="text-center py-20" style={{ color: "#6b8f4e" }}>
                      <Bird size={40} className="mx-auto mb-3 opacity-30" />
                      <p>{t.noDestinations}</p>
                    </div>
                  )}
                </>
              )}
            </>
          );
        })()}
      </div>

      {/* FOOTER */}
      <footer className="py-8 text-center" style={{ borderTop: "1px solid rgba(134,187,74,0.1)" }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Bird size={16} style={{ color: "#86bb4a" }} />
          <span className="font-bold" style={{ color: "#e8f5d0", fontFamily: "'Playfair Display', serif" }}>CaldasTurismo</span>
        </div>
        <p className="text-xs" style={{ color: "#3d5a2a" }}>{t.footerTagline}</p>
        <div className="mt-4 pt-4 max-w-4xl mx-auto flex items-center justify-center gap-2" style={{ borderTop: "1px solid rgba(134,187,74,0.08)" }}>
          <img src="/imgs/neo-astrum-logo.png" alt="Neo Astrum" className="h-4 w-4 object-contain" />
          <p className="text-xs" style={{ color: "#3d5a2a" }}>© 2026 CaldasTurismo · Desarrollado por Neo Astrum</p>
        </div>
      </footer>

      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onReserve={handleReserve}
          t={t}
        />
      )}

      {view === "map" && (
        <div className={`map-overlay ${mapClosing ? "map-overlay--exit" : "map-overlay--enter"}`}>
          <MapView
            onBack={closeMap}
            t={t}
            matchIds={
              aiMatches?.length
                ? aiMatches.map((m) => m.id).filter((id) => id != null)
                : focusPropertyId
                ? [focusPropertyId]
                : null
            }
          />
        </div>
      )}

      {/* Nubes: una sola pasada desde que la IA empieza a buscar hasta que abre el mapa;
          otra pasada nueva (key cambia) al volver a Explorar. Nunca quedan en loop. */}
      {(searchLoading || view === "map" || mapClosing) && (
        <div key={mapClosing ? "cloud-exit" : "cloud-enter"} className="cloud-layer" aria-hidden="true">
          <span className="cloud cloud-1" />
          <span className="cloud cloud-2" />
          <span className="cloud cloud-3" />
          <span className="cloud cloud-4" />
          <span className="cloud cloud-5" />
          <span className="cloud cloud-6" />
          <span className="cloud cloud-7" />
          <span className="cloud cloud-8" />
          <span className="cloud cloud-9" />
          <span className="cloud cloud-10" />
          <span className="cloud cloud-11" />
          <span className="cloud cloud-12" />
          <span className="cloud cloud-13" />
          <span className="cloud cloud-14" />
          <span className="cloud cloud-15" />
          <span className="cloud cloud-16" />
          <span className="cloud cloud-17" />
          <span className="cloud cloud-18" />
          <span className="cloud cloud-19" />
          <span className="cloud cloud-20" />
        </div>
      )}
    </div>
  );
}
