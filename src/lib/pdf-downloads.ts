/** ÜBERGABE LADEVERHALTEN: PDF-Bibliotheken erst nach einem Klick auf „PDF herunterladen“ laden. */
export async function generateDownloadPdf(filename: string): Promise<void> {
  switch (filename) {
    case "checkliste-hausverkauf.pdf":
      return (await import("../components/HausverkaufCheckliste")).generateHausverkaufChecklistePDF();
    case "guide-wertsteigerung.pdf":
      return (await import("../components/WertsteigerungRenovierung")).generateWertsteigerungRenovierungPDF();
    case "fehler-vermeiden.pdf":
      return (await import("../components/HaeufigsteFehler")).generateHaeufigsteFehlerPDF();
    default:
      throw new Error("Dieser Ratgeber ist nicht verfügbar.");
  }
}
