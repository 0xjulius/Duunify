'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Application = {
  id: string
  company: string
  job_title: string
  location: string
  status: string
  notes: string
  applied_date: string
  job_description: string
  job_url?: string
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Haettu':
      return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'Haastattelu':
      return 'bg-amber-100 text-amber-700 border-amber-200'
    case 'Hylätty':
      return 'bg-rose-100 text-rose-700 border-rose-200'
    case 'Tarjous':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200'
  }
}

export default function ApplicationCard({
  app,
  onChange,
}: {
  app: Application
  onChange: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [newStatus, setNewStatus] = useState(app.status)
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function deleteApplication() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    setLoading(true)
    await supabase.from('applications').delete().eq('id', app.id)
    setLoading(false)
    onChange()
  }

  async function saveStatus() {
    setLoading(true)
    await supabase.from('applications').update({ status: newStatus }).eq('id', app.id)
    setLoading(false)
    setEditing(false)
    onChange()
  }

  const description = app.job_description || ''

  return (
    /* TAUSTA VAIHDETTU: bg-white/60 backdrop-blur-2xl rounded-3xl border-white/20 shadow-xl */
    <div className="group relative overflow-hidden rounded-3xl p-6 bg-white/60 backdrop-blur-2xl border border-white/20 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      
      {/* Otsikko-osa */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 leading-tight">
            {app.company}
          </h2>
          <p className="text-md font-medium text-gray-600 mt-1">{app.job_title}</p>
        </div>
        
        <button
          onClick={deleteApplication}
          disabled={loading}
          className={`ml-4 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
            confirmDelete 
              ? 'bg-rose-500 text-white animate-pulse' 
              : 'text-gray-400 hover:text-rose-500 hover:bg-rose-50'
          }`}
        >
          {loading ? '...' : confirmDelete ? 'Vahvista?' : 'Poista'}
        </button>
      </div>

{/* Meta-tiedot */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-sm text-gray-600 font-medium">
        {app.location && (
          <span className="flex items-center gap-1.5 bg-white/40 px-2 py-0.5 rounded-lg">
            <span className="text-xs">📍</span> {app.location}
          </span>
        )}
        {app.applied_date && (
          <span className="flex items-center gap-1.5 bg-white/40 px-2 py-0.5 rounded-lg">
            <span className="text-xs">📅</span> {app.applied_date}
          </span>
        )}
      </div>

      {/* Status-osio */}
      <div className="flex items-center gap-3 py-3 border-y border-pink-100/30">
        {editing ? (
          <div className="flex items-center gap-2 w-full">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="flex-1 p-2 rounded-xl bg-white/80 border border-pink-200 text-sm outline-none text-gray-900"
            >
              <option>Haettu</option>
              <option>Haastattelu</option>
              <option>Hylätty</option>
              <option>Tarjous</option>
            </select>
            <button
              onClick={saveStatus}
              className="px-4 py-2 bg-pink-500 text-white rounded-xl text-sm font-bold shadow-sm"
            >
              OK
            </button>
            <button onClick={() => setEditing(false)} className="p-2 text-gray-400">✕</button>
          </div>
        ) : (
          <>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(app.status)}`}>
              {app.status.toUpperCase()}
            </span>
            <button
              onClick={() => setEditing(true)}
              className="text-gray-400 hover:text-pink-500 text-xs font-semibold transition-colors"
            >
              Muuta tilaa
            </button>
          </>
        )}
      </div>

      {/* Linkki ja sisällöt */}
      {app.job_url && (
        <a
          href={app.job_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mt-4 text-pink-600 text-sm font-semibold hover:underline"
        >
          Avaa ilmoitus 🔗
        </a>
      )}

      <div className="mt-4 space-y-3">
        {app.notes && (
          <div className="bg-white/40 p-3 rounded-2xl border border-white/50">
            <p className="text-[10px] uppercase tracking-wider font-bold text-pink-400 mb-1">Muistiinpanot</p>
            <p className="text-sm text-gray-600 italic">"{app.notes}"</p>
          </div>
        )}

        {description && (
          <div className="pt-1">
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Työpaikkakuvaus</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {expanded ? description : `${description.slice(0, 850)}...`}
            </p>
            {description.length > 850 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 text-pink-500 text-xs font-bold"
              >
                {expanded ? 'Näytä vähemmän ↑' : 'Lue lisää ↓'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}