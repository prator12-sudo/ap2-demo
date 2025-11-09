/**
 * Accordion Block
 * Provides expandable/collapsible content sections with smooth animations
 * and full accessibility support
 */

export default function decorate(block) {
  // Get all rows - each row becomes an accordion item
  const rows = [...block.children];
  
  // Create accordion container
  const accordionContainer = document.createElement('div');
  accordionContainer.className = 'accordion-container-child';
  accordionContainer.setAttribute('role', 'group');
  
  rows.forEach((row, index) => {
    const cells = [...row.children];
    if (cells.length < 2) return; // Need at least label and content
    
    const label = cells[0].textContent.trim();
    const content = cells[1];
    
    // Create accordion item
    const item = createAccordionItem(label, content, index);
    accordionContainer.appendChild(item);
  });
  
  // Replace block content
  block.textContent = '';
  block.appendChild(accordionContainer);
  
  // Open first item by default
  const firstItem = accordionContainer.querySelector('.accordion-item');
  if (firstItem) {
    toggleAccordionItem(firstItem, true);
  }
}

/**
 * Creates an accordion item with header and content
 */
function createAccordionItem(label, contentElement, index) {
  const item = document.createElement('div');
  item.className = 'accordion-item';
  
  // Create header button
  const header = document.createElement('button');
  header.className = 'accordion-header';
  header.setAttribute('aria-expanded', 'false');
  header.setAttribute('aria-controls', `accordion-content-${index}`);
  header.setAttribute('type', 'button');
  
  // Label with number
  const labelSpan = document.createElement('span');
  labelSpan.className = 'accordion-label';
  labelSpan.textContent = `${String(index + 1).padStart(2, '0')} ${label}`;
  
  // Icon container
  const iconContainer = document.createElement('div');
  iconContainer.className = 'accordion-icon';
  iconContainer.innerHTML = `
    <svg class="icon-plus" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 3.5V12.5M3.5 8H12.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
    <svg class="icon-minus" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.5 8H12.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
  
  header.appendChild(labelSpan);
  header.appendChild(iconContainer);
  
  // Create content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'accordion-content-wrapper';
  contentWrapper.id = `accordion-content-${index}`;
  contentWrapper.setAttribute('aria-hidden', 'true');
  
  const contentInner = document.createElement('div');
  contentInner.className = 'accordion-content';
  contentInner.appendChild(contentElement);
  
  contentWrapper.appendChild(contentInner);
  
  // Add click handler
  header.addEventListener('click', () => {
    const isOpen = header.getAttribute('aria-expanded') === 'true';
    
    // Close all other items (single expand mode)
    const allItems = item.parentElement.querySelectorAll('.accordion-item');
    allItems.forEach(otherItem => {
      if (otherItem !== item) {
        toggleAccordionItem(otherItem, false);
      }
    });
    
    // Toggle current item
    toggleAccordionItem(item, !isOpen);
  });
  
  // Add keyboard handler
  header.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      header.click();
    }
  });
  
  item.appendChild(header);
  item.appendChild(contentWrapper);
  
  return item;
}

/**
 * Toggles an accordion item open or closed
 */
function toggleAccordionItem(item, open) {
  const header = item.querySelector('.accordion-header');
  const contentWrapper = item.querySelector('.accordion-content-wrapper');
  const content = item.querySelector('.accordion-content');
  
  if (open) {
    // Open
    header.setAttribute('aria-expanded', 'true');
    contentWrapper.setAttribute('aria-hidden', 'false');
    item.classList.add('is-open');
    
    // Set height for animation
    const height = content.scrollHeight;
    contentWrapper.style.height = `${height}px`;
    
    // After animation, set to auto for responsive behavior
    setTimeout(() => {
      if (item.classList.contains('is-open')) {
        contentWrapper.style.height = 'auto';
      }
    }, 150);
  } else {
    // Close
    // Set explicit height first for animation
    contentWrapper.style.height = `${content.scrollHeight}px`;
    
    // Force reflow
    contentWrapper.offsetHeight; // eslint-disable-line no-unused-expressions
    
    // Start closing animation
    contentWrapper.style.height = '0';
    
    header.setAttribute('aria-expanded', 'false');
    contentWrapper.setAttribute('aria-hidden', 'true');
    item.classList.remove('is-open');
  }
}
