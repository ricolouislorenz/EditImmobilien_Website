import jsPDF from 'jspdf';
const profileImage = "https://placehold.co/200x200?text=Profil";

export interface Mistake {
  number: number;
  title: string;
  problem: string;
  solution: string;
  editTip?: string;
}

const fehlerData: Mistake[] = [
  {
    number: 1,
    title: "Unrealistischer Verkaufspreis",
    problem: "Viele Verkäufer überschätzen den Wert ihrer Immobilie emotional. Ein zu hoher Preis führt zu langer Vermarktungszeit, weniger Besichtigungen und schließlich zu Preissenkungen, die Käufer misstrauisch machen.",
    solution: "Lassen Sie den Marktwert professionell ermitteln. Eine realistische Preisgestaltung von Anfang an führt zu mehr Interessenten, schnellerem Verkauf und oft sogar zu einem besseren Endpreis durch Wettbewerb unter Käufern.",
    editTip: "Wir erstellen eine fundierte Marktanalyse und beraten Sie zur optimalen Preisstrategie."
  },
  {
    number: 2,
    title: "Mangelhafte Vorbereitung der Immobilie",
    problem: "Ungepflegte Räume, verdreckte Fenster, überladene Zimmer oder sichtbare Mängel schrecken Käufer ab. Der erste Eindruck zählt - und ist meist entscheidend.",
    solution: "Investieren Sie in Home Staging: Entrümpeln, putzen, kleine Reparaturen durchführen und neutral gestalten. Bereits kleine Maßnahmen können den Verkaufspreis um 5-15% steigern.",
    editTip: "Wir übernehmen die Kosten für sinnvolle Aufwertungsmaßnahmen - faire Abrechnung beim Verkauf!"
  },
  {
    number: 3,
    title: "Schlechte oder fehlende Fotos",
    problem: "90% der Käufer suchen online. Verwackelte Handyfotos, schlechte Beleuchtung oder zu wenige Bilder führen dazu, dass Ihre Immobilie gar nicht erst wahrgenommen wird.",
    solution: "Professionelle Immobilienfotografie ist ein Muss. Hochwertige Bilder zeigen Ihre Immobilie im besten Licht, generieren mehr Anfragen und rechtfertigen höhere Preise.",
    editTip: "Bei EDIT Immobilien gehört professionelle Fotografie zum Standard-Service - kostenfrei!"
  },
  {
    number: 4,
    title: "Fehlende oder unvollständige Unterlagen",
    problem: "Fehlende Grundrisse, Energieausweis, Baubeschreibung oder Grundbuchauszüge verzögern den Verkauf. Käufer werden misstrauisch und springen ab.",
    solution: "Stellen Sie alle Unterlagen vor der Vermarktung zusammen: Grundriss, Energieausweis, Flurkarte, Teilungserklärung, Protokolle der Eigentümerversammlungen. Vollständigkeit schafft Vertrauen.",
    editTip: "Wir unterstützen Sie bei der Beschaffung aller notwendigen Dokumente und prüfen Vollständigkeit."
  },
  {
    number: 5,
    title: "Keine professionelle Vermarktungsstrategie",
    problem: "Einfach ein Inserat auf einem Portal schalten reicht nicht. Ohne durchdachte Multi-Channel-Strategie erreichen Sie nicht die richtigen Käufer zur richtigen Zeit.",
    solution: "Nutzen Sie mehrere Kanäle: Top-Immobilienportale, Social Media, Netzwerk von Maklern, gezielte Ansprache potenzieller Käufer. Professionelle Exposés und kontinuierliches Marketing sind entscheidend.",
    editTip: "Wir vermarkten auf verschiedenen Plattformen und nutzen unser großes Käufer-Netzwerk für schnelle Erfolge."
  },
  {
    number: 6,
    title: "Emotionale statt sachliche Verhandlungen",
    problem: "Verkäufer hängen emotional an ihrem Zuhause und reagieren auf Kritik oder Preisverhandlungen persönlich. Das führt zu gescheiterten Verhandlungen und verlorenen Käufern.",
    solution: "Behandeln Sie den Verkauf als Geschäftstransaktion. Bleiben Sie sachlich, nehmen Sie Anmerkungen nicht persönlich und konzentrieren Sie sich auf das Ziel: den bestmöglichen Preis.",
    editTip: "Als neutraler Verhandlungspartner führen wir sachliche Gespräche und holen das Beste für Sie heraus."
  },
  {
    number: 7,
    title: "Unterschätzung des Zeitaufwands",
    problem: "Viele Privatverkäufer unterschätzen den enormen Zeitaufwand: Telefonate, Besichtigungen am Abend und Wochenende, Nachfragen beantworten, Unterlagen zusammenstellen. Das kostet Nerven und Zeit.",
    solution: "Planen Sie realistisch oder überlassen Sie die zeitintensiven Aufgaben einem Profi. Ein erfahrener Makler spart Ihnen durchschnittlich 50-80 Stunden Arbeit.",
    editTip: "Wir übernehmen den kompletten Vermarktungsprozess - Sie bleiben entspannt und informiert."
  }
];

