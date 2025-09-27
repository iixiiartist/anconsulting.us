// Netlify Function: AI Chatbot Backend
// Handles Gemini AI conversations and email notifications

const { GoogleGenerativeAI } = require('@google/generative-ai');
let supabaseClient = null;
let supabaseCanWrite = false; // only true when using service role key
try {
    const { createClient } = require('@supabase/supabase-js');
    
    // Detect Supabase URL from various possible Netlify extension env var names
    const supabaseUrl = process.env.SUPABASE_URL || 
                       process.env.SUPABASE_DATABASE_URL || 
                       process.env.NEXT_PUBLIC_SUPABASE_URL || 
                       process.env.SUPABASE_PROJECT_URL ||
                       process.env.VITE_SUPABASE_URL;
    
    console.log('Supabase URL detection:', supabaseUrl ? 'found' : 'missing');
    
    if (supabaseUrl) {
        // Accept multiple possible env var patterns for flexibility:
        // Preferred explicit: SUPABASE_SERVICE_ROLE_KEY (write) / SUPABASE_ANON_KEY (read)
        // Netlify extension alternatives: NEXT_PUBLIC_SUPABASE_ANON_KEY
        // Fallback legacy / user-provided single key: SUPABASE_KEY (treated as service if it matches service pattern)
        const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY || null;
        const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;
        const genericKey = process.env.SUPABASE_KEY || null; // fallback

        // Heuristic: Supabase service role keys contain 'service_role'
        const genericLooksService = genericKey && /service_role/.test(genericKey);

        console.log('Supabase connection diagnostic:', {
            url: supabaseUrl ? 'found' : 'missing',
            serviceKey: svcKey ? 'present' : 'missing',
            anonKey: anonKey ? 'present' : 'missing',
            genericKey: genericKey ? 'present' : 'missing'
        });

        if (svcKey) {
            supabaseClient = createClient(
                supabaseUrl,
                svcKey,
                { auth: { autoRefreshToken: false, persistSession: false } }
            );
            supabaseCanWrite = true;
            console.log('✓ Supabase initialized with service role key (write enabled)');
        } else if (genericKey && genericLooksService) {
            supabaseClient = createClient(
                supabaseUrl,
                genericKey,
                { auth: { autoRefreshToken: false, persistSession: false } }
            );
            supabaseCanWrite = true;
            console.log('✓ Supabase initialized with SUPABASE_KEY (detected service role; write enabled)');
        } else if (anonKey) {
            supabaseClient = createClient(
                supabaseUrl,
                anonKey,
                { auth: { autoRefreshToken: false, persistSession: false } }
            );
            console.log('⚠ Supabase initialized with anon key (read-only mode)');
        } else if (genericKey) {
            // treat generic key as anon if no service markers
            supabaseClient = createClient(
                supabaseUrl,
                genericKey,
                { auth: { autoRefreshToken: false, persistSession: false } }
            );
            console.log('⚠ Supabase initialized with SUPABASE_KEY (assumed anon; read-only mode)');
        }
        if (supabaseClient) {
            console.log(`Supabase diagnostic: writeCapability=${supabaseCanWrite} keyPreferenceOrder=${svcKey ? 'service_role' : genericKey && genericLooksService ? 'generic_service_role' : anonKey ? 'anon' : genericKey ? 'generic_anon' : 'none'}`);
        } else {
            console.log('Supabase diagnostic: client not initialized (missing or invalid env vars)');
        }
    }
} catch (e) {
    console.warn('Supabase client not initialized:', e.message);
}

// --- ROLLBACK NOTE ---
// Retrieval-Augmented Generation (RAG) and adaptive preference logic removed for simplicity.
// If future reactivation is desired, previous implementation searched recent assistant
// messages and scored relevance. This section intentionally left minimal.

// Email service (using a service like Resend, SendGrid, or Netlify Forms)
async function sendEmailNotification(conversationSummary, clientData, sessionId) {
    // This will be implemented based on your preferred email service
    // For now, using Netlify Forms as a simple option
    
    const emailData = {
        'form-name': 'chatbot-conversation',
        'session-id': sessionId,
        'client-name': clientData.name || 'Anonymous',
        'client-email': clientData.email || 'Not provided',
        'client-company': clientData.company || 'Not provided',
        'conversation-summary': conversationSummary,
        'timestamp': new Date().toISOString()
    };

    // Send to Netlify Forms for email notification
    try {
        const formResponse = await fetch('https://anconsulting.us/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(emailData).toString()
        });
        return formResponse.ok;
    } catch (error) {
        console.error('Email notification failed:', error);
        return false;
    }
}

