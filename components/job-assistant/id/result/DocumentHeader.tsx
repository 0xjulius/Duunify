interface DocumentHeaderProps {
  isEditing: boolean;
  fullName: string;
  city: string;
  phone: string;
  email: string;
  onFullNameChange: (val: string) => void;
  onCityChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
  onEmailChange: (val: string) => void;
}

export function DocumentHeader({
  isEditing,
  fullName,
  city,
  phone,
  email,
  onFullNameChange,
  onCityChange,
  onPhoneChange,
  onEmailChange,
}: DocumentHeaderProps) {
  return (
    <header className="grid grid-cols-3 gap-4 pb-8 mb-8 border-b border-slate-200 dark:border-slate-800 print:border-b-0 print:pb-6 print:mb-6 text-sm text-slate-700 dark:text-slate-300 print:text-black print:text-[12pt]">
      <div className="space-y-0.5">
        {isEditing ? (
          <div className="space-y-2 print:hidden">
            <input
              type="text"
              value={fullName}
              onChange={(e) => onFullNameChange(e.target.value)}
              placeholder="Etunimi Sukunimi"
              className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
            <input
              type="text"
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              placeholder="Paikkakunta"
              className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
            <input
              type="text"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="Puhelinnumero"
              className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
            <input
              type="text"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="Sähköposti"
              className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
          </div>
        ) : null}

        <div className={isEditing ? "print:block hidden" : "block"}>
          <p className="font-bold text-slate-900 dark:text-white print:text-black">
            {fullName || "Etunimi Sukunimi"}
          </p>
          <p>{city || "Paikkakunta"}</p>
          <p>{phone || "Puhelinnumero"}</p>
          <p>{email || "Sähköposti"}</p>
        </div>
      </div>

      <div className="flex flex-col justify-between pl-[120px]">
        <p className="font-bold text-slate-900 dark:text-white print:text-black">
          Saatekirje
        </p>
        <p className="mt-auto">{new Date().toLocaleDateString("fi-FI")}</p>
      </div>

      <div className="text-right font-bold">
        <p>1 (2)</p>
      </div>
    </header>
  );
}