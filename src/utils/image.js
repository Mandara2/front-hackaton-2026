/**
 * Lectura unificada de la URL de imagen de un destino.
 * Acepta los campos que puede enviar el backend o el mock: image, imagen_principal, image_url.
 * Solo devuelve URLs absolutas (http/https) para evitar que el navegador las trate como rutas relativas.
 *
 * Logs en consola (F12) para depurar: qué campos trae el registro y qué URL se usa.
 */
/** URL de imagen por defecto cuando no hay URL o cuando falla la carga (evita imagen rota). */
export const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80";

const LOG_IMAGES = true; // Cambiar a false para quitar logs en producción

function logImage(record, raw, url, isPlaceholder) {
  if (!LOG_IMAGES || typeof console?.log !== "function") return;
  const id = record?.id ?? record?.name ?? "?";
  console.log("[Imagen destino]", {
    id,
    name: record?.name ?? record?.nombre_sitio,
    campos_recibidos: {
      image: record?.image ?? "(vacío)",
      imagen_principal: record?.imagen_principal ?? "(vacío)",
      image_url: record?.image_url ?? "(vacío)",
    },
    url_cruda: raw || "(vacía)",
    url_final: url,
    es_placeholder: isPlaceholder,
  });
}

export function getImageUrl(record) {
  if (!record) {
    if (LOG_IMAGES) console.log("[Imagen destino] record es null/undefined → placeholder");
    return PLACEHOLDER_IMAGE;
  }
  const raw =
    record.image || record.imagen_principal || record.image_url || "";
  const url = (typeof raw === "string" ? raw : "").trim();
  const usePlaceholder =
    !url || (!url.startsWith("http://") && !url.startsWith("https://"));
  const final = usePlaceholder ? PLACEHOLDER_IMAGE : url;
  logImage(record, raw, final, usePlaceholder);
  return final;
}

/** Llamar desde onError de <img> para saber si el fallo es del enlace/red. */
export function logImageLoadError(src, context = "") {
  if (!LOG_IMAGES || typeof console?.error !== "function") return;
  console.error("[Imagen NO cargó — fallo en el enlace o red]", {
    url: src,
    contexto: context || "destino",
  });
}

/**
 * Handler para onError de <img>: registra el fallo y pone imagen de respaldo
 * para que siempre se vea algo (p. ej. Unsplash bloqueando hotlinking).
 * Evita bucle infinito: si ya está en placeholder, no vuelve a cambiar.
 */
export function handleImageError(e, context = "") {
  const img = e?.target;
  if (!img) return;
  const src = img.src || "";
  logImageLoadError(src, context);
  if (src !== PLACEHOLDER_IMAGE) {
    img.src = PLACEHOLDER_IMAGE;
  }
}
