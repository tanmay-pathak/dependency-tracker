import React from 'react'
import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { format } from 'date-fns'

interface InfoTooltipProps {
  data: Record<string, string> | Array<Record<string, string>>
  title: string
  type: 'eol' | 'latest' | 'current'
}

export function InfoTooltip({ data, title, type }: InfoTooltipProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger className="flex items-center">
          <Info className="h-3 w-3 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent className="w-64 p-0">
          <div className="rounded-md bg-white p-2 text-xs text-black">
            <h4 className="mb-2 font-semibold">{title}</h4>
            <ul className="space-y-1">
              {type === 'eol' || type === 'current'
                ? renderEolData(data as Record<string, any>)
                : renderLatestData(Array.isArray(data) ? data : [data])}
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function renderEolData(data: Record<string, any>) {
  return Object.entries(data).map(([key, value]) => (
    <li key={key} className="flex justify-between">
      <span className="font-medium">{formatKey(key)}:</span>
      <span>{formatValue(value)}</span>
    </li>
  ))
}

function renderLatestData(data: Array<Record<string, any>>) {
  return data.slice(0, 3).map((item, index) => (
    <div key={index} className="flex flex-col gap-1 rounded-md border p-2">
      {renderEolData(item)}
    </div>
  ))
}

function formatKey(key: string): string {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatValue(value: any): string {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (value instanceof Date) return format(value, 'MMM d, yyyy')
  if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return format(new Date(value), 'MMM d, yyyy')
  }
  return String(value)
}
