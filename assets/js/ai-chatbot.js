// AI Chatbot System for anconsulting.us
// Handles Gemini AI conversations, email notifications, and booking promotion

class AIChatbot {
    constructor() {
        // Centralized booking link so it can be updated in one place
    this.BOOKING_LINK = 'https://calendar.app.google/BndKeYEmGrRQDGXr6';
    this.validBookingLink = this.validateBookingLink(this.BOOKING_LINK);
        this.isOpen = false;
        this.conversation = [];
        this.clientData = {};
        this.hasCollectedEmail = false;
    this.hasShownBookingPromotion = false;
    this.sessionId = this.generateSessionId();
    this.sessionStart = Date.now();
    this.hasHighlightedBooking = false; // one-time CTA highlight
    this.visitorId = this.getOrCreateVisitorId();
        
        this.init();
    }

    validateBookingLink(url) {
        return /^https:\/\/calendar\.app\.google\/[A-Za-z0-9]+$/.test(url) ? url : null;
    }

    generateSessionId() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    init() {
        this.createChatWidget();
        this.bindEvents();
    }

    getOrCreateVisitorId() {
        const KEY = 'ai_chat_visitor_id';
        try {
            let existing = localStorage.getItem(KEY);
            if (!existing) {
                existing = 'vis_' + Date.now() + '_' + Math.random().toString(36).slice(2,10);
                localStorage.setItem(KEY, existing);
            }
            return existing;
        } catch (_) {
            return 'vis_fallback_' + Date.now();
        }
    }

