'use client'
 
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
 
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
 
export default function AddApplicationForm({
  onSuccess,
}: {
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [loadingJob, setLoadingJob] = useState(false)
 
  const [company, setCompany] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState('Haettu')
  const [notes, setNotes] = useState('')
  const [appliedDate, setAppliedDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [jobDescription, setJobDescription] = useState('')
  const [jobUrl, setJobUrl] = useState('')
 
  // New fields
  const [salaryMin, setSalaryMin] = useState<string>('')
  const [salaryMax, setSalaryMax] = useState<string>('')
  const [employmentType, setEmploymentType] = useState<string>('')
  const [validThrough, setValidThrough] = useState<string>('')
 
  async function autofillFromUrl() {
    if (!jobUrl) return
    setLoadingJob(true)
 
    try {
      const response = await fetch('/api/parse-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: jobUrl }),
      })
 
      const data = await response.json()
 
      if (data.company) setCompany(data.company)
      if (data.title) setJobTitle(data.title)
      if (data.location) setLocation(data.location)
      if (data.description) setJobDescription(data.description)
      if (data.salaryMin) setSalaryMin(String(data.salaryMin))
      if (data.salaryMax) setSalaryMax(String(data.salaryMax))
      if (data.employmentType) setEmploymentType(data.employmentType)
      if (data.validThrough) setValidThrough(data.validThrough.split('T')[0])
    } catch (error) {
      console.log(error)
      toast.error('Tietojen haku epäonnistui')
    }
 
    setLoadingJob(false)
  }
 
  async function addApplication(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
 
    const { error } = await supabase.from('applications').insert([
      {
        company,
        job_title: jobTitle,
        location,
        status,
        notes,
        applied_date: appliedDate,
        job_description: jobDescription,
        job_url: jobUrl,
        salary_min: salaryMin ? Number(salaryMin) : null,
        salary_max: salaryMax ? Number(salaryMax) : null,
        employment_type: employmentType || null,
        valid_through: validThrough || null,
      },
    ])
 
    setLoading(false)
 
    if (error) {
      console.error(error)
      toast.error('Virhe tallennuksessa: ' + error.message)
      return
    }

    toast.success('🎉 Hakemus tallennettu!', {
      description: `${company} • ${jobTitle}`,
    })
 
    // Reset
    setCompany('')
    setJobTitle('')
    setLocation('')
    setStatus('Haettu')
    setNotes('')
    setJobDescription('')
    setJobUrl('')
    setSalaryMin('')
    setSalaryMax('')
    setEmploymentType('')
    setValidThrough('')
 
    onSuccess()
  }
 
  const inputStyle =
  'w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition'
  const labelStyle =
    'block text-sm font-medium text-slate-700 mb-2'
 
  return (
    <form
      onSubmit={addApplication}
      className=" bg-white border border-slate-200 rounded-3xl p-8 shadow-sm "
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Uusi hakemus
        </h2>

        <p className="text-slate-500 mt-1">
          Seuraa uutta työmahdollisuutta.
        </p>
      </div>
 
      {/* URL AUTOFILL */}
      <div className="mb-6">
        <label className={labelStyle}>Hakuilmoituksen linkki</label>
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://duunitori.fi/..."
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            className={inputStyle}
          />
          <button
            type="button"
            onClick={autofillFromUrl}
            disabled={loadingJob || !jobUrl}
            className="px-5 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition flex items-center gap-1.5"
          >
            {loadingJob ? (
              <>
                <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" />
                Haetaan...
              </>
            ) : (
              'Auto'
            )}
          </button>
        </div>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          <div>
            <label className={labelStyle}>Yritys *</label>
            <input
              type="text"
              placeholder="Esim. Google"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={inputStyle}
              required
            />
          </div>
 
          <div>
            <label className={labelStyle}>Työtehtävä *</label>
            <input
              type="text"
              placeholder="Esim. Frontend Developer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className={inputStyle}
              required
            />
          </div>
 
          <div>
            <label className={labelStyle}>Paikkakunta</label>
            <input
              type="text"
              placeholder="Helsinki / Etä"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputStyle}
            />
          </div>
 
          <div>
            <label className={labelStyle}>Työsuhteen tyyppi</label>
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className={`${inputStyle} appearance-none cursor-pointer`}
            >
              <option value="">— Valitse —</option>
              {Object.entries(EMPLOYMENT_TYPE_FI).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
 
        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          <div>
            <label className={labelStyle}>Hakupäivä</label>
            <input
              type="date"
              value={appliedDate}
              onChange={(e) => setAppliedDate(e.target.value)}
              className={inputStyle}
            />
          </div>
 
          <div>
            <label className={labelStyle}>Hakemuksen tila</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`${inputStyle} appearance-none cursor-pointer bg-pink-50/50`}
            >
              <option>Haettu</option>
              <option>Haastattelu</option>
              <option>Hylätty</option>
              <option>Tarjous</option>
            </select>
          </div>
 
          <div>
            <label className={labelStyle}>Haku päättyy</label>
            <input
              type="date"
              value={validThrough}
              onChange={(e) => setValidThrough(e.target.value)}
              className={inputStyle}
            />
          </div>
 
          <div>
            <label className={labelStyle}>Palkka (€ / kk)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                min={0}
                className={inputStyle}
              />
              <span className="text-gray-400 shrink-0">–</span>
              <input
                type="number"
                placeholder="Max"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                min={0}
                className={inputStyle}
              />
            </div>
          </div>
        </div>
 
        {/* NOTES — full width */}
        <div className="md:col-span-2">
          <label className={labelStyle}>Muistiinpanot</label>
          <textarea
            placeholder="Palkkatoive, yhteyshenkilö..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={`${inputStyle} h-[100px] resize-none`}
          />
        </div>
 
        {/* DESCRIPTION — full width */}
        <div className="md:col-span-2">
          <label className={labelStyle}>Työpaikkakuvaus</label>
          <textarea
            placeholder="Kopioi tähän tärkeimmät asiat ilmoituksesta..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className={`${inputStyle} min-h-[150px]`}
          />
        </div>
 
      </div>
 
      <button
        type="submit"
        disabled={loading}
        className="mt-8 w-full md:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
            Tallennetaan...
          </>
        ) : (
          'Tallenna hakemus'
        )}
      </button>
    </form>
  )
}
 