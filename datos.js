// ====== DATOS DE LA ACTIVIDAD (editable) ======
// Precios, personajes e imprevistos: FICTICIOS (simulación escolar).
window.DS = {
  CURSO: "2026-2027",
  PRESUPUESTO: 400,
  RESERVA: 40,
  DIAS: 5,
  ALOJ: [
    { id: "alb", n: "Albergue", p: 10, d: "litera compartida", i: "ti-bed" },
    { id: "pen", n: "Pensión", p: 22, d: "habitación", i: "ti-home" },
    { id: "hot", n: "Hotel", p: 50, d: "baño propio", i: "ti-building" }
  ],
  COM: [
    { id: "tie", n: "Tienda", p: 12, d: "cocináis vosotros", i: "ti-shopping-cart" },
    { id: "men", n: "Menú peregrino", p: 20, d: "bar del pueblo", i: "ti-tools-kitchen-2" },
    { id: "res", n: "Restaurante", p: 35, d: "a la carta", i: "ti-chef-hat" }
  ],
  MOCHILA: [
    { id: "agua", n: "Botella de agua", i: "ti-bottle", ok: true, why: "Andaréis 20–29 km al día: hay que beber." },
    { id: "lluvia", n: "Chubasquero", i: "ti-cloud-rain", ok: true, why: "En Galicia llueve a menudo." },
    { id: "botiquin", n: "Botiquín", i: "ti-first-aid-kit", ok: true, why: "Para ampollas y pequeñas heridas." },
    { id: "credencial", n: "Credencial", i: "ti-id", ok: true, why: "Sin sellos no hay Compostela." },
    { id: "sol", n: "Gorra y crema solar", i: "ti-sun", ok: true, why: "Muchas horas al sol." },
    { id: "portatil", n: "Ordenador portátil", i: "ti-device-laptop", ok: false, why: "Pesa mucho y no lo necesitáis." },
    { id: "consola", n: "Videoconsola", i: "ti-device-gamepad-2", ok: false, why: "Peso inútil en la mochila." },
    { id: "maleta", n: "Maleta con ruedas", i: "ti-luggage", ok: false, why: "Por caminos de tierra no rueda." }
  ],
  // Hoy -> Edad Media (fuentes en la guía docente)
  PARES: [
    { hoy: "Botella de agua", ok: "Calabaza" },
    { hoy: "Mochila", ok: "Zurrón" },
    { hoy: "Bastón de trekking", ok: "Bordón" },
    { hoy: "Gorra", ok: "Sombrero de ala ancha" }
  ],
  PARES_OPC: ["Calabaza", "Zurrón", "Bordón", "Sombrero de ala ancha", "Termo de acero", "Linterna"],
  FUNCIONES: [
    { id: "puente", n: "Cruzar el río sin peligro" },
    { id: "hospital", n: "Dar cama, comida y cuidados a peregrinos y enfermos" },
    { id: "iglesia", n: "Rezar y reunirse; también servía para defenderse" }
  ],
  MODELOS: {
    A: {
      activo: true,
      camino: "Camino Francés",
      inicio: "Sarria",
      viaje: "Sevilla ↔ Sarria",
      transporte: [
        { id: "bus", n: "Autobús", p: 120, d: "el más lento", i: "ti-bus" },
        { id: "tren", n: "Tren", p: 160, d: "con transbordo", i: "ti-train" },
        { id: "avion", n: "Avión", p: 200, d: "+ bus hasta Sarria", i: "ti-plane" }
      ],
      // x,y en el mapa esquemático (oeste a la izquierda)
      paradas: [
        { n: "Sarria", km: 0, x: 600, y: 220, fija: true },
        { n: "Portomarín", km: 22, x: 495, y: 192 },
        { n: "Palas de Rei", km: 47, x: 371, y: 136 },
        { n: "Arzúa", km: 76, x: 228, y: 80 },
        { n: "O Pedrouzo", km: 95, x: 129, y: 108 },
        { n: "Santiago", km: 115, x: 40, y: 127 }
      ],
      totalKm: 115,
      completo: "El Camino Francés completo mide unos 780 km desde Saint-Jean-Pied-de-Port (Francia). Se tarda entre 30 y 40 días.",
      mapaCompleto: {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Caminos%20Santiago%20actuales%20-%2001%20Camino%20Franc%C3%A9s.svg?width=760",
        credito: "Mapa: Paulusburg, Wikimedia Commons, CC BY-SA 4.0"
      },
      lugares: [
        {
          id: "puente", n: "Puente de Furelos", lugar: "Melide", fecha: "Ya existía en el siglo XII",
          pista: "Fíjate en el río que pasa por debajo.",
          img: "https://commons.wikimedia.org/wiki/Special:FilePath/Puente%20Furelos.jpg?width=640",
          credito: "Foto: Mentxuwiki, Wikimedia Commons, CC BY-SA 4.0"
        },
        {
          id: "hospital", n: "Hospital Real", lugar: "Santiago de Compostela", fecha: "Fundado por los Reyes Católicos en 1499",
          pista: "Hoy es un hotel (Parador). Antes recibía a peregrinos cansados y enfermos.",
          img: "https://commons.wikimedia.org/wiki/Special:FilePath/Vista%20de%20la%20fachada%20del%20Hostal%20de%20los%20Reyes%20Cat%C3%B3licos%2C%20en%20la%20Plaza%20del%20Obradoiro.JPG?width=640",
          credito: "Foto: Lancastermerrin88, Wikimedia Commons, CC BY-SA 4.0"
        },
        {
          id: "iglesia", n: "Iglesia de San Nicolás", lugar: "Portomarín", fecha: "Siglos XII–XIII",
          pista: "Mira las almenas de arriba: parece un castillo. En 1962 la trasladaron piedra a piedra por un embalse.",
          img: "https://commons.wikimedia.org/wiki/Special:FilePath/Iglesia%20de%20San%20Nicol%C3%A1s%2C%20Puertomar%C3%ADn%2C%20Camino%20de%20Santiago%2C%20Lugo%2C%20Espa%C3%B1a%2C%202015-09-19%2C%20DD%2015-17%20HDR.jpg?width=640",
          credito: "Foto: Diego Delso, Wikimedia Commons, CC BY-SA 4.0"
        }
      ],
      imprevisto: {
        titulo: "¡Ampollas en Palas de Rei!",
        texto: "Día 3. A uno de vosotros le han salido ampollas. Hoy toca la etapa más larga: 29 km hasta Arzúa.",
        opciones: [
          { id: "a", n: "Descansar un día más en Palas de Rei", det: "Pagáis una noche y un día de comida más (vuestro gasto diario).", tipo: "anade", extra: "diario", kmPerdidos: 0 },
          { id: "b", n: "Coger un taxi hasta Arzúa", det: "El taxi cuesta 35 €. Esos 29 km no los andáis.", tipo: "anade", extra: 35, kmPerdidos: 29 },
          { id: "c", n: "Comprar apósitos y dormir en Melide en vez de en Arzúa", det: "Los apósitos cuestan 6 €. La noche en Melide cuesta lo mismo que la de Arzúa.", tipo: "ambas", extra: 6, kmPerdidos: 0 }
        ]
      }
    },
    B: { activo: false, camino: "Camino Portugués", inicio: "Tui" },
    C: { activo: false, camino: "Camino Inglés", inicio: "Ferrol" },
    D: { activo: false, camino: "Vía de la Plata", inicio: "Ourense" }
  },
  EJEMPLO: {
    pregunta: "Es agosto. ¿A qué hora salís a caminar?",
    opciones: ["A las 6:30", "A las 12:00", "A las 16:00"],
    pista: "Pista: en agosto, de 12:00 a 17:00 hace mucho calor.",
    ok: 0,
    explica: "Elegimos las 6:30 porque así andamos con fresco y llegamos antes del calor. Fíjate: usamos la pista para descartar las otras dos."
  },
  CIERRE: {
    q1: { t: "Un peregrino llega enfermo a Santiago en el año 1520. ¿Adónde va a que lo cuiden?", o: ["Al Hospital Real", "Al puente de Furelos", "A la Oficina de turismo"], ok: 0 },
    q2: { t: "¿Por qué en el Camino se mezclaban culturas?", o: ["Porque se cruzaban peregrinos de muchos países con sus ideas, lenguas y productos", "Porque todos los peregrinos eran de Galicia", "Porque estaba prohibido hablar con otros peregrinos"], ok: 0, frase: "Pon un ejemplo con tus palabras:" },
    q3: { t: "¿Qué decisión de vuestro viaje defiendes?", o: ["El transporte desde Sevilla", "El alojamiento", "La comida", "La solución al imprevisto"], frase: "La defiendo porque…" }
  }
};
