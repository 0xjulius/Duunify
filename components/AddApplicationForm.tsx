'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AddApplicationForm({
  onSuccess,
}: {
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [company, setCompany] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState('Haettu')
  const [notes, setNotes] = useState('')
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0])
  const [jobDescription, setJobDescription] = useState('')
  const [jobUrl, setJobUrl] = useState('')

  async function addApplication(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('applications')
      .insert([
        {
          company,
          job_title: jobTitle,
          location,
          status,
          notes,
          applied_date: appliedDate,
          job_description: jobDescription,
          job_url: jobUrl,
        },
      ])

    setLoading(false)

    if (error) {
      console.error(error)
      alert('Virhe tallennuksessa: ' + error.message)
      return
    }

    // Tyhjennetään kentät
    setCompany('')
    setJobTitle('')
    setLocation('')
    setStatus('Haettu')
    setNotes('')
    setJobDescription('')
    setJobUrl('')
    
    onSuccess()
  }

  const inputStyle = "w-full p-3 rounded-xl border border-pink-100 bg-white/50 focus:bg-white focus:ring-2 focus:ring-pink-300 outline-none transition-all placeholder:text-gray-400 text-gray-800"
  const labelStyle = "text-sm font-semibold text-pink-700 ml-1 mb-1 block"

  return (
    <form
      onSubmit={addApplication}
      className="max-w-4xl mx-auto p-6 md:p-8 bg-white/60 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/20"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 px-1">Lisää uusi työhakemus</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vasen sarake: Perustiedot */}
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
            <label className={labelStyle}>Hakuilmoituksen linkki</label>
            <input
              type="url"
              placeholder="https://..."
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              className={inputStyle}
            />
          </div>
        </div>

        {/* Oikea sarake: Tila ja Päivämäärä */}
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

          <div className="md:h-full">
            <label className={labelStyle}>Muistiinpanot</label>
            <textarea
              placeholder="Palkkatoive, yhteyshenkilö..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`${inputStyle} h-[132px] resize-none`}
            />
          </div>
        </div>

        {/* Alarivi: Työpaikkakuvaus koko leveydellä */}
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
        className={`mt-8 w-full md:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
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