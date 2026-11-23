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
      pasos: [["Barbadelo", "Ferreiros"], ["Gonzar", "Ligonde"], ["Furelos", "Melide"], ["Salceda", "A Rúa"], ["Lavacolla", "Monte do Gozo"]],
      viaje: "Sevilla ↔ Sarria",
      transporte: [
        { id: "bus", n: "Autobús", p: 120, d: "el más lento", i: "ti-bus" },
        { id: "tren", n: "Tren", p: 160, d: "con transbordo", i: "ti-train" },
        { id: "avion", n: "Avión", p: 200, d: "+ bus hasta Sarria", i: "ti-plane" }
      ],
      // x,y en el mapa esquemático (oeste a la izquierda)
      paradas: [
        { n: "Sarria", km: 0, lat: 42.781, lon: -7.414, fija: true },
        { n: "Portomarín", km: 22, lat: 42.807, lon: -7.616 },
        { n: "Palas de Rei", km: 47, lat: 42.873, lon: -7.869 },
        { n: "Arzúa", km: 76, lat: 42.927, lon: -8.163 },
        { n: "O Pedrouzo", km: 95, lat: 42.905, lon: -8.360 },
        { n: "Santiago", km: 115, lat: 42.880, lon: -8.544 }
      ],
      pistaRuta: "Santiago está al oeste. La parada más cercana a Sarria es Portomarín.",
      kmOpciones: ["Unos 115 km", "Unos 780 km", "Unos 30 km"],
      falsoInicio: "Porque allí empieza el Camino Francés",
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
    B: {
      activo: true,
      camino: "Camino Portugués",
      inicio: "Tui",
      pasos: [["O Porriño", "Mos"], ["Arcade", "Ponte Sampaio"], ["San Amaro", "Briallos"], ["Valga", "Pontecesures"], ["A Escravitude", "O Milladoiro"]],
      viaje: "Sevilla ↔ Tui",
      transporte: [
        { id: "bus", n: "Autobús", p: 120, d: "el más lento", i: "ti-bus" },
        { id: "tren", n: "Tren", p: 160, d: "con transbordo", i: "ti-train" },
        { id: "avion", n: "Avión", p: 200, d: "+ bus hasta Tui", i: "ti-plane" }
      ],
      paradas: [
        { n: "Tui", km: 0, lat: 42.047, lon: -8.645, fija: true },
        { n: "Redondela", km: 32, lat: 42.283, lon: -8.609 },
        { n: "Pontevedra", km: 51, lat: 42.431, lon: -8.645 },
        { n: "Caldas de Reis", km: 72, lat: 42.604, lon: -8.642 },
        { n: "Padrón", km: 91, lat: 42.738, lon: -8.660 },
        { n: "Santiago", km: 115, lat: 42.880, lon: -8.544 }
      ],
      pistaRuta: "Santiago está al norte. La parada más cercana a Tui es Redondela.",
      kmOpciones: ["Unos 115 km", "Unos 620 km", "Unos 30 km"],
      falsoInicio: "Porque allí empieza el Camino Portugués",
      totalKm: 115,
      completo: "El Camino Portugués completo sale de Lisboa y mide unos 620 km. Se tarda casi un mes.",
      mapaCompleto: {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Caminos%20Santiago%20actuales%20Portugal.svg?width=600",
        credito: "Mapa: Paulusburg, Wikimedia Commons, CC BY-SA 4.0"
      },
      lugares: [
        {
          id: "puente", n: "Puente de Ponte Sampaio", lugar: "Pontevedra", fecha: "Origen medieval; tiene 10 arcos",
          pista: "Cruza el río Verdugo. En 1809 hubo aquí una batalla contra el ejército de Napoleón.",
          img: "https://commons.wikimedia.org/wiki/Special:FilePath/Ponte%20Sampaio.jpg?width=640",
          credito: "Foto: Adrián Estévez, Wikimedia Commons, CC BY-SA 4.0"
        },
        {
          id: "hospital", n: "Hospital de Pobres y Peregrinos", lugar: "Tui", fecha: "Edificio de 1756 (hoy Museo Diocesano)",
          pista: "Su nombre lo dice todo. Los peregrinos podían dormir aquí tres noches.",
          img: "https://commons.wikimedia.org/wiki/Special:FilePath/Tui%2C%20Museo%20Diocesán.jpg?width=640",
          credito: "Foto: HombreDHojalata, Wikimedia Commons, CC BY-SA 3.0"
        },
        {
          id: "iglesia", n: "Catedral de Santa María", lugar: "Tui", fecha: "Empezó a construirse en 1120",
          pista: "Mira sus torres con almenas: parece un castillo junto a la frontera con Portugal.",
          img: "https://commons.wikimedia.org/wiki/Special:FilePath/Catedral%20de%20Tui%202017.jpg?width=640",
          credito: "Foto: Roi González Villa, Wikimedia Commons, CC BY-SA 4.0"
        }
      ],
      imprevisto: {
        titulo: "¡Tormenta en Redondela!",
        texto: "Día 2. Llueve a cántaros. Mañana toca ir a Pontevedra (20 km) y vuestras botas están empapadas.",
        opciones: [
          { id: "a", n: "Quedarse un día más en Redondela hasta que pare", det: "Pagáis una noche y un día de comida más (vuestro gasto diario).", tipo: "anade", extra: "diario", kmPerdidos: 0 },
          { id: "b", n: "Coger el autobús hasta Pontevedra", det: "El autobús cuesta 10 €. Esos 20 km no los andáis.", tipo: "anade", extra: 10, kmPerdidos: 20 },
          { id: "c", n: "Comprar un poncho y dormir en Arcade en vez de en Pontevedra", det: "El poncho cuesta 12 €. La noche en Arcade cuesta lo mismo que la de Pontevedra.", tipo: "ambas", extra: 12, kmPerdidos: 0 }
        ]
      }
    },
    C: {
      activo: true,
      camino: "Camino Inglés",
      inicio: "Ferrol",
      pasos: [["Neda", "Fene", "Cabanas"], ["Miño"], ["Presedo"], ["Poulo"], ["Puente medieval sobre el río Tambre"]],
      viaje: "Sevilla ↔ Ferrol",
      transporte: [
        { id: "bus", n: "Autobús", p: 120, d: "el más lento", i: "ti-bus" },
        { id: "tren", n: "Tren", p: 160, d: "con transbordo", i: "ti-train" },
        { id: "avion", n: "Avión", p: 200, d: "+ bus hasta Ferrol", i: "ti-plane" }
      ],
      paradas: [
        { n: "Ferrol", km: 0, lat: 43.484, lon: -8.233, fija: true },
        { n: "Pontedeume", km: 28, lat: 43.407, lon: -8.170 },
        { n: "Betanzos", km: 48, lat: 43.280, lon: -8.212 },
        { n: "Hospital de Bruma", km: 72, lat: 43.140, lon: -8.275 },
        { n: "Sigüeiro", km: 96, lat: 42.966, lon: -8.441 },
        { n: "Santiago", km: 113, lat: 42.880, lon: -8.544 }
      ],
      pistaRuta: "Santiago está al sur. La parada más cercana a Ferrol es Pontedeume.",
      kmOpciones: ["Unos 113 km", "Unos 780 km", "Unos 30 km"],
      falsoInicio: "Porque allí está la catedral de Santiago",
      totalKm: 113,
      completo: "Los peregrinos de Inglaterra, Irlanda y el norte de Europa hacían casi todo el viaje en barco y desembarcaban en Ferrol o A Coruña. Por eso a pie solo les quedaba este tramo.",
      mapaCompleto: {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Caminos%20Santiago%20actuales%20-%2002%20Rutas%20jacobeas%20en%20Galicia.svg?width=600",
        credito: "Mapa: Paulusburg, Wikimedia Commons, CC BY-SA 4.0"
      },
      lugares: [
        {
          id: "puente", n: "Puente de Pontedeume", lugar: "Pontedeume", fecha: "El puente medieval era del siglo XIV; el actual, del XIX",
          pista: "Cruza la ría del Eume. El puente medieval era tan largo que tenía encima una capilla y un hospital.",
          img: "https://commons.wikimedia.org/wiki/Special:FilePath/Pontedeume%20-%20Ponte%20-%2001.jpg?width=640",
          credito: "Foto: Xosema, Wikimedia Commons, CC BY-SA 4.0"
        },
        {
          id: "hospital", n: "Hospital de Bruma", lugar: "Mesía (A Coruña)", fecha: "Funcionó desde la Edad Media hasta el siglo XVIII",
          pista: "El pueblo se llama así por él. Hoy en el mismo sitio hay un albergue de peregrinos.",
          img: "https://commons.wikimedia.org/wiki/Special:FilePath/Hospital%20de%20Bruma%206.jpg?width=640",
          credito: "Foto: Miguel Branco, Wikimedia Commons, CC BY-SA 4.0"
        },
        {
          id: "iglesia", n: "Iglesia de Santiago", lugar: "Betanzos", fecha: "Gótica, del siglo XV",
          pista: "Está dedicada al apóstol al que iban a visitar los peregrinos.",
          img: "https://commons.wikimedia.org/wiki/Special:FilePath/Betanzos%20Igrexa%20de%20Santiago%2021.jpg?width=640",
          credito: "Foto: Miguel Branco, Wikimedia Commons, CC BY-SA 4.0"
        }
      ],
      imprevisto: {
        titulo: "¡Se rompe la mochila en Betanzos!",
        texto: "Día 3. Se ha roto el asa de una mochila. Hoy toca la etapa más dura: 24 km hasta Hospital de Bruma.",
        opciones: [
          { id: "a", n: "Quedarse un día más en Betanzos para arreglarla", det: "Pagáis una noche y un día de comida más (vuestro gasto diario).", tipo: "anade", extra: "diario", kmPerdidos: 0 },
          { id: "b", n: "Coger un taxi hasta Hospital de Bruma", det: "El taxi cuesta 40 €. Esos 24 km no los andáis.", tipo: "anade", extra: 40, kmPerdidos: 24 },
          { id: "c", n: "Comprar una mochila barata y dormir en un albergue a mitad de camino en vez de en Bruma", det: "La mochila cuesta 15 €. Ese albergue cuesta lo mismo que el de Bruma.", tipo: "ambas", extra: 15, kmPerdidos: 0 }
        ]
      }
    },
    D: {
      activo: true,
      camino: "Vía de la Plata (Camino Sanabrés)",
      inicio: "Ourense",
      pasos: [["Tamallancos", "Sobreira"], ["Piñor (o el monasterio de Oseira, por la variante)"], ["A Laxe"], ["Bandeira", "Ponte Ulla"], []],
      viaje: "Sevilla ↔ Ourense",
      transporte: [
        { id: "bus", n: "Autobús", p: 120, d: "el más lento", i: "ti-bus" },
        { id: "tren", n: "Tren", p: 160, d: "con transbordo", i: "ti-train" },
        { id: "avion", n: "Avión", p: 200, d: "+ bus hasta Ourense", i: "ti-plane" }
      ],
      paradas: [
        { n: "Ourense", km: 0, lat: 42.336, lon: -7.864, fija: true },
        { n: "Cea", km: 22, lat: 42.465, lon: -7.989 },
        { n: "O Castro (Dozón)", km: 41, lat: 42.585, lon: -8.030 },
        { n: "Silleda", km: 69, lat: 42.696, lon: -8.246 },
        { n: "Outeiro", km: 93, lat: 42.795, lon: -8.440 },
        { n: "Santiago", km: 109, lat: 42.880, lon: -8.544 }
      ],
      pistaRuta: "Santiago está al norte y un poco al oeste. La parada más cercana a Ourense es Cea.",
      kmOpciones: ["Unos 109 km", "Unos 1.000 km", "Unos 30 km"],
      falsoInicio: "Porque allí empieza la Vía de la Plata",
      totalKm: 109,
      completo: "La Vía de la Plata empieza en Sevilla, ¡vuestra ciudad! Hasta Santiago son casi 1.000 km. Un peregrino sevillano medieval tardaba muchas semanas andando.",
      mapaCompleto: {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Caminos%20Santiago%20actuales%20-%2007%20Caminos%20andaluces.svg?width=600",
        credito: "Mapa: Paulusburg, Wikimedia Commons, CC BY-SA 4.0"
      },
      lugares: [
        {
          id: "puente", n: "Puente Mayor (Ponte Vella)", lugar: "Ourense", fecha: "Origen romano; reconstruido en el siglo XIII",
          pista: "Cruza el río Miño. Durante siglos fue el único puente para pasarlo en Ourense.",
          img: "https://commons.wikimedia.org/wiki/Special:FilePath/Puente%20Medieval%20de%20Orense%20desde%20el%20Paseo%20Fluvial%20del%20Mi%C3%B1o.jpg?width=640",
          credito: "Foto: Mentxuwiki, Wikimedia Commons, CC BY-SA 4.0"
        },
        {
          id: "hospital", n: "Hospital Real", lugar: "Santiago de Compostela", fecha: "Fundado por los Reyes Católicos en 1499",
          pista: "Hoy es un hotel (Parador). Antes recibía a peregrinos cansados y enfermos.",
          img: "https://commons.wikimedia.org/wiki/Special:FilePath/Vista%20de%20la%20fachada%20del%20Hostal%20de%20los%20Reyes%20Cat%C3%B3licos%2C%20en%20la%20Plaza%20del%20Obradoiro.JPG?width=640",
          credito: "Foto: Lancastermerrin88, Wikimedia Commons, CC BY-SA 4.0"
        },
        {
          id: "iglesia", n: "Catedral de San Martiño", lugar: "Ourense", fecha: "Siglos XII–XIII (consagrada en 1188)",
          pista: "Es la iglesia más importante de la ciudad. Su pórtico se parece al de la catedral de Santiago.",
          img: "https://commons.wikimedia.org/wiki/Special:FilePath/Fachada%20Oeste%20Catedral%20de%20Ourense.jpg?width=640",
          credito: "Foto: CatedralOurense, Wikimedia Commons, CC BY-SA 4.0"
        }
      ],
      imprevisto: {
        titulo: "¡Tobillo torcido en Silleda!",
        texto: "Día 4. Uno de vosotros se ha torcido el tobillo. Hoy toca ir a Outeiro (24 km).",
        opciones: [
          { id: "a", n: "Descansar un día más en Silleda", det: "Pagáis una noche y un día de comida más (vuestro gasto diario).", tipo: "anade", extra: "diario", kmPerdidos: 0 },
          { id: "b", n: "Coger el autobús hasta Outeiro", det: "El autobús cuesta 8 €. Esos 24 km no los andáis.", tipo: "anade", extra: 8, kmPerdidos: 24 },
          { id: "c", n: "Comprar una venda y dormir en Bandeira en vez de en Outeiro", det: "La venda cuesta 9 €. La noche en Bandeira cuesta lo mismo que la de Outeiro.", tipo: "ambas", extra: 9, kmPerdidos: 0 }
        ]
      }
    }
  },
  // Situaciones de cada jornada (de hoy, ficticias). {de} y {a} = salida y llegada del día.
  DIARIO: [
    { t: "Al llegar a {a}, el albergue público está completo.", o: [
      { n: "Andar 3 km más hasta el siguiente albergue", c: 0, r: "Llegáis agotados, pero no gastáis nada más." },
      { n: "Dormir esta noche en una pensión", c: 8, r: "Pagáis 8 € más de lo previsto, pero descansáis." } ] },
    { t: "En {a} hay fiesta del pueblo con pulpo y música.", o: [
      { n: "Probar el pulpo", c: 6, r: "Gastáis 6 € y conocéis a gente del pueblo." },
      { n: "Cenar lo que teníais previsto", c: 0, r: "No gastáis nada más." } ] },
    { t: "Al salir de {de} os dais cuenta de que ayer no sellasteis la credencial.", o: [
      { n: "Volver a sellarla antes de seguir", c: 0, r: "Perdéis media hora, pero la credencial está en regla." },
      { n: "Seguir sin el sello", c: 0, r: "Cuidado: en los últimos 100 km hacen falta 2 sellos al día. Os podrían negar la Compostela." } ] },
    { t: "Camino de {a}, una peregrina de Corea del Sur no encuentra el albergue y no habla español.", o: [
      { n: "Acompañarla hasta el albergue", c: 0, r: "Os enseña a decir «gracias» en coreano: gamsahamnida." },
      { n: "Indicarle el camino y seguir", c: 0, r: "Os da las gracias con una sonrisa y sigue sola." } ] },
    { t: "Último día: llueve sin parar camino de {a}.", o: [
      { n: "Comprar calcetines secos", c: 3, r: "Gastáis 3 € y llegáis con los pies secos." },
      { n: "Seguir así", c: 0, r: "Llegáis empapados, pero contentos." } ] }
  ],
  // Banco de imprevistos: a cada pareja le toca uno al azar, en el día 2, 3 o 4.
  // b = transporte que se salta la etapa del día; c = compra + dormir en otro sitio (mismo precio).
  IMPREVISTOS: [
    { tit: "¡Ampollas!", sit: "a uno de vosotros le han salido ampollas", b: { n: "Coger un taxi hasta {a}", p: 35 }, c: { n: "Comprar apósitos", p: 6 } },
    { tit: "¡Tormenta!", sit: "llueve a cántaros y vuestras botas están empapadas", b: { n: "Coger el autobús hasta {a}", p: 10 }, c: { n: "Comprar un poncho", p: 12 } },
    { tit: "¡Mochila rota!", sit: "se ha roto el asa de una mochila", b: { n: "Coger un taxi hasta {a}", p: 40 }, c: { n: "Comprar una mochila barata", p: 15 } },
    { tit: "¡Tobillo torcido!", sit: "uno de vosotros se ha torcido el tobillo", b: { n: "Coger el autobús hasta {a}", p: 8 }, c: { n: "Comprar una venda", p: 9 } },
    { tit: "¡Botas rotas!", sit: "a una bota se le ha despegado la suela", b: { n: "Coger un taxi hasta {a}", p: 35 }, c: { n: "Comprar unas zapatillas", p: 25 } },
    { tit: "¡Ola de calor!", sit: "anuncian 38 °C para hoy", b: { n: "Coger el autobús hasta {a}", p: 9 }, c: { n: "Comprar gorras y agua", p: 7 } },
    { tit: "¡Rodilla cargada!", sit: "a uno de vosotros le duele la rodilla al bajar cuestas", b: { n: "Coger un taxi hasta {a}", p: 30 }, c: { n: "Comprar una rodillera", p: 10 } },
    { tit: "¡Albergues llenos!", sit: "un grupo enorme ha reservado las camas de los albergues del camino de hoy", b: { n: "Coger el autobús hasta {a}, donde aún queda sitio", p: 7 }, c: { n: "Llamar para reservar cama", p: 3 } }
  ],
  EJEMPLO: {
    pregunta: "Es agosto. ¿A qué hora salís a caminar?",
    opciones: ["A las 6:30", "A las 12:00", "A las 16:00"],
    pista: "Pista: en agosto, de 12:00 a 17:00 hace mucho calor.",
    ok: 0,
    explica: "Elegimos las 6:30 porque así andamos con fresco y llegamos antes del calor. Fíjate: usamos la pista para descartar las otras dos."
  },
  CIERRE: {
    q1: { t: "Año 1300. Un peregrino llega enfermo y sin dinero a una ciudad del Camino. ¿Dónde lo acogen?", o: ["En un hospital de peregrinos", "En el puente del pueblo", "En un hotel, pagando con tarjeta"], ok: 0 },
    q2: { t: "¿Por qué en el Camino se mezclaban culturas?", o: ["Porque se cruzaban peregrinos de muchos países con sus ideas, lenguas y productos", "Porque todos los peregrinos eran de Galicia", "Porque estaba prohibido hablar con otros peregrinos"], ok: 0, frase: "Pon un ejemplo con tus palabras:" },
    q3: { t: "¿Qué decisión de vuestro viaje defiendes?", o: ["El transporte desde Sevilla", "El alojamiento", "La comida", "La solución al imprevisto"], frase: "La defiendo porque…" }
  }
};
