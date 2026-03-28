import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const phoneNumber = "491729037547";
  const message = "Hallo EDIT Immobilien, ich interessiere mich für Ihre Dienstleistungen und würde gerne Kontakt aufnehmen.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Kontakt über WhatsApp"
    >
      <div className="relative">
        {/* Main button */}
        <div className="relative bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110">
          <MessageCircle className="w-7 h-7" />
        </div>
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-xl">
          Schreiben Sie uns auf WhatsApp
          <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </a>
  );
}