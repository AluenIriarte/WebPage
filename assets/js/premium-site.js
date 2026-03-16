(function () {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const heroData = {
    weekly: {
      label: "Esta semana",
      metrics: [
        { label: "Expansion", value: "$127K", caption: "potencial cross-sell" },
        { label: "Rentabilidad", value: "+18%", caption: "mejora de margen" },
      ],
      chart: {
        labels: ["L", "M", "X", "J", "V", "S", "D"],
        ventas: [42, 58, 35, 71, 63, 28, 19],
        margen: [28, 41, 22, 55, 48, 18, 12],
      },
    },
    monthly: {
      label: "Este mes",
      metrics: [
        { label: "Expansion", value: "$348K", caption: "potencial cross-sell" },
        { label: "Rentabilidad", value: "+22%", caption: "mejora de margen" },
      ],
      chart: {
        labels: ["S1", "S2", "S3", "S4"],
        ventas: [180, 220, 195, 260],
        margen: [125, 158, 140, 190],
      },
    },
    quarterly: {
      label: "Q1 2026",
      metrics: [
        { label: "Expansion", value: "$890K", caption: "potencial cross-sell" },
        { label: "Rentabilidad", value: "+31%", caption: "mejora de margen" },
      ],
      chart: {
        labels: ["Ene", "Feb", "Mar"],
        ventas: [520, 680, 740],
        margen: [380, 490, 560],
      },
    },
  };

  function initHeader() {
    const header = $("[data-site-header]");
    if (!header) return;

    const setScrolled = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
    };

    setScrolled();
    window.addEventListener("scroll", setScrolled, { passive: true });

    const mobileToggle = $("[data-mobile-toggle]");
    const mobilePanel = $("[data-mobile-panel]");
    if (mobileToggle && mobilePanel) {
      mobileToggle.addEventListener("click", () => {
        const isOpen = mobilePanel.classList.toggle("is-open");
        mobileToggle.setAttribute("aria-expanded", String(isOpen));
        document.body.classList.toggle("menu-open", isOpen);
      });

      $$("a", mobilePanel).forEach((link) => {
        link.addEventListener("click", () => {
          mobilePanel.classList.remove("is-open");
          mobileToggle.setAttribute("aria-expanded", "false");
          document.body.classList.remove("menu-open");
        });
      });
    }

    $$("[data-mobile-submenu-toggle]").forEach((button) => {
      const target = document.getElementById(button.getAttribute("data-mobile-submenu-toggle"));
      if (!target) return;
      button.addEventListener("click", () => {
        const isOpen = target.classList.toggle("is-open");
        button.setAttribute("aria-expanded", String(isOpen));
      });
    });

    $$("[data-dropdown]").forEach((dropdown) => {
      const trigger = $("[data-dropdown-trigger]", dropdown);
      if (!trigger) return;
      const open = () => dropdown.classList.add("is-open");
      const close = () => dropdown.classList.remove("is-open");
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        dropdown.classList.toggle("is-open");
      });
      dropdown.addEventListener("mouseenter", open);
      dropdown.addEventListener("mouseleave", close);
      document.addEventListener("click", (event) => {
        if (!dropdown.contains(event.target)) close();
      });
    });
  }

  function initReveals() {
    const nodes = $$("[data-reveal]");
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
    );

    nodes.forEach((node) => observer.observe(node));
  }

  function initMetricBars() {
    $$("[data-fill]").forEach((bar) => {
      const wrapper = bar.closest(".metric-bar");
      if (!wrapper) return;
      bar.style.setProperty("--fill", `${bar.getAttribute("data-fill")}%`);
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              wrapper.classList.add("is-ready");
              observer.disconnect();
            }
          });
        },
        { threshold: 0.4 }
      );
      observer.observe(wrapper);
    });
  }

  function initFaqs() {
    $$("[data-faq-group]").forEach((group) => {
      const items = $$("[data-faq-item]", group);
      items.forEach((item) => {
        const trigger = $("[data-faq-trigger]", item);
        const panel = $("[data-faq-panel]", item);
        if (!trigger || !panel) return;

        trigger.addEventListener("click", () => {
          const willOpen = !item.classList.contains("is-open");
          items.forEach((other) => {
            other.classList.remove("is-open");
            const otherPanel = $("[data-faq-panel]", other);
            const otherTrigger = $("[data-faq-trigger]", other);
            if (otherPanel) otherPanel.style.maxHeight = "0px";
            if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
          });

          if (willOpen) {
            item.classList.add("is-open");
            panel.style.maxHeight = `${panel.scrollHeight}px`;
            trigger.setAttribute("aria-expanded", "true");
          }
        });
      });
    });
  }

  function initMailForms() {
    $$("[data-mail-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        const feedback = $(".form-feedback", form.parentElement || form);
        const data = new FormData(form);
        const lines = [];

        for (const [key, value] of data.entries()) {
          const normalized = String(value).trim();
          if (!normalized) continue;
          lines.push(`${key}: ${normalized}`);
        }

        if (!lines.length) return;

        const subject = encodeURIComponent(form.dataset.mailSubject || "Consulta desde sitio web");
        const intro = form.dataset.mailIntro ? `${form.dataset.mailIntro}\n\n` : "";
        const body = encodeURIComponent(`${intro}${lines.join("\n")}`);
        const mailTo = form.dataset.mailTo || "alanlperez1996@gmail.com";

        window.location.href = `mailto:${mailTo}?subject=${subject}&body=${body}`;

        if (feedback) {
          feedback.textContent =
            form.dataset.feedback ||
            "Se abrio un borrador de correo con tus datos para completar el envio.";
          feedback.classList.add("is-visible");
        }
      });
    });
  }

  function initHeroDashboard() {
    const canvas = document.getElementById("heroChart");
    if (!canvas || typeof window.Chart === "undefined") return;

    const metricNodes = $$("[data-hero-metric]");
    const periodLabel = document.getElementById("heroPeriodLabel");
    let currentPeriod = "monthly";

    const chart = new window.Chart(canvas, {
      type: "line",
      data: {
        labels: heroData[currentPeriod].chart.labels,
        datasets: [
          {
            label: "Ventas",
            data: heroData[currentPeriod].chart.ventas,
            borderColor: "#8b5cf6",
            backgroundColor: "rgba(139, 92, 246, 0.18)",
            fill: true,
            tension: 0.42,
            pointRadius: 0,
            pointHoverRadius: 4,
          },
          {
            label: "Margen",
            data: heroData[currentPeriod].chart.margen,
            borderColor: "#06b6d4",
            backgroundColor: "rgba(6, 182, 212, 0.12)",
            fill: true,
            tension: 0.42,
            pointRadius: 0,
            pointHoverRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 450 },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(255,255,255,0.96)",
            titleColor: "#111111",
            bodyColor: "#4b5563",
            borderColor: "rgba(17,17,17,0.08)",
            borderWidth: 1,
            titleFont: { weight: 700 },
            bodyFont: { weight: 500 },
            displayColors: true,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: "#9ca3af", font: { size: 10, weight: "600" } },
          },
          y: {
            grid: { color: "rgba(17,17,17,0.06)", drawBorder: false },
            border: { display: false },
            ticks: { color: "#9ca3af", font: { size: 10 } },
          },
        },
      },
    });

    const syncHero = () => {
      const active = heroData[currentPeriod];
      chart.data.labels = active.chart.labels;
      chart.data.datasets[0].data = active.chart.ventas;
      chart.data.datasets[1].data = active.chart.margen;
      chart.update();

      metricNodes.forEach((node, index) => {
        const metric = active.metrics[index];
        const value = $("[data-hero-value]", node);
        const label = $("[data-hero-label]", node);
        const caption = $("[data-hero-caption]", node);
        if (metric && value && label && caption) {
          value.textContent = metric.value;
          label.textContent = metric.label;
          caption.textContent = metric.caption;
        }
      });

      if (periodLabel) periodLabel.textContent = active.label;
    };

    $$("[data-period]").forEach((button) => {
      button.addEventListener("click", () => {
        currentPeriod = button.getAttribute("data-period") || "monthly";
        $$("[data-period]").forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        syncHero();
      });
    });

    syncHero();
  }

  function setChartDefaults() {
    if (typeof window.Chart === "undefined") return false;

    window.Chart.defaults.font.family = '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    window.Chart.defaults.color = "#6b7280";
    window.Chart.defaults.plugins.legend.labels.usePointStyle = true;
    window.Chart.defaults.plugins.legend.labels.boxWidth = 10;
    window.Chart.defaults.plugins.legend.labels.boxHeight = 10;
    return true;
  }

  function chartTooltip(labelFormatter) {
    return {
      backgroundColor: "rgba(255,255,255,0.96)",
      titleColor: "#111111",
      bodyColor: "#4b5563",
      borderColor: "rgba(17,17,17,0.08)",
      borderWidth: 1,
      titleFont: { weight: 700 },
      bodyFont: { weight: 500 },
      callbacks: labelFormatter ? { label: labelFormatter } : {},
    };
  }

  function lineChart(canvasId, labels, datasets, yTick) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    new window.Chart(canvas, {
      type: "line",
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { tooltip: chartTooltip(), legend: { position: "bottom" } },
        scales: {
          x: { grid: { display: false }, border: { display: false } },
          y: {
            grid: { color: "rgba(17,17,17,0.06)" },
            border: { display: false },
            ticks: yTick || {},
          },
        },
      },
    });
  }

  function barChart(canvasId, labels, datasets, horizontal, yTick) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    new window.Chart(canvas, {
      type: "bar",
      data: { labels, datasets },
      options: {
        indexAxis: horizontal ? "y" : "x",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { tooltip: chartTooltip(), legend: { position: "bottom" } },
        scales: {
          x: {
            grid: { color: horizontal ? "rgba(17,17,17,0.06)" : "transparent" },
            border: { display: false },
            ticks: horizontal && yTick ? yTick : {},
          },
          y: {
            grid: { color: horizontal ? "transparent" : "rgba(17,17,17,0.06)" },
            border: { display: false },
            ticks: !horizontal && yTick ? yTick : {},
          },
        },
      },
    });
  }

  function initCharts() {
    if (!setChartDefaults()) return;

    lineChart(
      "dashboardRevenueChart",
      ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago"],
      [
        { label: "Ventas", data: [420, 380, 510, 490, 560, 620, 580, 670], borderColor: "#8b5cf6", backgroundColor: "rgba(139,92,246,0.12)", fill: true, tension: 0.4, pointRadius: 3 },
        { label: "Meta", data: [400, 420, 440, 460, 480, 500, 520, 540], borderColor: "#d1d5db", borderDash: [6, 6], tension: 0.4, pointRadius: 0 },
      ],
      { callback: (value) => `$${value}K` }
    );

    barChart(
      "dashboardChannelChart",
      ["Canal Directo", "Distribuidores", "E-commerce", "Key Accounts"],
      [{ label: "Participacion", data: [38, 27, 21, 14], backgroundColor: "#8b5cf6", borderRadius: 8 }],
      true,
      { callback: (value) => `${value}%` }
    );

    const pipelineCanvas = document.getElementById("salesPipelineChart");
    if (pipelineCanvas) {
      new window.Chart(pipelineCanvas, {
        data: {
          labels: ["Prospectos", "Calificados", "Propuesta", "Negociacion", "Cierre"],
          datasets: [
            { type: "bar", label: "Cantidad", data: [240, 180, 110, 62, 38], backgroundColor: "#8b5cf6", borderRadius: 8 },
            { type: "line", label: "Conversion %", data: [100, 75, 46, 26, 16], borderColor: "#cbd5e1", tension: 0.4, yAxisID: "y1", pointRadius: 3, fill: false },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { tooltip: chartTooltip(), legend: { position: "bottom" } },
          scales: {
            x: { grid: { display: false }, border: { display: false } },
            y: { grid: { color: "rgba(17,17,17,0.06)" }, border: { display: false } },
            y1: {
              position: "right",
              grid: { drawOnChartArea: false },
              border: { display: false },
              ticks: { callback: (value) => `${value}%` },
            },
          },
        },
      });
    }

    barChart(
      "salesRepChart",
      ["M. Garcia", "P. Lopez", "S. Torres", "R. Diaz", "L. Mendez"],
      [{ label: "Cumplimiento", data: [94, 87, 112, 78, 103], backgroundColor: "#8b5cf6", borderRadius: 8 }],
      true,
      { callback: (value) => `${value}%` }
    );

    lineChart(
      "salesStructureChart",
      ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"],
      [
        { label: "Nuevas ventas", data: [18, 22, 15, 28, 31, 24, 36, 42], borderColor: "#8b5cf6", backgroundColor: "rgba(139,92,246,0.25)", fill: true, tension: 0.4, pointRadius: 0 },
        { label: "Renovaciones", data: [32, 28, 35, 31, 29, 38, 34, 40], borderColor: "#a78bfa", backgroundColor: "rgba(167,139,250,0.14)", fill: true, tension: 0.4, pointRadius: 0 },
        { label: "Perdidas", data: [4, 6, 3, 5, 7, 4, 6, 5], borderColor: "#cbd5e1", backgroundColor: "rgba(226,232,240,0.45)", fill: true, tension: 0.4, pointRadius: 0 },
      ]
    );

    const radarCanvas = document.getElementById("kpiRadarChart");
    if (radarCanvas) {
      new window.Chart(radarCanvas, {
        type: "radar",
        data: {
          labels: ["Tasa cierre", "Retencion", "Ticket prom.", "Cobertura", "Velocidad", "Cross-sell"],
          datasets: [{ label: "Desempeno", data: [72, 85, 60, 90, 55, 40], borderColor: "#8b5cf6", backgroundColor: "rgba(139,92,246,0.2)", pointBackgroundColor: "#8b5cf6" }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: chartTooltip() },
          scales: { r: { angleLines: { color: "rgba(17,17,17,0.08)" }, grid: { color: "rgba(17,17,17,0.08)" }, pointLabels: { color: "#6b7280" }, suggestedMax: 100 } },
        },
      });
    }

    lineChart(
      "retentionChart",
      ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago"],
      [{ label: "Retencion", data: [88, 85, 91, 89, 83, 86, 90, 93], borderColor: "#8b5cf6", backgroundColor: "rgba(139,92,246,0.12)", fill: true, tension: 0.42, pointRadius: 3 }],
      { callback: (value) => `${value}%` }
    );

    barChart(
      "cacChart",
      ["Inbound", "Outbound", "Referidos", "Key Accounts"],
      [
        { label: "CAC", data: [420, 680, 210, 1200], backgroundColor: "#e9d5ff", borderRadius: 8 },
        { label: "LTV", data: [4800, 6200, 5100, 18000], backgroundColor: "#8b5cf6", borderRadius: 8 },
      ],
      false,
      { callback: (value) => `$${value}` }
    );

    lineChart(
      "boardTrendChart",
      ["Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct"],
      [{ label: "Ventas", data: [3890, 4120, 3750, 4380, 4210, 4920, 5180, 5040], borderColor: "#8b5cf6", backgroundColor: "rgba(139,92,246,0.12)", fill: true, tension: 0.4, pointRadius: 3 }],
      { callback: (value) => `$${(value / 1000).toFixed(1)}K` }
    );

    barChart(
      "boardRegionChart",
      ["AMBA", "NOA", "NEA", "Cuyo", "Patagonia", "Centro"],
      [
        { label: "Meta", data: [1600, 900, 600, 650, 400, 850], backgroundColor: "#e9d5ff", borderRadius: 8 },
        { label: "Real", data: [1840, 720, 540, 680, 410, 930], backgroundColor: "#8b5cf6", borderRadius: 8 },
      ],
      false
    );

    const bubbleCanvas = document.getElementById("boardSegmentChart");
    if (bubbleCanvas) {
      new window.Chart(bubbleCanvas, {
        type: "bubble",
        data: {
          datasets: [{
            label: "Segmentos",
            data: [
              { x: 12, y: 2400, r: 12, name: "Segmento A" },
              { x: 8, y: 1800, r: 10, name: "Segmento B" },
              { x: 24, y: 4200, r: 18, name: "Segmento C" },
              { x: 4, y: 800, r: 9, name: "Segmento D" },
              { x: 18, y: 3100, r: 15, name: "Segmento E" },
              { x: 6, y: 1200, r: 9, name: "Segmento F" },
              { x: 30, y: 6800, r: 22, name: "Segmento G" },
            ],
            backgroundColor: "rgba(139,92,246,0.48)",
            borderColor: "#8b5cf6",
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: chartTooltip((context) => {
              const point = context.raw;
              return `${point.name}: ${point.x} compras/ano, $${point.y}`;
            }),
          },
          scales: {
            x: { title: { display: true, text: "Frecuencia de compra" }, grid: { color: "rgba(17,17,17,0.06)" }, border: { display: false } },
            y: { title: { display: true, text: "Ticket promedio" }, grid: { color: "rgba(17,17,17,0.06)" }, border: { display: false } },
          },
        },
      });
    }
  }

  function initToc() {
    const links = $$(".toc-link");
    if (!links.length) return;
    const sections = links
      .map((link) => document.getElementById(link.getAttribute("href").replace("#", "")))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = $(`.toc-link[href="#${entry.target.id}"]`);
          if (!link) return;
          if (entry.isIntersecting) {
            links.forEach((item) => item.classList.remove("is-active"));
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0.01 }
    );
    sections.forEach((section) => observer.observe(section));
  }

  document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initReveals();
    initMetricBars();
    initFaqs();
    initMailForms();
    initHeroDashboard();
    initCharts();
    initToc();
  });
})();
