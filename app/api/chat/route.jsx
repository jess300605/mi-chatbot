// Estado de la conversación y datos universitarios
const conversationState = new Map()

const universityInfo = {
  nombre: "Universidad Don Bosco",
  lema: "Ciencia y Tecnología para el Desarrollo Social",
  calendario: {
    inicioSemestre: "22 de enero 2025",
    finSemestre: "07 de junio 2025",
    inscripciones: "7-15 de diciembre 2024",
    examenesParciales: [
      "<br>✔ Primeras evaluaciones: 24 Feb - 01 Mar 2025",
      "✔ Segundas evaluaciones: 07 Abr - 12 Abr 2025",
    ],
    examenesFinales: "19 May - 31 May 2025",
  },
  biblioteca: {
    nombre: "Biblioteca P. Mauricio Gaborit",
    ubicacion: "Edificio P. Mauricio Gaborit, Campus Soyapango",
    direccion: "https://maps.app.goo.gl/6LaWEhyMpf4rmiWu8",
    horario: "Lunes a Viernes: 7:00 AM - 9:00 PM, Sábados: 8:00 AM - 2:00 PM",
    servicios: ["<br>✔ Préstamo de libros", "✔ Salas de estudio", "✔ Computadoras", "✔ Impresiones", "✔ Recursos digitales"],
  },
  serviciosEstudiantiles: {
    ubicacion: "Edificio Administrativo, Campus Soyapango",
    direccion: "https://maps.app.goo.gl/eFYMwBqn4v22NH2P7",
    contacto: "servicios.estudiantiles@udb.edu.sv",
    telefono: "2527-2300",
    horario: "Lunes a Viernes: 8:00 AM - 4:00 PM",
  },
  apoyoEstudiantil: {
    consejeriaAcademica: {
      ubicacion: "Centro de Desarrollo Integral Estudiantil.",
      direccion: "https://maps.app.goo.gl/eFYMwBqn4v22NH2P7",
      horario: "Lunes a Viernes: 9:00 AM - 3:00 PM",
      servicios: ["<br>✔ Orientación académica", "✔ Apoyo emocional", "✔ Manejo del estrés", "✔ Adaptación universitaria."],
    },
    tutorias: {
      ubicacion: "Centro de Tutorías UDB",
      direccion: "https://maps.app.goo.gl/eFYMwBqn4v22NH2P7",
      materias: ["<br>✔ Matemáticas", "✔ Programación", "✔ Física", "✔ Inglés", "✔ Electrónica."],
      horario: "Lunes a Viernes: 10:00 AM - 6:00 PM",
    },
  },
  desarrolloProfesional: {
    servicios: ["<br>✔ Asesoría de CV", "✔ Preparación para entrevistas", "✔ Búsqueda de pasantías", "✔ Bolsa de trabajo UDB"],
    talleres: [
      "✔ Escritura de CV - Todos los lunes",
      "✔ Entrevistas efectivas - Miércoles",
      "✔ LinkedIn para profesionales - Viernes",
      "✔ Emprendimiento UDB - Jueves",
    ],
    contacto: "carreras@udb.edu.sv",
  },
  vidaEstudiantil: {
    clubes: [
      "✔ Club de Programación UDB",
      "✔ Sociedad de IA y Robótica",
      "✔ Club de Desarrollo Web",
      "✔ Grupo de Investigación Tecnológica",
      "✔ Club de Emprendimiento",
    ],
    alimentacion: {
      cafeterias: ["<br>✔ Cafetería Central UDB", "✔ Café Express", "✔ Food Court Bosco"],
      horario: "6:00 AM - 5:00 PM",
      direccion1: "https://maps.app.goo.gl/co1zy9QRm3vn89vUA",
      direccion2: "https://maps.app.goo.gl/wqcFYCbqefZ4nZay8",
    },
    eventos: [
      "✔ Hackathon UDB - 20 de marzo",
      "✔ Feria de Tecnología - 15 de abril",
      "✔ Competencia de Programación - 5 de mayo",
      "✔ Semana del Estudiante UDB - 10-15 de mayo",
    ],
  },
}

