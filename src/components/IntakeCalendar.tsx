'use client'
import { useState } from 'react'
import { INTAKES } from '@/lib/intakes'
import EnrollModal from './EnrollModal'

const categoryColors: Record<string, string> = {
  children: 'bg-blue-100 text-blue-700',
  teen:     'bg-pink-100 text-pink-700',
  adult:    'bg-violet-100 text-violet-700',
  online:   'bg-green-100 text-green-700',
}

function SpotBar({ total, left }: { total: number; left: number }) {
  const pct = Math.round((left / total) * 100)
  const color = pct <= 30 ? 'bg-red-500' : pct <= 60 ? 'bg-amber-500' : 'bg-green-500'
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{left} spots left</span>
        <span>{total} total</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function IntakeCalendar() {
  const [enrollKey, setEnrollKey] = useState<string | null>(null)

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {INTAKES.map(intake => (
          <div key={intake.courseKey} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
            {/* Category badge */}
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[intake.category]}`}>
                {intake.category.charAt(0).toUpperCase() + intake.category.slice(1)}
              </span>
              {intake.rolling && (
                <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full">Open Now</span>
              )}
            </div>

            {/* Course name */}
            <h3 className="font-bold text-gray-900 text-base mb-3 flex-1">{intake.courseName}</h3>

            {/* Date */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <span className="text-violet-500">📅</span>
              <span className="font-medium">{intake.date}</span>
            </div>

            {/* Format & duration */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              <span>⏱ {intake.duration}</span>
              <span>📍 {intake.format}</span>
            </div>

            {/* Spots bar (not for rolling) */}
            {!intake.rolling && (
              <SpotBar total={intake.spotsTotal} left={intake.spotsLeft} />
            )}

            {/* Price + CTA */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="font-bold text-violet-700 text-lg">{intake.price}</span>
              <button
                onClick={() => setEnrollKey(intake.courseKey)}
                disabled={!intake.rolling && intake.spotsLeft === 0}
                className="bg-gradient-to-r from-violet-600 to-purple-500 text-white text-sm font-semibold px-5 py-2 rounded-full hover:shadow-lg hover:shadow-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {intake.spotsLeft === 0 && !intake.rolling ? 'Full' : 'Enroll'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <EnrollModal courseKey={enrollKey} onClose={() => setEnrollKey(null)} />
    </>
  )
}
