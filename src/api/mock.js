/**
 * Mock API: drop-in replacement del cliente real.
 * Datos alineados con properties_db.json (6 propiedades reales de Caldas).
 */

const DELAY_MS = 800;

const delay = () => new Promise((resolve) => setTimeout(resolve, DELAY_MS));

const PROPERTIES = [
  {
    id: 1,
    name: "Tinamú Birding Nature Reserve",
    location: "Manizales, Caldas",
    price: 250000,
    rating: 4.9,
    reviews: 42,
    type: "Reserva Natural y Lodge",
    image: "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg",
    image_url: "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg",
    gallery: ["https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg"],
    tags: ["Aviturismo", "Naturaleza", "Reserva", "Accesibilidad"],
    birds: 0,
    amenities: ["wifi", "parking", "meals", "birdwatching"],
    description: "Un santuario familiar de 11 hectáreas de bosque húmedo tropical. Especializado 100% en aviturismo de alto nivel. Ofrece 3 km de senderos privados, comederos para aves y habitaciones decoradas con temática de naturaleza. Cuenta con accesibilidad para personas con movilidad reducida en áreas principales.",
    host: "Anfitrión",
    available: true,
  },
  {
    id: 2,
    name: "Finca Tío Conejo",
    location: "Neira, Caldas",
    price: 180000,
    rating: 4.8,
    reviews: 38,
    type: "Finca Cafetera Inmersiva",
    image: "https://images.pexels.com/photos/1304117/pexels-photo-1304117.jpeg",
    image_url: "https://images.pexels.com/photos/1304117/pexels-photo-1304117.jpeg",
    gallery: ["https://images.pexels.com/photos/1304117/pexels-photo-1304117.jpeg"],
    tags: ["Café de Origen", "Sostenibilidad", "Cultura", "Senderismo"],
    birds: 0,
    amenities: ["wifi", "parking", "meals"],
    description: "Experiencia cafetera auténtica enfocada en la bioarquitectura y la sostenibilidad. Aquí los turistas no solo aprenden sobre café de exportación, sino sobre construcción con guadua (bambú) y materiales reciclados. Ideal para quienes buscan un turismo rural muy educativo y profundo.",
    host: "Anfitrión",
    available: true,
  },
  {
    id: 3,
    name: "Mirador Valle de la Samaria",
    location: "Salamina, Caldas",
    price: 150000,
    rating: 4.9,
    reviews: 28,
    type: "Glamping y Refugio Campesino",
    image: "https://images.pexels.com/photos/167684/pexels-photo-167684.jpeg",
    image_url: "https://images.pexels.com/photos/167684/pexels-photo-167684.jpeg",
    gallery: ["https://images.pexels.com/photos/167684/pexels-photo-167684.jpeg"],
    tags: ["Naturaleza", "Glamping", "Senderismo", "Cultura"],
    birds: 0,
    amenities: ["wifi", "meals"],
    description: "El secreto mejor guardado de Caldas. Un bosque de Palmas de Cera mucho más tranquilo y prístino que Salento. Operado por emprendedores campesinos de la región lechera. Ideal para desconexión total, clima frío, neblina y senderismo entre los árboles nacionales de Colombia.",
    host: "Anfitrión",
    available: true,
  },
  {
    id: 4,
    name: "Finca Romelia",
    location: "Manizales, Caldas",
    price: 160000,
    rating: 4.7,
    reviews: 35,
    type: "Finca Agrícola y Orquideario",
    image: "https://images.pexels.com/photos/1083822/pexels-photo-1083822.jpeg",
    image_url: "https://images.pexels.com/photos/1083822/pexels-photo-1083822.jpeg",
    gallery: ["https://images.pexels.com/photos/1083822/pexels-photo-1083822.jpeg"],
    tags: ["Naturaleza", "Fotografía", "Cultura", "Botánica"],
    birds: 0,
    amenities: ["wifi", "parking", "meals"],
    description: "Un paraíso botánico familiar que alberga más de 800 especies de orquídeas, además de cultivos de aguacate y cítricos. Es el destino perfecto para turistas interesados en la flora, la fotografía macro y el turismo contemplativo sin largas caminatas.",
    host: "Anfitrión",
    available: true,
  },
  {
    id: 5,
    name: "Hacienda Guayabal",
    location: "Chinchiná, Caldas",
    price: 130000,
    rating: 4.8,
    reviews: 56,
    type: "Finca Cafetera Tradicional",
    image: "https://images.pexels.com/photos/2564463/pexels-photo-2564463.jpeg",
    image_url: "https://images.pexels.com/photos/2564463/pexels-photo-2564463.jpeg",
    gallery: ["https://images.pexels.com/photos/2564463/pexels-photo-2564463.jpeg"],
    tags: ["Café de Origen", "Cultura", "Gastronomía"],
    birds: 0,
    amenities: ["wifi", "parking", "meals", "birdwatching"],
    description: "Inmersión total en la cultura del café en la capital cafetera de Colombia. Aquí los turistas se ponen el poncho y el sombrero para recolectar el grano junto a los trabajadores locales, terminando con una cata profesional para entender los perfiles de taza.",
    host: "Anfitrión",
    available: true,
  },
  {
    id: 6,
    name: "El Nido del Cóndor",
    location: "Villamaría, Caldas",
    price: 480000,
    rating: 5.0,
    reviews: 22,
    type: "Ecolodge de Alta Montaña",
    image: "https://images.pexels.com/photos/2314983/pexels-photo-2314983.jpeg",
    image_url: "https://images.pexels.com/photos/2314983/pexels-photo-2314983.jpeg",
    gallery: ["https://images.pexels.com/photos/2314983/pexels-photo-2314983.jpeg"],
    tags: ["Aviturismo", "Naturaleza", "Lujo", "Alta montaña"],
    birds: 0,
    amenities: ["wifi", "meals", "birdwatching"],
    description: "Una experiencia de lujo sostenible y extrema. Un ecolodge suspendido en el borde de un cañón al que solo se llega en un teleférico privado. Diseñado específicamente para avistar la majestuosidad del Cóndor Andino en su hábitat natural, ideal para turismo internacional de alto nivel.",
    host: "Anfitrión",
    available: true,
  },
];

export async function getProperties() {
  await delay();
  return { data: [...PROPERTIES] };
}

export async function getPropertyById(id) {
  await delay();
  const property = PROPERTIES.find((p) => p.id === Number(id));
  return { data: property ?? null };
}

export async function postBookings(payload) {
  await delay();
  const property = PROPERTIES.find((p) => p.id === Number(payload?.propertyId));
  const host = property?.host ?? "Anfitrión";
  return {
    data: {
      bookingId: `bk-mock-${Date.now()}`,
      message: "Reserva confirmada",
      host,
    },
  };
}