// Nuevos estados para recolección de datos
const STATES = {
  INITIAL: "initial",
  COLLECTING_NAME: "collecting_name",
  COLLECTING_PHONE: "collecting_phone",
  COLLECTING_DATE: "collecting_date",
  COLLECTING_REASON: "collecting_reason",
  CONFIRMING_APPOINTMENT: "confirming_appointment",
}

// Detectar respuestas afirmativas
const affirmativeResponses = [
  "si",
  "sí",
  "yes",
  "claro",
  "por supuesto",
  "ok",
  "okay",
  "dale",
  "va",
  "está bien",
  "esta bien",
  "me gustaría",
  "me gustaria",
  "quiero",
  "quisiera",
]

function isAffirmativeResponse(message) {
  const affirmativeWords = [
    "si",
    "sí",
    "yes",
    "claro",
    "por supuesto",
    "ok",
    "okay",
    "dale",
    "va",
    "está bien",
    "esta bien",
    "me gustaría",
    "me gustaria",
    "quiero",
    "quisiera",
  ]

  const normalizedMessage = message.toLowerCase().trim()
  return affirmativeWords.some(
    (word) =>
      normalizedMessage === word ||
      normalizedMessage.startsWith(word + " ") ||
      normalizedMessage.endsWith(" " + word) ||
      normalizedMessage.includes(" " + word + " "),
  )
}

