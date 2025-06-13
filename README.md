# Agent Widget

A beautiful, animated widget that captures user automation needs and connects them with AI agent solutions.

## Features

- 🎯 Animated placeholder text cycling through use cases
- 🎨 Dark glassmorphic design with smooth animations
- 🚀 Real-time API integration with OpenAI
- 💬 Conversational responses from "TrainMyAgent founder"
- 📱 Fully responsive and mobile-friendly
- 🔒 Self-contained - no external dependencies

## Quick Start

### 1. Basic HTML Integration

Add this to any HTML page:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Website</title>
</head>
<body>
    <!-- Your existing content -->
    
    <!-- Add the widget container -->
    <div id="agent-widget"></div>
    
    <!-- Load the widget script -->
    <script src="agent-widget.js"></script>
</body>
</html>
```

### 2. Configure Calendly URL

Update the Calendly URL in `agent-widget.js` (line ~364):

```javascript
chatBtn.addEventListener('click', () => {
  window.open('https://calendly.com/your-username/30min', '_blank');
});
```

### 3. Configure Email

Update the email address in `agent-widget.js` (line ~368):

```javascript
emailBtn.addEventListener('click', () => {
  window.location.href = 'mailto:hello@trainmyagent.com?subject=AI Agent Inquiry';
});
```

## Vercel Deployment

### 1. Environment Setup

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install Vercel CLI: `npm i -g vercel`
3. Get your OpenAI API key from [platform.openai.com](https://platform.openai.com)

### 2. Deploy to Vercel

```bash
# Clone or create your project
git init
git add .
git commit -m "Initial commit"

# Deploy to Vercel
vercel

# Add environment variable
vercel env add OPENAI_API_KEY
```

### 3. Environment Variables

In your Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add `OPENAI_API_KEY` with your OpenAI API key
3. Redeploy for changes to take effect

## Local Development

### 1. Install Dependencies

```bash
# No dependencies required for the widget itself!
# For local API testing, you'll need:
npm init -y
npm install dotenv
```

### 2. Run Locally

```bash
# Using Vercel CLI
vercel dev

# Or use any static server for the frontend
python -m http.server 8000
# or
npx serve
```

### 3. Test the API

```bash
# Test the API endpoint
curl -X POST http://localhost:3000/api/get-response \
  -H "Content-Type: application/json" \
  -d '{"userNeed": "automate invoice processing"}'
```

## Widget Configuration

### Custom Styling

The widget uses CSS variables that you can override:

```css
:root {
  --agent-widget-primary: #00ff00;
  --agent-widget-background: rgba(26, 26, 26, 0.85);
  --agent-widget-text: white;
}
```

### Custom Placeholders

Edit the placeholders array in `agent-widget.js`:

```javascript
const placeholders = [
  "Answer new-hire questions",
  "Package raw ERP data",
  "Automate invoice processing",
  "Generate monthly reports"
];
```

### Widget Position

Change the widget position by modifying the CSS:

```css
.agent-widget-container {
  position: fixed;
  bottom: 30px;
  right: 30px;  /* Change to left: 30px for left side */
}
```

## API Response Format

The API expects POST requests with:

```json
{
  "userNeed": "string describing what the user wants to automate"
}
```

And returns:

```json
{
  "message": "Conversational response from the AI"
}
```

## Testing

### Basic Test

Open `test.html` in your browser to see the widget in action.

### Advanced Testing

Use `test-harness.html` for:
- Testing different user inputs
- Validating API responses
- Checking mobile responsiveness
- Performance testing

## Troubleshooting

### Widget not appearing
- Check that `<div id="agent-widget"></div>` exists
- Ensure `agent-widget.js` is loaded after the div
- Check browser console for errors

### API not responding
- Verify `OPENAI_API_KEY` is set in environment
- Check network tab for API errors
- Fallback responses should still work

### Styling issues
- Widget has high z-index (9999/10000) to appear above content
- Check for CSS conflicts with your site
- Use browser DevTools to inspect styles

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (including iOS)
- Mobile: Fully responsive

## License

MIT License - feel free to use in your projects!

## Support

- Issues: [GitHub Issues](https://github.com/yourusername/agent-widget)
- Email: support@trainmyagent.com
- Documentation: This README