export function generateHaeufigsteFehlerPDF(): void {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (2 * margin);
  let yPosition = margin;

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
    pdf.setTextColor(128, 143, 166); // #C2A878
    pdf.text(
      'EDIT Immobilien | Tel: +49 1729037547 | kontakt@edit-immobilien.de | www.edit-immobilien.de',
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
  pdf.setFillColor(10, 10, 10); // #111111
  pdf.rect(0, 0, pageWidth, 90, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Die 7 häufigsten Fehler', pageWidth / 2, 40, { align: 'center' });
  pdf.setFontSize(32);
  pdf.text('beim Immobilienverkauf', pageWidth / 2, 55, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(128, 143, 166); // #C2A878
  pdf.text('...und wie Sie diese vermeiden können', pageWidth / 2, 70, { align: 'center' });

  yPosition = 110;

  // Introduction
  pdf.setTextColor(60, 60, 60);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const introText = [
    'Der Verkauf einer Immobilie ist eine komplexe Angelegenheit. Viele Privatverkäufer machen',
    'vermeidbare Fehler, die zu Preisverlusten von durchschnittlich 8-15% führen und den',
    'Verkaufsprozess unnötig verzögern. Mit der richtigen Vorbereitung und professioneller',
    'Unterstützung lassen sich diese Stolperfallen einfach umgehen.'
  ];
  
  introText.forEach((line, index) => {
    pdf.text(line, margin, yPosition + (index * 5));
  });
  
  yPosition += 28;

  // Important Note Box
  pdf.setFillColor(162, 105, 74); // #6B4F3A
  pdf.roundedRect(margin, yPosition, contentWidth, 25, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Unser Versprechen:', margin + 5, yPosition + 7);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Mit EDIT Immobilien vermeiden Sie diese Fehler von Anfang an. Wir begleiten Sie durch', margin + 5, yPosition + 13);
  pdf.text('jeden Schritt - professionell, transparent und mit maximaler Wertschöpfung für Sie.', margin + 5, yPosition + 19);
  
  yPosition += 32;

  drawFooter();

  // Fehler Pages
  fehlerData.forEach((fehler, index) => {
    // Check if we need a new page
    checkPageBreak(85);

    // Fehler Number Badge
    pdf.setFillColor(128, 143, 166); // #C2A878
    pdf.circle(margin + 6, yPosition + 6, 6, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(fehler.number.toString(), margin + 6, yPosition + 8.5, { align: 'center' });

    // Fehler Title
    pdf.setTextColor(30, 30, 30);
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.text(fehler.title, margin + 16, yPosition + 8);

    yPosition += 15;

    // Problem Section
    pdf.setFillColor(255, 245, 245);
    pdf.roundedRect(margin, yPosition, contentWidth, 0, 1.5, 1.5, 'F'); // Will adjust height
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(162, 105, 74); // #6B4F3A
    pdf.text('Problem:', margin + 4, yPosition + 5);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    const problemLines = pdf.splitTextToSize(fehler.problem, contentWidth - 10);
    pdf.text(problemLines, margin + 4, yPosition + 10);
    
    const problemHeight = (problemLines.length * 4) + 8;
    pdf.setFillColor(255, 245, 245);
    pdf.roundedRect(margin, yPosition, contentWidth, problemHeight, 1.5, 1.5, 'F');
    pdf.text(problemLines, margin + 4, yPosition + 10);
    
    yPosition += problemHeight + 3;

    // Solution Section
    pdf.setFillColor(245, 255, 245);
    pdf.roundedRect(margin, yPosition, contentWidth, 0, 1.5, 1.5, 'F'); // Will adjust height
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(70, 130, 70);
    pdf.text('Lösung:', margin + 4, yPosition + 5);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    const solutionLines = pdf.splitTextToSize(fehler.solution, contentWidth - 10);
    pdf.text(solutionLines, margin + 4, yPosition + 10);
    
    const solutionHeight = (solutionLines.length * 4) + 8;
    pdf.setFillColor(245, 255, 245);
    pdf.roundedRect(margin, yPosition, contentWidth, solutionHeight, 1.5, 1.5, 'F');
    pdf.text(solutionLines, margin + 4, yPosition + 10);
    
    yPosition += solutionHeight + 3;

    // EDIT Tip Section (if available)
    if (fehler.editTip) {
      pdf.setFillColor(162, 105, 74); // #6B4F3A
      pdf.roundedRect(margin, yPosition, contentWidth, 0, 1.5, 1.5, 'F'); // Will adjust height
      
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text('EDIT Immobilien:', margin + 4, yPosition + 5);
      
      pdf.setFont('helvetica', 'normal');
      const tipLines = pdf.splitTextToSize(fehler.editTip, contentWidth - 10);
      pdf.text(tipLines, margin + 4, yPosition + 10);
      
      const tipHeight = (tipLines.length * 4) + 8;
      pdf.setFillColor(162, 105, 74);
      pdf.roundedRect(margin, yPosition, contentWidth, tipHeight, 1.5, 1.5, 'F');
      pdf.text(tipLines, margin + 4, yPosition + 10);
      
      yPosition += tipHeight + 3;
    }

    // Spacing after each fehler
    yPosition += 5;

    drawFooter();
  });

  // Final Page - Summary & Contact
  pdf.addPage();
  yPosition = margin;

  pdf.setFillColor(10, 10, 10);
  pdf.rect(0, 0, pageWidth, 60, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Ihr nächster Schritt', pageWidth / 2, 30, { align: 'center' });
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(128, 143, 166);
  pdf.text('Professioneller Verkauf beginnt mit der richtigen Strategie', pageWidth / 2, 45, { align: 'center' });

  yPosition = 70;

  // Two-column layout: Summary left, Photo right
  const leftColumnX = margin;
  const rightColumnX = pageWidth - margin - 55;
  const summaryWidth = contentWidth - 65;

  // Summary Section (LEFT COLUMN)
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 30, 30);
  pdf.text('Zusammenfassung: So verkaufen Sie erfolgreich', leftColumnX, yPosition);
  
  let summaryY = yPosition + 10;

  const summaryPoints = [
    'Realistische Preisgestaltung durch professionelle Bewertung',
    'Optimale Vorbereitung der Immobilie (Staging & Aufwertung)',
    'Professionelle Fotos und aussagekräftige Exposés',
    'Vollständige Unterlagen von Anfang an bereithalten',
    'Multi-Channel-Vermarktungsstrategie nutzen',
    'Sachliche, professionelle Verhandlungsführung',
    'Zeitaufwand realistisch einschätzen oder delegieren'
  ];

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(60, 60, 60);
  
  summaryPoints.forEach((point, index) => {
    // Numbered circle
    pdf.setFillColor(70, 130, 70);
    pdf.circle(leftColumnX + 3, summaryY - 1.5, 2.5, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text((index + 1).toString(), leftColumnX + 3, summaryY - 0.5, { align: 'center' });
    
    // Point text
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    const pointLines = pdf.splitTextToSize(point, summaryWidth - 12);
    pdf.text(pointLines, leftColumnX + 8, summaryY);
    summaryY += (pointLines.length * 4.5) + 2;
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

  yPosition = Math.max(summaryY, photoY) + 15;

  // Special EDIT Feature Box
  pdf.setFillColor(162, 105, 74); // #6B4F3A
  pdf.roundedRect(margin, yPosition, contentWidth, 42, 3, 3, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Warum EDIT Immobilien?', margin + 5, yPosition + 8);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('✓ Kostenlose, fundierte Marktanalyse & Bewertung', margin + 5, yPosition + 16);
  pdf.text('✓ Professionelle Aufwertung mit fairer Kostenübernahme', margin + 5, yPosition + 22);
  pdf.text('✓ Vermarktung auf verschiedenen Plattformen + großes Käufer-Netzwerk', margin + 5, yPosition + 28);
  pdf.text('✓ Komplette Abwicklung - Sie bleiben entspannt', margin + 5, yPosition + 34);

  yPosition += 50;

  // Contact Box
  pdf.setFillColor(128, 143, 166);
  pdf.roundedRect(margin, yPosition, contentWidth, 42, 3, 3, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Starten Sie Ihren erfolgreichen Verkauf - Jetzt Kontakt aufnehmen!', pageWidth / 2, yPosition + 10, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('EDIT Immobilien', pageWidth / 2, yPosition + 20, { align: 'center' });
  pdf.text('Telefon: +49 1729037547', pageWidth / 2, yPosition + 27, { align: 'center' });
  pdf.text('E-Mail: kontakt@edit-immobilien.de', pageWidth / 2, yPosition + 34, { align: 'center' });

  yPosition += 50;

  // Disclaimer
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  const disclaimer = pdf.splitTextToSize('Diese Informationen dienen der allgemeinen Orientierung. Jeder Immobilienverkauf ist individuell. Gerne beraten wir Sie persönlich zu Ihrer spezifischen Situation.', contentWidth);
  pdf.text(disclaimer, pageWidth / 2, yPosition, { align: 'center' });

  drawFooter();

  // Download the PDF
  pdf.save('Die-7-haeufigsten-Fehler-beim-Immobilienverkauf-EDIT-Immobilien.pdf');
}