// Booking link centralized
const BOOKING_LINK = 'https://calendar.app.google/BndKeYEmGrRQDGXr6';

// Validate booking link format (single path segment alphanumeric)
function isValidBookingLink(url) {
    return /^https:\/\/calendar\.app\.google\/[A-Za-z0-9]+$/.test(url);
}

const SAFE_BOOKING_LINK = isValidBookingLink(BOOKING_LINK) ? BOOKING_LINK : null;

// Knowledge base for Joe's Digital Twin
const COMPANY_KNOWLEDGE = `
COMPANY: anconsulting.us - Professional Source-Grounded AI Workflow Implementation

MY SERVICES:
- Source-Grounded AI Workflow Implementation
- General AI Strategy Consulting

*Self-correction: The user previously mentioned "Custom Gemini Agent Development", "AgentSpace Multi-Agent System Implementation", and "Enterprise AI Integration Services". I will keep these as more detailed offerings under the two main categories.*

DETAILED OFFERINGS:
- Source-Grounded AI Workflows: This is my core methodology. It significantly reduces unreliable AI outputs by requiring all AI responses to be backed by specific, verifiable documents or data sources. Every output can be traced back to your proprietary data, improving accuracy and auditability.
- General AI Strategy: I help teams understand and implement AI effectively.
- Custom Gemini Agent Development: I build custom AI agents tailored to your business needs.
- AgentSpace Multi-Agent Systems: For complex workflows, I can implement systems where multiple AI agents collaborate.
- Enterprise AI Integration: I help integrate these AI systems into your existing enterprise software.

MY TARGET CLIENTS:
I work with professional sales teams in any industry and broader B2B organizations that need verifiable, auditable AI outputs. While government organizations aren't my typical direct client, the core need for traceable, source‑grounded AI is often critical in those environments—especially for business development and strategic partnership teams where trust and verifiable information are paramount. If you're engaged in any sales or revenue-facing motion—AE, SDR/BDR, sales engineering, partnerships, channel, founder-led sales, customer success with expansion goals—you’re in scope. I adapt the workflow to your cycle length, compliance needs, and data maturity. My Source-Grounded AI methodology is designed specifically for accuracy, auditability, and traceability, making it valuable anywhere rigor, compliance, or high-stakes decisions matter.

USE CASES (Sample Library of 10):
1. Auditable Sales Pipeline Intelligence
2. Source-Grounded Prospect Research  
3. Verifiable Sales Proposal Generation
4. Deal Risk Assessment with Citations
5. Competitive Intelligence Analysis
6. Customer Communication Analysis
7. Sales Performance Optimization
8. Revenue Forecasting with Source Verification
9. Lead Qualification Automation
10. Sales Training Content Generation

PRICING: My professional consulting rate is $125/hour.
BOOKING: You can book a call with me here: ${SAFE_BOOKING_LINK || 'Please ask me for my current booking link.'}

MY VALUE PROPOSITIONS:
- I help significantly reduce AI unreliability through source verification.
- My clients typically see a 15-25% increase in deal velocity.
- They often improve win rates by 10-20%.
- I've helped 20-30% more reps hit their quota.
- My systems lead to 30-40% faster time to productivity for new hires.

MY DIFFERENTIATORS:
- My source-grounded methodology is different from standard AI.
- I provide professional implementation, not just DIY tools.
- I have an industry-specific focus on Professional Sales.
- You get my expert consulting, not a software subscription.
- The result is verifiable, auditable AI outputs.
- I ensure enterprise-grade security and compliance.
`;

