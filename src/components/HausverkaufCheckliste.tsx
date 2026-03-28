import jsPDF from 'jspdf';
const profileImage = "https://placehold.co/200x200?text=Profil";

export interface ChecklistStep {
  step: number;
  title: string;
  description: string;
  tasks: string[];
  duration: string;
}

const checklistSteps: ChecklistStep[] = [
  {
    step: 1,
    title: "Ist-Zustand erfassen & Verkaufsentscheidung treffen",
    description: "Analysieren Sie Ihre aktuelle Situation und treffen Sie eine fundierte Entscheidung",
    tasks: [
      "Persönliche Verkaufsmotive klären",
      "Zeitrahmen für den Verkauf festlegen",
      "Finanzielle Situation prüfen (Restschulden, Vorfälligkeitsentschädigung)",
      "Erste Werteinschätzung durchführen",
      "Rechtliche Rahmenbedingungen checken (Spekulationsfrist etc.)"
    ],
    duration: "1-2 Wochen"
  },
  {
    step: 2,
    title: "Immobilienmakler auswählen",
    description: "Finden Sie einen kompetenten Partner für Ihren Verkauf",
    tasks: [
      "Mindestens 3 Makler kontaktieren und vergleichen",
      "Referenzen und Bewertungen prüfen",
      "Vermarktungsstrategie besprechen",
      "Provisionsvereinbarung klären",
      "Maklervertrag sorgfältig prüfen und unterschreiben"
    ],
    duration: "1-2 Wochen"
  },
  {
    step: 3,
    title: "Professionelle Immobilienbewertung",
    description: "Ermitteln Sie den realistischen Marktwert Ihrer Immobilie",
    tasks: [
      "Verkehrswertgutachten erstellen lassen",
      "Vergleichsobjekte in der Region analysieren",
      "Renovierungsbedarf und Wertsteigerungspotenzial prüfen",
      "Realistischen Verkaufspreis festlegen",
      "Verhandlungsspielraum definieren"
    ],
    duration: "2-3 Wochen"
  },
  {
    step: 4,
    title: "Unterlagen zusammenstellen",
    description: "Sammeln Sie alle wichtigen Dokumente für den Verkauf",
    tasks: [
      "Grundbuchauszug besorgen (nicht älter als 3 Monate)",
      "Energieausweis erstellen lassen (falls nicht vorhanden)",
      "Grundrisse und Bauzeichnungen zusammenstellen",
      "Baugenehmigung und Teilungserklärung (bei Eigentumswohnungen)",
      "Nebenkostenabrechnungen der letzten 3 Jahre",
      "Modernisierungs- und Renovierungsnachweise"
    ],
    duration: "2-3 Wochen"
  },
  {
    step: 5,
    title: "Immobilie aufwerten & vorbereiten",
    description: "Bringen Sie Ihre Immobilie in den bestmöglichen Zustand",
    tasks: [
      "Kleinere Reparaturen durchführen",
      "Gründliche Reinigung von innen und außen",
      "Entrümpelung und Depersonalisierung",
      "Garten pflegen und Außenbereich herrichten",
      "Optional: Home Staging für bessere Präsentation"
    ],
    duration: "2-4 Wochen"
  },
  {
    step: 6,
    title: "Professionelle Vermarktung starten",
    description: "Präsentieren Sie Ihre Immobilie optimal",
    tasks: [
      "Professionelle Fotos erstellen lassen",
      "Aussagekräftiges Exposé erstellen",
      "Immobilie auf relevanten Portalen inserieren",
      "Social Media und Online-Marketing nutzen",
      "Virtuelle Besichtigungstouren anbieten (optional)"
    ],
    duration: "1 Woche"
  },
  {
    step: 7,
    title: "Besichtigungen organisieren & durchführen",
    description: "Zeigen Sie Ihre Immobilie den Interessenten",
    tasks: [
      "Besichtigungstermine koordinieren",
      "Immobilie für jeden Termin vorbereiten",
      "Interessenten qualifizieren (Finanzierung, Kaufbereitschaft)",
      "Besichtigungen professionell durchführen",
      "Feedback einholen und dokumentieren"
    ],
    duration: "4-8 Wochen"
  },
  {
    step: 8,
    title: "Kaufangebote prüfen & verhandeln",
    description: "Wählen Sie das beste Angebot aus",
    tasks: [
      "Kaufangebote schriftlich einholen",
      "Bonität der Interessenten prüfen",
      "Finanzierungsbestätigungen einfordern",
      "Preisverhandlungen führen",
      "Bestmögliche Konditionen aushandeln"
    ],
    duration: "2-4 Wochen"
  },
  {
    step: 9,
    title: "Kaufvertrag vorbereiten & notariell beurkunden",
    description: "Sichern Sie den Verkauf rechtlich ab",
    tasks: [
      "Notar beauftragen und Termin vereinbaren",
      "Kaufvertragsentwurf prüfen lassen",
      "Alle erforderlichen Unterlagen bereitstellen",
      "Kaufvertrag gemeinsam mit Käufer beim Notar beurkunden",
      "Auflassungsvormerkung eintragen lassen"
    ],
    duration: "2-3 Wochen"
  },
  {
    step: 10,
    title: "Eigentumsübergabe & Abwicklung",
    description: "Übergeben Sie die Immobilie und schließen Sie den Verkauf ab",
    tasks: [
      "Kaufpreiszahlung auf Treuhandkonto bestätigen",
      "Objekt an Käufer übergeben (Übergabeprotokoll)",
      "Schlüssel übergeben",
      "Zählerstände dokumentieren",
      "Ummeldungen veranlassen (Versicherungen, Versorger etc.)",
      "Grundbuchänderung abwarten"
    ],
    duration: "4-8 Wochen"
  }
];

