(() => {
  const html = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  // Theme persistence
  const savedTheme = localStorage.getItem("harsh_theme") || "dark";
  html.setAttribute("data-theme", savedTheme);
  themeIcon.textContent = savedTheme === "dark" ? "☀️" : "🌙";

  themeToggle.addEventListener("click", () => {
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("harsh_theme", next);
    themeIcon.textContent = next === "dark" ? "☀️" : "🌙";
  });

  // Scroll progress + active nav link
  const scrollProgress = document.getElementById("scrollProgress");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));

  function onScroll() {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    scrollProgress.style.width = `${Math.min(100, pct)}%`;

    let current = "";
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
    });
    navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${current}`));
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile drawer
  const menuToggle = document.getElementById("menuToggle");
  const mobileDrawer = document.getElementById("mobileDrawer");
  menuToggle.addEventListener("click", () => {
    const open = mobileDrawer.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    mobileDrawer.setAttribute("aria-hidden", String(!open));
  });
  document.querySelectorAll(".mobile-link").forEach((a) =>
    a.addEventListener("click", () => {
      mobileDrawer.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    })
  );

  // Subtle 3D tilt effect on desktop pointer devices (respects reduced motion)
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (!reduceMotion && finePointer) {
    document.querySelectorAll(".tilt-3d").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg) translateY(-2px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  // Typewriter
  const roles = [
    "Data Science & AI/ML Builder",
    "Generative AI & RAG Developer",
    "Python & SQL Data Analyst",
    "Full-Stack Streamlit Engineer",
  ];
  const twEl = document.getElementById("typewriterText");
  let rIdx = 0, cIdx = roles[0].length, deleting = true;
  setInterval(() => {
    const word = roles[rIdx];
    if (deleting) {
      cIdx--;
      twEl.textContent = word.slice(0, cIdx);
      if (cIdx <= 0) {
        deleting = false;
        rIdx = (rIdx + 1) % roles.length;
      }
    } else {
      cIdx++;
      twEl.textContent = roles[rIdx].slice(0, cIdx);
      if (cIdx >= roles[rIdx].length) deleting = true;
    }
  }, 95);

  // Reveal observer
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
    { threshold: 0.06 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // Category filters
  function wireFilter(attr, cardSelector, cardAttr, multiToken = false) {
    const pills = document.querySelectorAll(`[${attr}]`);
    const cards = document.querySelectorAll(cardSelector);
    pills.forEach((btn) => {
      btn.addEventListener("click", () => {
        pills.forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        const val = btn.getAttribute(attr);
        cards.forEach((c) => {
          const raw = (c.getAttribute(cardAttr) || "").split(/\s+/);
          const match = val === "all" || (multiToken ? raw.includes(val) : c.getAttribute(cardAttr) === val);
          c.classList.toggle("hidden", !match);
          if (match) c.classList.add("visible");
        });
      });
    });
  }
  wireFilter("data-skill-filter", ".skill-card", "data-skill-cat");
  wireFilter("data-proj-filter", ".proj-card", "data-proj-cat");
  wireFilter("data-cert-filter", ".cert-img-card, .cert-card", "data-cert-cat", true);

  // Image & Certificate Lightbox
  const imgLightbox = document.getElementById("imgLightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");

  document.querySelectorAll("[data-lightbox]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      lightboxImg.src = el.getAttribute("data-lightbox");
      lightboxCaption.textContent = el.getAttribute("data-caption") || "Preview";
      imgLightbox.classList.add("open");
      imgLightbox.setAttribute("aria-hidden", "false");
    });
  });
  function closeLightbox() {
    imgLightbox.classList.remove("open");
    imgLightbox.setAttribute("aria-hidden", "true");
  }
  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  imgLightbox.addEventListener("click", (e) => { if (e.target === imgLightbox) closeLightbox(); });

  // Project Architecture Modals
  const MODAL_DATA = {
    talentsphere: {
      title: "TalentSphere Enterprise 2.0 — Architecture Breakdown",
      html: `
        <p><strong>Live App:</strong> <a href="https://talentsphereenterprise20-hq239uebmxwggycjex9icv.streamlit.app/" target="_blank" rel="noopener noreferrer">Streamlit Cloud Deployment ↗</a></p>
        <ul>
          <li><strong>RBAC &amp; Security:</strong> 6 user roles (Super Admin, HR Admin, College Admin, Employee, College Student, High School Student) enforced via server-side permission matrix and Bcrypt 12-round password hashing.</li>
          <li><strong>Database Layer:</strong> 28 relational SQLAlchemy ORM models across SQLite (WAL mode) and PostgreSQL, with audit logging and healthcheck probes.</li>
          <li><strong>AI / NLP Engine:</strong> <code>ResumeAnalyzer</code> (PDF/DOCX ingestion + skill taxonomy), <code>ATSEngine</code> (35% TF-IDF cosine similarity, 35% keyword coverage, 15% structure, 15% readability), <code>JobMatcher</code>, <code>SkillAnalyzer</code>, <code>CareerRecommender</code> (RIASEC), and STAR coaching modules.</li>
          <li><strong>Reporting &amp; QA:</strong> ReportLab PDF executive/placement reports, CSV exports, Dockerfile + Docker Compose, and 20 unit &amp; integration <code>pytest</code> tests.</li>
        </ul>`
    },
    videoai: {
      title: "AI Video Assistant — Multimodal RAG Pipeline",
      html: `
        <p><strong>Repository:</strong> <a href="https://github.com/harshsharma2006/AI-Video-Assistant" target="_blank" rel="noopener noreferrer">github.com/harshsharma2006/AI-Video-Assistant ↗</a></p>
        <ul>
          <li><strong>Ingestion:</strong> <code>utils/audio_processor.py</code> handles YouTube URLs via <code>yt-dlp</code> and local video/audio files via <code>FFmpeg</code>.</li>
          <li><strong>Transcription:</strong> <code>core/transcriber.py</code> runs OpenAI Whisper ASR (<code>base</code> model) across audio chunks.</li>
          <li><strong>Vector Indexing:</strong> <code>core/vector_store.py</code> splits transcripts (500 chars / 50 overlap) and stores embeddings in <code>ChromaDB</code> using Hugging Face <code>sentence-transformers/all-MiniLM-L6-v2</code>.</li>
          <li><strong>LLM Chains:</strong> <code>core/summarize.py</code>, <code>core/extractor.py</code>, and <code>core/rag_engine.py</code> orchestrate LangChain LCEL + <code>ChatMistralAI</code> (<code>mistral-small-latest</code>) for map-reduce summaries, action items, decisions, open questions, and <code>k=4</code> grounded Q&amp;A.</li>
        </ul>`
    },
    mllab: {
      title: "Machine Learning Lab — 11 Implemented Practicals",
      html: `
        <p><strong>Repository:</strong> <a href="https://github.com/harshsharma2006/Machine-Learning-Lab" target="_blank" rel="noopener noreferrer">github.com/harshsharma2006/Machine-Learning-Lab ↗</a></p>
        <ul>
          <li><strong>01:</strong> Titanic dataset preprocessing (median <code>SimpleImputer</code> + train/test split)</li>
          <li><strong>02–03:</strong> Simple &amp; Multiple Linear Regression (House Prices &amp; Advertising Sales; MAE, MSE, R²)</li>
          <li><strong>04:</strong> Principal Component Analysis (PCA) dimensionality reduction on Iris</li>
          <li><strong>05–06:</strong> Logistic Regression (Social Network Ads) &amp; KNN odd-k tuning (Diabetes)</li>
          <li><strong>07:</strong> Spam email classification using <code>TfidfVectorizer</code> + <code>LinearSVC</code> &amp; <code>MultinomialNB</code></li>
          <li><strong>08–09:</strong> Gini Decision Tree (Breast Cancer) &amp; Random Forest <code>ColumnTransformer</code> pipeline (German Credit)</li>
          <li><strong>10–11:</strong> K-Means &amp; Ward Hierarchical clustering (silhouette score + dendrogram) and UCI HAR multi-model comparison</li>
        </ul>`
    }
  };

  const detailModal = document.getElementById("detailModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  document.querySelectorAll(".modal-open").forEach((btn) => {
    btn.addEventListener("click", () => {
      const data = MODAL_DATA[btn.dataset.modal];
      if (!data) return;
      modalTitle.textContent = data.title;
      modalBody.innerHTML = data.html;
      detailModal.classList.add("open");
      detailModal.setAttribute("aria-hidden", "false");
    });
  });
  document.getElementById("modalClose").addEventListener("click", () => {
    detailModal.classList.remove("open");
    detailModal.setAttribute("aria-hidden", "true");
  });
  detailModal.addEventListener("click", (e) => {
    if (e.target === detailModal) {
      detailModal.classList.remove("open");
      detailModal.setAttribute("aria-hidden", "true");
    }
  });

  // Toast & Copy Email
  const toast = document.getElementById("toast");
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2400);
  }
  document.getElementById("copyEmailBtn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("harshsharmashar8377@gmail.com");
      showToast("Email copied: harshsharmashar8377@gmail.com");
    } catch {
      showToast("Email: harshsharmashar8377@gmail.com");
    }
  });

  // Command Palette (Ctrl+K)
  const cmdModal = document.getElementById("cmdModal");
  const cmdInput = document.getElementById("cmdInput");
  const cmdList = document.getElementById("cmdList");
  const COMMANDS = [
    { label: "Jump to Projects", hint: "#projects", run: () => location.hash = "#projects" },
    { label: "Jump to Certificate Proofs", hint: "#certifications", run: () => location.hash = "#certifications" },
    { label: "Open TalentSphere Enterprise 2.0 Live App", hint: "Streamlit", run: () => window.open("https://talentsphereenterprise20-hq239uebmxwggycjex9icv.streamlit.app/", "_blank") },
    { label: "Open AI Video Assistant Repo", hint: "GitHub", run: () => window.open("https://github.com/harshsharma2006/AI-Video-Assistant", "_blank") },
    { label: "Download 2026 Resume PDF", hint: "PDF", run: () => document.querySelector(".nav-resume").click() },
    { label: "Jump to Experience", hint: "#experience", run: () => location.hash = "#experience" },
    { label: "Jump to Technical Skills", hint: "#skills", run: () => location.hash = "#skills" },
    { label: "Toggle Light / Dark Theme", hint: "Theme", run: () => themeToggle.click() },
    { label: "Open LinkedIn Profile", hint: "External", run: () => window.open("https://www.linkedin.com/in/harsh-sharma8377/", "_blank") },
  ];

  function renderCmds(q = "") {
    cmdList.innerHTML = "";
    COMMANDS.filter((c) => c.label.toLowerCase().includes(q.toLowerCase())).forEach((c) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "cmd-item";
      b.innerHTML = `<strong>${c.label}</strong><span>${c.hint}</span>`;
      b.addEventListener("click", () => {
        cmdModal.classList.remove("open");
        c.run();
      });
      cmdList.appendChild(b);
    });
  }
  function openCmd() {
    renderCmds("");
    cmdInput.value = "";
    cmdModal.classList.add("open");
    cmdInput.focus();
  }
  document.getElementById("cmdBtn").addEventListener("click", openCmd);
  cmdInput.addEventListener("input", () => renderCmds(cmdInput.value));
  cmdModal.addEventListener("click", (e) => { if (e.target === cmdModal) cmdModal.classList.remove("open"); });
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openCmd();
    } else if (e.key === "Escape") {
      cmdModal.classList.remove("open");
      detailModal.classList.remove("open");
      closeLightbox();
    }
  });

  // Ask Harsh AI Assistant
  const aiFab = document.getElementById("aiFab");
  const aiPanel = document.getElementById("aiPanel");
  const aiMessages = document.getElementById("aiMessages");
  const aiForm = document.getElementById("aiForm");
  const aiInput = document.getElementById("aiInput");

  function toggleAi(force) {
    const open = force !== undefined ? force : !aiPanel.classList.contains("open");
    aiPanel.classList.toggle("open", open);
    aiPanel.setAttribute("aria-hidden", String(!open));
    aiFab.setAttribute("aria-expanded", String(open));
  }
  aiFab.addEventListener("click", () => toggleAi());
  document.getElementById("aiClose").addEventListener("click", () => toggleAi(false));
  document.getElementById("openAiFromHero").addEventListener("click", () => toggleAi(true));

  function answerQuery(raw) {
    const q = raw.toLowerCase();
    if (q.includes("project") || q.includes("talentsphere") || q.includes("video") || q.includes("ml lab") || q.includes("built")) {
      return "Harsh's flagship projects:<br>1) <strong>TalentSphere Enterprise 2.0</strong> (Live on Streamlit): 28 SQLAlchemy models, 6-role RBAC, Scikit-learn TF-IDF ATS scoring, ReportLab PDFs, Docker &amp; 20 pytest tests.<br>2) <strong>AI Video Assistant</strong>: Whisper ASR + LangChain + ChromaDB + Mistral AI RAG Q&amp;A.<br>3) <strong>Machine Learning Lab</strong>: 11 end-to-end Scikit-learn pipelines.";
    }
    if (q.includes("intern") || q.includes("aishwi") || q.includes("oriva") || q.includes("experience") || q.includes("work")) {
      return "Harsh has completed two Data Analytics internships: <strong>Oriva Lifesciences Pvt. Ltd.</strong> (Jun–Jul 2026, On-site: Python, SQL, Excel, Power BI reporting) and <strong>Aishwi Technologies</strong> (Jul–Nov 2025, Remote: EDA &amp; visualization on production datasets), plus Cognifyz analytics tasks and ICSsCT-2025 / NSS leadership.";
    }
    if (q.includes("skill") || q.includes("stack") || q.includes("tech") || q.includes("python") || q.includes("sql") || q.includes("power bi")) {
      return "Core stack: <strong>Python, SQL, C/C++</strong> · <strong>Pandas, NumPy, Scikit-learn, Matplotlib, Plotly, Power BI</strong> · <strong>LangChain, RAG, Whisper, ChromaDB, Hugging Face, Mistral AI</strong> · <strong>Streamlit, SQLAlchemy, MySQL, PostgreSQL, Docker, pytest, Git</strong>.";
    }
    if (q.includes("cert") || q.includes("nptel") || q.includes("cisco") || q.includes("ey") || q.includes("snowflake")) {
      return "Harsh holds <strong>18+ certifications</strong>, including the <strong>Snowflake Generative AI Professional Certificate</strong> (Nov 2026), <strong>NPTEL Data Analytics with Python (Elite, Jan–May 2026)</strong>, <strong>NPTEL Cloud Computing</strong>, <strong>EY &amp; Microsoft AI Skills Passport</strong>, <strong>Cisco Data Analytics &amp; Cybersecurity</strong>, <strong>HackerRank Python (Basic)</strong>, and <strong>HP LIFE Data Science</strong>.";
    }
    if (q.includes("hire") || q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("resume")) {
      return "Harsh is actively seeking <strong>Data Science, Data Analyst, AI/ML, GenAI, and Python Developer internships</strong>.<br>📧 harshsharmashar8377@gmail.com<br>📞 +91 8377859493";
    }
    if (q.includes("who") || q.includes("about") || q.includes("harsh") || q.includes("education") || q.includes("college")) {
      return "Harsh Sharma is a B.Tech CSE (Data Science) student at <strong>Lingaya's Vidyapeeth, Faridabad (2024–2028)</strong>, former Data Analyst Intern at Aishwi Technologies, and builder of applied AI/ML &amp; RAG systems.";
    }
    return "I can answer questions about Harsh's <strong>projects</strong> (TalentSphere 2.0, AI Video Assistant, ML Lab), <strong>Aishwi Technologies internship</strong>, <strong>tech stack</strong>, <strong>certifications</strong>, or <strong>contact details</strong>!";
  }

  function pushAiTurn(text) {
    const u = document.createElement("div");
    u.className = "ai-msg user";
    u.textContent = text;
    aiMessages.appendChild(u);

    const b = document.createElement("div");
    b.className = "ai-msg bot";
    b.innerHTML = answerQuery(text);
    aiMessages.appendChild(b);
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }

  document.querySelectorAll(".ai-chip").forEach((c) =>
    c.addEventListener("click", () => pushAiTurn(c.dataset.q))
  );
  aiForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = aiInput.value.trim();
    if (!val) return;
    aiInput.value = "";
    pushAiTurn(val);
  });

  // Multi-Color Neural Canvas Background
  const canvas = document.getElementById("neuralBg");
  const ctx = canvas.getContext("2d");
  let pts = [];
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = Math.min(44, Math.floor((canvas.width * canvas.height) / 26000));
    const palette = ["#38bdf8", "#a855f7", "#34d399", "#ec4899"];
    pts = Array.from({ length: count }, (_, idx) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.36,
      vy: (Math.random() - 0.5) * 0.36,
      color: palette[idx % palette.length],
    }));
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function drawBg() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isLight = html.getAttribute("data-theme") === "light";
    ctx.strokeStyle = isLight ? "rgba(37, 99, 235, 0.08)" : "rgba(129, 140, 248, 0.12)";
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      if (!reduceMotion) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }
      ctx.fillStyle = p.color;
      ctx.globalAlpha = isLight ? 0.35 : 0.45;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 135) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
    if (!reduceMotion) requestAnimationFrame(drawBg);
  }
  drawBg();
})();
