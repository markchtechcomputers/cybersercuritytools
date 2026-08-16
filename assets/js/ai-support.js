/**
 * Meridian Cyber — AI Support widget controller
 * Talks to /api/ai-support.php only. No API keys, no model calls, and no
 * chat history live in the browser beyond the current page view.
 */
(() => {
  'use strict';

  const launcher = document.getElementById('aiSupportLauncher');
  const panel = document.getElementById('aiSupportPanel');
  const closeBtn = document.getElementById('aiSupportClose');
  const body = document.getElementById('aiSupportBody');
  const form = document.getElementById('aiSupportForm');
  const input = document.getElementById('aiSupportInput');
  const sendBtn = document.getElementById('aiSupportSend');
  const quickButtons = document.querySelectorAll('[data-quick]');

  if (!launcher || !panel || !form) return;

  let open = false;
  let sending = false;

  function togglePanel(forceState) {
    open = typeof forceState === 'boolean' ? forceState : !open;
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', String(!open));
    launcher.setAttribute('aria-expanded', String(open));
    if (open) input?.focus();
  }

  launcher.addEventListener('click', () => togglePanel());
  closeBtn?.addEventListener('click', () => togglePanel(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) togglePanel(false);
  });

  function scrollToBottom() {
    body.scrollTop = body.scrollHeight;
  }

  function addMessage(text, role, topicLabel) {
    const el = document.createElement('div');
    el.className = `ai-msg ${role}`;
    if (topicLabel) {
      const tag = document.createElement('span');
      tag.className = 'topic-tag';
      tag.textContent = topicLabel;
      el.appendChild(tag);
      el.appendChild(document.createElement('br'));
    }
    el.appendChild(document.createTextNode(text));
    body.appendChild(el);
    scrollToBottom();
    return el;
  }

  function addTypingIndicator() {
    const el = document.createElement('div');
    el.className = 'ai-msg bot';
    el.id = 'aiTypingIndicator';
    el.innerHTML = '<span class="ai-typing"><span></span><span></span><span></span></span>';
    body.appendChild(el);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    document.getElementById('aiTypingIndicator')?.remove();
  }

  async function sendMessage(text) {
    if (!text.trim() || sending) return;
    sending = true;
    sendBtn.disabled = true;

    addMessage(text, 'user');
    input.value = '';
    input.style.height = 'auto';
    addTypingIndicator();

    try {
      const response = await fetch('/api/ai-support.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      removeTypingIndicator();

      if (!response.ok || data.error) {
        addMessage(
          data.error || 'Something went wrong on our end. Please try again or use the contact form.',
          'bot'
        );
      } else {
        addMessage(data.reply, 'bot', data.topic_label || null);
      }
    } catch (err) {
      removeTypingIndicator();
      addMessage('I could not reach the support service. Please check your connection or use the contact form.', 'bot');
    } finally {
      sending = false;
      sendBtn.disabled = false;
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage(input.value);
  });

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input.value);
    }
  });

  input?.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 90) + 'px';
  });

  quickButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      togglePanel(true);
      sendMessage(btn.dataset.quick);
    });
  });
})();
