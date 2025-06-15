(function() {
  // Configuration
  const CONFIG = {
    calendlyUrl: 'https://calendly.com/chase-trainmyagent/30min',
    emailAddress: 'chase@trainmyagent.com'
  };

  // Widget styles
  const styles = `
    .agent-widget-container {
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
    }

    .agent-widget-input-wrapper {
      background: rgba(26, 26, 26, 0.85);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-radius: 50px;
      padding: 20px 30px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
      min-width: 550px;
      max-width: 700px;
    }

    .agent-widget-input-wrapper:hover {
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
      transform: translateY(-2px);
    }

    .agent-widget-input {
      background: transparent;
      border: none;
      color: white;
      font-size: 16px;
      outline: none;
      flex: 1;
      min-width: 450px;
      padding-right: 20px;
    }

    .agent-widget-input::placeholder {
      color: rgba(255, 255, 255, 0.7);
      transition: opacity 0.3s ease;
    }

    .agent-widget-submit {
      background: #00ff00;
      border: none;
      border-radius: 50%;
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
    }

    .agent-widget-submit:hover {
      background: #00dd00;
      transform: scale(1.05);
    }

    .agent-widget-submit:active {
      transform: scale(0.95);
    }

    .agent-widget-submit.loading {
      pointer-events: none;
      animation: pulse 1s infinite;
    }

    .agent-widget-submit svg {
      width: 20px;
      height: 20px;
      transition: opacity 0.2s ease;
    }

    .agent-widget-submit svg path {
      stroke: #000000;
      stroke-width: 2.5;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.05);
        opacity: 0.8;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    .agent-widget-loading {
      display: none;
      animation: spin 1s linear infinite;
    }

    .agent-widget-submit.loading .agent-widget-arrow {
      display: none;
    }

    .agent-widget-submit.loading .agent-widget-loading {
      display: block;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .agent-widget-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .agent-widget-modal-overlay.active {
      display: flex;
      opacity: 1;
    }

    .agent-widget-modal {
      background: #1a1a1a;
      border-radius: 20px;
      padding: 40px;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transform: translateY(20px);
      transition: transform 0.3s ease;
    }

    .agent-widget-modal-overlay.active .agent-widget-modal {
      transform: translateY(0);
    }

    .agent-widget-modal-content {
      color: white;
      font-size: 18px;
      line-height: 1.6;
      margin-bottom: 30px;
    }

    .agent-widget-modal-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
    }

    .agent-widget-button {
      padding: 12px 24px;
      border-radius: 25px;
      border: none;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .agent-widget-button-primary {
      background: #00ff00;
      color: #1a1a1a;
    }

    .agent-widget-button-primary:hover {
      background: #00dd00;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 255, 0, 0.3);
    }

    .agent-widget-button-secondary {
      background: transparent;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .agent-widget-button-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .agent-widget-close {
      position: absolute;
      top: 20px;
      right: 20px;
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.5);
      font-size: 28px;
      cursor: pointer;
      transition: color 0.3s ease;
      line-height: 1;
      padding: 0;
      width: 30px;
      height: 30px;
    }

    .agent-widget-close:hover {
      color: white;
    }

    @keyframes typing {
      from { width: 0; }
      to { width: 100%; }
    }

    .typing-animation {
      overflow: hidden;
      white-space: nowrap;
      display: inline-block;
      animation: typing 2s steps(30, end);
    }

    @media (max-width: 600px) {
      .agent-widget-container {
        bottom: 20px;
        right: 10px;
        left: 10px;
      }

      .agent-widget-input-wrapper {
        min-width: unset;
        width: 100%;
        padding: 16px 20px;
        gap: 12px;
      }

      .agent-widget-input {
        min-width: unset;
        font-size: 14px;
        padding-right: 10px;
      }

      .agent-widget-submit {
        width: 40px;
        height: 40px;
      }

      .agent-widget-submit svg {
        width: 20px;
        height: 20px;
      }
    }
  `;

  // Placeholder texts
  const placeholders = [
    "Answer new-hire questions",
    "Package raw ERP data",
    "Automate invoice processing",
    "Generate monthly reports"
  ];

  let currentPlaceholderIndex = 0;
  let typingInterval;

  // Create widget HTML
  function createWidget() {
    const container = document.getElementById('agent-widget');
    if (!container) return;

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Create widget HTML
    container.innerHTML = `
      <div class="agent-widget-container">
        <div class="agent-widget-input-wrapper">
          <input type="text" class="agent-widget-input" placeholder="I need an agent to..." />
          <button class="agent-widget-submit">
            <svg class="agent-widget-arrow" viewBox="0 0 24 24">
              <path d="M7 12h10m0 0l-4-4m4 4l-4 4"/>
            </svg>
            <svg class="agent-widget-loading" viewBox="0 0 24 24">
              <path d="M12 2v4m0 12v4m4.22-15.22l2.83 2.83M4.93 19.07l2.83-2.83M2 12h4m12 0h4m-15.22 4.22l2.83-2.83M19.07 4.93l-2.83 2.83"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="agent-widget-modal-overlay">
        <div class="agent-widget-modal">
          <button class="agent-widget-close">&times;</button>
          <div class="agent-widget-modal-content"></div>
          <div class="agent-widget-modal-buttons">
            <button class="agent-widget-button agent-widget-button-primary">Let's chat</button>
            <button class="agent-widget-button agent-widget-button-secondary">Email instead</button>
          </div>
        </div>
      </div>
    `;

    // Initialize widget
    initializeWidget();
  }

  // Initialize widget functionality
  function initializeWidget() {
    const input = document.querySelector('.agent-widget-input');
    const submitBtn = document.querySelector('.agent-widget-submit');
    const modal = document.querySelector('.agent-widget-modal-overlay');
    const closeBtn = document.querySelector('.agent-widget-close');
    const chatBtn = document.querySelector('.agent-widget-button-primary');
    const emailBtn = document.querySelector('.agent-widget-button-secondary');

    // Start placeholder animation
    startPlaceholderAnimation(input);

    // Handle input focus
    input.addEventListener('focus', () => {
      stopPlaceholderAnimation();
      input.placeholder = "I need an agent to...";
    });

    input.addEventListener('blur', () => {
      if (!input.value) {
        startPlaceholderAnimation(input);
      }
    });

    // Handle submit
    const handleSubmit = async () => {
      const value = input.value.trim();
      if (!value) return;

      // Add loading class for immediate feedback
      submitBtn.classList.add('loading');

      try {
        // Call API
        const response = await fetch('/api/get-response', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ need: value })
        });

        const data = await response.json();

        // Show modal with response
        document.querySelector('.agent-widget-modal-content').textContent = 
          data.message || "We can help you with that! Our AI agents can handle this task efficiently.";
        
        modal.classList.add('active');

      } catch (error) {
        // Fallback response
        document.querySelector('.agent-widget-modal-content').textContent = 
          "We can definitely help you with that! Let's schedule a time to discuss your specific needs.";
        
        modal.classList.add('active');
      } finally {
        // Reset loading state
        submitBtn.classList.remove('loading');
        input.value = '';
      }
    };

    submitBtn.addEventListener('click', handleSubmit);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    });

    // Handle modal close
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });

    // Handle button clicks
    chatBtn.addEventListener('click', () => {
      window.open(CONFIG.calendlyUrl, '_blank');
    });

    emailBtn.addEventListener('click', () => {
      window.location.href = `mailto:${CONFIG.emailAddress}?subject=AI Agent Inquiry`;
    });
  }

  // Placeholder animation functions
  function startPlaceholderAnimation(input) {
    let charIndex = 0;
    let isDeleting = false;
    const baseText = "I need an agent to...";
    
    typingInterval = setInterval(() => {
      const currentPlaceholder = placeholders[currentPlaceholderIndex];
      
      if (!isDeleting) {
        // Typing
        if (charIndex <= currentPlaceholder.length) {
          input.placeholder = baseText + " " + currentPlaceholder.substring(0, charIndex);
          charIndex++;
        } else {
          // Pause before deleting
          setTimeout(() => {
            isDeleting = true;
          }, 2000);
        }
      } else {
        // Deleting
        if (charIndex > 0) {
          charIndex--;
          input.placeholder = baseText + " " + currentPlaceholder.substring(0, charIndex);
        } else {
          isDeleting = false;
          currentPlaceholderIndex = (currentPlaceholderIndex + 1) % placeholders.length;
        }
      }
    }, 100);
  }

  function stopPlaceholderAnimation() {
    if (typingInterval) {
      clearInterval(typingInterval);
      typingInterval = null;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();