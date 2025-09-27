# anconsulting.us Style Guide

## Brand Overview

- Company Name: anconsulting.us
- Primary Service: Source-Grounded AI Workflows
- Industry Focus: Professional AI Implementation for Sales Teams
- Website: <https://anconsulting.us>
- Current Use Case Library: Sample of 10 verified, sales-aligned implementations
- Implementation Guides: One comprehensive sales-focused guide

---

## 1. TYPOGRAPHY

### Primary Typeface

- **Font Weights Available:** 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Google Fonts URL:** `https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap`

### Typography Hierarchy

#### Headlines (H1)

- **Size:** 4xl-6xl (64px desktop, 36px mobile)
- **Weight:** 800 (Extrabold)
- **Usage:** Main page titles, hero headlines
- **Example:** "Source-Grounded AI Workflows"

#### Subheadlines (H2)

- **Size:** 3xl-4xl (48px desktop, 30px mobile)
- **Color:** White (#FFFFFF)
- **Usage:** Section headers, major content divisions

#### Section Headers (H3)

- **Weight:** 700 (Bold)
- **Color:** White (#FFFFFF)
- **Usage:** Card titles, subsection headers
- **Example:** "Professional Sales Teams", "Sales Leaders"

### Body Text

- **Size:** Base (16px) to lg (18px)
- **Weight:** 400 (Regular)
- **Color:** Slate-300 (#cbd5e1) for primary text, Slate-400 (#94a3b8) for secondary
- **Line Height:** 1.6-1.8

#### Accent Text


- **Size:** lg-2xl (18px-24px)
- **Weight:** 600 (Semibold)
- **Color:** Gradient (see color section)
- **Usage:** Taglines, special callouts
- **Example:** "Your Antidote to AI Hallucination"
 
## 2. COLOR PALETTE


### Primary Colors

### Accent Colors

- **Electric Blue:** #3b82f6 (Primary accent, buttons, links)
- **Indigo:** #6366f1 (Gradient component)
- **Sky Blue:** #38bdf8 (Gradient component)
- **Blue-400:** #60a5fa (Secondary accents, hover states)

### Text Colors

- **Primary Text:** #FFFFFF (White)
- **Secondary Text:** #cbd5e1 (Slate-300)
- **Tertiary Text:** #94a3b8 (Slate-400)  
- **Muted Text:** #6b7280 (Slate-500)

### Status Colors

- **Success Green:** #10b981 (Check marks, success states)
- **Warning Amber:** #f59e0b (Alert states)
- **Error Red:** #ef4444 (Error states)

### Gradient Definitions

- **Primary Gradient:** `linear-gradient(90deg, #6366f1, #38bdf8)`
- **Button Gradient:** `linear-gradient(90deg, #4f46e5, #3b82f6)`
- **Aurora Gradient 1:** `radial-gradient(circle, #38bdf8, transparent 60%)`
- **Aurora Gradient 2:** `radial-gradient(circle, #6366f1, transparent 60%)`

---

## 3. VISUAL ELEMENTS

### Logo & Brand Mark

- **Primary Logo:** "anconsulting.us" in white with gradient text effect
- **Logo Size:** 2xl (24px) font size
- **Logo Font Weight:** 700 (Bold)
- **Gradient Application:** Applied to "Consulting" word only

### Glass Morphism Cards

- **Background:** `rgba(17, 25, 40, 0.75)`
- **Backdrop Filter:** `blur(16px) saturate(180%)`
- **Border:** `1px solid rgba(255, 255, 255, 0.125)`
- **Border Radius:** 1rem (16px)
- **Hover Effect:** `translateY(-5px)` with shadow enhancement
- **Usage:** Service cards, pricing cards, content containers

### Buttons

#### Primary CTA Button

- **Background:** `linear-gradient(90deg, #4f46e5, #3b82f6)`
- **Text Color:** White (#FFFFFF)
- **Font Weight:** 600 (Semibold)
- **Padding:** py-3 px-8 (12px vertical, 32px horizontal)
- **Border Radius:** lg (8px)
- **Hover Effect:** `translateY(-2px)` + `box-shadow: 0 10px 20px rgba(59, 130, 246, 0.4)`

#### Secondary CTA Button  

- **Background:** Transparent
- **Border:** `1px solid #3b82f6`
- **Text Color:** #3b82f6
- **Font Weight:** 600 (Semibold)
- **Padding:** py-3 px-8 (12px vertical, 32px horizontal)
- **Border Radius:** lg (8px)
- **Hover Effect:** `background: rgba(59, 130, 246, 0.1)` + glow effect

### Icons

- **Icon Library:** Lucide Icons
- **Primary Size:** w-5 h-5 (20px) for inline icons
- **Large Size:** w-6 h-6 (24px) for featured icons
- **Color:** Green-400 (#10b981) for checkmarks, Blue-400 (#60a5fa) for interactive
- **Glow Effect:** `filter: drop-shadow(0 0 8px rgba(96, 165, 250, 0.7))`

### Background Effects

#### Aurora Animation
 
- **Container:** Fixed position, 150vw x 150vw, centered
- **Animation:** 40s linear infinite rotation
- **Blur:** 100px filter
- **Opacity:** 0.25
- **Z-index:** -2 (behind content)

#### Constellation Background
 
- **Element:** Canvas element for particle effects
- **Position:** Fixed, full viewport
- **Z-index:** -1 (behind content, above aurora)

---

## 4. LAYOUT & SPACING

### Grid System

- **Container Max Width:** Container mx-auto (responsive)
- **Padding:** px-6 (24px horizontal) on mobile, larger on desktop
- **Grid Layouts:**
  - 2 columns on md+ screens
  - 3 columns on lg+ screens for card grids

### Spacing Scale (Tailwind-based)
 
- **xs:** 4px
- **sm:** 8px  
- **base:** 16px
- **lg:** 24px
- **xl:** 32px
- **2xl:** 48px
- **3xl:** 64px
- **4xl:** 80px

### Section Spacing
 
- **Section Padding:** py-20 (80px vertical) on desktop
- **Mobile Section Padding:** py-12 (48px vertical)
- **Content Spacing:** mb-8 to mb-16 between major elements

---

## 5. COMPONENT SPECIFICATIONS

### Navigation Header

- **Background:** `bg-slate-900/50` with `backdrop-blur-md`
- **Border:** `border-b border-slate-800`
- **Position:** Fixed top
- **Height:** Standard navigation height with py-4 padding
- **Mobile:** Hamburger menu with slide-down animation
- **Dropdown Menu:** Implementation Guides section with glass morphism styling
- **Touch Optimization:** 44px minimum touch targets, touch-manipulation CSS

### Implementation Guide Navigation

- **Structure:** Single link to the Professional Sales Teams guide
- **Icons:** 🎯 Sales
- **Hover Effects:** Background color change and smooth transitions
- **Mobile Layout:** Expanded vertical menu with proper spacing

### Hero Section

- **Padding:** pt-32 pb-20 on desktop, pt-24 pb-16 on mobile
- **Text Alignment:** Center
- **Background:** Aurora + constellation effects
- **Button Layout:** Horizontal flex with gap-4

### Content Cards

- **Base:** Glass morphism styling
- **Padding:** p-6 to p-8 depending on content density
- **Layout:** Flexbox column with flex-grow for equal height
- **Hover:** Transform and shadow animation

### Forms (Waitlist Modal)

- **Background:** bg-slate-900 with border
- **Input Style:** bg-slate-800 with slate-600 border
- **Focus State:** border-blue-400 with ring effect
- **Modal:** Fixed position with backdrop blur overlay

---

## 6. ANIMATION & INTERACTIONS

### Hover Effects

- **Cards:** `translateY(-5px)` + enhanced shadow
- **Buttons:** `translateY(-2px)` + colored shadow
- **Links:** Color transition to lighter shade

### Loading States

- **Pulse Animation:** For loading elements
- **Glow Animation:** For featured elements using CSS keyframes

### Transitions

- **Duration:** 0.3s for most interactions
- **Easing:** ease function for smooth animations
- **Transform:** Used for hover lift effects

---

## 7. CONTENT VOICE & MESSAGING

### Brand Voice

- **Tone:** Professional, confident, technically precise, ethically focused
- **Style:** Direct, benefit-focused, no-nonsense, compliance-aware
- **Approach:** Problem-solution oriented with emphasis on reliability and professional standards
- **Quality Focus:** Human-in-the-loop verification, realistic capabilities, verifiable outcomes

### Key Messaging Points

- "Source-Grounded AI Workflows" (core service)
- "Eliminate AI hallucinations" (primary benefit)
- "Verifiable, auditable AI solutions" (quality assurance)
- "$125/hr expert consulting" (pricing transparency)
- "Professional implementation" (service positioning)
- "10 sample use cases" (library scope)
- "Ethical AI compliance" (legal/professional standards)
- "Human-in-the-loop verification" (quality control)

### Industry-Specific Language

- **Sales:** Lead qualification, proposal automation, client intelligence, verifiable AI sales engine, B2B enablement

---

## 8. APPLICATION GUIDELINES

### For One-Sheets/Flyers

- **Background:** Deep navy (#0a192f) with subtle aurora effects
- **Logo Placement:** Top left or center
- **Headlines:** Large Lexend Bold in white
- **Body Text:** Lexend Regular in slate-300
- **CTA Elements:** Use primary button styling with gradient backgrounds

### For PowerPoint/Google Slides

- **Master Slide Background:** Deep navy with aurora gradient overlay
- **Title Slides:** Large gradient text for main headers
- **Content Slides:** Glass morphism containers for content blocks
- **Accent Elements:** Use electric blue for highlights and callouts

### For HTML Emails

- **Background:** Solid deep navy (avoid complex animations)
- **Container:** Glass-effect simulation with borders and subtle backgrounds
- **Buttons:** Solid gradient backgrounds (fallback for email clients)
- **Typography:** Web-safe fonts as fallback (Arial, Helvetica)

### For Social Media Posts

- **Instagram/LinkedIn:** Square format with centered logo
- **Twitter/X:** Horizontal format with brand colors
- **Background:** Aurora effects work well for social graphics
- **Text Overlay:** High contrast white text on dark backgrounds

### For Landing Pages

- **Structure:** Follow website hierarchy and spacing
- **Hero Section:** Full aurora background treatment
- **Content Sections:** Alternating backgrounds (navy and slate)
- **Forms:** Modal-style containers with glass morphism

### For Documents/Memos

- **Header:** Company logo with gradient treatment
- **Body:** Clean typography with proper spacing
- **Accents:** Electric blue for headers and important information
- **Footer:** Consistent brand colors and contact information

---

## 9. TECHNICAL IMPLEMENTATION

### CSS Custom Properties

```css
:root {
  --color-primary: #0a192f;
  --color-secondary: #1e293b;
  --color-accent: #3b82f6;
  --color-text-primary: #ffffff;
  --color-text-secondary: #cbd5e1;
  --font-primary: 'Lexend', sans-serif;
  --gradient-primary: linear-gradient(90deg, #6366f1, #38bdf8);
  --gradient-button: linear-gradient(90deg, #4f46e5, #3b82f6);
}
```

### Glass Morphism Implementation

```css
.glass-card {
  background: rgba(17, 25, 40, 0.75);
  backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.125);
  border-radius: 1rem;
}
```

### Gradient Text Implementation

```css
.gradient-text {
  background: linear-gradient(90deg, #6366f1, #38bdf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Mobile Touch Optimization

```css
.touch-manipulation {
  touch-action: manipulation;
  min-height: 44px;
  min-width: 44px;
}
```

### Mobile Menu JavaScript Pattern

```javascript
// Enhanced touch and click handling
document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('mobile-menu-button');
  if (button) {
    button.addEventListener('touchstart', function(e) {
      e.preventDefault();
      toggleMobileMenu();
    }, { passive: false });

    button.addEventListener('click', function(e) {
      e.preventDefault();
      toggleMobileMenu();
    });
  }
});
```

---

## 10. BRAND COMPLIANCE CHECKLIST

### Essential Elements (Must Include)

- [ ] Lexend font family
- [ ] Deep navy background (#0a192f)
- [ ] anconsulting.us logo with gradient effect
- [ ] Electric blue accent color (#3b82f6)
- [ ] Glass morphism cards for content containers
- [ ] Professional, confident tone in all copy

### Recommended Elements

- [ ] Aurora background effects (when technically feasible)
- [ ] Gradient text treatments for taglines
- [ ] Proper typography hierarchy
- [ ] Consistent button styling
- [ ] White text on dark backgrounds for readability

### Quality Standards

- [ ] High contrast for accessibility (minimum 4.5:1 ratio)
- [ ] Responsive design considerations
- [ ] Professional photography or graphics
- [ ] Consistent spacing and alignment
- [ ] Error-free, technically precise copy

---

## 11. ASSET LIBRARY

### Required Files

- Lexend font files (WOFF2, WOFF, TTF)
- Company logo (SVG, PNG with transparency)
- Aurora background graphics (if using static images)
- Color palette swatches
- Icon set (Lucide icons recommended)

### Template Recommendations

- PowerPoint master template with brand colors
- Google Slides template with glass morphism elements  
- Email signature template with brand colors
- Social media post templates (Instagram, LinkedIn, Twitter)
- One-sheet template with proper typography hierarchy

---

This comprehensive style guide ensures consistent brand application across all materials while maintaining the sophisticated, professional identity of anconsulting.us Source-Grounded AI Workflow services.

---

## 12. CURRENT WEBSITE ARCHITECTURE

### Page Structure

- **Homepage (index.html):** Main landing with industry cards, simplified pricing
- **Use Case Library (/use-cases/):** Sample library of 10 Professional Sales use cases
- **Implementation Guides (/implementation-guides/):** One sales-focused blueprint
  - Professional Sales Teams: Verifiable AI sales engine guide
- **Secondary Pages:** NotebookLM Alternative (Gem Membership hidden; Prompt Shop removed)

### Industry Distribution

- **Professional Sales Teams:** 10 sample use cases (B2B focused)
- **Total:** 10 sample implementations

### SEO Optimization

- **Meta Descriptions:** Updated to reflect a sample of 10 use cases
- **Structured Data:** JSON-LD schema with accurate counts
- **Sitemap:** Only public pages listed; hidden/removed pages excluded
- **Internal Linking:** Strategic connections between industry cards and guides

### Quality Standards Applied

- **Ethical Compliance:** All use cases align with professional standards
- **Realistic Capabilities:** No overstated AI promises
- **Human-in-the-Loop:** Emphasis on professional oversight and review
- **Source-Grounded Focus:** No predictive AI or unsupported claims

---

## 13. IMPLEMENTATION GUIDE BRANDING

### Visual Identity for Guides

- **Professional Sales Teams:** 🎯 Revenue emphasis, sales performance focus

### Guide Styling Standards

- **Layout:** Consistent chapter structure for the sales guide
- **Typography:** Same hierarchy as main site (Lexend font family)
- **Color Scheme:** Glass morphism cards with industry-appropriate accents
- **Interactive Elements:** Knowledge checks, implementation steps, contact integration

### Content Framework

- **Structure:** 6-10 chapters with progressive complexity
- **Format:** Practical implementation focus with step-by-step guidance
- **Quality Control:** Human-in-the-loop verification protocols
- **Professional Standards:** Industry-specific compliance requirements

---

## 14. MOBILE OPTIMIZATION STANDARDS

### Touch Interface Requirements

- **Minimum Touch Targets:** 44px x 44px for all interactive elements
- **Touch Optimization:** `touch-manipulation` CSS property applied
- **Button Spacing:** Minimum 8px gap between interactive elements
- **Gesture Support:** Proper touch event handling with preventDefault

### Mobile Navigation

- **Hamburger Menu:** Enhanced with touchstart event listeners
- **Menu Animation:** Smooth slide-down with backdrop blur
- **Icon Changes:** Menu/X icon transformation with Lucide icons
- **Accessibility:** Proper ARIA labels and keyboard navigation

### Responsive Breakpoints

- **Mobile:** < 768px (single column, larger touch targets)
- **Tablet:** 768px - 1024px (two-column layouts)
- **Desktop:** > 1024px (three-column grids, hover effects)

---

## 15. BRAND COMPLIANCE UPDATES

### Current Implementation Status

- [x] 10 sample use cases live
- [x] One comprehensive implementation guide
- [x] Enhanced mobile navigation with proper touch handling
- [x] Complete SEO optimization with accurate counts
- [x] Ethical compliance alignment for all content
- [x] Professional emoji icons for industry identification
- [x] Simplified pricing structure (removed subscription complexity)

### Quality Assurance Checklist

- [x] All use cases align with implementation guide criteria
- [x] No overstated AI capabilities or unrealistic promises
- [x] Professional standards maintained across all industries
- [x] Mobile-first responsive design implemented
- [x] Accessibility standards met for navigation and content
- [x] Consistent branding across the sales implementation guide
