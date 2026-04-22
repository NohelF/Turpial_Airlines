document.addEventListener('DOMContentLoaded', () => {
    const chatWidget = document.getElementById('chat-widget');
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendMessage = document.getElementById('send-message');
    const typingIndicator = document.getElementById('typing-indicator');
    const chatSuggestions = document.getElementById('chat-suggestions');

    // Knowledge Base based on Avior services
    const knowledgeBase = {
        services: {
            keywords: ['services', 'provide', 'do you do', 'what offer'],
            response: "Avior provides full flight support, including flight planning, ground handling, permits, fuel services, and charter flights. We specialize in executive aviation and operational logistics."
        },
        permits: {
            keywords: ['permits', 'flight permits', 'overflight', 'landing permit'],
            response: "We coordinate all necessary flight permits, including overflight and landing authorizations worldwide. Our team handles the regulatory paperwork so you don't have to."
        },
        planning: {
            keywords: ['planning', 'flight planning', 'dispatch', 'route'],
            response: "Yes. Avior provides full flight planning and dispatch services. Our team supports route optimization, weather analysis, and operational planning to ensure safe and efficient flights."
        },
        charter: {
            keywords: ['charter', 'book a flight', 'private flight', 'private jet'],
            response: "To book a charter flight or request a quote, please contact our logistics team directly. We offer flexible solutions for executive and group travel."
        },
        ground: {
            keywords: ['ground handling', 'handling', 'ramp services', 'support'],
            response: "We offer comprehensive ground handling services at various international locations. This includes passenger services, ramp handling, and cargo coordination."
        },
        fuel: {
            keywords: ['fuel', 'jet a1', 'refuel', 'gas'],
            response: "Avior provides competitive fuel services (Jet A1) through our global network of suppliers. We ensure timely and compliant refuelling for your aircraft."
        },
        crew: {
            keywords: ['crew', 'accommodation', 'transportation', 'hotel'],
            response: "We provide full support for flight crews, including luxury transportation, hotel coordination, and customized catering services."
        },
        international: {
            keywords: ['international', 'worldwide', 'global', 'abroad'],
            response: "Absolutely. We support international operations across the globe, managing cross-border permits and local logistics at any airport."
        },
        contact: {
            keywords: ['contact', 'team', 'phone', 'email', 'support'],
            response: "You can contact our operations team 24/7 via email at ops@aviorair.com or call our support line. We are always ready to assist you."
        }
    };

    const initialSuggestions = [
        "What services do you provide?",
        "Request flight permits",
        "Flight planning services",
        "How can I contact support?"
    ];

    // Functions
    function toggleChat() {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            chatInput.focus();
            if (chatMessages.children.length === 0) {
                sendBotGreeting();
            }
        }
    }

    function sendBotGreeting() {
        const greeting = "Hello, welcome to Avior support. I can help you learn about our aviation services, flight planning, permits, charter flights, and operational support. How can I assist you today?";
        addMessage(greeting, 'bot');
        renderSuggestions(initialSuggestions);
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(sender === 'bot' ? 'bot-message' : 'user-message');
        messageDiv.textContent = text;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function renderSuggestions(suggestions) {
        chatSuggestions.innerHTML = '';
        suggestions.forEach(text => {
            const btn = document.createElement('button');
            btn.classList.add('suggestion-btn');
            btn.textContent = text;
            btn.onclick = () => {
                handleUserInput(text);
                chatSuggestions.innerHTML = ''; // Clear after click
            };
            chatSuggestions.appendChild(btn);
        });
    }

    function showTyping() {
        typingIndicator.classList.remove('hidden');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideTyping() {
        typingIndicator.classList.add('hidden');
    }

    function handleUserInput(text) {
        if (!text.trim()) return;
        
        addMessage(text, 'user');
        chatInput.value = '';
        
        showTyping();

        // Simulate thinking time
        setTimeout(() => {
            hideTyping();
            const response = getBotResponse(text);
            addMessage(response, 'bot');
            
            // Re-show suggestions after some time if it was a specific question
            setTimeout(() => {
                if (chatSuggestions.innerHTML === '') {
                    renderSuggestions(initialSuggestions);
                }
            }, 1000);
        }, 1200);
    }

    function getBotResponse(input) {
        const lowerInput = input.toLowerCase();
        
        for (const key in knowledgeBase) {
            const entry = knowledgeBase[key];
            if (entry.keywords.some(keyword => lowerInput.includes(keyword))) {
                return entry.response;
            }
        }

        return "I'm sorry, I didn't quite catch that. Could you please rephrase your question? I can help with flight planning, permits, fuel, and more.";
    }

    // Event Listeners
    chatToggle.onclick = toggleChat;
    closeChat.onclick = toggleChat;

    sendMessage.onclick = () => handleUserInput(chatInput.value);
    
    chatInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
            handleUserInput(chatInput.value);
        }
    };
});
