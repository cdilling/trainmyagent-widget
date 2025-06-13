export const config = {
  runtime: 'edge',
};

// Dynamic system prompt is now created per request

const FALLBACK_RESPONSES = [
  "That sounds like a real time drain! We've helped dozens of teams automate similar workflows. What's the most painful part of your current process?",
  "I totally get it - that's exactly why we built this. Just last week we saved a client 20 hours on something similar. How long have you been dealing with this?",
  "Oh wow, that's a perfect use case for automation! We've seen 10x speed improvements there. What tools are you currently using?",
];

export default async function handler(request) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    // Parse request body
    const body = await request.json();
    const userNeed = body.userNeed || body.need; // Support both field names

    if (!userNeed) {
      return new Response(
        JSON.stringify({ error: 'Missing userNeed in request body' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY not configured');
      // Return fallback response
      const fallbackMessage = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      return new Response(
        JSON.stringify({ message: fallbackMessage }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create dynamic system prompt
    const systemPrompt = `You're having a friendly conversation with a potential customer about AI automation. They just said they need help with: "${userNeed}"

Create a warm, personalized response that:
1. Uses their EXACT words/phrase in your response
2. Shows genuine enthusiasm about solving their specific problem
3. Ends with suggesting a conversation

Format: 2-3 sentences max. Be conversational and human.

Examples of good responses:
- User: 'process invoices' → 'Processing invoices faster? Yes! We can definitely help you with that. Let's chat about your specific invoice workflow and how we can automate it.'
- User: 'onboard new employees' → 'Onboarding new employees smoothly is so important! We've built several agents that handle this beautifully. Let's schedule 15 minutes to discuss your specific onboarding needs.'
- User: 'analyze sales data' → 'Analyzing sales data automatically? That's exactly what our agents excel at! Let's talk about what insights you're looking for and how we can help.'

Key phrases to incorporate naturally:
- 'We can definitely help you with [their exact need]'
- 'Let's discuss your specific [their topic]'
- 'exactly what we do'
- 'I'd love to show you how'

Remember: Always reference their EXACT input to show you're listening.`;

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userNeed
          }
        ],
        temperature: 0.7,
        max_tokens: 100,
      }),
    });

    if (!openaiResponse.ok) {
      console.error('OpenAI API error:', openaiResponse.status);
      // Return fallback response
      const fallbackMessage = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      return new Response(
        JSON.stringify({ message: fallbackMessage }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await openaiResponse.json();
    const message = data.choices?.[0]?.message?.content || FALLBACK_RESPONSES[0];

    return new Response(
      JSON.stringify({ message }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        }
      }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    
    // Return a fallback response on any error
    const fallbackMessage = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    return new Response(
      JSON.stringify({ message: fallbackMessage }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}