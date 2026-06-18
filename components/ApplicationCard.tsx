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
  // New fields from scraper
  salary_min?: number | null
  salary_max?: number | null
  employment_type?: string | null
  valid_through?: string | null
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  Haettu: {
    label: 'Haettu',
    className: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  },
  Haastattelu: {
    label: 'Haastattelu',
    className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  },
  Hylätty: {
    label: 'Hylätty',
    className: 'bg-red-50 text-red-600 ring-1 ring-red-200',
  },
  Tarjous: {
    label: 'Tarjous',
    className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  },
}

const EMPLOYMENT_TYPE_FI: Record<string, string> = {
  FULL_TIME: 'Kokoaikainen',
  PART_TIME: 'Osa-aikainen',
  CONTRACTOR: 'Toimeksiantaja',
  TEMPORARY: 'Määräaikainen',
  INTERN: 'Harjoittelija',
  VOLUNTEER: 'Vapaaehtoinen',
  PER_DIEM: 'Päivätyö',
  OTHER: 'Muu',
}

function formatDescription(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>
    }
    return part
  })
}

function formatSalary(min?: number | null, max?: number | null): string | null {
  if (!min && !max) return null
  const fmt = (n: number) => n.toLocaleString('fi-FI') + ' €'
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `alkaen ${fmt(min)}`
  if (max) return `enintään ${fmt(max)}`
  return null
}

function formatDate(iso?: string | null): string | null {
  if (!iso) return null
  try {
    return new Date(iso).toLocaleDateString('fi-FI', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return null
  }
}

function CompanyAvatar({ company }: { company: string }) {
  const initials = company
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const hue = (company.charCodeAt(0) * 37) % 360
  const palettes = [
    { bg: 'bg-violet-100', text: 'text-violet-700' },
    { bg: 'bg-teal-100', text: 'text-teal-700' },
    { bg: 'bg-rose-100', text: 'text-rose-700' },
    { bg: 'bg-sky-100', text: 'text-sky-700' },
    { bg: 'bg-amber-100', text: 'text-amber-700' },
    { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  ]
  const palette = palettes[hue % palettes.length]

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${palette.bg} ${palette.text}`}
    >
      {initials}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${config.className}`}
    >
      {config.label.toUpperCase()}
    </span>
  )
}

function MetaChip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-0.5 text-[12px] font-medium text-slate-600">
      {icon}
      {children}
    </span>
  )
}

// --- Icons ---
const IconPin = () => (
  <svg className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4-4-7-7.5-7-11a7 7 0 1114 0c0 3.5-3 7-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
)
const IconCalendar = () => (
  <svg className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
  </svg>
)
const IconBriefcase = () => (
  <svg className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
  </svg>
)
const IconCurrency = () => (
  <svg className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 9a3 3 0 100 6H12m0-6h-1a2 2 0 000 4h1" />
  </svg>
)
const IconClock = () => (
  <svg className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
  </svg>
)

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
  const isOffer = app.status === 'Tarjous'
  const salary = formatSalary(app.salary_min, app.salary_max)
  const deadline = formatDate(app.valid_through)
  const employmentLabel =
    app.employment_type
      ? EMPLOYMENT_TYPE_FI[app.employment_type] ?? app.employment_type
      : null

  // Warn if deadline is within 3 days
  const isUrgent =
    app.valid_through
      ? (new Date(app.valid_through).getTime() - Date.now()) / 86_400_000 <= 3
      : false

  return (
    <div
      className={`relative rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        isOffer ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-slate-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <CompanyAvatar company={app.company} />
          <div>
            <h2 className="text-[17px] font-semibold leading-snug text-slate-900">
              {app.company}
            </h2>
            <p className="text-[14px] text-slate-500">{app.job_title}</p>
          </div>
        </div>

        <button
          onClick={deleteApplication}
          disabled={loading}
          aria-label="Poista hakemus"
          className={`ml-2 rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
            confirmDelete
              ? 'animate-pulse bg-red-500 text-white'
              : 'text-slate-400 hover:bg-red-50 hover:text-red-500'
          }`}
        >
          {loading ? '…' : confirmDelete ? 'Vahvista?' : 'Poista'}
        </button>
      </div>

      {/* Meta chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        {app.location && (
          <MetaChip icon={<IconPin />}>{app.location}</MetaChip>
        )}
        {app.applied_date && (
          <MetaChip icon={<IconCalendar />}>{app.applied_date}</MetaChip>
        )}
        {employmentLabel && (
          <MetaChip icon={<IconBriefcase />}>{employmentLabel}</MetaChip>
        )}
        {salary && (
          <MetaChip icon={<IconCurrency />}>{salary}</MetaChip>
        )}
        {deadline && (
          <MetaChip icon={<IconClock />}>
            <span className={isUrgent ? 'text-red-500 font-semibold' : ''}>
              Haku päättyy {deadline}
              {isUrgent && ' ⚠️'}
            </span>
          </MetaChip>
        )}
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-slate-100" />

      {/* Status row */}
      <div className="flex items-center gap-2.5">
        {editing ? (
          <div className="flex w-full items-center gap-2">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            >
              <option>Haettu</option>
              <option>Haastattelu</option>
              <option>Hylätty</option>
              <option>Tarjous</option>
            </select>
            <button
              onClick={saveStatus}
              className="rounded-xl bg-violet-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-violet-700 cursor-pointer"
            >
              OK
            </button>
            <button
              onClick={() => setEditing(false)}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 cursor-pointer"
              aria-label="Peruuta"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <StatusBadge status={app.status} />
            <button
              onClick={() => setEditing(true)}
              className="text-[13px] font-medium text-slate-400 transition-colors hover:text-violet-600 cursor-pointer hover:underline"
            >
              Muuta tilaa
            </button>
            {app.job_url && (
              <a
                href={app.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-1 text-[13px] font-medium text-violet-600 hover:underline"
              >
                Avaa ilmoitus
                <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </>
        )}
      </div>

      {/* Notes */}
      {app.notes && (
        <div className="mt-4 rounded-xl border-l-2 border-violet-300 bg-slate-50 py-2.5 pl-3.5 pr-3">
          <p className="mb-0.5 text-[13px] font-semibold uppercase tracking-widest text-slate-400">
            Muistiinpanot
          </p>
          <p className="text-[13px] leading-relaxed text-slate-600">{app.notes}</p>
        </div>
      )}

        {/* Description */}
    {description && (
      <div className="mt-4">
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Työpaikkakuvaus
        </p>
        {/* whitespace-pre-wrap säilyttää rivivälit, formatDescription hoitaa boldaukset */}
        <div className="text-[14px] leading-relaxed text-slate-600 whitespace-pre-wrap">
          {expanded 
            ? formatDescription(description) 
            : formatDescription(`${description.slice(0, 850)}…`)
          }
        </div>
        {description.length > 850 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-violet-600 hover:underline cursor-pointer"
          >
            {expanded ? 'Näytä vähemmän' : 'Lue lisää'}
            <svg
              className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
    )}
    </div>
  )
}
