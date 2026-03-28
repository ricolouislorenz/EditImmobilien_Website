import jsPDF from 'jspdf';
const profileImage = "https://placehold.co/200x200?text=Profil";

interface RenovationTip {
  title: string;
  description: string;
}

export interface RenovierungCategory {
  category: string;
  description: string;
  measures: RenovierungMeasure[];
}

export interface RenovierungMeasure {
  title: string;
  description: string;
  roi: string; // Return on Investment
  duration: string;
  cost: string;
}

const renovierungCategories: RenovierungCategory[] = [
  {
    category: "Außenbereich & Fassade",
    description: "Der erste Eindruck zählt - Curb Appeal entscheidet oft über Kaufinteresse",
    measures: [
      {
        title: "Fassade reinigen & streichen",
        description: "Eine saubere, frisch gestrichene Fassade wertet die Immobilie sofort auf und signalisiert gute Pflege.",
        roi: "100-150%",
        duration: "2-5 Tage",
        cost: "€€"
      },
      {
        title: "Vorgarten & Eingangsbereich gestalten",
        description: "Gepflegte Beete, gemähter Rasen und ein aufgeräumter Eingang schaffen Willkommensgefühl.",
        roi: "150-200%",
        duration: "1-2 Tage",
        cost: "€"
      },
      {
        title: "Haustür renovieren oder austauschen",
        description: "Eine moderne, gepflegte Haustür ist das Aushängeschild der Immobilie.",
        roi: "100-120%",
        duration: "1 Tag",
        cost: "€€"
      }
    ]
  },
  {
    category: "Innenräume - Wände & Decken",
    description: "Frische, neutrale Farben schaffen helle Räume mit breiter Käuferappeal",
    measures: [
      {
        title: "Wände in neutralen Farben streichen",
        description: "Weiß, Beige oder helle Grautöne lassen Räume größer wirken und sprechen mehr Käufer an.",
        roi: "150-200%",
        duration: "2-4 Tage",
        cost: "€"
      },
      {
        title: "Risse & Löcher spachteln",
        description: "Kleine Mängel schnell beheben - zeigt Sorgfalt und vermeidet Preisverhandlungen.",
        roi: "200%+",
        duration: "1-2 Tage",
        cost: "€"
      },
      {
        title: "Tapeten entfernen/erneuern",
        description: "Veraltete oder beschädigte Tapeten durch neutrale Wandgestaltung ersetzen.",
        roi: "120-150%",
        duration: "3-5 Tage",
        cost: "€€"
      }
    ]
  },
  {
    category: "Böden",
    description: "Hochwertige Böden steigern den Wert erheblich und beeinflussen die Raumwirkung",
    measures: [
      {
        title: "Parkett aufarbeiten & versiegeln",
        description: "Abgeschliffenes und neu versiegeltes Parkett wirkt wie neu und steigert den Wert deutlich.",
        roi: "150-200%",
        duration: "3-5 Tage",
        cost: "€€"
      },
      {
        title: "Alte Teppiche entfernen",
        description: "Teppichböden entfernen und durch Laminat, Vinyl oder Parkett ersetzen.",
        roi: "120-180%",
        duration: "2-3 Tage",
        cost: "€€"
      },
      {
        title: "Fliesen reinigen & Fugen erneuern",
        description: "Saubere Fugen und glänzende Fliesen machen einen großen Unterschied.",
        roi: "180-220%",
        duration: "1-2 Tage",
        cost: "€"
      }
    ]
  },
  {
    category: "Küche",
    description: "Die Küche ist oft kaufentscheidend - bereits kleine Verbesserungen wirken",
    measures: [
      {
        title: "Küchenfronten erneuern oder folieren",
        description: "Neue Fronten oder hochwertige Folien geben der Küche ein modernes Aussehen.",
        roi: "100-150%",
        duration: "2-3 Tage",
        cost: "€€"
      },
      {
        title: "Arbeitsplatte austauschen",
        description: "Eine neue Arbeitsplatte (Naturstein, Quarz) wertet die Küche erheblich auf.",
        roi: "120-160%",
        duration: "1-2 Tage",
        cost: "€€€"
      },
      {
        title: "Armaturen & Griffe modernisieren",
        description: "Neue Griffe und eine moderne Armatur sind kostengünstig und wirken stark.",
        roi: "200%+",
        duration: "0.5 Tage",
        cost: "€"
      }
    ]
  },
  {
    category: "Badezimmer",
    description: "Ein modernes, sauberes Bad ist für viele Käufer entscheidend",
    measures: [
      {
        title: "Sanitärobjekte modernisieren",
        description: "Neue WC, Waschbecken oder Dusche schaffen ein zeitgemäßes Badambiente.",
        roi: "100-140%",
        duration: "2-4 Tage",
        cost: "€€€"
      },
      {
        title: "Armaturen austauschen",
        description: "Moderne Armaturen in Chrom oder Matt-Schwarz wirken hochwertig.",
        roi: "150-200%",
        duration: "0.5 Tage",
        cost: "€"
      },
      {
        title: "Silikonfugen erneuern",
        description: "Saubere, weiße Fugen vermitteln Hygiene und Pflege.",
        roi: "250%+",
        duration: "0.5 Tage",
        cost: "€"
      },
      {
        title: "Beleuchtung optimieren",
        description: "Helle, moderne LED-Beleuchtung macht das Bad freundlicher und größer.",
        roi: "180-220%",
        duration: "1 Tag",
        cost: "€"
      }
    ]
  },
  {
    category: "Beleuchtung",
    description: "Gutes Licht macht Räume einladend und hebt Vorzüge hervor",
    measures: [
      {
        title: "LED-Beleuchtung installieren",
        description: "Moderne, energiesparende LED-Leuchten in warmweißer Lichtfarbe schaffen Atmosphäre.",
        roi: "150-180%",
        duration: "1-2 Tage",
        cost: "€"
      },
      {
        title: "Lampen & Leuchten austauschen",
        description: "Veraltete Lampen durch moderne, neutrale Designs ersetzen.",
        roi: "120-160%",
        duration: "0.5 Tage",
        cost: "€€"
      },
      {
        title: "Dimmer einbauen",
        description: "Dimmbare Beleuchtung ermöglicht verschiedene Lichtstimmungen.",
        roi: "100-130%",
        duration: "0.5 Tage",
        cost: "€"
      }
    ]
  },
  {
    category: "Kleine Reparaturen & Details",
    description: "Details zeigen Wertschätzung und vermeiden negative Eindrücke",
    measures: [
      {
        title: "Türen & Fenster instand setzen",
        description: "Knarrende Türen ölen, klemmende Fenster reparieren, Beschläge erneuern.",
        roi: "200%+",
        duration: "1 Tag",
        cost: "€"
      },
      {
        title: "Steckdosen & Schalter modernisieren",
        description: "Vergilbte Schalter durch moderne, weiße oder farblich passende ersetzen.",
        roi: "180-220%",
        duration: "1 Tag",
        cost: "€"
      },
      {
        title: "Heizkörper streichen",
        description: "Frisch gestrichene Heizkörper in Weiß wirken gepflegt.",
        roi: "150-180%",
        duration: "1-2 Tage",
        cost: "€"
      }
    ]
  }
];

