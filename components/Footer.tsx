export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-4">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Vasen puoli: Logo ja brändi */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <h4 className="font-bold text-slate-900">Duunify</h4>
          <p className="text-xs text-slate-500">
            © {currentYear} Kaikki oikeudet pidätetään.
          </p>
        </div>

        {/* Oikea puoli: Linkit */}
        <nav className="flex gap-8 text-sm text-slate-600">
          <a href="/tietosuoja" className="hover:text-indigo-600 transition-colors">Tietosuoja</a>
          <a href="/kayttoehdot" className="hover:text-indigo-600 transition-colors">Käyttöehdot</a>
          <a href="mailto:tuki@duunify.com" className="hover:text-indigo-600 transition-colors">Yhteystiedot</a>
        </nav>
      </div>
    </footer>
  );
}