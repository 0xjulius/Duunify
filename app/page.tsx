'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

import AddApplicationForm from '@/components/AddApplicationForm'
import ApplicationCard from '@/components/ApplicationCard'

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

export default function Home() {
  const [applications, setApplications] = useState<Application[]>([])
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')

  async function fetchApplications() {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    setApplications(data || [])
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  async function deleteApplication(id: string) {
    await supabase
      .from('applications')
      .delete()
      .eq('id', id)

    fetchApplications()
  }

  const filtered = applications.filter((app) =>
    app.company.toLowerCase().includes(search.toLowerCase()) ||
    app.job_title.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    Haettu: applications.filter(a => a.status === 'Haettu').length,
    Haastattelu: applications.filter(a => a.status === 'Haastattelu').length,
    Hylätty: applications.filter(a => a.status === 'Hylätty').length,
    Tarjous: applications.filter(a => a.status === 'Tarjous').length,
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-400 to-orange-300 py-10 px-4 md:px-8">
      {/* CONTAINER: Tämä tuo tilan sivuille ja keskittää sisällön */}
      <div className="max-w-6xl mx-auto w-full">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-sm">
            Työhakemukset
          </h1>

          {/* STAT CARDS */}
          <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wider">
            <p className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-2xl border border-white/20 shadow-sm">
              Haettu <span className="ml-1 text-blue-100">{stats.Haettu}</span>
            </p>
            <p className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-2xl border border-white/20 shadow-sm">
              Haastattelu <span className="ml-1 text-amber-100">{stats.Haastattelu}</span>
            </p>
            <p className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-2xl border border-white/20 shadow-sm">
              Hylätty <span className="ml-1 text-rose-100">{stats.Hylätty}</span>
            </p>
            <p className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-2xl border border-white/20 shadow-sm">
              Tarjous <span className="ml-1 text-emerald-100">{stats.Tarjous}</span>
            </p>
          </div>
        </div>

            {/* TOP BAR: Search and Add */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500/50 group-focus-within:text-pink-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input
              type="text"
              placeholder="Hae yritystä tai tehtävää..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/60 border border-white/40 p-4 pl-12 rounded-2xl text-gray-800 placeholder-gray-500 backdrop-blur-2xl focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all shadow-xl"
            />
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-6 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
              showForm 
                ? 'bg-rose-500 text-white hover:bg-rose-600' 
                : 'bg-emerald-500 text-white hover:bg-emerald-400'
            }`}
          >
            {showForm ? '✕ Sulje' : '+ Lisää hakemus'}
          </button>
        </div>

        {/* FORM SECTION */}
        {showForm && (
          <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
            <AddApplicationForm
              onSuccess={() => {
                fetchApplications()
                setShowForm(false)
              }}
            />
          </div>
        )}

        {/* LIST SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.length > 0 ? (
            filtered.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                onChange={fetchApplications}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white/10 backdrop-blur-sm rounded-3xl border border-white/10">
              <p className="text-white/60 text-lg font-medium">Ei löytynyt hakemuksia.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}