// Fallback response generator when Gemini API is not available
function generateFallbackResponse(message, conversation, clientData) {
    const lowerMessage = message.toLowerCase();
    const ambiguousEnterpriseRegex = /(enterprise\s+data\s+sales|data\s+sales|selling\s+enterprise\s+data)/i;

    // ML model building redirection to LabelX.ai
    const mlModelBuildingRegex = /(build.*model|train.*model|ml.*model|machine learning model|custom.*model|model.*training|data.*annotation|data.*curation|digital twin.*manufacturing|computer vision|model.*development|dataset|labeling|annotation.*service)/i;
    if (mlModelBuildingRegex.test(lowerMessage)) {
        return "For building custom AI/ML models, data curation, annotation, and generative AI services, you'll want to connect with my colleague who specializes in fully managed, high-quality data services. Reach out to joe@labelx.ai—they handle the technical model development side while I focus on implementing existing AI into business workflows. They can provide exactly what you need for custom model development.";
    }

    // Email provided
    const emailMatch = lowerMessage.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch) {
        return "Great—I’ve got your email. What specific outcome are you hoping AI helps you achieve next?";
    }
    
    // Initial Greeting (if conversation is empty)
    if (conversation.length === 0) {
        return "👋 Hey, I'm Joe. This is my Digital Twin. Ask me about sales workflow automation, source‑grounded AI, ROI, pricing—or just describe your current bottleneck. Where should we start?";
    }

    // Simple greetings
    if (['hello', 'hi', 'hey'].includes(lowerMessage)) {
        return "Hi there—what part of your sales or AI process are you trying to improve?";
    }
    
    // Pricing inquiries
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
        return "My consulting rate is $125/hr. Happy to quote scope once I know your data sources + desired workflow. Want to outline those?";
    }
    
    // Services inquiries
    if (lowerMessage.includes('service') || lowerMessage.includes('what do you do') || lowerMessage.includes('help')) {
        return "I implement source‑grounded AI workflows (so outputs are verifiable) and advise on AI strategy. Sales teams use this to speed proposals, qualify pipeline, and surface risk earlier. Which of those feels most relevant?";
    }
    
    // Use cases
    if (lowerMessage.includes('use case') || lowerMessage.includes('example') || lowerMessage.includes('how it works')) {
        return "Popular patterns: 1) Source‑grounded proposal generation, 2) Prospect research briefs with citations, 3) Deal risk scoring tied to CRM evidence. Which lane matches what you're exploring?";
    }

    // Specific Use Case: Proposal Generation
    if (lowerMessage.includes('proposal')) {
        return "Proposal acceleration: connect CRM + product spec + prior proposal corpus; AI drafts with inline source trace. Teams usually cut turnaround time ~50%. Want the architecture outline?";
    }

    // Specific Use Case: Sales Intelligence
    if (lowerMessage.includes('pipeline') || lowerMessage.includes('intelligence')) {
        return "Pipeline intelligence: unify CRM events + call notes + email threads; model surfaces deal risk drivers with citations (e.g. missing champion, stalled next step). Want a quick example output format?";
    }

    // Specific Use Case: Prospect Research
    if (lowerMessage.includes('research') || lowerMessage.includes('prospect')) {
        return "Prospect research workflow: ingest firmographics + news + CRM notes -> generate briefing sheet w/ source pointers. How many minutes per rep per prospect today?";
    }

    // Ambiguity clarification inside fallback
    if (!clientData?._clarifiedEnterpriseDataSales && ambiguousEnterpriseRegex.test(message)) {
        return `Quick clarification so I don't waste your time—by "enterprise data sales" do you mean:
1) Internal sales teams in a large org using AI over big proprietary data, or
2) You (or your company) selling enterprise data / data products?

Reply with 1 or 2 and I'll tailor next steps.`;
    }
    
    // Contact/booking
    if (lowerMessage.includes('contact') || lowerMessage.includes('call') || lowerMessage.includes('meeting') || lowerMessage.includes('consultation')) {
    return `Happy to connect. I can send over architecture ideas or we can jump straight to a working session. You can schedule here: ${SAFE_BOOKING_LINK || 'ask me for the booking link and I will send it.'} — also, can I grab your email so I can follow up with a quick summary?`;
    }
    
    // Default response
    const lastBotResponse = conversation.filter(m => m.role === 'assistant').pop()?.content;
    const defaultResponses = [
        "Give me a bit more context—what friction are you seeing right now: proposal speed, pipeline visibility, or rep onboarding?",
        "If you had a magic button for AI this quarter, would it fix research time, forecast accuracy, or content generation?",
        "Helpful—next: which systems hold the data you’d want the AI to ground itself on (CRM, call transcripts, product docs)?"
    ];

    // Filter out the last response if it was a default one, to avoid repetition
    const availableResponses = defaultResponses.filter(r => r !== lastBotResponse);
    
    return availableResponses[Math.floor(Math.random() * availableResponses.length)];
}

