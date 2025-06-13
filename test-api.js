// Test OpenAI API directly
import dotenv from 'dotenv';
dotenv.config();

async function testAPI() {
  const apiKey = process.env.OPENAI_API_KEY;
  console.log('API Key found:', apiKey ? 'Yes' : 'No');
  console.log('Key prefix:', apiKey?.substring(0, 7) + '...');

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'Say "API is working!" in exactly 3 words.'
          },
          {
            role: 'user',
            content: 'test'
          }
        ],
        temperature: 0.7,
        max_tokens: 10,
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ API Response:', data.choices[0].message.content);
    } else {
      console.log('❌ API Error:', data.error);
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
}

testAPI();