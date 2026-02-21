// Side Rail Navigation for Case Studies
// Automatically generates a table of contents from h2 headings

let sideRailInitialized = false;

function initSideRail() {
  if (sideRailInitialized) return;
  
  const caseStudy = document.querySelector('.case-study');
  if (!caseStudy) return;
  
  sideRailInitialized = true;

  // Get all h2 headings in the case study
  const headings = caseStudy.querySelectorAll('h2');
  if (headings.length === 0) return;

  // Create the layout wrapper
  const contentContainer = document.querySelector('.content-container');
  if (!contentContainer) return;

  // Create the new layout structure
  const layoutWrapper = document.createElement('div');
  layoutWrapper.className = 'case-study-layout';

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'case-study-content';

  const sidebar = document.createElement('aside');
  sidebar.className = 'case-study-sidebar';

  // Create the side rail
  const sideRail = document.createElement('nav');
  sideRail.className = 'side-rail';
  sideRail.innerHTML = '<div class="side-rail-label">Contents</div>';

  const navList = document.createElement('ul');
  navList.className = 'side-rail-nav';

  // Add IDs to headings and create nav links
  headings.forEach((heading, index) => {
    // Use data-nav-title if available, otherwise use heading text
    const navTitle = heading.dataset.navTitle || heading.textContent;
    
    // Create a slug from the nav title
    const slug = navTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const id = `section-${slug}`;
    heading.id = id;

    // Create nav item
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${id}`;
    link.textContent = navTitle;
    link.dataset.target = id;

    li.appendChild(link);
    navList.appendChild(li);
  });

  sideRail.appendChild(navList);
  sidebar.appendChild(sideRail);

  // IMPORTANT: Move (not clone) the case study into the new layout
  // This preserves all event listeners and animation states
  contentWrapper.appendChild(caseStudy);

  layoutWrapper.appendChild(contentWrapper);
  layoutWrapper.appendChild(sidebar);

  // Update container styles and append the layout
  contentContainer.style.maxWidth = 'none';
  contentContainer.style.padding = '0';
  contentContainer.appendChild(layoutWrapper);

  // Apply scroll-margin-top to all headings so scrollIntoView respects the sticky navbar
  const navbar = document.querySelector('.navbar');
  const scrollMargin = (navbar ? navbar.offsetHeight : 72) + 24;
  headings.forEach(heading => {
    heading.style.scrollMarginTop = scrollMargin + 'px';
  });

  // Smooth scroll on click
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.dataset.target;
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Highlight current section on scroll
  const observerOptions = {
    root: null,
    rootMargin: '-100px 0px -70% 0px',
    threshold: 0
  };

  let currentActiveLink = null;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const link = navList.querySelector(`a[data-target="${id}"]`);

        if (currentActiveLink) {
          currentActiveLink.classList.remove('active');
        }

        if (link) {
          link.classList.add('active');
          currentActiveLink = link;
        }
      }
    });
  }, observerOptions);

  headings.forEach(heading => {
    observer.observe(heading);
  });

  // Set first item as active initially
  const firstLink = navList.querySelector('a');
  if (firstLink) {
    firstLink.classList.add('active');
    currentActiveLink = firstLink;
  }
}

// Listen for case study render completion
document.addEventListener('caseStudyRendered', initSideRail);

// Also try on DOMContentLoaded for non-templated pages
document.addEventListener('DOMContentLoaded', function() {
  // Small delay to allow for any synchronous rendering
  setTimeout(initSideRail, 100);
});
