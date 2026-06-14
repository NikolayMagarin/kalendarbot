export function createHTML(content: [string, string]): string {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>Календарь</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
  
      body {
        background: linear-gradient(145deg, #f6f9fc 0%, #eef2f5 100%);
        font-family: system-ui, -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
        padding: 1.5rem;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
  
      /* main card container — soft, modern, responsive */
      .card {
        max-width: 1000px;
        width: 100%;
        margin: 0 auto;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(2px);
        border-radius: 2rem;
        box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.02);
        padding: 1.5rem;
        transition: all 0.2s ease;
      }
  
      h1 {
        font-size: 1.75rem;
        font-weight: 600;
        letter-spacing: -0.01em;
        background: linear-gradient(135deg, #1a2a3a, #1e3a5f);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        margin-bottom: 0.25rem;
        display: inline-block;
      }
  
      .sub {
        color: #4a627a;
        margin-bottom: 2rem;
        border-left: 3px solid #7c9ebf;
        padding-left: 0.9rem;
        font-size: 0.95rem;
        font-weight: 450;
      }
  
      /* each block wrapper with modern styling */
      .pre-container {
        margin-bottom: 2rem;
        border-radius: 1.25rem;
        background: #0f1722;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        transition: transform 0.2s, box-shadow 0.2s;
      }
  
      .pre-container:hover {
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.12);
      }
  
      /* header inside each container: label + button */
      .pre-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1.2rem;
        background: #0b1119;
        border-top-left-radius: 1.25rem;
        border-top-right-radius: 1.25rem;
        border-bottom: 1px solid #2a3647;
      }
  
      .label {
        font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
        font-size: 0.75rem;
        font-weight: 500;
        background: #2a3a4e;
        padding: 0.25rem 0.7rem;
        border-radius: 2rem;
        color: #d1e2f5;
        letter-spacing: 0.3px;
        backdrop-filter: blur(4px);
      }
  
      /* modern copy button */
      .copy-btn {
        background: #2b3b4e;
        border: none;
        font-family: inherit;
        font-size: 0.8rem;
        font-weight: 500;
        padding: 0.4rem 1rem;
        border-radius: 2.5rem;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        color: #f0f6fe;
        transition: all 0.2s ease;
        box-shadow: 0 1px 1px rgba(0,0,0,0.2);
        backdrop-filter: blur(2px);
      }
  
      .copy-btn svg {
        width: 16px;
        height: 16px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
  
      .copy-btn:hover {
        background: #3f5a74;
        transform: scale(0.97);
        cursor: pointer;
      }
  
      .copy-btn:active {
        transform: scale(0.96);
        background: #1f3346;
      }
  
      /* success feedback effect */
      .copy-btn.copied {
        background: #2c7a5e;
        color: white;
        box-shadow: 0 0 6px rgba(44, 122, 94, 0.5);
      }
  
      /* pre block styling — elegant code area */
      pre {
        margin: 0;
        padding: 1.2rem 1.5rem;
        font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace;
        font-size: 0.85rem;
        line-height: 1.5;
        color: #eef4ff;
        background: #0f1722;
        overflow-x: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
        tab-size: 4;
        border-bottom-left-radius: 1.25rem;
        border-bottom-right-radius: 1.25rem;
        scrollbar-width: thin;
        scrollbar-color: #3c5670 #1e2a3a;
      }
  
      /* custom scroll for code blocks (webkit) */
      pre::-webkit-scrollbar {
        height: 6px;
        width: 6px;
      }
      pre::-webkit-scrollbar-track {
        background: #1a2532;
        border-radius: 10px;
      }
      pre::-webkit-scrollbar-thumb {
        background: #4a6e8c;
        border-radius: 10px;
      }
  
      /* add subtle highlight on copy (flash) */
      .copy-flash {
        animation: gentleFlash 0.32s ease-out;
      }
  
      @keyframes gentleFlash {
        0% { background-color: #0f1722; }
        50% { background-color: #2f4b6e; }
        100% { background-color: #0f1722; }
      }
  
      /* responsive: stack nicely on small screens */
      @media (max-width: 640px) {
        body {
          padding: 1rem;
        }
        .card {
          padding: 1rem;
        }
        .pre-header {
          padding: 0.6rem 1rem;
        }
        pre {
          padding: 1rem;
          font-size: 0.75rem;
        }
        .copy-btn {
          padding: 0.3rem 0.8rem;
          font-size: 0.7rem;
        }
        h1 {
          font-size: 1.5rem;
        }
      }
  
      /* footer optional tiny note */
      .footer-note {
        margin-top: 1.5rem;
        text-align: center;
        font-size: 0.7rem;
        color: #6b85a0;
        border-top: 1px solid #cbdde9;
        padding-top: 1rem;
      }
      button {
        background: none;
        border: none;
      }
    </style>
  </head>
  <body>
  <div class="card">
    <div style="margin-bottom: 0.5rem;">
      <h1>Календарь</h1>
    </div>
    <div class="sub">Для копирования</div>
  
    <!-- FIRST PRE BLOCK -->
    <div class="pre-container" id="block1-container">
      <div class="pre-header">
        <span class="label">Календарь</span>
        <button class="copy-btn" data-target="pre1" aria-label="Copy to clipboard">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" fill="none"></path>
          </svg>
          <span class="btn-text">Копировать</span>
        </button>
      </div>
      <pre id="pre1">${content[0]}</pre>
    </div>
  
    <!-- SECOND PRE BLOCK -->
    <div class="pre-container" id="block2-container">
      <div class="pre-header">
        <span class="label">Чтения</span>
        <button class="copy-btn" data-target="pre2" aria-label="Copy to clipboard">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" fill="none"></path>
          </svg>
          <span class="btn-text">Копировать</span>
        </button>
      </div>
      <pre id="pre2">${content[1]}</pre>
    </div>
  </div>
  
  <script>
    (function() {
      // Helper: robust copy text using modern clipboard API + fallback for old devices (just in case)
      async function copyToClipboard(text, buttonElement) {
        try {
          // Try modern clipboard API first (secure, works on mobile)
          await navigator.clipboard.writeText(text);
          return true;
        } catch (err) {
          // Fallback for very old browsers / some mobile contexts (execCommand)
          console.warn('Clipboard API failed, using fallback', err);
          const textarea = document.createElement('textarea');
          textarea.value = text;
          // Make it non-visible but part of DOM
          textarea.style.position = 'fixed';
          textarea.style.top = '-9999px';
          textarea.style.left = '-9999px';
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          let success = false;
          try {
            success = document.execCommand('copy');
          } catch (e) {
            console.error('execCommand error', e);
          }
          document.body.removeChild(textarea);
          return success;
        }
      }
  
      // Add visual feedback for button (copied state + optional flash on pre block)
      function setButtonCopiedState(btn, originalText = "Copy") {
        const span = btn.querySelector('.btn-text');
        const originalSpanText = span ? span.innerText : "Copy";
        // store original text if not already stored as data
        if (!btn.dataset.originalText) {
          btn.dataset.originalText = originalSpanText;
        }
        const finalOriginal = btn.dataset.originalText;
        span.innerText = "✓ Готово";
        btn.classList.add('copied');
        // reset after 1.8 seconds
        setTimeout(() => {
          if (btn) {
            span.innerText = finalOriginal;
            btn.classList.remove('copied');
          }
        }, 1800);
      }
  
      // flash the pre block background for subtle visual feedback (non intrusive)
      function flashPreElement(preEl) {
        if (!preEl) return;
        preEl.classList.add('copy-flash');
        setTimeout(() => {
          preEl.classList.remove('copy-flash');
        }, 320);
      }
  
      // attach event handlers to both copy buttons
      const buttons = document.querySelectorAll('.copy-btn');
      
      async function handleCopy(ev) {
        const btn = ev.currentTarget;
        const targetId = btn.getAttribute('data-target');
        if (!targetId) return;
        
        const preElement = document.getElementById(targetId);
        if (!preElement) {
          console.warn(\`pre element with id "\${targetId}" not found\`);
          return;
        }
        
        // get raw text content from pre block (preserve formatting, line breaks)
        let textToCopy = preElement.innerText;
        // ensure we don't copy extra weird artifacts, but innerText captures line breaks perfectly
        if (textToCopy === undefined) textToCopy = preElement.textContent || "";
        
        // execute copy
        const copySuccess = await copyToClipboard(textToCopy, btn);
        
        if (copySuccess) {
          // show button copied state
          setButtonCopiedState(btn);
          // add visual flash on the corresponding pre block
          flashPreElement(preElement);
          // optional: subtle haptic? no need but we keep clean
        } else {
          // alert fallback (very rare) but user friendly
          const span = btn.querySelector('.btn-text');
          const originalMsg = span ? span.innerText : "Copy";
          if (span) span.innerText = "⚠️ ошибка";
          setTimeout(() => {
            if (span) span.innerText = originalMsg;
            btn.classList.remove('copied');
          }, 1200);
          console.error('Copy failed');
        }
      }
      
      // Attach listeners and also ensure that on mobile touches are responsive
      buttons.forEach(btn => {
        btn.addEventListener('click', handleCopy);
        // optional: add minor touchstart to avoid double tap zoom on buttons (not needed but safe)
        btn.addEventListener('touchstart', (e) => {
          // just to ensure responsiveness, but no preventDefault to keep click event
          // we allow click event to fire normally.
        });
      });
      
      // Additional: make the pre blocks feel interactive but doesn't interfere
      // For extra robustness: test if clipboard write permission? Not needed.
      // Also ensure that if any double copy, it doesn't break.
      // CSS only beautification done
      console.log('ready — two pre blocks with copy');
    })();
  </script>
  </body>
  </html>`;
}