// Sanitize history to ensure strict user/model turn-taking
function sanitizeHistory(history) {
    if (history.length === 0) {
        return [];
    }

    const sanitized = [];
    let lastRole = null;

    for (const message of history) {
        if (message.role === lastRole) {
            // Merge content with the last message
            const lastMessage = sanitized[sanitized.length - 1];
            lastMessage.parts[0].text += `\\n${message.parts[0].text}`;
        } else {
            // Add new message
            sanitized.push(message);
            lastRole = message.role;
        }
    }
    return sanitized;
}

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // --- DIAGNOSTIC LOGGING ---
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.length > 0) {
        console.log(`DIAGNOSTIC: GEMINI_API_KEY is present. Length: ${apiKey.length}`);
    } else {
        console.log('DIAGNOSTIC: GEMINI_API_KEY is MISSING or empty.');
    }
    // --------------------------

    try {
        const { message, conversation, clientData, sessionId } = JSON.parse(event.body);
        const visitorId = clientData && clientData.visitorId ? clientData.visitorId : null;

        // --- Load prior context from Supabase (non-blocking) ---
        // This logic is disabled to prevent "false memory" issues on new sessions.
        // The conversation history from the client is now the single source of truth.
        let priorRole = null;
        // let recentMemory = [];
        
        // Check if Gemini API key is available
        const hasGeminiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 0;
        
        let aiResponse;
        
        if (hasGeminiKey) {
            try {
                const systemPrompt = `You are Joe (founder of anconsulting.us). You speak in a natural, concise, confident consulting tone (first person only). Answer directly using only the knowledge base below. Do not be pushy or overly salesy. Only offer the booking link if the user explicitly asks to schedule / book / call / meeting / get started.

AMBIGUITY: If a user says something like "enterprise data sales" (ambiguous), ask a single clarification with two numbered interpretations before giving solutions. Do not include booking or pricing in that clarification turn.

REDIRECTION: If the user asks about building/training custom AI/ML models, data curation/annotation, computer vision, or similar model development, redirect them to joe@labelx.ai with the provided wording (you focus on implementing existing AI into workflows).

BOOKING: Only share the booking link when explicitly asked to schedule. Otherwise focus on understanding their workflow friction and desired outcomes.

KNOWLEDGE BASE:
${COMPANY_KNOWLEDGE}

Keep answers to 1–2 short paragraphs (optionally a compact bullet list if it clearly improves clarity). Avoid filler like "Certainly" or repeating their question. If unsure, say so and offer a consultation.`;

                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({
                    model: 'gemini-2.5-flash', // Use the requested model
                    generationConfig: {
                        temperature: 0.7,
                        topP: 0.8,
                        topK: 40,
                        maxOutputTokens: 1000,
                    }
                });

                // Build and sanitize the full chat history
                const fullHistory = [
                    {
                        role: "user",
                        parts: [{ text: systemPrompt }],
                    },
                    {
                        role: "model",
                        parts: [{ text: "Understood. I am ready to assist." }],
                    },
                    ...conversation.map(msg => ({
                        role: msg.role === 'user' ? 'user' : 'model',
                        parts: [{ text: msg.content }]
                    }))
                ];

                // Prior memory enrichment disabled to prevent false memories.
                // if (recentMemory.length > 0) {
                //     fullHistory.push({
                //         role: 'user',
                //         parts: [{ text: `Context Memory (previous session excerpts):\n${recentMemory.join('\n')}` }]
                //     });
                // }

                const sanitizedHistory = sanitizeHistory(fullHistory);

                const chat = model.startChat({ history: sanitizedHistory });

                const result = await chat.sendMessage(message);
                const response = await result.response;
                aiResponse = response.text();

            } catch (geminiError) {
                console.error('Gemini API Error:', geminiError);
                aiResponse = generateFallbackResponse(message, conversation, clientData);
            }
        } else {
            // Fallback response system when API key is not available
            aiResponse = generateFallbackResponse(message, conversation, clientData);
        }

        // --- Email Extraction (from latest user message) ---
        const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
        let extractedEmail = null;
        if (message && emailRegex.test(message)) {
            extractedEmail = message.match(emailRegex)[1];
        }

        // Ambiguity / clarification interception (before special actions)
        let clarificationTriggered = false;
        const ambiguousEnterpriseRegex = /(enterprise\s+data\s+sales|data\s+sales|selling\s+enterprise\s+data)/i;
        if (!clientData?._clarifiedEnterpriseDataSales && ambiguousEnterpriseRegex.test(message)) {
            aiResponse = `Just to make sure I point you in the most useful direction—when you say "enterprise data sales" do you mean:
1) Internal sales / revenue teams at an enterprise that need AI over large proprietary data to sell better, or
2) You (or your company) selling enterprise data / data products / data-driven solutions to customers?

Reply with 1 or 2 (or clarify your own phrasing) and I’ll tailor the strategy.`;
            clarificationTriggered = true;
        }

        // --- Sequential Special Actions ---
        let collectEmail = false;
        let promoteBooking = false;
        let roleAcknowledgement = null;

        // --- Role Detection (one-time) ---
        const roleKeywords = [
            { key: 'account executive', tag: 'AE' },
            { key: 'ae', tag: 'AE' },
            { key: 'sdr', tag: 'SDR/BDR' },
            { key: 'bdr', tag: 'SDR/BDR' },
            { key: 'business development', tag: 'Business Development' },
            { key: 'partnership', tag: 'Partnerships' },
            { key: 'channel', tag: 'Channel' },
            { key: 'sales engineer', tag: 'Sales Engineering' },
            { key: 'sales engineering', tag: 'Sales Engineering' },
            { key: 'founder', tag: 'Founder-Led Sales' },
            { key: 'customer success', tag: 'Customer Success' },
            { key: 'csm', tag: 'Customer Success' }
        ];
        if (!clientData?._roleAcknowledged) {
            const lowerMsg = message.toLowerCase();
            const match = roleKeywords.find(r => lowerMsg.includes(r.key));
            if (match) {
                roleAcknowledgement = `Got it—${match.tag} context noted. I’ll frame examples toward what typically accelerates ${match.tag === 'Founder-Led Sales' ? 'early pipeline validation and motion repeatability' : match.tag.toLowerCase() + ' impact'} (grounded research, faster proposals, and risk surfacing).`;
                // Append to AI response if safe
                if (typeof aiResponse === 'string') {
                    aiResponse += (aiResponse.endsWith('\n') ? '' : '\n\n') + roleAcknowledgement;
                }
                // Fire-and-forget roles_ledger update (normalized role = match.tag, raw_phrase = matched substring)
                (async () => {
                    if (!supabaseClient || !supabaseCanWrite) return;
                    try {
                        // raw phrase capture: find the first occurrence snippet (up to 40 chars context)
                        const idx = lowerMsg.indexOf(match.key);
                        let rawPhrase = match.key;
                        if (idx >= 0) {
                            rawPhrase = message.substring(idx, idx + match.key.length);
                        }
                        // Attempt update-if-exists pattern: try insert, on conflict increment occurrences & update last_seen
                        const { error: rlErr } = await supabaseClient.from('roles_ledger').upsert({
                            normalized_role: match.tag,
                            raw_phrase: rawPhrase,
                            occurrences: 1,
                            last_seen: new Date().toISOString()
                        }, { onConflict: 'raw_phrase' });
                        if (rlErr && !/duplicate key/i.test(rlErr.message)) {
                            console.warn('roles_ledger upsert error:', rlErr.message);
                        } else if (!rlErr) {
                            // If it's an existing row we need to increment occurrences manually (Supabase upsert won't auto increment).
                            await supabaseClient.rpc('increment_role_occurrence', { p_raw_phrase: rawPhrase }).catch(()=>{});
                        }
                    } catch (ledgerErr) {
                        console.warn('roles_ledger update failed:', ledgerErr.message);
                    }
                })();
            }
        }

        // 1. Prioritize Email Collection (unchanged logic except moved below intent classification)
        // New: classify intent first
        function classifyIntent(raw) {
            const txt = (raw || '').toLowerCase();
            const intent = {
                pricing: /(pricing|cost|how much|rate|hourly|fee)/.test(txt),
                start: /(work with you|get started|engage|engagement|begin|start working)/.test(txt),
                schedule: /(schedule|book|booking|calendar|call|meeting)/.test(txt),
                valueProbe: /(roi|outcome|results|impact)/.test(txt),
                process: /(process|how you work|workflow|implementation model)/.test(txt)
            };
            intent.anyExplicit = intent.pricing || intent.start || intent.schedule;
            return intent;
        }
        const intent = classifyIntent(message);

        // Count user messages including current
        const userMessageCount = conversation.filter(m => m.role === 'user').length + 1;
        const timeSinceStart = clientData && clientData.sessionStart ? Date.now() - Number(clientData.sessionStart) : 0;
        const timeOk = timeSinceStart >= 30000; // slightly longer guard (30s)
        const alreadyPromoted = !!clientData?._promotedBooking;
        const aiAlreadyHasLink = typeof aiResponse === 'string' && aiResponse.includes(SAFE_BOOKING_LINK || 'calendar.app.google');

        // Email collection gate (only after value delivered: at least 2 AI responses OR explicit schedule intent)
        const aiResponseCount = conversation.filter(m => m.role === 'assistant').length;
        if (!clarificationTriggered && !clientData.email && aiResponseCount >= 2 && userMessageCount >= 3 && !intent.pricing && !intent.schedule) {
            // Email collection logic is currently disabled to feel less transactional.
            // collectEmail = true;
        }

        // Booking promotion refined: only if explicit intent OR pricing AND minimum trust signals
        const trustReady = aiResponseCount >= 2 && userMessageCount >= 3 && timeOk;
        if (!clarificationTriggered && !collectEmail && !alreadyPromoted && !aiAlreadyHasLink) {
            if (intent.anyExplicit && trustReady) {
                promoteBooking = true;
            }
        }

        // Progressive discovery injection if user is casual and no intent yet after a few turns
        if (!promoteBooking && !collectEmail && !clarificationTriggered && !intent.anyExplicit && userMessageCount === 2) {
            // Replace AI response tail with a light directional prompt if response is very short or generic
            if (typeof aiResponse === 'string' && aiResponse.length < 180) {
                aiResponse += (aiResponse.endsWith('\n') ? '' : '\n\n') + "Quick direction check—want to focus on workflow mapping, data grounding, or ROI impact first?";
            }
        }

        let updatedClientData = { ...clientData };
        let emailCaptured = false;
        if (extractedEmail && !updatedClientData.email) {
            updatedClientData.email = extractedEmail;
            emailCaptured = true;
        }
        // Suppress redundant email request in AI response if we already have email
        if (updatedClientData.email && typeof aiResponse === 'string') {
            const emailPromptPatterns = [
                /provide your email/i,
                /can i get your email/i,
                /what's your email/i
            ];
            if (emailPromptPatterns.some(r => r.test(aiResponse))) {
                aiResponse = aiResponse.replace(/.*(provide your email|can i get your email|what's your email).*?/gi, '').trim();
                if (aiResponse.length === 0) {
                    aiResponse = "Got it. Want me to map a quick next-step outline for you?";
                }
            }
        }

        if (clarificationTriggered) {
            updatedClientData._clarifiedEnterpriseDataSales = true;
        }
        if (roleAcknowledgement) {
            updatedClientData._roleAcknowledged = true;
        } else if (priorRole && !updatedClientData._roleAcknowledged) {
            // Silently note prior detected role to avoid re-detection noise
            updatedClientData._roleAcknowledged = true;
        }
        if (promoteBooking) {
            updatedClientData._promotedBooking = true; // mark so we don't repeat
        }

        // Send email notification if conversation is substantial
        if (conversation.length >= 8 || (clientData.email && conversation.length >= 4)) {
            try {
                const summary = `
Session ID: ${sessionId}
Client: ${updatedClientData.name || 'Anonymous'} (${updatedClientData.email || 'No email'})
Company: ${updatedClientData.company || 'Not provided'}
Messages: ${conversation.length + 1}

Latest Exchange:
User: ${message}
AI: ${aiResponse}

Previous Context:
${conversation.slice(-6).map(msg => `${msg.role}: ${msg.content}`).join('\\n')}
                `.trim();

                await sendEmailNotification(summary, updatedClientData, sessionId);
            } catch (emailError) {
                console.error('Email notification error:', emailError);
                // Don't fail the entire request if email fails
            }
        }

        // --- Persist conversation + message asynchronously (fire & forget) ---
        (async () => {
            if (!supabaseClient || !visitorId || !supabaseCanWrite) {
                // Extended diagnostics to help verify why persistence may be skipped
                try {
                    console.log('[Supabase Persistence] Skipped write', {
                        hasClient: !!supabaseClient,
                        hasVisitorId: !!visitorId,
                        canWrite: supabaseCanWrite,
                        reason: !supabaseClient ? 'no_client' : !visitorId ? 'no_visitor_id' : !supabaseCanWrite ? 'read_only_mode' : 'unknown'
                    });
                } catch (_) {}
                return; // skip writes in read-only or missing context
            }
            try {
                // --- Visitor upsert (lightweight heartbeat) ---
                try {
                    const { error: visErr } = await supabaseClient
                        .from('visitors')
                        .upsert({
                            visitor_id: visitorId,
                            last_seen: new Date().toISOString()
                        }, { onConflict: 'visitor_id' });
                    if (visErr) {
                        console.warn('[Supabase Persistence] visitors upsert error:', visErr.message);
                    }
                } catch (vErr) {
                    console.warn('[Supabase Persistence] visitors upsert exception:', vErr.message);
                }

                // (Preferences removed in rollback) – single upsert only already executed above.

                // Upsert conversation by session_id
                const convoPayload = {
                    session_id: sessionId,
                    visitor_id: visitorId,
                    email: updatedClientData.email || null,
                    role_detected: updatedClientData._roleAcknowledged && roleAcknowledgement ? (roleAcknowledgement.match(/Got it—(.*) context/) || [null, null])[1] : (priorRole || null),
                    last_message_at: new Date().toISOString()
                };
                const { data: existing } = await supabaseClient
                    .from('conversations')
                    .select('id')
                    .eq('session_id', sessionId)
                    .limit(1);
                let convoId = existing && existing.length ? existing[0].id : null;
                if (!convoId) {
                    const { data: inserted, error: insErr } = await supabaseClient
                        .from('conversations')
                        .insert(convoPayload)
                        .select('id')
                        .single();
                    if (insErr) throw insErr;
                    convoId = inserted.id;
                } else {
                    await supabaseClient.from('conversations').update(convoPayload).eq('id', convoId);
                }
                if (convoId) {
                    // Insert the latest user + AI messages
                    const rows = [];
                    rows.push({ conversation_id: convoId, role: 'user', content: message });
                    if (aiResponse) rows.push({ conversation_id: convoId, role: 'assistant', content: aiResponse });
                    const { error: msgErr } = await supabaseClient.from('messages').insert(rows);
                    if (msgErr) {
                        console.warn('[Supabase Persistence] messages insert error:', msgErr.message);
                    } else {
                        console.log('[Supabase Persistence] wrote conversation/messages', { convoId, messageRows: rows.length });
                    }
                }
            } catch (persistErr) {
                console.warn('Supabase persist error:', persistErr.message);
            }
        })();

        // (Adaptive styling removed in rollback)

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: aiResponse,
                collectEmail,
                promoteBooking,
                emailCaptured,
                clientData: updatedClientData
            })
        };

    } catch (error) {
        console.error('Chatbot AI Error:', error);
        
        try {
            // If there's an error, provide a fallback response
            const requestData = JSON.parse(event.body || '{}');
            const fallbackResponse = generateFallbackResponse(
                requestData.message || 'Hello', 
                requestData.conversation || [], 
                requestData.clientData || {}
            );
            
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    message: fallbackResponse,
                    collectEmail: false,
                    promoteBooking: true,
                    clientData: requestData.clientData || {}
                })
            };
        } catch (fallbackError) {
            // Ultimate fallback if everything fails
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    message: `Hello! Thanks for your interest in anconsulting.us. I'm temporarily experiencing technical difficulties. Please contact us directly at joseph@anconsulting.us${SAFE_BOOKING_LINK ? ' or schedule a consultation at ' + SAFE_BOOKING_LINK : ''}`,
                    collectEmail: false,
                    promoteBooking: true,
                    clientData: {}
                })
            };
        }
    }
};