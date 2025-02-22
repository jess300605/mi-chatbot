// Estado de la conversación y datos del consultorio
const conversationState = new Map()

const clinicInfo = {
  doctor: {
    nombre: "Dr. Juan Pérez",
    especialidad: "Medicina General",
  },
  ubicacion: {
    direccion: "Col. Escalón, Pasaje 4",
    referencia: "Frente al Banco Central",
  },
  contacto: {
    telefono: "2335-1049",
    whatsapp: "2335-1049",
  },
  horarios: {
    dias: "Lunes a Sábado",
    horas: "8:00 AM - 4:00 PM",
  },
  precios: {
    consultaGeneral: 20,
    controlRutina: 15,
    emergencias: 30,
    examenesMedicos: 25,
  },
}

function getResponseByState(messages, sessionId) {
  const state = conversationState.get(sessionId) || { step: "initial" }
  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || ""

  // Detectar afirmaciones
  const afirmaciones = ["si", "sí", "claro", "por supuesto", "ok", "está bien", "quiero", "adelante"]
  const isAfirmativo = afirmaciones.some(
    (afirmacion) => lastMessage === afirmacion || lastMessage.startsWith(afirmacion + " "),
  )

  // Detectar saludos
  const saludos = ["hola", "buenos días", "buenas tardes", "buenas noches", "hey", "saludos"]
  const isSaludo = saludos.some((saludo) => lastMessage === saludo || lastMessage.startsWith(saludo + " "))

  // Detectar despedidas
  const despedidas = ["adiós", "hasta luego", "chao", "bye", "gracias"]
  const isDespedida = despedidas.some((despedida) => lastMessage.includes(despedida))

  // Detectar intención de agendar
  const palabrasCita = ["cita", "agendar", "reservar", "consulta", "hora"]
  const wantsCita = palabrasCita.some((palabra) => lastMessage.includes(palabra))

  // Detectar consultas sobre precios
  const palabrasPrecios = ["precio", "costo", "tarifa", "valor", "cuánto", "cuanto", "cobran", "cobra"]
  const wantsPrecios = palabrasPrecios.some((palabra) => lastMessage.includes(palabra))

  // Detectar consultas sobre horarios
  const palabrasHorario = ["horario", "atienden", "abierto", "cerrado", "días", "horas"]
  const wantsHorario = palabrasHorario.some((palabra) => lastMessage.includes(palabra))

  // Detectar consultas sobre ubicación
  const palabrasUbicacion = ["donde", "ubicación", "dirección", "direccion", "llegar", "encuentran"]
  const wantsUbicacion = palabrasUbicacion.some((palabra) => lastMessage.includes(palabra))

  // Detectar consultas sobre el doctor
  const palabrasDoctor = ["doctor", "médico", "medico", "especialidad", "experiencia"]
  const wantsDoctor = palabrasDoctor.some((palabra) => lastMessage.includes(palabra))

  // Lógica de respuestas basada en el estado y el mensaje
  console.log("Current state:", state.step, "Last message:", lastMessage)

  // Manejar saludos iniciales
  if (isSaludo && (state.step === "initial" || !state.step)) {
    conversationState.set(sessionId, { step: "greeted" })
    return `¡Hola! Soy el asistente virtual del ${clinicInfo.doctor.nombre}. Puedo ayudarte a agendar citas, informarte sobre nuestros servicios, precios y horarios. ¿En qué puedo ayudarte?`
  }

  // Manejar despedidas
  if (isDespedida) {
    conversationState.delete(sessionId)
    return "¡Hasta luego! Que tengas un excelente día. Si necesitas algo más, no dudes en volver."
  }

  // Manejar respuesta afirmativa a sugerencia de cita
  if (state.step === "suggested_appointment" && isAfirmativo) {
    conversationState.set(sessionId, { step: "waiting_name" })
    return "¡Excelente! Para agendar tu cita, ¿podrías proporcionarme tu nombre completo?"
  }

  // Manejar consultas específicas
  if (wantsPrecios) {
    conversationState.set(sessionId, { step: "suggested_appointment" })
    return `Estos son nuestros precios:
    - Consulta General: $${clinicInfo.precios.consultaGeneral}
    - Control de Rutina: $${clinicInfo.precios.controlRutina}
    - Atención de Emergencias: $${clinicInfo.precios.emergencias}
    - Exámenes Médicos Generales: $${clinicInfo.precios.examenesMedicos}

    ¿Te gustaría agendar una cita?`
  }

  if (wantsHorario) {
    conversationState.set(sessionId, { step: "suggested_appointment" })
    return `Nuestro horario de atención es:
${clinicInfo.horarios.dias} de ${clinicInfo.horarios.horas}

¿Te gustaría programar una cita en alguno de estos horarios?`
  }

  if (wantsUbicacion) {
    conversationState.set(sessionId, { step: "suggested_appointment" })
    return `Estamos ubicados en:
    ${clinicInfo.ubicacion.direccion}
    ${clinicInfo.ubicacion.referencia}
    
    Puedes comunicarte al ${clinicInfo.contacto.telefono} para más indicaciones.
    ¿Te gustaría agendar una cita?`
  }

  if (wantsDoctor) {
    conversationState.set(sessionId, { step: "suggested_appointment" })
    return `El ${clinicInfo.doctor.nombre} es especialista en ${clinicInfo.doctor.especialidad}. 
    Cuenta con amplia experiencia en atención médica general y tratamientos especializados.
    
    ¿Te gustaría programar una consulta?`
  }

  // Manejar solicitud directa de cita
  if (wantsCita) {
    conversationState.set(sessionId, { step: "waiting_name" })
    return `Por supuesto, te ayudo a agendar una cita con el ${clinicInfo.doctor.nombre}. 
    ¿Podrías proporcionarme tu nombre completo?`
  }

  // Proceso de agenda de cita
  switch (state.step) {
    case "waiting_name":
      // Verificar que el mensaje no sea un saludo o una palabra clave
      if (isSaludo || wantsCita || wantsPrecios || wantsHorario || wantsUbicacion || wantsDoctor) {
        return "Por favor, proporciona tu nombre completo para continuar con la cita."
      }
      conversationState.set(sessionId, { step: "waiting_phone", name: lastMessage })
      return `Gracias ${lastMessage}. ¿Me podrías proporcionar un número de teléfono para contactarte?`

    case "waiting_phone":
      conversationState.set(sessionId, {
        step: "waiting_date",
        name: state.name,
        phone: lastMessage,
      })
      return `¿Para qué fecha te gustaría agendar la cita? Atendemos de ${clinicInfo.horarios.dias} de ${clinicInfo.horarios.horas}`

    case "waiting_date":
      conversationState.set(sessionId, {
        step: "waiting_reason",
        name: state.name,
        phone: state.phone,
        date: lastMessage,
      })
      return "¿Cuál es el motivo de tu consulta? Esto nos ayudará a preparar mejor tu atención."

    case "waiting_reason":
      const appointmentInfo = {
        ...state,
        reason: lastMessage,
      }
      conversationState.set(sessionId, { step: "initial" })
      return `¡Perfecto! He agendado tu cita con los siguientes detalles:
      - Doctor: ${clinicInfo.doctor.nombre}
      - Nombre del paciente: ${appointmentInfo.name}
      - Teléfono: ${appointmentInfo.phone}
      - Fecha: ${appointmentInfo.date}
      - Motivo: ${lastMessage}
      - Dirección: ${clinicInfo.ubicacion.direccion}
      
      Por favor, llega 10 minutos antes de tu cita. 
      El costo de la consulta general es $${clinicInfo.precios.consultaGeneral}.
      
      ¿Necesitas alguna información adicional?`
  }

  // Respuestas generales para otros casos
  const respuestasGenerales = [
    "¿En qué más puedo ayudarte? Puedo informarte sobre precios, horarios o agendar una cita.",
    "Estoy aquí para ayudarte con información sobre nuestros servicios médicos. ¿Qué te gustaría saber?",
    `Puedo ayudarte a agendar una cita con el ${clinicInfo.doctor.nombre} o brindarte información sobre nuestros servicios. ¿Qué necesitas?`,
    "¿Tienes alguna otra pregunta sobre nuestros servicios médicos, horarios o precios?",
  ]

  return respuestasGenerales[Math.floor(Math.random() * respuestasGenerales.length)]
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

