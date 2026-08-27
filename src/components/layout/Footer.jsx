export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-column">
          <a href="#" className="logo footer-logo">👨‍🍳 Cocina<span>Mejor</span></a>
          <p>Equipamos tu cocina con los mejores productos de calidad al mejor precio.</p>
          <div className="socials"><a href="#">f</a><a href="#">◎</a><a href="#">♪</a><a href="#">▶</a></div>
        </div>
        <div className="footer-column"><h3>Atención al cliente</h3><a href="#">Preguntas frecuentes</a><a href="#">Políticas de envío</a><a href="#">Cambios y devoluciones</a><a href="#">Términos y condiciones</a><a href="#">Contacto</a></div>
        <div className="footer-column"><h3>Mi cuenta</h3><a href="#">Iniciar sesión</a><a href="#">Mis pedidos</a><a href="#">Mis favoritos</a><a href="#">Boletines y ofertas</a></div>
        <div className="footer-column"><h3>Información</h3><a href="#">Quiénes somos</a><a href="#">Trabaja con nosotros</a><a href="#">Términos y condiciones</a><a href="#">Política de privacidad</a></div>
        <div className="footer-column newsletter"><h3>Suscríbete a nuestras ofertas</h3><p>Recibe las mejores ofertas y novedades directamente en tu correo.</p><div className="newsletter-form"><input type="email" placeholder="Ingresa tu correo" /><button>→</button></div></div>
      </div>
      <div className="container footer-bottom"><span>© 2026 CocinaMejor. Todos los derechos reservados.</span><div className="payment-methods"><span>VISA</span><span>MC</span><span>Yape</span><span>Plin</span></div></div>
    </footer>
  );
}