    createChatWidget() {
        // Create the main chatbot container
        const chatWidget = document.createElement('div');
        chatWidget.id = 'ai-chatbot';
        chatWidget.innerHTML = `
            <!-- Chat Toggle Button -->
            <button id="chat-toggle" class="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110">
                <i data-lucide="message-circle" class="w-8 h-8"></i>
            </button>

            <!-- Chat Window -->
            <div id="chat-window" class="fixed bottom-24 right-6 w-96 h-[500px] bg-slate-900/95 backdrop-blur-lg border border-slate-700 rounded-2xl shadow-2xl z-50 transform translate-y-8 opacity-0 pointer-events-none transition-all duration-300 max-w-[calc(100vw-3rem)] sm:w-96">
                
                <!-- Chat Header -->
                <div class="flex items-center justify-between p-4 border-b border-slate-700">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <i data-lucide="brain" class="w-4 h-4 text-white"></i>
                        </div>
                        <div>
                            <h3 class="text-white font-semibold text-sm">Joe's Digital Twin</h3>
                            <p class="text-slate-400 text-xs">Powered by Source-Grounded AI</p>
                        </div>
                    </div>
                    <button id="chat-close" class="text-slate-400 hover:text-white transition-colors">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>

                <!-- Chat Messages -->
                <div id="chat-messages" class="flex-1 p-4 space-y-4 overflow-y-auto max-h-[320px] scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                    <!-- Welcome message will be inserted here -->
                </div>

                <!-- Typing Indicator -->
                <div id="typing-indicator" class="px-4 py-2 hidden">
                    <div class="flex items-center space-x-2 text-slate-400 text-sm">
                        <div class="flex space-x-1">
                            <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                            <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                            <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                        </div>
                        <span>AI is thinking...</span>
                    </div>
                </div>

                <!-- Chat Input -->
                <div class="p-4 border-t border-slate-700">
                    <div class="flex space-x-2">
                        <input 
                            type="text" 
                            id="chat-input" 
                            placeholder="Ask about our AI services..." 
                            class="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                        <button 
                            id="chat-send" 
                            class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center min-w-[40px]"
                        >
                            <i data-lucide="send" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(chatWidget);
        
        // Initialize Lucide icons for the new elements
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    bindEvents() {
        const toggleBtn = document.getElementById('chat-toggle');
        const closeBtn = document.getElementById('chat-close');
        const sendBtn = document.getElementById('chat-send');
        const input = document.getElementById('chat-input');

        toggleBtn.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.closeChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Auto-open chat after 10 seconds if user hasn't interacted
        setTimeout(() => {
            if (!this.isOpen && !localStorage.getItem('chatbot_dismissed')) {
                this.showWelcomePrompt();
            }
        }, 10000);
    }

    showWelcomePrompt() {
        const toggleBtn = document.getElementById('chat-toggle');
        toggleBtn.classList.add('animate-pulse');
        
        // Add a subtle notification badge
        const badge = document.createElement('div');
        badge.className = 'absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center';
        badge.textContent = '!';
        toggleBtn.appendChild(badge);
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.isOpen = true;
        const chatWindow = document.getElementById('chat-window');
        const toggleBtn = document.getElementById('chat-toggle');
        
        // Remove any notification indicators
        const badge = toggleBtn.querySelector('.absolute');
        if (badge) badge.remove();
        toggleBtn.classList.remove('animate-pulse');
        
        // Show chat window with animation
        chatWindow.classList.remove('translate-y-8', 'opacity-0', 'pointer-events-none');
        chatWindow.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
        
        // Change toggle button icon
        const icon = toggleBtn.querySelector('[data-lucide]');
        icon.setAttribute('data-lucide', 'x');
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
        // Show welcome message if first time opening
        if (this.conversation.length === 0) {
            this.showWelcomeMessage();
        }
        
        // Focus on input
        setTimeout(() => {
            document.getElementById('chat-input').focus();
        }, 300);
        
        localStorage.setItem('chatbot_dismissed', 'false');
    }

    closeChat() {
        this.isOpen = false;
        const chatWindow = document.getElementById('chat-window');
        const toggleBtn = document.getElementById('chat-toggle');
        
        // Hide chat window with animation
        chatWindow.classList.add('translate-y-8', 'opacity-0', 'pointer-events-none');
        chatWindow.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
        
        // Change toggle button icon back
        const icon = toggleBtn.querySelector('[data-lucide]');
        icon.setAttribute('data-lucide', 'message-circle');
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
        localStorage.setItem('chatbot_dismissed', 'true');
    }

    showWelcomeMessage() {
        const welcomeMessage = {
            role: 'assistant',
            content: `👋 Hi! I'm Joe's Digital Twin. If you're involved in revenue activity (AE, SDR/BDR, partnerships, founder-led sales, sales engineering, customer success expansion)—you're in the right place.

You can ask me about:
• Workflow / use case fit & ROI
• Source-grounded architecture
• Pricing & engagement model
• Reducing unreliable AI outputs

Where should we start?`
        };

        this.addMessage(welcomeMessage);
        this.conversation.push(welcomeMessage);
    }

    addMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        
        const isUser = message.role === 'user';
        messageDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'}`;
        
        const bubbleClass = isUser 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
            : 'bg-slate-800 text-slate-100 border border-slate-700';
        
        messageDiv.innerHTML = `
            <div class="max-w-[80%] ${bubbleClass} rounded-2xl px-4 py-3 text-sm">
                ${this.formatMessage(message.content)}
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    formatMessage(content) {
        // Convert markdown-style formatting to HTML (but leave existing anchors intact)
        content = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/•/g, '•')
            .replace(/\n/g, '<br>');

        // If content already includes an anchor tag, skip auto-linking to avoid breaking markup
        if (/<a\s[^>]*>/i.test(content)) {
            return content;
        }

        // Safer URL detection: stop at quotes, angle brackets, or parentheses
        const urlRegex = /(https?:\/\/[^\s<>")']+)/g;
        return content.replace(urlRegex, (raw) => {
            const cleaned = raw.replace(/["'>)]+$/,'');
            // If it's any calendar.app.google link and we have a validated canonical link, always render canonical button
            if (/calendar\.app\.google/i.test(cleaned)) {
                if (this.validBookingLink) {
                    return `<a href="${this.validBookingLink}" target="_blank" class="inline-block mt-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity no-underline">📅 Schedule a Consultation</a>`;
                }
                return `<span class="text-slate-400">(Booking link unavailable, please ask me directly.)</span>`;
            }
            return `<a href="${cleaned}" target="_blank" class="text-blue-400 hover:underline">${cleaned}</a>`;
        });
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message to conversation
        const userMessage = { role: 'user', content: message };
        this.addMessage(userMessage);
        this.conversation.push(userMessage);
        
        // Clear input and show typing indicator
        input.value = '';
        this.showTyping();
        
        try {
            // Send to AI backend
            const response = await this.callAI(message);
            this.hideTyping();
            
            // Add AI response
            const aiMessage = { role: 'assistant', content: response.message };
            this.addMessage(aiMessage);
            this.conversation.push(aiMessage);
            
            // Handle special actions (email collection, booking promotion, etc.)
            this.handleSpecialActions(response);
            
        } catch (error) {
            console.error('AI Chat Error:', error);
            this.hideTyping();
            
            const errorMessage = {
                role: 'assistant', 
                content: 'I apologize, but I\'m experiencing a temporary issue. Please try again in a moment, or feel free to contact me directly at joseph@anconsulting.us.'
            };
            this.addMessage(errorMessage);
        }
    }

    showTyping() {
        document.getElementById('typing-indicator').classList.remove('hidden');
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
        document.getElementById('typing-indicator').classList.add('hidden');
    }

    async callAI(message) {
        // This will call our Netlify function
        const response = await fetch('/.netlify/functions/chat-ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                conversation: this.conversation,
                clientData: { ...this.clientData, sessionStart: this.sessionStart, visitorId: this.visitorId },
                sessionId: this.sessionId
            })
        });

        if (!response.ok) {
            throw new Error('AI service unavailable');
        }

        return await response.json();
    }

    handleSpecialActions(response) {
        // Handle email collection
        if (response.collectEmail && !this.hasCollectedEmail) {
            this.requestEmailCollection();
        }
        // One-time acknowledgement if email just captured
        if (response.emailCaptured) {
            this.hasCollectedEmail = true; // ensure we don't re-ask
            this.sendAnalyticsEvent('email_captured');
            const confirm = {
                role: 'assistant',
                content: "Great—I've got your email. Want a quick architecture outline or should we scope impact first?"
            };
            this.addMessage(confirm);
            this.conversation.push(confirm);
        }
        
        // Handle booking promotion
        if (response.promoteBooking && !this.hasShownBookingPromotion) {
            // Don't show if AI response already included a booking link button
            const lastAi = this.conversation.filter(m => m.role === 'assistant').slice(-1)[0];
            if (lastAi && /calendar\.app\.google/.test(lastAi.content)) {
                // Already present, mark as shown logically
                this.hasShownBookingPromotion = true;
            } else {
                this.showBookingPromotion();
                this.hasShownBookingPromotion = true;
                // Fire impression analytics
                this.sendAnalyticsEvent('booking_promotion_impression');
                // highlight CTA after it renders
                setTimeout(() => this.highlightBookingCTA(), 2500);
            }
        }
        
        // Update client data
        if (response.clientData) {
            this.clientData = { ...this.clientData, ...response.clientData };
        }
    }

    requestEmailCollection() {
        this.hasCollectedEmail = true; // Prevent asking for email again
        setTimeout(() => {
            const emailMessage = {
                role: 'assistant',
                content: `So I can have Joe reach out, could you please provide your email address?`
            };
            this.addMessage(emailMessage);
            this.conversation.push(emailMessage);
        }, 1000);
    }

    showBookingPromotion() {
    setTimeout(() => {
            const bookingMessage = {
                role: 'assistant',
        content: `Based on our conversation, it sounds like a consultation with me would be valuable for your specific needs. 

**Ready to get started?** Let's connect for a strategic discussion about implementing Source-Grounded AI in your organization.

${this.validBookingLink ? `<a href="${this.validBookingLink}" target="_blank" class="inline-block mt-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">📅 Schedule Your Consultation ($125/hr)</a>` : '<span class="text-slate-400">(Booking link currently unavailable—ask me and I can provide it.)</span>'}

Would you like to discuss any other aspects of my AI implementation process first?`
            };
            this.addMessage(bookingMessage);
            this.conversation.push(bookingMessage);
        }, 1500);
    }

    highlightBookingCTA() {
        if (this.hasHighlightedBooking) return;
        const messagesContainer = document.getElementById('chat-messages');
        const link = messagesContainer.querySelector('a[href*="calendar.app.google"]');
        if (!link) return;
        this.hasHighlightedBooking = true;
        link.classList.add('booking-highlight');
        // Remove the pulse after 6 seconds to avoid distraction
        setTimeout(() => link.classList.remove('booking-highlight'), 6000);
    }

    sendAnalyticsEvent(eventType) {
        try {
            fetch('/.netlify/functions/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: eventType,
                    sessionId: this.sessionId,
                    timestamp: new Date().toISOString()
                })
            }).catch(() => {});
        } catch (_) {}
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're not on the gem-membership page (hidden page)
    if (!window.location.pathname.includes('gem-membership')) {
        window.aiChatbot = new AIChatbot();
        // Delegate click tracking for booking link
        document.body.addEventListener('click', (e) => {
            const target = e.target.closest('a');
            if (!target) return;
            if (target.href && target.href.includes('calendar.app.google')) {
                if (window.aiChatbot) {
                    window.aiChatbot.sendAnalyticsEvent('booking_promotion_click');
                }
            }
        });
    }
});