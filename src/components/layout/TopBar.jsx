import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="container top-bar-content">
        <span>✅ Yape, Plin y transferencia</span>
        <span>🚚 Envíos a todo el Perú</span>
        <span>
          📞 WhatsApp:{" "}
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
            +51 949 242 995
          </a>
        </span>
      </div>
    </div>
  );
}
