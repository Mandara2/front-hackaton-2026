/**
 * Puntos de turismo en el mapa — datos reales de Caldas, Colombia.
 * Orden igual que properties_db.json (id 1 = índice 0) para que la búsqueda IA filtre correctamente.
 */

export const MAP_CENTER_CALDAS = [5.07, -75.55];
export const MAP_DEFAULT_ZOOM = 10;

export const TOURISM_POINTS = [
  {
    id: "caldas-001",
    name: "Tinamú Birding Nature Reserve",
    municipality: "Manizales",
    lat: 5.06,
    lng: -75.52,
    type: "Reserva Natural y Lodge",
    description: "Un santuario familiar de 11 hectáreas de bosque húmedo tropical. Especializado 100% en aviturismo de alto nivel. Ofrece 3 km de senderos privados, comederos para aves y habitaciones decoradas con temática de naturaleza. Cuenta con accesibilidad para personas con movilidad reducida en áreas principales.",
    image: "/imgs/ave1.jpg",
    gallery: ["/imgs/ave1.jpg", "/imgs/ave4.jpg", "/imgs/ave6.jpg", "/imgs/ave7.jpg"],
    tags: ["Aviturismo", "Naturaleza", "Reserva", "Accesibilidad"],
  },
  {
    id: "caldas-002",
    name: "Finca Tío Conejo",
    municipality: "Neira",
    lat: 5.08,
    lng: -75.52,
    type: "Finca Cafetera Inmersiva",
    description: "Experiencia cafetera auténtica enfocada en la bioarquitectura y la sostenibilidad. Aquí los turistas no solo aprenden sobre café de exportación, sino sobre construcción con guadua (bambú) y materiales reciclados. Ideal para quienes buscan un turismo rural muy educativo y profundo.",
    image: "/imgs/images-11.jpg",
    gallery: ["/imgs/images-11.jpg", "/imgs/images-9.jpg", "/imgs/images-24.jpg"],
    tags: ["Café de Origen", "Sostenibilidad", "Cultura", "Senderismo"],
  },
  {
    id: "caldas-003",
    name: "Mirador Valle de la Samaria",
    municipality: "Salamina",
    lat: 5.36,
    lng: -75.50,
    type: "Glamping y Refugio Campesino",
    description: "El secreto mejor guardado de Caldas. Un bosque de Palmas de Cera mucho más tranquilo y prístino que Salento. Operado por emprendedores campesinos de la región lechera. Ideal para desconexión total, clima frío, neblina y senderismo entre los árboles nacionales de Colombia.",
    image: "/imgs/images-13.jpg",
    gallery: ["/imgs/images-13.jpg", "/imgs/images-15.jpg"],
    tags: ["Naturaleza", "Glamping", "Senderismo", "Cultura"],
  },
  {
    id: "caldas-004",
    name: "Finca Romelia",
    municipality: "Manizales",
    lat: 5.05,
    lng: -75.50,
    type: "Finca Agrícola y Orquideario",
    description: "Un paraíso botánico familiar que alberga más de 800 especies de orquídeas, además de cultivos de aguacate y cítricos. Es el destino perfecto para turistas interesados en la flora, la fotografía macro y el turismo contemplativo sin largas caminatas.",
    image: "/imgs/images-14.jpg",
    gallery: ["/imgs/images-14.jpg", "/imgs/images-12.jpg"],
    tags: ["Naturaleza", "Fotografía", "Cultura", "Botánica"],
  },
  {
    id: "caldas-005",
    name: "Hacienda Guayabal",
    municipality: "Chinchiná",
    lat: 4.9825,
    lng: -75.6036,
    type: "Finca Cafetera Tradicional",
    description: "Inmersión total en la cultura del café en la capital cafetera de Colombia. Aquí los turistas se ponen el poncho y el sombrero para recolectar el grano junto a los trabajadores locales, terminando con una cata profesional para entender los perfiles de taza.",
    image: "/imgs/images-25.jpg",
    gallery: ["/imgs/images-25.jpg", "/imgs/images-10.jpg", "/imgs/descarga-9.jpg"],
    tags: ["Café de Origen", "Cultura", "Gastronomía"],
  },
  {
    id: "caldas-006",
    name: "El Nido del Cóndor",
    municipality: "Villamaría",
    lat: 5.04,
    lng: -75.51,
    type: "Ecolodge de Alta Montaña",
    description: "Una experiencia de lujo sostenible y extrema. Un ecolodge suspendido en el borde de un cañón al que solo se llega en un teleférico privado. Diseñado específicamente para avistar la majestuosidad del Cóndor Andino en su hábitat natural, ideal para turismo internacional de alto nivel.",
    image: "/imgs/ave.jpg",
    gallery: ["/imgs/ave.jpg", "/imgs/ave2.jpg", "/imgs/ave3.jpg", "/imgs/ave5.jpg"],
    tags: ["Aviturismo", "Naturaleza", "Lujo", "Alta montaña"],
  },
];
