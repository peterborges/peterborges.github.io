// Case Study Template Renderer
// Updates to this file will apply to ALL case studies

class CaseStudyRenderer {
  constructor(containerId, dataUrl) {
    this.container = document.getElementById(containerId);
    this.dataUrl = dataUrl;
  }

  async render() {
    try {
      const response = await fetch(this.dataUrl);
      const data = await response.json();
      this.container.innerHTML = this.generateHTML(data);
      this.initAnimations();
    } catch (error) {
      console.error('Error loading case study data:', error);
      this.container.innerHTML = '<p>Error loading case study.</p>';
    }
  }

  generateHTML(data) {
    return `
      <section class="case-study">
        ${this.renderHeader(data)}
        ${this.renderHero(data)}
        ${this.renderContext(data)}
        ${data.outcomes ? this.renderOutcomes(data.outcomes) : ''}
        ${data.sections ? data.sections.map(section => this.renderSection(section)).join('') : ''}
        ${data.cta ? this.renderCTA(data.cta) : ''}
      </section>
      ${data.nextCaseStudy ? this.renderNextCaseStudy(data.nextCaseStudy) : ''}
    `;
  }

  // ============================================
  // HEADER SECTION
  // ============================================
  renderHeader(data) {
    return `
      <h1>${data.title}</h1>
      <p class="subtitle">${data.subtitle}</p>
    `;
  }

  // ============================================
  // HERO IMAGE/VIDEO
  // ============================================
  renderHero(data) {
    if (!data.hero) return '';
    
    if (data.hero.type === 'video') {
      return `
        <video class="hero-video" autoplay muted loop playsinline>
          <source src="${data.hero.src}" type="video/mp4">
        </video>
      `;
    }
    
    return `<img src="${data.hero.src}" alt="${data.hero.alt || data.title}" class="hero-image ${data.hero.noCard ? 'no-card' : ''}" />`;
  }

