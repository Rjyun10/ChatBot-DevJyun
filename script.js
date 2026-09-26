// ==========================================================
// 1. ANIMAÇÃO MATRIX / CACHOEIRA DIGITAL (EFEITO FLUIDO DE OPACIDADE)
// ==========================================================
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
const fontSize = 16;
let columns = Math.floor(canvas.width / fontSize);

const trailLength = 14; 
let drops = Array(columns).fill(0).map(() => Math.random() * -50); 
let speed = Array(columns).fill(0).map(() => 0.15 + Math.random() * 0.25); 

function drawMatrix() {
  ctx.fillStyle = "rgba(3, 7, 18, 0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `600 ${fontSize}px 'Fira Code', monospace`;

  const currentColumns = Math.floor(canvas.width / fontSize);
  if (currentColumns !== columns) {
    columns = currentColumns;
    drops = Array(columns).fill(0).map(() => Math.random() * -50);
    speed = Array(columns).fill(0).map(() => 0.15 + Math.random() * 0.25);
  }

  for (let i = 0; i < columns; i++) {
    const headY = drops[i];

    for (let j = 0; j < trailLength; j++) {
      const charY = Math.floor(headY) - j;
      
      if (charY >= 0 && charY * fontSize < canvas.height + fontSize) {
        const charIndex = Math.abs((i * 31 + charY * 17) % chars.length);
        const char = chars.charAt(charIndex);

        const x = i * fontSize;
        const y = charY * fontSize;

        let alpha = 1 - (j / trailLength);
        alpha = Math.max(0, Math.min(1, alpha));

        if (j === 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(0, 242, 254, ${alpha * 0.85})`;
        }

        ctx.fillText(char, x, y);
      }
    }

    drops[i] += speed[i];

    if (drops[i] * fontSize > canvas.height + (trailLength * fontSize) && Math.random() > 0.975) {
      drops[i] = -Math.random() * 20;
      speed[i] = 0.15 + Math.random() * 0.25;
    }
  }

  requestAnimationFrame(drawMatrix);
}

requestAnimationFrame(drawMatrix);

// ==========================================================
// 2. BASE DE CONHECIMENTO DO DEV JYUN & REGRAS LOCAIS
// ==========================================================
const DEV_DATA = {
  nome: "Renan Jyun (Dev JYUN)",
  githubUser: "Rjyun10",
  funcao: "Desenvolvedor Front-end e Web Developer",
  experiencia: "Mais de 4 anos dedicados aos estudos de programação e criação de soluções digitais.",
  habilidades: "HTML5, CSS3, JavaScript (ES6+), Bootstrap 5, Git, GitHub e consumo de APIs REST.",
  stack: "Front-end Web Stack: HTML5, CSS3, JavaScript ES6+, Bootstrap 5, Git/GitHub, Fetch API e JSON.",
  principios: "Clean Code (código limpo), Componentização, Responsividade Mobile-First, Performance e Acessibilidade (a11y).",
  softSkills: "Comunicação clara, Resolução de problemas, Autonomia de aprendizagem, Atenção aos detalhes e Adaptabilidade.",
  hardSkills: "Desenvolvimento Front-end, Consumo de APIs RESTful, Manipulação de DOM, Layouts Responsivos e Versionamento Git.",
  uiux: "Interfaces modernas, intuitivas e com temática Cyberpunk / Dark Mode, focadas na experiência do usuário (UX).",
  seoPerformance: "Otimização de páginas (SEO básico), carregamento rápido e estrutura HTML semântica.",
  servicos: "Criação de Sites Responsivos, Portfólios, Landing Pages, Integração com APIs e Manutenção de Interfaces Web.",
  contratacao: "Disponível para oportunidades de trabalho (CLT / PJ), Projetos Freelance e Parcerias.",
  portfolio: "https://rjyun10.github.io/",
  github: "https://github.com/Rjyun10",
  contato: "https://rjyun10.github.io/#contato"
};

const PROMPT_DEV_JYUN = `
Você é o JYUN.ai, o assistente virtual oficial do desenvolvedor Renan Jyun (Dev JYUN).
Sua personalidade é humana, amigável, prestativa, comunicativa e com um toque descontraído de quem entende de tecnologia e cultura geek/cyberpunk. Fale como se estivesse batendo um papo legal com alguém interessado no trabalho do Renan.

Informações oficiais sobre o Dev JYUN:
- Nome Completo: ${DEV_DATA.nome}
- Nome de Usuário / GitHub: ${DEV_DATA.githubUser}
- Função: ${DEV_DATA.funcao}
- Experiência: ${DEV_DATA.experiencia}
- Habilidades / Stack: ${DEV_DATA.stack}
- Princípios e Boas Práticas: ${DEV_DATA.principios}
- Soft Skills: ${DEV_DATA.softSkills}
- Hard Skills: ${DEV_DATA.hardSkills}
- UI/UX & Design: ${DEV_DATA.uiux}
- SEO e Performance: ${DEV_DATA.seoPerformance}
- Serviços oferecidos: ${DEV_DATA.servicos}
- Modelo de Contratação: ${DEV_DATA.contratacao}
- Portfólio Web: ${DEV_DATA.portfolio}
- Perfil no GitHub: ${DEV_DATA.github}
- Formulário de Contato: ${DEV_DATA.contato}

Regra Estrita de Formatação: NÃO use formatação Markdown nas respostas. NUNCA use asteriscos (* ou **), hashtags (# ou ###), ou underlines (_). Responda de forma humanizada e fluida, introduzindo o assunto de maneira natural e usando hífens simples (-) apenas para organizar os pontos principais em tópicos. Sempre insira quebras de linha após cada item.
`;

function checkDevQuestionsLocal(text) {
  const query = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const match = (keywords) => keywords.some(k => query.includes(k));

  // 1. FILTRO DE SEGURANÇA: BLOQUEIO DE ASSUNTOS PESSOAIS / ÍNTIMOS
  const personalKeywords = [
    "namorada", "namorado", "casado", "solteiro", "relacionamento", "esposa", "marido", 
    "idade", "quantos anos ele tem", "onde ele mora", "endereco", "endereço", "bairro", "cidade onde", 
    "telefone pessoal", "whatsapp pessoal", "zap", "cpf", "rg", "documento", "familia", "pais", 
    "mae", "pai", "irmao", "filhos", "filho", "filha", "religiao", "politica", "voto", "partido", 
    "fofoca", "vida privada", "vida pessoal", "intimidade", "segredo", "quanto ele ganha", "salario"
  ];

  if (match(personalKeywords)) {
    return "Desculpe, mas não posso fornecer informações sobre a vida pessoal ou privada do Jyun. Meu objetivo aqui é focar exclusivamente em sua trajetória profissional, portfólio, projetos e tecnologias. Se tiver alguma dúvida sobre o trabalho dele, é só perguntar!";
  }

  const globalDevKeywords = [
    "dev", "renan", "jyun", "rjyun10", "desenvolvedor", "web developer", "front-end", "frontend", "criador", 
    "quem criou", "autor", "dono", "quem e voce", "como te chamo", "assistente", "jyun.ai", "nome",
    "stack", "tecnologia", "tecnologias", "ferramentas", "linguagem", "linguagens", "html", "html5", 
    "css", "css3", "javascript", "js", "es6", "bootstrap", "bootstrap 5", "git", "github", "api", "apis", 
    "rest", "restful", "fetch", "json", "dom", "manipulacao de dom",
    "limpo", "clean code", "componentizacao", "componentes", "responsividade", "responsivo", 
    "mobile-first", "mobile first", "mobile", "celular", "performance", "desempenho", 
    "acessibilidade", "a11y", "principio", "principios", "boas praticas", "metodologia", "solid",
    "skill", "skills", "soft", "softskill", "softskills", "hard", "hardskill", "hardskills", 
    "habilidade", "habilidades", "competencias", "qualidades", "comunicacao", "resolucao de problemas", 
    "autonomia", "atencao aos detalhes", "adaptabilidade", "versionamento",
    "ui", "ux", "design", "interface", "interfaces", "usabilidade", "estilo", "tema", "tematica", 
    "cyberpunk", "dark mode", "darkmode", "experiencia do usuario",
    "seo", "otimizacao", "motores de busca", "carregamento", "semantica", "html semantico",
    "servico", "servicos", "landing page", "landing pages", "site", "sites", "manutencao", 
    "contratacao", "contratar", "modalidade", "clt", "pj", "freelance", "freelancer", "parceria", 
    "parcerias", "trabalho", "oportunidades", "orcamento", "projeto", "projetos",
    "contato", "email", "e-mail", "falar", "mensagem", "proposta", "formulario", "form", 
    "portfolio", "portfólio", "link", "links", "repositorio", "codigo", "experiencia", 
    "experiencias", "anos", "estudo", "estudos", "carreira", "sobre", "resumo", "info", 
    "informacao", "informacoes", "tudo", "relatorio"
  ];

  const isDevRelated = match(globalDevKeywords);

  if (!isDevRelated) return null;

  // 1. TUDO SOBRE O DEV / RELATÓRIO COMPLETO
  if (match(["tudo sobre", "tudo do dev", "todas as informacoes", "fale tudo", "me diga tudo", "tudo dele", "relatorio completo"])) {
    return `Com certeza! Posso te passar uma visão geral completa sobre o trabalho e a trajetória do Renan. Dá uma olhada nos pontos principais:\n\n- Nome: ${DEV_DATA.nome}\n- Função: ${DEV_DATA.funcao}\n- Experiência: ${DEV_DATA.experiencia}\n- Stack Principal: ${DEV_DATA.stack}\n- Princípios: ${DEV_DATA.principios}\n- Hard Skills: ${DEV_DATA.hardSkills}\n- Soft Skills: ${DEV_DATA.softSkills}\n- UI/UX: ${DEV_DATA.uiux}\n- SEO e Performance: ${DEV_DATA.seoPerformance}\n- Serviços: ${DEV_DATA.servicos}\n- Disponibilidade: ${DEV_DATA.contratacao}\n- Portfólio: ${DEV_DATA.portfolio}\n- GitHub: ${DEV_DATA.github}\n- Contato Direto: ${DEV_DATA.contato}\n\nSe quiser aprofundar em alguma dessas áreas, é só me falar!`;
  }

  // 2. CONTATO / EMAIL / FALA / PROPOSTA / MENSAGEM / ORÇAMENTO
  if (match(["contato", "email", "e-mail", "falar", "mensagem", "orcamento", "parceria", "parcerias", "proposta", "contratar", "formulario", "form"])) {
    return `Se você quiser trocar uma ideia, mandar uma proposta ou solicitar um orçamento, o melhor caminho é falar direto com ele por aqui:\n\n- Formulário de Contato: ${DEV_DATA.contato}\n\nEle costuma responder rápido, pode mandar mensagem!`;
  }

  // 3. NOME / IDENTIFICAÇÃO / CRIADOR / SOBRE VOCÊ
  if (match(["nome", "quem e voce", "seu nome", "como te chamo", "criador", "autor", "dono", "rjyun10", "jyun.ai"])) {
    return `Eu sou o JYUN.ai, o assistente virtual criado para representar o trabalho do Renan. Para você saber com quem está lidando:\n\n- Assistente: JYUN.ai (versão 2.0)\n- Desenvolvedor Responsável: ${DEV_DATA.nome}\n- Especialidade: ${DEV_DATA.funcao}\n\nEstou sempre por aqui para te ajudar a conhecer melhor os projetos dele!`;
  }

  // 4. STACK / TECNOLOGIAS / LINGUAGENS / FERRAMENTAS
  if (match(["stack", "tecnologia", "tecnologias", "ferramentas", "linguagem", "linguagens", "html", "html5", "css", "css3", "javascript", "js", "es6", "bootstrap", "fetch", "json", "dom"])) {
    return `O Renan curte bastante trabalhar com tecnologias modernas focadas em criar interfaces fluidas e limpas. A stack principal dele engloba:\n\n- ${DEV_DATA.stack}\n\nEle foca bastante em escrever um código que seja fácil de manter e escalar.`;
  }

  // 5. PRINCÍPIOS / CLEAN CODE / METODOLOGIAS / BOAS PRÁTICAS
  if (match(["principio", "principios", "clean code", "limpo", "boas praticas", "metodologia", "solid", "componentizacao", "mobile-first", "mobile first", "a11y"])) {
    return `Quando o assunto é escrever código, o Renan leva muito a sério boas práticas e organização. Os pilares dele são:\n\n- ${DEV_DATA.principios}\n\nA ideia é sempre entregar um produto que funcione bem em qualquer tela e seja agradável de dar manutenção.`;
  }

  // 6. SOFT SKILLS, HARD SKILLS & HABILIDADES
  if (match(["skill", "skills", "soft", "softskill", "softskills", "hard", "hardskill", "hardskills", "competencias", "qualidades", "habilidade", "habilidades", "versionamento"])) {
    return `O Renan equilibra muito bem a parte técnica com a parte de comunicação e resolução de problemas. Veja as competências dele:\n\n- Hard Skills: ${DEV_DATA.hardSkills}\n- Soft Skills: ${DEV_DATA.softSkills}\n\nEssa combinação ajuda muito no dia a dia de desenvolvimento e em trabalhos em equipe.`;
  }

  // 7. UI / UX / DESIGN / ESTILO / TEMA
  if (match(["ui", "ux", "design", "interface", "interfaces", "acessibilidade", "usabilidade", "estilo", "tema", "tematica", "cyberpunk", "dark mode", "darkmode"])) {
    return `O visual é uma das partes que ele mais capricha! Ele foca muito em entregar experiências marcantes:\n\n- ${DEV_DATA.uiux}\n\nExemplo disso é este próprio chat, que traz essa pegada futurista e imersiva.`;
  }

  // 8. SEO / PERFORMANCE / DESEMPENHO
  if (match(["seo", "performance", "desempenho", "velocidade", "carregamento", "semantica", "motores de busca"])) {
    return `Não basta apenas ser bonito, tem que voar! Nos projetos dele, o Renan se preocupa bastante com:\n\n- ${DEV_DATA.seoPerformance}\n\nIsso garante que o site carregue rápido e seja amigável para buscadores.`;
  }

  // 9. GITHUB / REPOSITÓRIO / CÓDIGO FONTE
  if (match(["github", "git", "repositorio", "codigo"])) {
    return `Quer dar uma olhada nos códigos e projetos que ele desenvolve? Você pode conferir diretamente no perfil dele:\n\n- Perfil no GitHub: ${DEV_DATA.github}\n\nTem bastante coisa legal por lá!`;
  }

  // 10. PORTFÓLIO / SITE / PROJETOS / LINKS
  if (match(["portfolio", "portfólio", "site", "sites", "web", "projeto", "projetos", "link", "links"])) {
    return `Para conhecer os trabalhos, aplicações e projetos criados por ele, o melhor lugar é acessar o portfólio oficial:\n\n- Portfólio Web: ${DEV_DATA.portfolio}\n\nDá uma olhada lá que vale a pena!`;
  }

  // 11. SERVIÇOS / FREELANCE / MODALIDADE DE CONTRATAÇÃO
  if (match(["servico", "servicos", "faz", "fazer", "freelance", "freelancer", "pj", "clt", "landing page", "landing pages", "manutencao", "contratacao", "modalidade"])) {
    return `Sim, ele está super ativo no mercado! Veja em que tipo de frentes ele pode ajudar:\n\n- Serviços Oferecidos: ${DEV_DATA.servicos}\n- Modalidade de Contratação: ${DEV_DATA.contratacao}\n\nSe tiver um projeto em mente, vale a pena chamar ele para conversar.`;
  }

  // 12. EXPERIÊNCIA / ANOS / CARREIRA
  if (match(["experiencia", "experiencias", "anos", "estudo", "estudos", "carreira", "tempo"])) {
    return `O Renan vem se dedicando firme à programação há algum tempo:\n\n- ${DEV_DATA.experiencia}\n\nNesse período ele focou bastante em evoluir suas habilidades e entregar soluções reais.`;
  }

  // 13. RESUMO GERAL
  return `Resumindo rapidinho quem é o desenvolvedor por trás disso tudo:\n\n- Nome: ${DEV_DATA.nome}\n- Função: ${DEV_DATA.funcao}\n- Experiência: ${DEV_DATA.experiencia}\n- Stack: ${DEV_DATA.stack}\n- Portfólio: ${DEV_DATA.portfolio}\n- GitHub: ${DEV_DATA.github}\n- Contato: ${DEV_DATA.contato}\n\nSe quiser saber de algo mais específico, é só mandar a pergunta!`;
}

// ==========================================================
// 3. MODELOS & DADOS DOS PROVEDORES DE API
// ==========================================================
const AVAILABLE_MODELS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
  "llama-3.3-70b-versatile"
];

const OPENAI_MODELS = [
  "gpt-4o-mini",
  "gpt-3.5-turbo"
];

const GEMINI_MODELS = [
  "gemini-1.5-flash",
  "gemini-1.5-pro"
];

const PROVIDERS = {
  groq: { label: "GROQ", models: AVAILABLE_MODELS },
  openai: { label: "OPENAI", models: OPENAI_MODELS },
  gemini: { label: "GEMINI", models: GEMINI_MODELS }
};

// ==========================================================
// 4. ELEMENTOS DO DOM & ARMAZENAMENTO TEMPORÁRIO (sessionStorage)
// ==========================================================
const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const clearChatBtn = document.getElementById("clearChatBtn");
const apiKeyInput = document.getElementById("apiKeyInput");
const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");
const apiProviderSelect = document.getElementById("apiProviderSelect");
const providerHelpText = document.getElementById("providerHelpText");
const statusLabel = document.getElementById("statusLabel");

let currentProvider = sessionStorage.getItem("JYUN_API_PROVIDER") || "groq";
let apiKeys = {
  groq: sessionStorage.getItem("GROQ_API_KEY") || "",
  openai: sessionStorage.getItem("OPENAI_API_KEY") || "",
  gemini: sessionStorage.getItem("GEMINI_API_KEY") || ""
};

let conversationHistory = [];

function showSystemNotice(title, message) {
  document.getElementById("noticeTitle").innerHTML = `<i class="bi bi-info-circle-fill me-2"></i>${title}`;
  document.getElementById("noticeBody").innerHTML = message;
  const modalElem = document.getElementById("systemNoticeModal");
  const modal = new bootstrap.Modal(modalElem);
  modal.show();
}

function updateProviderUI() {
  apiProviderSelect.value = currentProvider;
  apiKeyInput.value = apiKeys[currentProvider] || "";
  statusLabel.innerText = `SYS.ONLINE — PROVIDER: ${PROVIDERS[currentProvider].label}`;

  if (currentProvider === "groq") {
    providerHelpText.innerHTML = 'Obtenha no <a href="https://console.groq.com/keys" target="_blank" class="text-cyan">Groq Console</a>.';
  } else if (currentProvider === "openai") {
    providerHelpText.innerHTML = 'Obtenha no <a href="https://platform.openai.com/api-keys" target="_blank" class="text-cyan">OpenAI Platform</a>.';
  } else if (currentProvider === "gemini") {
    providerHelpText.innerHTML = 'Obtenha no <a href="https://aistudio.google.com/" target="_blank" class="text-cyan">Google AI Studio</a>.';
  }
}
updateProviderUI();

apiProviderSelect.addEventListener("change", (e) => {
  currentProvider = e.target.value;
  updateProviderUI();
});

saveApiKeyBtn.addEventListener("click", () => {
  const keyValue = apiKeyInput.value.trim();
  
  if (currentProvider === "openai" && keyValue.startsWith("gsk_")) {
    showSystemNotice("Aviso de Chave Incorreta", "A chave inserida começa com <code>gsk_</code>, que pertence ao <strong>Groq Console</strong>. Altere o provedor para 'Groq Console'.");
    return;
  }

  apiKeys[currentProvider] = keyValue;

  sessionStorage.setItem(`${currentProvider.toUpperCase()}_API_KEY`, keyValue);
  sessionStorage.setItem("JYUN_API_PROVIDER", currentProvider);

  updateProviderUI();

  const configModalElem = document.getElementById("configModal");
  const configModal = bootstrap.Modal.getInstance(configModalElem);
  if (configModal) configModal.hide();

  showSystemNotice("Configuração Salva", `Chave temporária da <strong>${PROVIDERS[currentProvider].label}</strong> salva! Ela será apagada ao fechar o site.`);
});

// ==========================================================
// 5. EXECUTOR DE CHAMADAS HTTP ADAPTADO
// ==========================================================
async function fetchAIResponse(payloadMessages) {
  const provider = currentProvider;
  const key = apiKeys[provider];
  const modelList = PROVIDERS[provider].models;
  let lastError = "";

  for (const modelName of modelList) {
    try {
      if (provider === "groq") {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
          body: JSON.stringify({ model: modelName, messages: payloadMessages, temperature: 0.7 })
        });
        const data = await response.json();
        if (response.ok && data.choices?.[0]?.message?.content) {
          return data.choices[0].message.content;
        }
        if (data.error?.message) lastError = data.error.message;
      } 
      else if (provider === "openai") {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
          body: JSON.stringify({ model: modelName, messages: payloadMessages, temperature: 0.7 })
        });
        const data = await response.json();
        if (response.ok && data.choices?.[0]?.message?.content) {
          return data.choices[0].message.content;
        }
        if (data.error?.message) lastError = data.error.message;
      } 
      else if (provider === "gemini") {
        const contents = payloadMessages
          .filter(m => m.role !== "system")
          .map(m => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }]
          }));

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: PROMPT_DEV_JYUN }] },
            contents: contents
          })
        });
        const data = await response.json();
        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
        if (data.error?.message) lastError = data.error.message;
      }
    } catch (err) {
      console.warn(`Erro na tentativa com ${provider} [${modelName}]:`, err);
    }
  }

  throw new Error(lastError || "Falha na conexão com os servidores da API.");
}

// ==========================================================
// 6. LÓGICA DE PROCESSAMENTO E INTERCEPTAÇÃO DO CHAT
// ==========================================================
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = userInput.value.trim();
  if (!text) return;

  const localReply = checkDevQuestionsLocal(text);
  const activeKey = apiKeys[currentProvider];

  appendMessage("user", text);
  userInput.value = "";
  toggleInput(false);

  // Se for uma pergunta sobre o Dev/Escopo local, responde com os tópicos humanizados
  if (localReply) {
    setTimeout(() => {
      appendMessage("bot", localReply);
      toggleInput(true);
      userInput.focus();
    }, 250);
    return;
  }

  // Se NÃO for do escopo E o usuário NÃO tiver chave de API conectada:
  if (!activeKey) {
    setTimeout(() => {
      appendMessage("bot", "Não posso ajudar com isso, mas se conectar uma chave API no menu superior, conseguirei!");
      toggleInput(true);
      userInput.focus();
    }, 250);
    return;
  }

  // Se não for do escopo, mas O USUÁRIO TEM CHAVE DE API, ele processa via API externa
  conversationHistory.push({ role: "user", content: text });
  const typingElem = appendTypingIndicator();

  const payloadMessages = [
    { role: "system", content: PROMPT_DEV_JYUN },
    ...conversationHistory
  ];

  try {
    const reply = await fetchAIResponse(payloadMessages);
    typingElem.remove();
    appendMessage("bot", reply);
    conversationHistory.push({ role: "assistant", content: reply });
  } catch (err) {
    typingElem.remove();
    conversationHistory.pop();
    appendMessage("bot", `Erro na API (${PROVIDERS[currentProvider].label}): ${err.message}`);
    showSystemNotice("Erro na API", `Não foi possível obter resposta do servidor da <strong>${PROVIDERS[currentProvider].label}</strong>.<br><br><small class="text-danger">${err.message}</small>`);
  }

  toggleInput(true);
  userInput.focus();
});

function formatTextWithLinks(text) {
  const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;

  let formatted = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  formatted = formatted.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-cyan text-decoration-underline">${url}</a>`;
  });

  formatted = formatted.replace(/\n/g, "<br>");
  return formatted;
}

function appendMessage(sender, text) {
  const isUser = sender === "user";
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

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