// Al inicio de la función getResponseByState
function getResponseByState(messages, sessionId) {
  const state = conversationState.get(sessionId) || { step: STATES.INITIAL, data: {} }
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase().trim() || ""

  console.log("Estado actual:", state.step)
  console.log("Último mensaje:", lastMessage)

  // Si estamos en cualquier estado de recolección de datos, procesarlo primero
  if (state.step !== STATES.INITIAL) {
    switch (state.step) {
      case STATES.COLLECTING_NAME:
        state.data.name = lastMessage
        state.step = STATES.COLLECTING_PHONE
        conversationState.set(sessionId, state)
        return "¿Cuál es tu número de teléfono para contactarte?"

      case STATES.COLLECTING_PHONE:
        state.data.phone = lastMessage
        state.step = STATES.COLLECTING_DATE
        conversationState.set(sessionId, state)
        return "¿Qué día y hora te gustaría agendar la cita? (Ejemplo: Lunes 15 de marzo a las 2:00 PM)"

      case STATES.COLLECTING_DATE:
        state.data.date = lastMessage
        state.step = STATES.COLLECTING_REASON
        conversationState.set(sessionId, state)
        return "¿Cuál es el motivo de tu cita?"

      case STATES.COLLECTING_REASON:
        state.data.reason = lastMessage
        state.step = STATES.CONFIRMING_APPOINTMENT
        conversationState.set(sessionId, state)
        return `Por favor confirma los siguientes datos para tu cita:
        
        Nombre: ${state.data.name}
        Teléfono: ${state.data.phone}
        Fecha y hora: ${state.data.date}
        Motivo: ${state.data.reason}
        
        ¿Están correctos los datos? (Responde "Sí" para confirmar)`

      case STATES.CONFIRMING_APPOINTMENT:
        if (isAffirmativeResponse(lastMessage)) {
          state.step = STATES.INITIAL
          conversationState.set(sessionId, state)
          return `¡Perfecto! Tu cita ha sido agendada con éxito. 
          Te contactaremos al ${state.data.phone} para confirmar.
          
          ¿Hay algo más en lo que pueda ayudarte?`
        } else {
          state.step = STATES.COLLECTING_NAME
          state.data = {}
          conversationState.set(sessionId, state)
          return "Entiendo, empecemos de nuevo. ¿Cuál es tu nombre completo?"
        }
    }
  }

  // Verificar si es una respuesta afirmativa a una pregunta de agendamiento
  if (isAffirmativeResponse(lastMessage)) {
    const previousMessage = messages[messages.length - 2]?.content?.toLowerCase() || ""
    if (
      previousMessage.includes("cita") ||
      previousMessage.includes("agendar") ||
      previousMessage.includes("consejero") ||
      previousMessage.includes("tutoría") ||
      previousMessage.includes("asesoría")
    ) {
      state.step = STATES.COLLECTING_NAME
      conversationState.set(sessionId, state)
      return "Por favor, proporciona tu nombre completo para agendar la cita:"
    }
  }

  // Detectar saludos - Expandido
  const saludos = [
    "hola",
    "buenos días",
    "buenas tardes",
    "buenas noches",
    "hey",
    "saludos",
    "qué tal",
    "que tal",
    "cómo estás",
    "como estas",
    "qué hay",
    "que hay",
    "hi",
    "hello",
    "buen día",
    "buen dia",
    "qué onda",
    "que onda",
    "que ondas",
  ]
  const isSaludo = saludos.some((saludo) => lastMessage.includes(saludo))

  // Detectar despedidas - Expandido
  const despedidas = [
    "adiós",
    "adios",
    "hasta luego",
    "chao",
    "bye",
    "gracias",
    "nos vemos",
    "hasta pronto",
    "me voy",
    "me retiro",
    "hasta mañana",
    "good bye",
    "que estés bien",
    "que estes bien",
    "cuídate",
    "cuidate",
  ]
  const isDespedida = despedidas.some((despedida) => lastMessage.includes(despedida))

  // Detectar intenciones de agendar
  const schedulingKeywords = {
    consejeria: ["cita", "consejero", "consejería", "consejeria", "asesoría", "asesoria"],
    tutorias: ["tutoría", "tutoria", "tutor", "clase", "ayuda con materias"],
    carrera: ["asesoría profesional", "asesoria profesional", "desarrollo profesional", "carrera"],
  }

  // Verificar si el mensaje contiene palabras clave de agendamiento
  for (const [service, keywords] of Object.entries(schedulingKeywords)) {
    if (keywords.some((keyword) => lastMessage.includes(keyword))) {
      if (isAffirmativeResponse(lastMessage)) {
        state.step = STATES.COLLECTING_NAME
        state.data = { service }
        conversationState.set(sessionId, state)
        return "Por favor, proporciona tu nombre completo para agendar la cita:"
      }
    }
  }

  // Resto del código de detección de palabras clave...
  const keywords = {
    calendario: ["calendario", "fechas", "semestre", "inscripción", "inscripciones", "examenes", "parciales",
      "fecha", "examen", "parcial", "inicio de ciclo", "final de ciclo", "inicio", "final", "horario", "horarios", "horarios de inscripción"],
    horario: ["horario", "clases", "materias"],
    biblioteca: ["biblioteca", "libros", "estudiar", "prestamo", "libro", "prestar", "leer", "estudio", "sala", 
      "salas", "préstamo", "recursos", "campus"],
    serviciosEstudiantiles: ["servicios estudiantiles", "departamento", "administrativo", "servicios", "estudiantiles",
      "servicio", "estudiantil", "administración"],
    eventos: ["eventos", "actividades", "esta semana", "fin de semana", "eventos", "proximos", "eventos próximos", "proximo",
      "actividad", "actividad reciente"],
    apoyo: ["estrés", "problemas", "ayuda", "emocional", "discapacidad", "consejería", "apoyo", "problema", "consejos", "mental",
      "incapacidad", "discapacidad"],
    tutorias: ["tutoría", "tutoria", "asesoría", "asesoria", "rendimiento", "acompañamiento", "materias"],
    carrera: ["pasantía", "pasantias", "práctica", "practicas", "profesional"],
    curriculum: ["curriculum", "cv", "vitae", "hoja de vida", "carrera"],
    entrevistas: ["entrevista", "trabajo", "laboral"],
    clubes: ["club", "clubes", "extracurricular", "actividades", "extra", "juegos", "entretener", "entretenimiento"],
    comida: ["comida", "alimentación", "cafetería", "cafeteria", "comer", "venta de comida", "venta", "chalets", "chalet"],
  }

  // Función para verificar si el mensaje contiene palabras clave
  const containsKeywords = (message, keywordList) => {
    return keywordList.some((keyword) => message.toLowerCase().includes(keyword.toLowerCase()))
  }

  // Primero verificamos si es un saludo inicial
  if (isSaludo && messages.length <= 2) {
    const initialMessage = `¡Bienvenido a la Universidad Don Bosco! Soy tu asistente virtual y estoy aquí para ayudarte con:

📚 Información académica (calendario, horarios, inscripciones)
📖 Biblioteca y recursos del campus
🎓 Servicios estudiantiles
🤝 Apoyo y bienestar estudiantil
💼 Desarrollo profesional
🎮 Vida estudiantil y eventos

¿En qué puedo ayudarte?`
    const saludosRespuestas = [
      `¡Hola! Soy el asistente virtual de la ${universityInfo.nombre}. Estoy aquí para ayudarte con información sobre servicios estudiantiles, calendario académico, y más.`,
      initialMessage,
      `¡Hola! Gracias por contactar al asistente virtual de la ${universityInfo.nombre}. ¿En qué puedo ayudarte hoy?`,
    ]
    const respuesta = saludosRespuestas[Math.floor(Math.random() * saludosRespuestas.length)]
    return `${respuesta}

    Puedo ayudarte con:
    📚 Información académica (calendario, horarios, inscripciones)
    📖 Biblioteca y recursos del campus
    🎓 Servicios estudiantiles
    🤝 Apoyo y bienestar estudiantil
    💼 Desarrollo profesional
    🎮 Vida estudiantil y eventos
    
    ¿Sobre qué tema te gustaría saber más?`
  }

  // Luego verificamos cada categoría de keywords
  for (const [category, keywordList] of Object.entries(keywords)) {
    if (containsKeywords(lastMessage, keywordList)) {
      console.log("Categoría detectada:", category)

      switch (category) {
        case "calendario":
          return `El calendario académico de la Universidad Don Bosco para este semestre es:
          - <b>Inicio del semestre:</b> ${universityInfo.calendario.inicioSemestre}
          - <b>Fin del semestre:</b> ${universityInfo.calendario.finSemestre}
          - <b>Período de inscripciones:</b> ${universityInfo.calendario.inscripciones}
          - <b>Exámenes parciales:</b> ${universityInfo.calendario.examenesParciales.join("\n")}
          - <b>Exámenes finales:</b> ${universityInfo.calendario.examenesFinales}
           
          Para más información Sobre tus horarios, visita <a href="https://admacad.udb.edu.sv/EstudiantesPlus/MiHorario" target="da click" rel="noopener noreferrer" style="color: #ffffff; font-weight: bold;">Portal Web</a>.
          ¿Necesitas información adicional sobre alguna fecha específica?`

        case "biblioteca":
          return `La ${universityInfo.biblioteca.nombre} está ubicada en ${universityInfo.biblioteca.ubicacion}. <br>
          - <b>Horario:</b> ${universityInfo.biblioteca.horario}
          - <b>Servicios disponibles:</b> ${universityInfo.biblioteca.servicios.join("\n")}
          - <b>Ubicación:<br><a href="${universityInfo.biblioteca.direccion}" 
          target="_blank" rel="noopener noreferrer" style="color: #d8d8d8; text-decoration: none;">https://maps.app.goo.gl/eFYMwBqn4v22NH2P7</a></b>
          
          ¿Te gustaría saber más sobre algún servicio específico?`

        case "serviciosEstudiantiles":
          return `El Departamento de Servicios Estudiantiles de la UDB está ubicado en ${universityInfo.serviciosEstudiantiles.ubicacion}
          Puedes contactarlos en:
          - <b>Email:</b> ${universityInfo.serviciosEstudiantiles.contacto}
          - <b>Teléfono:</b> ${universityInfo.serviciosEstudiantiles.telefono}
          - <b>Horario:</b> ${universityInfo.serviciosEstudiantiles.horario}
          - <b>Ubicación:<br><a href="${universityInfo.serviciosEstudiantiles.direccion}" 
          target="_blank" rel="noopener noreferrer" style="color: #d8d8d8; text-decoration: none;">https://maps.app.goo.gl/eFYMwBqn4v22NH2P7</a></b>
          
             Para más información sobre otros servicios, visita <a href="https://admacad.udb.edu.sv/EstudiantesPlus/MiHorario" target="da click" rel="noopener noreferrer" style="color: #ffffff; font-weight: bold;">Portal Web</a>.<br>

          ¿En qué te puedo ayudar específicamente?`
          

        case "apoyo":
          return `La UDB ofrece varios servicios de apoyo estudiantil:
          
          Consejería Académica y Apoyo Emocional:
          - <b>Dirección:</b> ${universityInfo.apoyoEstudiantil.consejeriaAcademica.ubicacion}
          - <b>Ubicación:<br><a href="${universityInfo.apoyoEstudiantil.consejeriaAcademica.direccion}" 
          target="_blank" rel="noopener noreferrer" style="color: #d8d8d8; text-decoration: none;">https://maps.app.goo.gl/eFYMwBqn4v22NH2P7</a></b>
          - <b>Horario:</b> ${universityInfo.apoyoEstudiantil.consejeriaAcademica.horario}
          - <b>Servicios:</b> ${universityInfo.apoyoEstudiantil.consejeriaAcademica.servicios.join("\n")}
          
          ¿Te gustaría agendar una cita con un consejero? (Responde "Sí" para comenzar el proceso)`

        case "tutorias":
          return `El Centro de Tutorías de la UDB ofrece apoyo en:
          - <b>Dirección:</b> ${universityInfo.apoyoEstudiantil.tutorias.ubicacion}
          - <b>Ubicación:<br><a href="${universityInfo.apoyoEstudiantil.tutorias.direccion}" 
          target="_blank" rel="noopener noreferrer" style="color: #d8d8d8; text-decoration: none;">https://maps.app.goo.gl/eFYMwBqn4v22NH2P7</a></b>
          - <b>Materias disponibles:</b>${universityInfo.apoyoEstudiantil.tutorias.materias.join("\n")}
          - <b>Horario:</b> ${universityInfo.apoyoEstudiantil.tutorias.horario}
          
          ¿Te gustaría agendar una tutoría? (Responde Sí para comenzar el proceso)`

        case "carrera":
        case "curriculum":
        case "entrevistas":
          return `La oficina de Desarrollo Profesional de la UDB ofrece:
          - <b>Servicios:</b> ${universityInfo.desarrolloProfesional.servicios.join("\n")}<br>
          - <b>Talleres disponibles:</b> 
            ${universityInfo.desarrolloProfesional.talleres.join("\n")}
          
          ¿Te gustaría agendar una asesoría profesional? (Responde "Sí" para comenzar el proceso)`

        case "clubes":
          return `<b>Los clubes disponibles en la UDB son:</b>
          ${universityInfo.vidaEstudiantil.clubes.join("\n          ")}
          
          ¿Te gustaría más información sobre algún club en particular?`

        case "comida":
          return `Opciones de alimentación en el campus de la UDB:
          - <b>Lugares disponibles:</b> ${universityInfo.vidaEstudiantil.alimentacion.cafeterias.join("\n")}
          <br>- <b>Horarios:</b> ${universityInfo.vidaEstudiantil.alimentacion.horario}
          <br>- <b>Ubicado por edificio 6:<br><a href="${universityInfo.vidaEstudiantil.alimentacion.direccion1}" 
          target="_blank" rel="noopener noreferrer" style="color: #d8d8d8; text-decoration: none;">https://maps.app.goo.gl/co1zy9QRm3vn89vUA</a></b>
          <br>- <b>Ubicado por edificio C:<br><a href="${universityInfo.vidaEstudiantil.alimentacion.direccion2}" 
          target="_blank" rel="noopener noreferrer" style="color: #d8d8d8; text-decoration: none;">https://maps.app.goo.gl/wqcFYCbqefZ4nZay8</a></b>
          
          ¿Necesitas información sobre algún lugar específico?`

        case "eventos":
          return `<b>Próximos eventos importantes en la UDB:</b>
          ${universityInfo.vidaEstudiantil.eventos.join("\n          ")}
          
          ¿Te gustaría más detalles sobre algún evento en particular?`
      }
    }
  }

  // Si no se detectó ninguna palabra clave específica, enviamos un mensaje por defecto
  return `Como asistente de la Universidad Don Bosco, puedo ayudarte con:
  
  📚 Información académica (calendario, horarios, inscripciones)
  📖 Biblioteca y recursos del campus
  🎓 Servicios estudiantiles
  🤝 Apoyo y bienestar estudiantil
  💼 Desarrollo profesional
  🎮 Vida estudiantil y eventos
  
  ¿Sobre qué tema te gustaría saber más?`
}

export async function POST(req) {
  try {
    const { messages } = await req.json()
    const sessionId = "session-1"
    const responseText = getResponseByState(messages, sessionId)

    return new Response(JSON.stringify({ content: responseText }), {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error en el chat:", error)
    return new Response(JSON.stringify({ error: "Error al procesar la solicitud" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

