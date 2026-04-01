// InboxForms Landing Page JavaScript

// Smooth scrolling function
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// Copy code functionality
function copyCode(button) {
  const codeBlock = button.parentElement.querySelector('code');
  const text = codeBlock.textContent;
  
  navigator.clipboard.writeText(text).then(() => {
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.style.background = 'hsl(var(--primary))';
    button.style.color = 'hsl(var(--primary-foreground))';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
      button.style.color = '';
    }, 2000);
  });
}

// Form generator functionality
let formConfig = {
  name: true,
  email: true,
  phone: false,
  company: false,
  message: true,
  buttonStyle: 'primary'
};

function updateFormPreview() {
  // Update config from checkboxes
  formConfig.name = document.getElementById('name-field').checked;
  formConfig.email = document.getElementById('email-field').checked;
  formConfig.phone = document.getElementById('phone-field').checked;
  formConfig.company = document.getElementById('company-field').checked;
  formConfig.message = document.getElementById('message-field').checked;
  formConfig.buttonStyle = document.getElementById('button-style').value;
  
  // Generate form HTML
  let formHTML = '<form action="https://api.inboxforms.com/submit" method="POST" class="preview-form">\n';
  
  if (formConfig.name) {
    formHTML += '  <input type="text" name="name" placeholder="Your Name" required>\n';
  }
  
  if (formConfig.email) {
    formHTML += '  <input type="email" name="email" placeholder="Your Email" required>\n';
  }
  
  if (formConfig.phone) {
    formHTML += '  <input type="tel" name="phone" placeholder="Your Phone">\n';
  }
  
  if (formConfig.company) {
    formHTML += '  <input type="text" name="company" placeholder="Company Name">\n';
  }
  
  if (formConfig.message) {
    formHTML += '  <textarea name="message" placeholder="Your Message" rows="4" required></textarea>\n';
  }
  
  const buttonClass = formConfig.buttonStyle === 'primary' ? 'btn-primary' : 
                     formConfig.buttonStyle === 'secondary' ? 'btn-secondary' : 'btn-accent';
  
  formHTML += `  <button type="submit" class="${buttonClass}">Send Message</button>\n`;
  formHTML += '</form>';
  
  // Update preview
  document.getElementById('form-preview-container').innerHTML = formHTML;
  
  // Update generated code
  const codeHTML = formHTML
    .replace('class="preview-form"', '')
    .replace(new RegExp(`class="${buttonClass}"`, 'g'), 'class="btn"')
    .trim();
  
  document.getElementById('generated-code').textContent = codeHTML;
}

// Copy generated code
function copyGeneratedCode() {
  const code = document.getElementById('generated-code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const button = document.querySelector('.code-output .copy-btn');
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.style.background = 'hsl(var(--primary))';
    button.style.color = 'hsl(var(--primary-foreground))';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
      button.style.color = '';
    }, 2000);
  });
}

// Template code snippets
const templates = {
  contact: `<form action="https://api.inboxforms.com/submit" method="POST">
  <input type="text" name="name" placeholder="Your Name" required>
  <input type="email" name="email" placeholder="Your Email" required>
  <textarea name="message" placeholder="Your Message" required></textarea>
  <button type="submit">Send Message</button>
</form>`,
  
  newsletter: `<form action="https://api.inboxforms.com/submit" method="POST">
  <input type="email" name="email" placeholder="Enter your email" required>
  <input type="hidden" name="type" value="newsletter">
  <button type="submit">Subscribe</button>
</form>`,
  
  quote: `<form action="https://api.inboxforms.com/submit" method="POST">
  <input type="text" name="company" placeholder="Company Name" required>
  <input type="email" name="email" placeholder="Email" required>
  <select name="service" required>
    <option value="">Service Type</option>
    <option value="web">Web Development</option>
    <option value="design">Design</option>
    <option value="consulting">Consulting</option>
  </select>
  <textarea name="details" placeholder="Project Details" required></textarea>
  <input type="hidden" name="type" value="quote">
  <button type="submit">Request Quote</button>
</form>`
};

// Copy template code
function copyTemplate(templateType) {
  const code = templates[templateType];
  navigator.clipboard.writeText(code).then(() => {
    const buttons = document.querySelectorAll('.template-copy-btn');
    buttons.forEach(button => {
      if (button.onclick.toString().includes(templateType)) {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = 'hsl(var(--primary))';
        button.style.color = 'hsl(var(--primary-foreground))';
        
        setTimeout(() => {
          button.textContent = originalText;
          button.style.background = '';
          button.style.color = '';
        }, 2000);
      }
    });
  });
}

// Initialize form generator on page load
document.addEventListener('DOMContentLoaded', () => {
  updateFormPreview();
  
  // Add smooth scrolling to all internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  // Add form submission handlers (prevent actual submission for demo)
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('This is a demo form. In production, submissions would be sent to your email via InboxForms!');
    });
  });
});