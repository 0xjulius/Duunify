'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { MapPin, Briefcase, Bookmark, MoreVertical, Search, Filter, Calendar, Clock } from 'lucide-react'

export default function SavedJobsPage() {
  const [activeTab, setActiveTab] = useState('Kaikki')

  return (
    <main className="min-h-screen flex bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-[1500px] mx-auto">
          
          {/* HEADER */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <span className="bg-indigo-100 p-2 rounded-xl text-indigo-600"><Bookmark /></span> 
                Tallentut työpaikat
              </h1>
              <p className="text-slate-500 mt-2">Työpaikat, jotka haluat hakea myöhemmin.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-xl font-medium"><Filter size={18}/> Suodattimet</button>
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold">+ Tallenna työpaikka</button>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[ { title: 'Tallennettua työpaikkaa', val: '18', sub: '+4 viime viikolla' }, { title: 'Päättyy pian', val: '5', sub: 'Seuraavan 7 päivän aikana' }, { title: 'Aiot hakea', val: '12', sub: 'Merkitty aktiiviseksi' }, { title: 'Arkistoitu', val: '3', sub: 'Piilotetut työpaikat' } ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-slate-500 text-sm">{s.title}</h3>
                <p className="text-2xl font-bold mt-1">{s.val}</p>
                <p className="text-xs text-indigo-600 mt-2 font-medium">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex gap-8">
            <div className="flex-1">
              {/* TABS */}
              <div className="flex gap-2 mb-6">
                {['Kaikki 18', 'Aiot hakea 12', 'Päättyy pian 5', 'Arkistoitu 3'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl font-medium ${activeTab === tab ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200'}`}>
                    {tab}
                  </button>
                ))}
              </div>

              {/* LIST */}
              <div className="bg-white rounded-2xl border border-slate-200 divide-y">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex gap-4">
                            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-semibold bg-sky-100 text-sky-700">G</div>
                      <div>
                        <h4 className="font-bold">Frontend Developer</h4>
                        <p className="text-sm text-slate-500">Google • Helsinki, Suomi</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">4 500 – 6 000 € / kk</p>
                      <p className="text-sm text-amber-600 flex items-center gap-1 justify-end"><Clock size={14}/> 7 päivää jäljellä</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="w-80 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <input className="w-full p-3 border rounded-xl mb-4" placeholder="Hae tallennetuista..." />
                <h3 className="font-bold mb-4">Suodata työpaikkoja</h3>
                <select className="w-full p-3 border rounded-xl mb-4"><option>Kaikki sijainnit</option></select>
                <button className="w-full py-2 border rounded-xl text-slate-500">Tyhjennä suodattimet</button>
              </div>
              <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                <h4 className="font-bold flex items-center gap-2 mb-2"><span className="text-indigo-600">💡</span> Vinkki</h4>
                <p className="text-sm text-indigo-900">Merkise työpaikka "Aiot hakea", kun olet valmis hakemaan sen. Näet ne helposti erikseen.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}