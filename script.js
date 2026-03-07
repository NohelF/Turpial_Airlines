/**
 * Turpial - Avior Virtual Assistant
 * script.js
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const chatTrigger = document.getElementById('turpial-chat-trigger');
    const chatWindow = document.getElementById('turpial-chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatSuggestions = document.getElementById('chat-suggestions');

    // Language Detection State
    let currentLang = 'en'; // Default

    // Knowledge Base
    const kb = {
        en: {
            welcome: "Hello, I am Turpial, Avior's virtual assistant. I can help you with information about our aviation services, flight planning, permits, charter flights, and operational support. How can I assist you today?",
            suggestions: [
                "What services do you provide?",
                "How can I request flight permits?",
                "Do you offer flight planning?",
                "How can I book a charter flight?",
                "How can I contact your team?"
            ],
            typing: "Turpial is typing...",
            patterns: [
                {
                    keys: ["service", "provide", "offer", "do you do"],
                    response: "Avior provides comprehensive aviation support including flight planning, international permits, ground handling, flight monitoring, crew support, aircraft fuel, and logistics coordination. We also offer executive charter services."
                },
                {
                    keys: ["permit", "permission", "authorization"],
                    response: "To request flight permits (overflight, landing, or special authorizations), please contact our operations team at ops@aviorair.com or use our request form in the 'Services' section."
                },
                {
                    keys: ["planning", "flight plan", "route"],
                    response: "Yes! We offer professional flight planning services, including route optimization, weather monitoring, and NOTAM analysis to ensure safe and efficient operations."
                },
                {
                    keys: ["charter", "book", "hire", "private"],
                    response: "To book a charter flight, please provide your itinerary, date, and number of passengers to our charter department at sales@aviorair.com. We coordinate logistics for executive and private flights."
                },
                {
                    keys: ["ground handling", "handling", "ground services"],
                    response: "We provide full ground handling coordination at major airports, including ramp services, passenger assistance, and technical support."
                },
                {
                    keys: ["contact", "email", "phone", "address", "team"],
                    response: "You can contact our team 24/7 via email at ops@aviorair.com or call us at our main headquarters. Visit our 'Contact Us' page for specific regional numbers."
                },
                {
                    keys: ["international", "support", "global"],
                    response: "Avior supports international operations globally, specializing in complex permits and logistics for flights entering or transiting multiple regions."
                },
                {
                    keys: ["fuel", "gasoline", "jet a1", "supply"],
                    response: "We offer competitive fuel services and coordination for aircraft at various locations. Contact us with your tail number and location to get a quote."
                },
                {
                    keys: ["hello", "hi", "hey"],
                    response: "Hello! I'm Turpial. How can I assist with your aviation needs today?"
                }
            ],
            fallback: "I'm sorry, I didn't quite catch that. Could you please rephrase your question? You can ask about our services, permits, or how to contact us."
        },
        es: {
            welcome: "Hola, soy Turpial, el asistente virtual de Avior. Puedo ayudarte con información sobre nuestros servicios de aviación, planificación de vuelos, permisos, vuelos charter y soporte operativo. ¿Cómo puedo ayudarte hoy?",
            suggestions: [
                "¿Qué servicios ofrece Avior?",
                "¿Cómo puedo solicitar permisos de vuelo?",
                "¿Ofrecen planificación de vuelos?",
                "¿Cómo puedo contratar un vuelo charter?",
                "¿Cómo puedo contactar con su equipo?"
            ],
            typing: "Turpial está escribiendo...",
            patterns: [
                {
                    keys: ["servicio", "ofrecen", "proporcionan", "hacen"],
                    response: "Avior brinda soporte integral que incluye planificación de vuelos, permisos internacionales, manejo en tierra, monitoreo de vuelos, apoyo a tripulación, suministro de combustible y coordinación logística. También ofrecemos vuelos charter ejecutivos."
                },
                {
                    keys: ["permiso", "vuelo", "autorización", "solicitar"],
                    response: "Para solicitar permisos de vuelo (sobrevuelo, aterrizaje o autorizaciones especiales), contacte a nuestro equipo de operaciones en ops@aviorair.com o use el formulario en la sección de 'Servicios'."
                },
                {
                    keys: ["planificación", "plan de vuelo", "ruta"],
                    response: "¡Sí! Ofrecemos servicios profesionales de planificación de vuelos, incluyendo optimización de rutas, análisis meteorológico y NOTAMs para asegurar operaciones seguras."
                },
                {
                    keys: ["charter", "contratar", "alquilar", "privado"],
                    response: "Para contratar un vuelo charter, envíe su itinerario, fecha y número de pasajeros a sales@aviorair.com. Coordinamos logística para vuelos ejecutivos y privados."
                },
                {
                    keys: ["ground handling", "manejo en tierra", "asistencia"],
                    response: "Proporcionamos coordinación de manejo en tierra en los principales aeropuertos, incluyendo servicios de rampa, asistencia a pasajeros y soporte técnico."
                },
                {
                    keys: ["contacto", "correo", "teléfono", "email", "equipo", "hablar"],
                    response: "Puede contactar a nuestro equipo 24/7 vía email en ops@aviorair.com. Visite nuestra página de 'Contacto' para ver los números telefónicos regionales."
                },
                {
                    keys: ["internacional", "apoyo", "global"],
                    response: "Avior apoya operaciones internacionales a nivel global, especializándose en permisos complejos y logística para vuelos que transitan múltiples regiones."
                },
                {
                    keys: ["combustible", "gasolina", "jet a1", "fuel"],
                    response: "Ofrecemos servicios competitivos de combustible para aeronaves en diversas localidades. Contáctenos con su matrícula y ubicación para una cotización."
                },
                {
                    keys: ["hola", "buenos días", "buenas tardes"],
                    response: "¡Hola! Soy Turpial. ¿En qué puedo ayudarte con tus necesidades de aviación hoy?"
                }
            ],
            fallback: "Lo siento, no entendí bien. ¿Podrías reformular tu pregunta? Puedes consultar sobre nuestros servicios, permisos o cómo contactarnos."
        }
    };

    // Initialize Chat
    function initChat() {
        appendBotMessage(kb[currentLang].welcome);
        renderSuggestions();
    }

    // Toggle Chat
    chatTrigger.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden') && chatMessages.children.length === 0) {
            initChat();
        }
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    // Send Message Logic
    function handleSendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        appendUserMessage(text);
        chatInput.value = '';
        
        // Detect Language
        detectLanguage(text);

        // Show typing indicator
        showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator();
            const response = getBotResponse(text);
            appendBotMessage(response);
            renderSuggestions(); // Update suggestions based on language
        }, 1000);
    }

    chatSend.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });

    // Suggestion Clicks
    function renderSuggestions() {
        chatSuggestions.innerHTML = '';
        kb[currentLang].suggestions.forEach(suggestion => {
            const btn = document.createElement('button');
            btn.className = 'suggestion-btn';
            btn.textContent = suggestion;
            btn.addEventListener('click', () => {
                chatInput.value = suggestion;
                handleSendMessage();
            });
            chatSuggestions.appendChild(btn);
        });
    }

    // Language Detection (Simple keyword based)
    function detectLanguage(text) {
        const spanishKeywords = ['hola', 'que', 'como', 'permiso', 'servicios', 'vuelo', 'contratar', 'donde', 'equipo', 'combustible'];
        const englishKeywords = ['hello', 'hi', 'what', 'how', 'permit', 'services', 'flight', 'book', 'where', 'team', 'fuel'];
        
        const lowerText = text.toLowerCase();
        
        let esMatch = spanishKeywords.filter(k => lowerText.includes(k)).length;
        let enMatch = englishKeywords.filter(k => lowerText.includes(k)).length;

        if (esMatch > enMatch) {
            currentLang = 'es';
        } else if (enMatch > esMatch) {
            currentLang = 'en';
        }
    }

    // Get Response
    function getBotResponse(text) {
        const lowerText = text.toLowerCase();
        const langKb = kb[currentLang];

        for (const pattern of langKb.patterns) {
            if (pattern.keys.some(key => lowerText.includes(key))) {
                return pattern.response;
            }
        }
        return langKb.fallback;
    }

    // Helpers
    function appendUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'msg msg-user';
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function appendBotMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'msg msg-bot';
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'msg msg-bot';
        typingDiv.style.fontStyle = 'italic';
        typingDiv.style.opacity = '0.7';
        typingDiv.textContent = kb[currentLang].typing;
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typingDiv = document.getElementById('typing-indicator');
        if (typingDiv) typingDiv.remove();
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Pre-load if needed (optional)
});
