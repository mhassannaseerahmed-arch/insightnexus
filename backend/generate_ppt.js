const pptxgen = require('pptxgenjs');
const path = require('path');

// Create a new Presentation
let pres = new pptxgen();

// Set presentation properties
pres.layout = 'LAYOUT_WIDE';
pres.title = 'AI Nexus Insight: The Founding 5 Strategy';
pres.author = 'AI Nexus Team';

// Define Styles
const COLORS = {
  indigo: '6366F1',
  slate900: '0F172A',
  slate500: '64748B',
  emerald: '10B981',
  rose: 'F43F5E',
  white: 'FFFFFF'
};

const TITLE_STYLE = { x: 0.5, y: 0.5, w: '90%', h: 1.0, fontSize: 40, bold: true, color: COLORS.slate900, align: 'left' };
const BODY_STYLE = { x: 0.5, y: 1.8, w: '55%', h: 4.5, fontSize: 18, color: COLORS.slate500 };
const IMAGE_POS = { x: 6.5, y: 1.5, w: 6.0, h: 4.5 };

// Image Paths (Generated Assets)
const TITLE_BG = '/home/hassan/.gemini/antigravity/brain/501711bb-695a-41b0-b811-fff7bf606461/ppt_title_background_1777817815847.png';
const LEAK_IMG = '/home/hassan/.gemini/antigravity/brain/501711bb-695a-41b0-b811-fff7bf606461/revenue_leak_illustration_1777817835814.png';

// Slide 1: Title (Visual Impact)
let slide1 = pres.addSlide();
slide1.addImage({ path: TITLE_BG, x: 0, y: 0, w: '100%', h: '100%' });
slide1.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: 'FFFFFF', transparency: 70 } });
slide1.addText("AI Nexus Insight", { x: 0.5, y: 2.5, w: '50%', h: 1, fontSize: 64, bold: true, color: COLORS.indigo, align: 'left' });
slide1.addText("Eliminating the $150B 'Invisible Leak' in Clinic Revenue", { x: 0.5, y: 3.5, w: '50%', h: 1, fontSize: 24, color: COLORS.slate900, align: 'left' });
slide1.addShape(pres.ShapeType.line, { x: 0.5, y: 4.2, w: 2.0, h: 0, line: { color: COLORS.indigo, width: 4 } });

// Slide 2: The $150B Crisis
let slide2 = pres.addSlide();
slide2.addText("The $150 Billion Revenue Leak", TITLE_STYLE);
slide2.addImage({ path: LEAK_IMG, ...IMAGE_POS });
slide2.addText([
  { text: "• No-shows cost the US healthcare system $150B annually.\n", options: { bullet: true } },
  { text: "• Average clinic loses 18% - 30% of potential revenue.\n", options: { bullet: true } },
  { text: "• A single missed appointment costs an average of $200.\n", options: { bullet: true } },
  { text: "• For a clinic with 20 appts/day, that's $4,000/week in lost revenue.", options: { bullet: true, bold: true, color: COLORS.rose } }
], BODY_STYLE);

// Slide 3: The "Magic" Moment: Frictionless Booking
let slide3 = pres.addSlide();
slide3.addText("Frictionless Patient Onboarding", TITLE_STYLE);
slide3.addText([
  { text: "• Inspired by High-Conversion Kiosks (KFC/McDonald's style).\n", options: { bullet: true } },
  { text: "• Patients book in under 30 seconds—no complex portals.\n", options: { bullet: true } },
  { text: "• Clean, premium UI that builds trust instantly.\n", options: { bullet: true } },
  { text: "• Designed for conversion: The faster they book, the more likely they show.", options: { bullet: true, color: COLORS.indigo, bold: true } }
], { x: 0.5, y: 1.8, w: '90%', h: 4.5, fontSize: 22, color: COLORS.slate500 });

// Slide 4: The "Money Dashboard" - Live ROI
let slide4 = pres.addSlide();
slide4.addText("The Live ROI Dashboard", TITLE_STYLE);
slide4.addText([
  { text: "• From 'Confirmed' to 'Recovered': We track the exact dollar value of every saved slot.\n", options: { bullet: true } },
  { text: "• Real-time Revenue Leak detection: See your monthly and annual loss shrink in real-time.\n", options: { bullet: true } },
  { text: "• Predictive Insights: Our AI highlights high-risk patterns before they cost you a dime.\n", options: { bullet: true } },
  { text: "• Transform your front desk into a Profit Center.", options: { bullet: true, color: COLORS.emerald, bold: true } }
], { x: 0.5, y: 1.8, w: '90%', h: 4.5, fontSize: 22, color: COLORS.slate500 });

