/**
 * Simula la búsqueda con IA de forma 100% local (sin llamadas de red), para
 * no depender de internet durante demos en vivo. Mantiene el mismo look &
 * feel (matches + "ai_personalized_pitch") que la búsqueda real con Gemini.
 */

const STOPWORDS_ES = new Set([
  "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "en",
  "con", "para", "por", "y", "o", "que", "quiero", "busco", "algo", "algun",
  "alguna", "cerca", "lugar", "sitio", "donde",
]);
const STOPWORDS_EN = new Set([
  "the", "a", "an", "of", "in", "with", "for", "and", "or", "that", "i",
  "want", "looking", "something", "near", "place", "where",
]);

// NFD + strip combining diacritics (U+0300-U+036F) so "café" matches "cafe".
function stripAccents(str) {
  return str.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function tokenize(text, lang) {
  const stop = lang === "en" ? STOPWORDS_EN : STOPWORDS_ES;
  return stripAccents(String(text || "").toLowerCase())
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stop.has(w));
}

function scoreProperty(property, queryTokens) {
  const haystack = tokenize(
    [property.name, property.location, property.type, property.description, ...(property.tags || [])].join(" "),
    "es"
  );
  let score = 0;
  for (const qt of queryTokens) {
    if (haystack.some((t) => t.includes(qt) || qt.includes(t))) score += 1;
  }
  return score;
}

const PITCH_TEMPLATES_ES = [
  (p) => `Ideal si buscas ${(p.tags || [])[0]?.toLowerCase() || "una experiencia autentica"} — ${p.name} combina justo eso con muy buena calificacion.`,
  (p) => `${p.name} destaca por ${(p.tags || [])[1] || p.type}, un fuerte candidato para lo que estas buscando.`,
];
const PITCH_TEMPLATES_EN = [
  (p) => `Great match if you're after ${(p.tags || [])[0]?.toLowerCase() || "an authentic experience"} — ${p.name} delivers exactly that.`,
  (p) => `${p.name} stands out for ${(p.tags || [])[1] || p.type}, a strong fit for what you're looking for.`,
];

/** Devuelve hasta 4 propiedades "encontradas", con pitch en las 2 primeras. */
export function simulateAiSearch(properties, query, lang = "es") {
  const list = properties ?? [];
  const queryTokens = tokenize(query, lang);
  const templates = lang === "en" ? PITCH_TEMPLATES_EN : PITCH_TEMPLATES_ES;

  const scored = list
    .map((property) => ({ property, score: scoreProperty(property, queryTokens) }))
    .sort((a, b) => b.score - a.score);

  const hasRealMatches = scored.some((s) => s.score > 0);
  const ranked = hasRealMatches
    ? scored.filter((s) => s.score > 0)
    : [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).map((property) => ({ property, score: 0 }));

  return ranked.slice(0, 4).map((s, idx) => ({
    ...s.property,
    ai_personalized_pitch: idx < 2 ? templates[idx % templates.length](s.property) : "",
  }));
}
