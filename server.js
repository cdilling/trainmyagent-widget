import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { resolve, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
};

const server = createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle API endpoint
  if (req.url === '/api/get-response' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { userNeed, need } = JSON.parse(body);
        const userInput = userNeed || need;

        // Create dynamic system prompt
        const systemPrompt = `You're having a friendly conversation with a potential customer about AI automation. They just said they need help with: "${userInput}"

Create a warm, personalized response that:
1. Uses their EXACT words/phrase in your response
2. Shows genuine enthusiasm about solving their specific problem
3. Ends with suggesting a conversation

Format: 2-3 sentences max. Be conversational and human.

Examples of good responses:
- User: 'process invoices' → 'Processing invoices faster? Yes! We can definitely help you with that. Let's chat about your specific invoice workflow and how we can automate it.'
- User: 'onboard new employees' → 'Onboarding new employees smoothly is so important! We've built several agents that handle this beautifully. Let's schedule 15 minutes to discuss your specific onboarding needs.'

Remember: Always reference their EXACT input to show you're listening.`;

        // Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userInput }
            ],
            temperature: 0.7,
            max_tokens: 100,
          }),
        });

        const data = await response.json();
        
        if (response.ok) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: data.choices[0].message.content }));
        } else {
          // Fallback response
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            message: "We can definitely help you with that! Let's schedule a time to discuss your specific needs and how we can automate them." 
          }));
        }
      } catch (error) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          message: "That sounds like a perfect use case for automation! I'd love to discuss your specific needs and show you how we can help." 
        }));
      }
    });
    return;
  }

  // Serve static files
  let filePath = req.url === '/' ? '/test.html' : req.url;
  filePath = resolve(__dirname, '.' + filePath);

  try {
    const content = await readFile(filePath);
    const ext = extname(filePath);
    const contentType = mimeTypes[ext] || 'text/plain';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (error) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - File Not Found</h1>');
  }
});

server.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`\n📋 Test pages:`);
  console.log(`   - Basic demo: http://localhost:${PORT}/test.html`);
  console.log(`   - Test harness: http://localhost:${PORT}/test-harness.html`);
  console.log(`\n✅ API endpoint: http://localhost:${PORT}/api/get-response`);
  console.log(`\nPress Ctrl+C to stop the server\n`);
});