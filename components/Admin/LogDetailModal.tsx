"use client";

export default function LogDetailModal({ log, onClose }: { log: any; onClose: () => void }) {
  if (!log) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-4">
        {/* Modaalisisältö tässä (se koodi jonka annoin aiemmin) */}
        <button onClick={onClose} className="mt-4 text-sm text-slate-500">Sulje</button>
      </div>
    </div>
  );
}