  // ============================================
  // PROJECT CONTEXT BLOCK
  // ============================================
  renderContext(data) {
    if (!data.context) return '';
    const ctx = data.context;
    
    return `
      <div class="project-context-block">
        <div class="context-left">
          ${ctx.role ? `
            <div class="context-section">
              <h4>My Role</h4>
              <p class="role-title"><strong>${ctx.role.title}</strong> — ${ctx.role.skills.join(', ')}</p>
            </div>
          ` : ''}
          
          ${ctx.team ? `
            <div class="context-section">
              <h4>Team</h4>
              ${ctx.team.map(member => `<p>${member}</p>`).join('')}
            </div>
          ` : ''}
          
          ${ctx.timeline ? `
            <div class="context-section">
              <h4>Timeline & Status</h4>
              <p>${ctx.timeline.duration}, <strong>${ctx.timeline.status}</strong></p>
            </div>
          ` : ''}
        </div>
        
        <div class="context-right">
          ${ctx.overview ? `
            <div class="context-section">
              <h4>Overview</h4>
              ${ctx.overview.map(p => `<p>${p}</p>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // ============================================
  // OUTCOMES SECTION (Big Numbers)
  // ============================================
  renderOutcomes(outcomes) {
    return `
      <div class="outcomes-section">
        <h2>Outcomes</h2>
        <div class="outcomes-grid">
          ${outcomes.map(outcome => `
            <div class="outcome-item">
              <div class="outcome-number">${outcome.value}</div>
              <div class="outcome-label">${outcome.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ============================================
  // GENERIC SECTION ROUTER
  // ============================================
  renderSection(section) {
    switch (section.type) {
      case 'text':
        return this.renderTextSection(section);
      case 'challenge':
        return this.renderChallengeSection(section);
      case 'problems':
        return this.renderProblemsSection(section);
      case 'features':
        return this.renderFeaturesSection(section);
      case 'testimonials':
        return this.renderTestimonialsSection(section);
      case 'iterations':
        return this.renderIterationsSection(section);
      case 'learnings':
        return this.renderLearningsSection(section);
      case 'highlight':
        return this.renderHighlightSection(section);
      case 'media':
        return this.renderMediaSection(section);
      case 'images-grid':
        return this.renderImagesGrid(section);
      case 'insights':
        return this.renderInsightsSection(section);
      case 'design-flow':
        return this.renderDesignFlow(section);
      case 'outcomes-list':
        return this.renderOutcomesList(section);
      default:
        return this.renderTextSection(section);
    }
  }

  // ============================================
  // TEXT SECTION (Users, Conclusion, etc.)
  // ============================================
  renderTextSection(section) {
    let html = `<h2>${section.title}</h2>`;
    
    if (section.paragraphs) {
      html += section.paragraphs.map(p => `<p>${p}</p>`).join('');
    }
    
    if (section.lists) {
      section.lists.forEach(list => {
        if (list.intro) html += `<p>${list.intro}</p>`;
        html += `<ul>${list.items.map(item => `<li>${item}</li>`).join('')}</ul>`;
      });
    }

    if (section.subsections) {
      html += section.subsections.map(sub => `
        <h3>${sub.title}</h3>
        ${sub.paragraphs ? sub.paragraphs.map(p => `<p>${p}</p>`).join('') : ''}
        ${sub.lists ? sub.lists.map(list => `<ul>${list.items.map(item => `<li>${item}</li>`).join('')}</ul>`).join('') : ''}
        ${sub.media ? this.renderFeatureMedia(sub.media) : ''}
      `).join('');
    }
    
    return html;
  }

  // ============================================
  // CHALLENGE SECTION (Distinctive Typography)
  // ============================================
  renderChallengeSection(section) {
    const icons = {
      lock: '<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
      cloud: '<svg viewBox="0 0 24 24"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>',
      users: '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
      clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
      alert: '<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
      x: '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
      layers: '<svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
      zap: '<svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
      file: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>',
      search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>'
    };

    let html = `
      <div class="challenge-section">
        <div class="challenge-header">
          <div class="challenge-label">${section.label || 'Problem Space'}</div>
          <h2>${section.headline}</h2>
        </div>
    `;

    if (section.cards && section.cards.length > 0) {
      html += `
        <div class="challenge-grid">
          <div class="challenge-intro">
            ${section.subheading ? `<p class="challenge-subheading">${section.subheading}</p>` : ''}
          </div>
          <div class="challenge-cards">
            ${section.cards.map(card => `
              <div class="challenge-card">
                <div class="challenge-card-icon">${icons[card.icon] || icons.alert}</div>
                <p>${card.text}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    html += '</div>';
    return html;
  }

  // ============================================
  // PROBLEMS SECTION (with quotes)
  // ============================================
  renderProblemsSection(section) {
    let html = `<h2>${section.title}</h2>`;
    
    html += section.problems.map(problem => `
      <div class="problem-section">
        <h3>${problem.title}</h3>
        <p><strong>Description:</strong> ${problem.description}</p>
        ${problem.quote ? `
          <blockquote>
            <p>"${problem.quote.text}"</p>
            <cite>${problem.quote.author}</cite>
          </blockquote>
        ` : ''}
      </div>
    `).join('');
    
    return html;
  }

  // ============================================
  // FEATURES SECTION (Distinctive Typography)
  // ============================================
  renderFeaturesSection(section) {
    let html = `<h2>${section.title}</h2>`;
    
    html += section.features.map((feature, index) => `
      <div class="feature-section">
        <div class="feature-header">
          <div class="feature-label">${feature.label || `Feature ${String(index + 1).padStart(2, '0')} — ${feature.name}`}</div>
          <h3>${feature.headline}</h3>
        </div>
        <div class="feature-content">
          <div class="feature-subtitle">${feature.before}</div>
          <p>${feature.description}</p>
        </div>
        ${feature.media ? this.renderFeatureMedia(feature.media) : ''}
      </div>
    `).join('');
    
    return html;
  }

  renderFeatureMedia(media) {
    if (!media) return '';
    
    if (media.type === 'video') {
      return `
        <div class="feature-media">
          <video autoplay muted loop playsinline class="hero-image">
            <source src="${media.src}" type="video/mp4">
          </video>
        </div>
      `;
    }
    
    return `
      <div class="feature-media">
        <img src="${media.src}" alt="${media.alt || ''}" class="hero-image" />
      </div>
    `;
  }

  // ============================================
  // ITERATIONS SECTION
  // ============================================
  renderIterationsSection(section) {
    let html = `<h2>${section.title}</h2>`;
    
    if (section.intro) {
      html += `<p>${section.intro}</p>`;
    }
    
    if (section.items) {
      html += section.items.map(item => `
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        ${item.media ? this.renderFeatureMedia(item.media) : ''}
      `).join('');
    }
    
    return html;
  }

  // ============================================
  // LEARNINGS SECTION
  // ============================================
  renderLearningsSection(section) {
    let html = `<h2>${section.title}</h2>`;
    
    html += `<ul>${section.items.map(item => `<li><strong>${item.title}</strong> ${item.description}</li>`).join('')}</ul>`;
    
    return html;
  }

  // ============================================
  // TESTIMONIALS SECTION
  // ============================================
  renderTestimonialsSection(section) {
    let html = `<h2>${section.title}</h2>`;
    
    html += section.quotes.map(quote => `
      <blockquote>
        <p>"${quote.text}"</p>
        <cite>${quote.author}</cite>
      </blockquote>
    `).join('');
    
    return html;
  }

  // ============================================
  // HIGHLIGHT CARD SECTION
  // ============================================
  renderHighlightSection(section) {
    return `
      <div class="highlight-card">
        <h2>${section.title}</h2>
        <ul class="highlight-list">
          ${section.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // ============================================
  // MEDIA SECTION (standalone image/video)
  // ============================================
  renderMediaSection(section) {
    let html = section.title ? `<h2>${section.title}</h2>` : '';
    if (section.intro) html += `<p>${section.intro}</p>`;
    html += this.renderFeatureMedia(section.media);
    return html;
  }

  // ============================================
  // IMAGES GRID (for quotes, screenshots, etc.)
  // ============================================
  renderImagesGrid(section) {
    let html = section.title ? `<h2>${section.title}</h2>` : '';
    if (section.intro) html += `<p>${section.intro}</p>`;
    
    html += `<div class="quotes-grid">
      ${section.images.map(img => `<img src="${img.src}" alt="${img.alt || ''}" />`).join('')}
    </div>`;
    
    return html;
  }

  // ============================================
  // INSIGHTS SECTION (competitive analysis, etc.)
  // ============================================
  renderInsightsSection(section) {
    let html = `<h2>${section.title}</h2>`;
    
    if (section.items) {
      html += section.items.map(item => `
        ${item.icon || ''} <strong>${item.title}</strong><br>
        ${item.description}
        <br><br>
      `).join('');
    }

    if (section.competitive) {
      html += `
        <div class="insight-section">
          <div class="insight-text">
            <h3>Competitive Analysis</h3>
            <ul>
              ${section.competitive.map(item => `<li><strong>${item.name}</strong><br>${item.description}</li>`).join('')}
            </ul>
          </div>
          ${section.competitiveImages ? `
            <div class="insight-image-row">
              ${section.competitiveImages.map(img => `
                <div class="image-wrapper">
                  <img src="${img.src}" alt="${img.alt || ''}" />
                  ${img.caption ? `<p class="image-caption">${img.caption}</p>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;
    }
    
    return html;
  }

  // ============================================
  // DESIGN FLOW DIAGRAM
  // ============================================
  renderDesignFlow(section) {
    let html = section.title ? `<h3>${section.title}</h3>` : '';
    
    html += `<div class="design-flow">
      ${section.steps.map((step, index) => `
        <div class="flow-step">
          <div class="flow-icon">${step.icon}</div>
          <p>${step.label}</p>
        </div>
        ${index < section.steps.length - 1 ? '<div class="flow-arrow">→</div>' : ''}
      `).join('')}
    </div>`;
    
    return html;
  }

  // ============================================
  // OUTCOMES LIST (simpler than outcomes grid)
  // ============================================
  renderOutcomesList(section) {
    let html = `<h2>${section.title}</h2>`;
    html += `<ul>${section.items.map(item => `<li>${item}</li>`).join('')}</ul>`;
    return html;
  }

  // ============================================
  // CTA LINK
  // ============================================
  renderCTA(cta) {
    return `<p><a href="${cta.url}" target="_blank" class="resume-download">${cta.text}</a></p>`;
  }

  // ============================================
  // NEXT CASE STUDY CTA
  // ============================================
  renderNextCaseStudy(next) {
    return `
      <div class="next-case-study">
        <div class="next-case-study-inner">
          <span class="next-label">Next Case Study</span>
          <a href="${next.url}" class="next-case-study-card">
            <div class="next-case-study-info">
              <h3>${next.title}</h3>
              <p>${next.description}</p>
            </div>
            <img src="${next.image}" alt="${next.title}" class="next-case-study-image" />
          </a>
        </div>
      </div>
    `;
  }

  // ============================================
  // ANIMATIONS
  // ============================================
  initAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const heroTitle = this.container.querySelector('.case-study h1');
    const subtitle = this.container.querySelector('.case-study .subtitle');
    if (heroTitle) setTimeout(() => heroTitle.classList.add('fade-in-up'), 0);
    if (subtitle) setTimeout(() => subtitle.classList.add('fade-in-up'), 0);

    const heroMedia = this.container.querySelectorAll('.hero-image, .hero-video');
    heroMedia.forEach((el, index) => {
      setTimeout(() => el.classList.add('fade-in-up'), 200 + (index * 100));
    });

    const h2Sections = this.container.querySelectorAll('.case-study h2');
    h2Sections.forEach((h2, index) => {
      setTimeout(() => h2.classList.add('fade-in-up'), 300 + (index * 100));
    });

    const h3Sections = this.container.querySelectorAll('.case-study h3');
    h3Sections.forEach((h3, index) => {
      setTimeout(() => h3.classList.add('fade-in-up'), 400 + (index * 50));
    });

    const problemSections = this.container.querySelectorAll('.problem-section');
    problemSections.forEach((section, index) => {
      setTimeout(() => section.classList.add('fade-in-up'), 500 + (index * 100));
    });

    const blockquotes = this.container.querySelectorAll('.case-study blockquote');
    blockquotes.forEach((quote, index) => {
      setTimeout(() => quote.classList.add('fade-in-up'), 600 + (index * 100));
    });

    const featureSections = this.container.querySelectorAll('.feature-section');
    featureSections.forEach((section, index) => {
      setTimeout(() => section.classList.add('fade-in-up'), 700 + (index * 100));
    });

    const featureMedia = this.container.querySelectorAll('.feature-media img, .feature-media video');
    featureMedia.forEach((media, index) => {
      setTimeout(() => media.classList.add('fade-in'), 800 + (index * 50));
    });
  }
}

// Export for use
window.CaseStudyRenderer = CaseStudyRenderer;
