// ==========================================================
// 1. ANIMAÇÃO MATRIX / CACHOEIRA DIGITAL
// ==========================================================
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const chars =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789<>{}[]/*+";
const fontSize = 16;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(1);

function drawMatrix() {
  ctx.fillStyle = "rgba(3, 7, 18, 0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00f2fe";
  ctx.font = `600 ${fontSize}px 'Fira Code', monospace`;

  const currentColumns = Math.floor(canvas.width / fontSize);
  if (currentColumns !== columns) {
    columns = currentColumns;
    drops = Array(columns).fill(1);
  }

  for (let i = 0; i < drops.length; i++) {
    const text = chars.charAt(Math.floor(Math.random() * chars.length));
    const x = i * fontSize;
    const y = drops[i] * fontSize;

    ctx.fillText(text, x, y);

    if (y > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(drawMatrix, 35);

// ==========================================================
// 2. PROMPT DO SISTEMA (PERSONALIZADO DO DEV JYUN)
// ==========================================================
const PROMPT_DEV_JYUN = `
Você é o JYUN.ai, o assistente virtual oficial do desenvolvedor Renan Jyun (Dev JYUN).
Sua missão é responder aos usuários de forma inteligente, amigável e técnica.

Informações oficiais sobre o Dev JYUN que você deve usar quando perguntarem:
- Nome Completo: Renan Jyun
- Nome de Usuário / GitHub: Rjyun10
- Função: Desenvolvedor Front-end e Web Developer
- Experiência: Mais de 4 anos dedicados aos estudos de programação e criação de soluções digitais.
- Habilidades e Tecnologias: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5, Git, GitHub e consumo de APIs REST.
- Estilo e Filosofia de Trabalho: Criar experiências digitais fluidas e modernas (foco em Cyberpunk / Dark mode), código limpo, interfaces responsivas e aplicações que unem lógica com design estético.
- Links Oficiais:
  - Portfólio Web: https://rjyun10.github.io/
  - Perfil no GitHub: https://github.com/Rjyun10
  - Formulário de Contato / Email: https://rjyun10.github.io/#contato

Instruções para Dúvidas de Contato:
Se o usuário perguntar como entrar em contato, mandar um e-mail, enviar uma proposta ou fazer uma parceria com o Renan Jyun, informe expressamente que ele pode enviar uma mensagem direta pelo formulário oficial de contato disponível no portfólio no link: https://rjyun10.github.io/#contato

Regra Estrita de Formatação: NÃO use formatação Markdown em suas respostas. NUNCA use asteriscos (* ou **), hashtags (# ou ###), ou underlines (_). Responda apenas com texto limpo, usando hífens simples (-) para listas. SEMPRE insira uma quebra de linha após cada item para que as informações fiquem separadas verticalmente.

Regra de Conteúdo: Se perguntarem algo sobre o Dev JYUN, use estas informações. Caso perguntem sobre assuntos gerais, responda normalmente em português com tom prestativo, sempre mantendo a regra estrita de formatação sem Markdown.
`;

// ==========================================================
// 3. LÓGICA DO CHATBOT
// ==========================================================
const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const clearChatBtn = document.getElementById("clearChatBtn");
const apiKeyInput = document.getElementById("apiKeyInput");
const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");

const AVAILABLE_MODELS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
  "llama-3.3-70b-versatile"
];

let conversationHistory = [];
let apiKey = localStorage.getItem("GROQ_API_KEY") || "";

if (apiKey) {
  apiKeyInput.value = apiKey;
}

saveApiKeyBtn.addEventListener("click", () => {
  const keyValue = apiKeyInput.value.trim();
  if (keyValue) {
    apiKey = keyValue;
    localStorage.setItem("GROQ_API_KEY", apiKey);

    const modalElement = document.getElementById("configModal");
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();

    alert("Chave de API salva com sucesso!");
  } else {
    alert("Por favor, insira uma chave válida da Groq (gsk_...).");
  }
});

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = userInput.value.trim();
  if (!text) return;

  if (!apiKey) {
    alert("Por favor, configure sua API Key da Groq primeiro.");
    const modal = new bootstrap.Modal(document.getElementById("configModal"));
    modal.show();
    return;
  }

  appendMessage("user", text);
  conversationHistory.push({ role: "user", content: text });

  userInput.value = "";
  toggleInput(false);

  const typingElem = appendTypingIndicator();
  let success = false;
  let lastErrorMessage = "";

  const payloadMessages = [
    { role: "system", content: PROMPT_DEV_JYUN },
    ...conversationHistory
  ];

  for (const modelName of AVAILABLE_MODELS) {
    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: modelName,
            messages: payloadMessages,
            temperature: 0.7,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.choices && data.choices[0]) {
        typingElem.remove();
        const reply = data.choices[0].message.content;
        appendMessage("bot", reply);
        conversationHistory.push({ role: "assistant", content: reply });
        success = true;
        break;
      } else if (data.error) {
        lastErrorMessage = data.error.message;
      }
    } catch (err) {
      console.warn(`Tentativa com ${modelName} falhou:`, err);
    }
  }

  if (!success) {
    typingElem.remove();
    conversationHistory.pop();
    appendMessage(
      "bot",
      `Erro na API: ${lastErrorMessage || "Não foi possível conectar. Verifique sua chave de API."}`
    );
  }

  toggleInput(true);
  userInput.focus();
});

// Função para formatar o texto, converter URLs em links e preservar quebras de linha
function formatTextWithLinks(text) {
  // Regex aprimorada para capturar apenas URLs válidas sem capturar pontuações coladas no final
  const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;

  // Escapa caracteres HTML para segurança
  let formatted = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Transforma URLs em tags <a> clicáveis
  formatted = formatted.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-cyan text-decoration-underline">${url}</a>`;
  });

  // Transforma quebras de linha (\n) em tags <br> por último
  formatted = formatted.replace(/\n/g, "<br>");

  return formatted;
}

function appendMessage(sender, text) {
  const isUser = sender === "user";
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${isUser ? "user-message" : "bot-message"} d-flex gap-2`;

  const avatarDiv = document.createElement("div");
  avatarDiv.className = `avatar ${isUser ? "bg-secondary text-white" : "bg-cyan-subtle text-cyan"} rounded-circle d-flex align-items-center justify-content-center`;
  avatarDiv.innerHTML = `<i class="bi ${isUser ? "bi-person-fill" : "bi-cpu-fill"}"></i>`;

  const contentDiv = document.createElement("div");
  contentDiv.className = "message-content p-3 rounded-4";

  const pText = document.createElement("p");
  pText.className = "mb-0";
  pText.innerHTML = formatTextWithLinks(text);

  const timeSmall = document.createElement("small");
  timeSmall.className = "text-secondary text-end d-block mt-1 font-code";
  timeSmall.innerText = time;

  contentDiv.appendChild(pText);
  contentDiv.appendChild(timeSmall);

  msgDiv.appendChild(avatarDiv);
  msgDiv.appendChild(contentDiv);

  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendTypingIndicator() {
  const div = document.createElement("div");
  div.className = "message bot-message d-flex gap-2";
  div.innerHTML = `
    <div class="avatar bg-cyan-subtle text-cyan rounded-circle d-flex align-items-center justify-content-center">
      <i class="bi bi-cpu-fill"></i>
    </div>
    <div class="message-content p-3 rounded-4">
      <div class="typing-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

function toggleInput(enable) {
  userInput.disabled = !enable;
  sendBtn.disabled = !enable;
}

clearChatBtn.addEventListener("click", () => {
  chatMessages.innerHTML = "";
  conversationHistory = [];
  appendMessage("bot", "Chat e histórico limpos pelo usuário.");
});