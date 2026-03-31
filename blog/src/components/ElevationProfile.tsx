'use client'

import { useState, useCallback } from 'react'
import { useT } from '@/lib/i18n'

interface ElevationPoint {
  km: number
  elev: number
  label?: string
  sleep?: boolean
}

interface TooltipState {
  x: number
  y: number
  km: number
  elev: number
  label?: string
}

const PAD = { left: 50, right: 24, top: 32, bottom: 100 }
const W = 1000
const H = 300
const PLOT_W = W - PAD.left - PAD.right
const PLOT_H = H - PAD.top - PAD.bottom
const MAX_ELEV = 1500

function toSvgX(km: number, maxKm: number) {
  return PAD.left + (km / maxKm) * PLOT_W
}

function toSvgY(elev: number) {
  return PAD.top + PLOT_H - (elev / MAX_ELEV) * PLOT_H
}

export default function ElevationProfile({ data }: { data: ElevationPoint[] }) {
  const t = useT()
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const maxKm = data[data.length - 1].km

  const points = data.map(d => [toSvgX(d.km, maxKm), toSvgY(d.elev)] as [number, number])

  const areaPath =
    `M ${points[0][0]},${toSvgY(0)} ` +
    points.map(([x, y]) => `L ${x},${y}`).join(' ') +
    ` L ${points[points.length - 1][0]},${toSvgY(0)} Z`

  const linePath =
    `M ${points[0][0]},${points[0][1]} ` +
    points.slice(1).map(([x, y]) => `L ${x},${y}`).join(' ')

  const yTicks = [0, 500, 1000, 1500]
  const xLabels = data.filter(d => d.label)
  const passes = data.filter(d => d.label && d.elev >= 1000)

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const scaleX = W / rect.width
    const svgX = (e.clientX - rect.left) * scaleX
    const km = ((svgX - PAD.left) / PLOT_W) * maxKm

    if (km < 0 || km > maxKm) { setTooltip(null); return }

    // Find nearest point
    let nearest = data[0]
    let minDist = Infinity
    for (const d of data) {
      const dist = Math.abs(d.km - km)
      if (dist < minDist) { minDist = dist; nearest = d }
    }

    setTooltip({
      x: toSvgX(nearest.km, maxKm),
      y: toSvgY(nearest.elev),
      km: nearest.km,
      elev: nearest.elev,
      label: nearest.label,
    })
  }, [data, maxKm])

  return (
    <div style={{ marginBottom: '4rem' }}>
      <div
        style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '0.65rem',
          color: 'var(--gold-500)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
        }}
      >
        {t('trip.elevationProfile')}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c9a84c" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {/* Y gridlines */}
        {yTicks.map(elev => (
          <g key={elev}>
            <line
              x1={PAD.left}
              y1={toSvgY(elev)}
              x2={W - PAD.right}
              y2={toSvgY(elev)}
              stroke="#e5e0d8"
              strokeWidth="0.8"
              strokeDasharray={elev === 0 ? 'none' : '4 4'}
            />
            <text
              x={PAD.left - 6}
              y={toSvgY(elev) + 4}
              textAnchor="end"
              fontSize="11"
              fontFamily="var(--font-dm-mono)"
              fill="#999"
            >
              {elev === 0 ? '0' : `${elev}`}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#elevGrad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinejoin="round" />

        {/* Sleep dots */}
        {data.filter(d => d.sleep).map(d => (
          <circle
            key={d.km}
            cx={toSvgX(d.km, maxKm)}
            cy={toSvgY(d.elev)}
            r="5"
            fill="#c0392b"
            stroke="white"
            strokeWidth="1.5"
          />
        ))}

        {/* Pass annotations — all labeled points ≥ 1000m */}
        {passes.map(p => (
          <g key={p.km}>
            <line
              x1={toSvgX(p.km, maxKm)}
              y1={toSvgY(p.elev) - 6}
              x2={toSvgX(p.km, maxKm)}
              y2={toSvgY(p.elev) - 34}
              stroke="#c9a84c"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <text
              x={toSvgX(p.km, maxKm)}
              y={toSvgY(p.elev) - 38}
              textAnchor="middle"
              fontSize="11"
              fontFamily="var(--font-dm-mono)"
              fill="#c9a84c"
            >
              {p.label}
            </text>
          </g>
        ))}

        {/* X axis labels — rotated 90° */}
        {xLabels.map(d => {
          const x = toSvgX(d.km, maxKm)
          const y = PAD.top + PLOT_H + 8
          return (
            <text
              key={d.km}
              transform={`rotate(-90, ${x}, ${y})`}
              x={x}
              y={y}
              textAnchor="end"
              fontSize="11"
              fontFamily="var(--font-dm-mono)"
              fill="#888"
            >
              {d.label}
            </text>
          )
        })}

        {/* X axis km ticks */}
        {[0, 250, 500, 750, maxKm].map(km => (
          <text
            key={km}
            x={toSvgX(km, maxKm)}
            y={PAD.top + PLOT_H - 6}
            textAnchor="middle"
            fontSize="10"
            fontFamily="var(--font-dm-mono)"
            fill="#ccc"
          >
            {km}km
          </text>
        ))}

        {/* Hover crosshair */}
        {tooltip && (
          <g>
            <line
              x1={tooltip.x}
              y1={PAD.top}
              x2={tooltip.x}
              y2={toSvgY(0)}
              stroke="#c9a84c"
              strokeWidth="1"
              strokeDasharray="4 3"
              strokeOpacity="0.6"
            />
            <circle cx={tooltip.x} cy={tooltip.y} r="5" fill="#c9a84c" />
            {/* Tooltip box */}
            {(() => {
              const boxW = 150
              const boxH = tooltip.label ? 52 : 40
              const bx = Math.min(Math.max(tooltip.x - boxW / 2, PAD.left), W - PAD.right - boxW)
              const by = tooltip.y < PAD.top + boxH + 20 ? tooltip.y + 10 : tooltip.y - boxH - 10
              return (
                <g>
                  <rect x={bx} y={by} width={boxW} height={boxH} rx="3" fill="white" stroke="#e5e0d8" strokeWidth="1" />
                  {tooltip.label && (
                    <text x={bx + boxW / 2} y={by + 15} textAnchor="middle" fontSize="11" fontFamily="var(--font-dm-mono)" fill="#555">
                      {tooltip.label}
                    </text>
                  )}
                  <text x={bx + boxW / 2} y={by + (tooltip.label ? 30 : 18)} textAnchor="middle" fontSize="12" fontFamily="var(--font-dm-mono)" fill="#333" fontWeight="600">
                    {tooltip.elev}m · {tooltip.km}km
                  </text>
                </g>
              )
            })()}
          </g>
        )}
      </svg>
    </div>
  )
}