export function generateWertsteigerungRenovierungPDF(): void {
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
    pdf.setTextColor(128, 143, 166); // #808FA6
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
  pdf.setFillColor(10, 10, 10); // #0a0a0a
  pdf.rect(0, 0, pageWidth, 90, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Wertsteigerung durch', pageWidth / 2, 40, { align: 'center' });
  pdf.setFontSize(32);
  pdf.text('Renovierung', pageWidth / 2, 55, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(128, 143, 166); // #808FA6
  pdf.text('Schnelle Maßnahmen für maximale Verkaufserfolge', pageWidth / 2, 70, { align: 'center' });

  yPosition = 110;

  // Introduction
  pdf.setTextColor(60, 60, 60);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const introText = [
    'Maßnahmen, die den ersten Eindruck des Verkaufsobjekts verbessern, sind oftmals schnell',
    'und leicht umzusetzen. Sie fördern einen positiven ersten Eindruck und damit einen',
    'beschleunigten Verkaufsablauf. Investitionen in gezielte Renovierungen zahlen sich aus:',
    'Sie steigern nicht nur den Verkaufspreis, sondern verkürzen auch die Vermarktungszeit.'
  ];
  
  introText.forEach((line, index) => {
    pdf.text(line, margin, yPosition + (index * 5));
  });
  
  yPosition += 30;

  // Important Note Box
  pdf.setFillColor(162, 105, 74); // #A2694A
  pdf.roundedRect(margin, yPosition, contentWidth, 25, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('EDIT Immobilien Vorteil: Faire Kostenübernahme!', margin + 5, yPosition + 7);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Wir übernehmen die Kosten für sinnvolle Renovierungsmaßnahmen und rechnen diese', margin + 5, yPosition + 13);
  pdf.text('fair beim Verkauf ab. So steigern Sie den Wert Ihrer Immobilie ohne Vorfinanzierung!', margin + 5, yPosition + 19);
  
  yPosition += 32;

  drawFooter();

  // Add new page for Cost Categories
  pdf.addPage();
  yPosition = margin;

  // Cost Categories Header
  pdf.setFillColor(10, 10, 10);
  pdf.rect(0, 0, pageWidth, 50, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Kostenkategorien', pageWidth / 2, 32, { align: 'center' });

  yPosition = 65;

  // Cost Category Boxes
  const costCategories = [
    { symbol: '€', range: 'bis 500€', description: 'Geringe Kosten' },
    { symbol: '€€', range: '500-2.000€', description: 'Mittlere Kosten' },
    { symbol: '€€€', range: 'über 2.000€', description: 'Höhere Investition' }
  ];

  costCategories.forEach((cat, index) => {
    const boxY = yPosition + (index * 35);
    
    // Category box
    pdf.setFillColor(250, 250, 250);
    pdf.roundedRect(margin, boxY, contentWidth, 28, 2, 2, 'F');
    
    // Symbol with background
    pdf.setFillColor(162, 105, 74); // #A2694A
    pdf.roundedRect(margin + 5, boxY + 5, 35, 18, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(cat.symbol, margin + 22.5, boxY + 17, { align: 'center' });
    
    // Range
    pdf.setTextColor(30, 30, 30);
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.text(cat.range, margin + 48, boxY + 12);
    
    // Description
    pdf.setTextColor(60, 60, 60);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(cat.description, margin + 48, boxY + 20);
  });

  yPosition += 115;

  drawFooter();

  // Categories with measures
  renovierungCategories.forEach((categoryData, catIndex) => {
    // Estimate space needed
    const measuresHeight = categoryData.measures.length * 28;
    const totalNeeded = 25 + measuresHeight;
    
    checkPageBreak(totalNeeded);

    // Category Header
    pdf.setFillColor(128, 143, 166); // #808FA6
    pdf.roundedRect(margin, yPosition, contentWidth, 18, 2, 2, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.text(categoryData.category, margin + 5, yPosition + 7);
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(categoryData.description, margin + 5, yPosition + 13);
    
    yPosition += 23;

    // Measures in this category
    categoryData.measures.forEach((measure, measureIndex) => {
      checkPageBreak(28);

      // Measure box with light background
      pdf.setFillColor(250, 250, 250);
      pdf.roundedRect(margin, yPosition, contentWidth, 24, 1.5, 1.5, 'F');

      // Title
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 30, 30);
      pdf.text(measure.title, margin + 4, yPosition + 5);

      // Description
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 60, 60);
      const descLines = pdf.splitTextToSize(measure.description, contentWidth - 10);
      pdf.text(descLines, margin + 4, yPosition + 10);

      // Duration and Cost at bottom
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`${measure.duration} • ${measure.cost}`, margin + 4, yPosition + 20);

      yPosition += 27;
    });

    // Spacing after category
    yPosition += 3;

    drawFooter();
  });

  // Final Page - Tips & Contact
  pdf.addPage();
  yPosition = margin;

  pdf.setFillColor(10, 10, 10);
  pdf.rect(0, 0, pageWidth, 60, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Unsere Empfehlung', pageWidth / 2, 30, { align: 'center' });
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(128, 143, 166);
  pdf.text('Professionelle Beratung zahlt sich aus', pageWidth / 2, 45, { align: 'center' });

  yPosition = 70;

  // Two-column layout: Tips left, Photo right
  const leftColumnX = margin;
  const rightColumnX = pageWidth - margin - 55;
  const tipsWidth = contentWidth - 65;

  // Expert Tips Section (LEFT COLUMN)
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 30, 30);
  pdf.text('Unsere Empfehlungen für Sie', leftColumnX, yPosition);
  
  let tipsY = yPosition + 10;

  const expertTips = [
    'Realistische Budgetplanung vor Beginn der Maßnahmen',
    'Professionelle Beratung zur Auswahl der Maßnahmen',
    'Qualifizierte Handwerker mit Garantieleistungen',
    'Dokumentation aller Renovierungen für spätere Verkäufe',
    'Wertermittlung vor und nach den Maßnahmen',
    'Faire Kostenübernahme bei EDIT Immobilien nutzen'
  ];

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(60, 60, 60);
  
  expertTips.forEach((tip, index) => {
    // Numbered circle
    pdf.setFillColor(70, 130, 70);
    pdf.circle(leftColumnX + 3, tipsY - 1.5, 2.5, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text((index + 1).toString(), leftColumnX + 3, tipsY - 0.5, { align: 'center' });
    
    // Tip text
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    const tipLines = pdf.splitTextToSize(tip, tipsWidth - 10);
    pdf.text(tipLines, leftColumnX + 6, tipsY);
    tipsY += (tipLines.length * 5) + 2;
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

  yPosition = Math.max(tipsY, photoY) + 15;

  // Special EDIT Feature Box
  pdf.setFillColor(162, 105, 74); // #A2694A
  pdf.roundedRect(margin, yPosition, contentWidth, 35, 3, 3, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Ihr Vorteil mit EDIT Immobilien:', margin + 5, yPosition + 8);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('✓ Kostenlose Erstberatung zur optimalen Renovierungsstrategie', margin + 5, yPosition + 16);
  pdf.text('✓ Faire Kostenübernahme für wertsteigende Maßnahmen', margin + 5, yPosition + 22);
  pdf.text('✓ Zugang zu unserem Handwerker-Netzwerk mit fairen Preisen', margin + 5, yPosition + 28);

  yPosition += 43;

  // Contact Box
  pdf.setFillColor(128, 143, 166);
  pdf.roundedRect(margin, yPosition, contentWidth, 42, 3, 3, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Lassen Sie uns gemeinsam den Wert Ihrer Immobilie steigern!', pageWidth / 2, yPosition + 10, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('EDIT Immobilien', pageWidth / 2, yPosition + 20, { align: 'center' });
  pdf.text('Telefon: +49 1729037547', pageWidth / 2, yPosition + 27, { align: 'center' });
  pdf.text('E-Mail: kontakt@edit-immobilien.de', pageWidth / 2, yPosition + 34, { align: 'center' });

  yPosition += 50;

  // Disclaimer
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Alle Angaben zu ROI und Kosten sind Richtwerte. Tatsächliche Werte können je nach Region und Objekt variieren.', pageWidth / 2, yPosition, { align: 'center' });

  drawFooter();

  // Download the PDF
  pdf.save('Wertsteigerung-durch-Renovierung-EDIT-Immobilien.pdf');
}