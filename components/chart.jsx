'use client'

import { cn } from '@/utils/class-names'
import { Area, AreaChart, ReferenceLine, ResponsiveContainer } from 'recharts'

// Override console.error
// This is a hack to suppress the warning about missing defaultProps in recharts library as of version 2.12
// @link https://github.com/recharts/recharts/issues/3615
const error = console.error
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return
  error(...args)
}

export const Chart = ({ data, average, dataKey, height, ...rest }) => (
  <ResponsiveContainer {...rest} width='100%' height={height ?? 32}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id='gradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='5%' stopColor='var(--chart-gradient-start)' stopOpacity={0.75} />
          <stop offset='95%' stopColor='var(--chart-gradient-end)' stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area
        dataKey={dataKey}
        type='monotone'
        fillOpacity={1}
        fill='url(#gradient)'
        stroke='var(--chart-stroke)'
      />
      {Number.isFinite(average) && (
        <ReferenceLine
          y={average}
          stroke='var(--chart-stroke)'
          strokeDasharray='3 3'
        />
      )}
    </AreaChart>
  </ResponsiveContainer>
)

export const ChartSkeleton = ({ className }) => (
  <div className={cn('h-16 rounded-md bg-primary-muted', className)} />
)