// Slide 5: The "7-Day Recovery Roadmap"
let slide5 = pres.addSlide();
slide5.addText("The 7-Day Revenue Recovery Roadmap", TITLE_STYLE);

// Add Icon Set at the top
const ICON_SET = '/home/hassan/.gemini/antigravity/brain/501711bb-695a-41b0-b811-fff7bf606461/roadmap_icons_set_1777818155345.png';
slide5.addImage({ path: ICON_SET, x: 0.5, y: 1.5, w: 9.0, h: 2.0 });

// Step 1
slide5.addShape(pres.ShapeType.rect, { x: 0.5, y: 3.8, w: 3.0, h: 2.5, fill: { color: 'F1F5F9' }, radius: 0.2 });
slide5.addText("PHASE 1: Day 1-2\nZERO-FRICTION SETUP", { x: 0.6, y: 4.0, w: 2.8, h: 0.5, fontSize: 16, bold: true, color: COLORS.slate900 });
slide5.addText("Sync your existing schedule in 15 mins. No complex IT integration required.", { x: 0.6, y: 4.6, w: 2.8, h: 1.5, fontSize: 14, color: COLORS.slate500 });

// Step 2
slide5.addShape(pres.ShapeType.rect, { x: 3.7, y: 3.8, w: 3.0, h: 2.5, fill: { color: 'EEF2FF' }, radius: 0.2 });
slide5.addText("PHASE 2: Day 3-5\nAI CALIBRATION", { x: 3.8, y: 4.0, w: 2.8, h: 0.5, fontSize: 16, bold: true, color: COLORS.indigo });
slide5.addText("Engine identifies your 'Risk Zones' and starts smart SMS sequences.", { x: 3.8, y: 4.6, w: 2.8, h: 1.5, fontSize: 14, color: COLORS.slate500 });

// Step 3
slide5.addShape(pres.ShapeType.rect, { x: 6.9, y: 3.8, w: 3.0, h: 2.5, fill: { color: 'ECFDF5' }, radius: 0.2 });
slide5.addText("PHASE 3: Day 7+\nREVENUE RESTORED", { x: 7.0, y: 4.0, w: 2.8, h: 0.5, fontSize: 16, bold: true, color: COLORS.emerald });
slide5.addText("Recover your first $200+ slot. View live 'ROI Reports' on your dashboard.", { x: 7.0, y: 4.6, w: 2.8, h: 1.5, fontSize: 14, color: COLORS.slate500, bold: true });

// Slide 6: The "Founding 5" Partner Offer
let slide6 = pres.addSlide();
slide6.background = { color: COLORS.slate900 };
slide6.addText("Become a Founding Partner", { x: 0.5, y: 1.0, w: '90%', h: 1, fontSize: 44, bold: true, color: COLORS.white });
slide6.addText([
  { text: "We are onboarding ONLY 5 clinics this month to ensure success.\n\n", options: { bold: true, color: COLORS.indigo } },
  { text: "• Lifetime 'Early Adopter' Pricing (50% off Forever)\n", options: { bullet: true, color: COLORS.white } },
  { text: "• Custom AI Model Tuning for your specific patient base\n", options: { bullet: true, color: COLORS.white } },
  { text: "• Priority access to new Revenue Recovery features\n", options: { bullet: true, color: COLORS.white } },
  { text: "• White-glove implementation & direct team support", options: { bullet: true, color: COLORS.white } }
], { x: 0.5, y: 2.5, w: '90%', h: 4, fontSize: 20 });

// Slide 7: Call to Action
let slide7 = pres.addSlide();
slide7.addText("Ready to Fix Your Revenue Leak?", { x: 0, y: 2.5, w: '100%', h: 1, fontSize: 44, bold: true, color: COLORS.slate900, align: 'center' });
slide7.addText("Schedule your 15-minute deep-dive demo today.", { x: 0, y: 3.5, w: '100%', h: 0.5, fontSize: 24, color: COLORS.slate500, align: 'center' });
slide7.addShape(pres.ShapeType.rect, { x: 4.5, y: 4.5, w: 4, h: 0.8, fill: { color: COLORS.indigo }, radius: 0.1 });
slide7.addText("BOOK A DEMO", { x: 4.5, y: 4.5, w: 4, h: 0.8, fontSize: 20, bold: true, color: COLORS.white, align: 'center' });

// Export the PPT
const outputFileName = 'AI_Nexus_Insight_Strategy_V2.pptx';
pres.writeFile({ fileName: outputFileName })
  .then(fileName => {
    console.log(`✅ Premium Presentation generated: ${fileName}`);
  })
  .catch(err => {
    console.error('❌ Error generating PPT:', err);
  });