export function generateHausverkaufChecklistePDF(): void {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (2 * margin);
  let yPosition = margin;

  // Add UTF-8 support for German characters
  pdf.setFont('helvetica');

  // Helper function to add a new page if needed
  const checkPageBreak = (neededSpace: number) => {
    if (yPosition + neededSpace > pageHeight - margin - 15) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to draw footer
  const drawFooter = () => {
    const pageNumber = (pdf as any).internal.getCurrentPageInfo().pageNumber;
    pdf.setFontSize(8);
    pdf.setTextColor(128, 143, 166); // #808FA6
    pdf.text(
      'EDIT Immobilien | Tel: +49 40 1234567 | kontakt@edit-immobilien.de | www.edit-immobilien.de',
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
    pdf.text(
      `Seite ${pageNumber}`,
      pageWidth - margin,
      pageHeight - 8,
      { align: 'right' }
    );
  };

  // Title Page
  pdf.setFillColor(10, 10, 10); // #0a0a0a
  pdf.rect(0, 0, pageWidth, 90, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Immobilie verkaufen in', pageWidth / 2, 40, { align: 'center' });
  pdf.setFontSize(32);
  pdf.text('10 Schritten', pageWidth / 2, 55, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(128, 143, 166); // #808FA6
  pdf.text('Ihre Checkliste für einen erfolgreichen Immobilienverkauf', pageWidth / 2, 70, { align: 'center' });

  yPosition = 110;

  // Introduction
  pdf.setTextColor(60, 60, 60);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const introText = [
    'Der Verkauf einer Immobilie ist ein komplexer Prozess, der sorgfältige Planung erfordert.',
    'Mit dieser Checkliste behalten Sie den Überblick über alle wichtigen Schritte und stellen',
    'sicher, dass Sie nichts vergessen. Von der ersten Überlegung bis zur finalen Eigentumsübergabe',
    'führen wir Sie durch den gesamten Verkaufsprozess.'
  ];
  
  introText.forEach((line, index) => {
    pdf.text(line, margin, yPosition + (index * 5));
  });
  
  yPosition += 30;

  // Important Note Box
  pdf.setFillColor(128, 143, 166); // #808FA6
  pdf.roundedRect(margin, yPosition, contentWidth, 18, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Tipp: Planen Sie für den gesamten Verkaufsprozess 4-6 Monate ein.', margin + 5, yPosition + 7);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Je besser Sie vorbereitet sind, desto reibungsloser verläuft der Verkauf!', margin + 5, yPosition + 13);
  
  yPosition += 25;

  drawFooter();

  // Steps
  checklistSteps.forEach((stepData, index) => {
    const estimatedStepHeight = 60 + (stepData.tasks.length * 5);
    checkPageBreak(estimatedStepHeight);

    // Step Number Circle
    pdf.setFillColor(162, 105, 74); // #A2694A
    pdf.circle(margin + 8, yPosition + 8, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(stepData.step.toString(), margin + 8, yPosition + 11.5, { align: 'center' });

    // Step Title (rechts vom Circle)
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 30, 30);
    const titleLines = pdf.splitTextToSize(stepData.title, contentWidth - 60);
    pdf.text(titleLines, margin + 20, yPosition + 10);
    
    // Duration Badge - positioned on the right, aligned with title
    pdf.setFillColor(240, 240, 240);
    pdf.roundedRect(pageWidth - margin - 30, yPosition + 5, 30, 6, 1.5, 1.5, 'F');
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(stepData.duration, pageWidth - margin - 28, yPosition + 9.5);
    
    // Nach dem Titel: Abstand für die Bullets (Titel endet bei yPosition + 10, plus Zeilenhöhe, plus größerer Abstand)
    yPosition += 10 + (titleLines.length * 5) + 6;

    // Tasks Checklist - jetzt klar unterhalb des Titels
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    
    stepData.tasks.forEach((task, taskIndex) => {
      checkPageBreak(8);
      
      // Checkbox - weiter eingerückt für klare Hierarchie
      pdf.setDrawColor(180, 180, 180);
      pdf.setLineWidth(0.3);
      pdf.rect(margin + 5, yPosition - 2.5, 3.5, 3.5);
      
      // Task text
      const taskLines = pdf.splitTextToSize(task, contentWidth - 15);
      pdf.text(taskLines, margin + 11, yPosition);
      
      yPosition += (taskLines.length * 4.5) + 1;
    });

    yPosition += 3;

    // Separator line (kompakter)
    if (index < checklistSteps.length - 1) {
      pdf.setDrawColor(220, 220, 220);
      pdf.setLineWidth(0.3);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;
    }

    drawFooter();
  });

  // Final Page - Contact & Tips
  pdf.addPage();
  yPosition = margin;

  pdf.setFillColor(10, 10, 10);
  pdf.rect(0, 0, pageWidth, 60, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Wir begleiten Sie!', pageWidth / 2, 30, { align: 'center' });
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(128, 143, 166);
  pdf.text('Ihr persönlicher Immobilienpartner', pageWidth / 2, 45, { align: 'center' });

  yPosition = 70;

  // Two-column layout: Summary left, Photo right
  const leftColumnX = margin;
  const rightColumnX = pageWidth - margin - 55;
  const benefitsWidth = contentWidth - 65;

  // Benefits Section (LEFT COLUMN)
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 30, 30);
  pdf.text('Ihr Verkaufserfolg - Unsere Garantie', leftColumnX, yPosition);
  
  let benefitsY = yPosition + 10;

  const benefits = [
    'Professionelle Marktanalyse & realistische Bewertung',
    'Aufwertungsmaßnahmen mit fairer Kostenübernahme',
    'Hochwertige Vermarktung auf allen relevanten Kanälen',
    'Erfahrene Verhandlungsführung für den besten Preis',
    'Komplette Abwicklung - stressfrei für Sie',
    'Persönliche Betreuung während des gesamten Prozesses'
  ];

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(60, 60, 60);
  
  benefits.forEach((benefit, index) => {
    // Numbered circle
    pdf.setFillColor(70, 130, 70);
    pdf.circle(leftColumnX + 3, benefitsY - 1.5, 2.5, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text((index + 1).toString(), leftColumnX + 3, benefitsY - 0.5, { align: 'center' });
    
    // Benefit text
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    const benefitLines = pdf.splitTextToSize(benefit, benefitsWidth - 10);
    pdf.text(benefitLines, leftColumnX + 8, benefitsY);
    benefitsY += (benefitLines.length * 5) + 2;
  });

  // Profile Section (RIGHT COLUMN)
  let photoY = yPosition;
  
  // "Ihr Ansprechpartner" title
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 30, 30);
  pdf.text('Ihr Ansprechpartner', rightColumnX + 27.5, photoY, { align: 'center' });
  
  photoY += 8;

  // Profile Photo
  try {
    const imgData = profileImage;
    const photoWidth = 42;
    const photoHeight = 55;
    const photoX = rightColumnX + (55 - photoWidth) / 2;
    
    // Add photo
    pdf.addImage(imgData, 'PNG', photoX, photoY, photoWidth, photoHeight);
    
    photoY += photoHeight + 5;
    
    // Signature "Timo Konrad" in script style
    pdf.setFontSize(16);
    pdf.setFont('times', 'italic');
    pdf.setTextColor(30, 30, 30);
    pdf.text('Timo Konrad', rightColumnX + 27.5, photoY, { align: 'center' });
    
  } catch (error) {
    console.error('Error adding profile image:', error);
  }

  yPosition = Math.max(benefitsY, photoY) + 15;

  // Contact Box
  pdf.setFillColor(128, 143, 166);
  pdf.roundedRect(margin, yPosition, contentWidth, 42, 3, 3, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Kontaktieren Sie uns für ein kostenloses Beratungsgespräch!', pageWidth / 2, yPosition + 10, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('EDIT Immobilien', pageWidth / 2, yPosition + 20, { align: 'center' });
  pdf.text('Telefon: +49 40 1234567', pageWidth / 2, yPosition + 27, { align: 'center' });
  pdf.text('E-Mail: kontakt@edit-immobilien.de', pageWidth / 2, yPosition + 34, { align: 'center' });

  yPosition += 50;

  // Disclaimer
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Diese Checkliste dient als Orientierungshilfe. Individuelle Verkaufssituationen können abweichen.', pageWidth / 2, yPosition, { align: 'center' });

  drawFooter();

  // Download the PDF
  pdf.save('Checkliste-Haus-verkaufen-in-10-Schritten.pdf');
}