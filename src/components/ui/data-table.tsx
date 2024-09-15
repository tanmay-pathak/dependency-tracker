'use client'

import React, { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ColumnDef } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Switch } from './switch'
import { EndOfLifeCell } from '@/components/EndOfLifeCell'
import { extractCycle, formatDate } from '@/utils/utility-functions'
import { LatestVersionCell } from '@/components/LatestVersionCell'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchField?: string
  showChart?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchField = 'key',
  showChart = false,
}: DataTableProps<TData, TValue>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showLando, setShowLando] = useState(true)
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('all')

  const filteredData = useMemo(() => {
    return data.filter(
      (item: any) =>
        item[searchField].toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedEnvironment === 'all' ||
          item.environment === selectedEnvironment ||
          (showLando && item.environment === 'LANDO')),
    )
  }, [data, searchTerm, selectedEnvironment, searchField, showLando])

  const versionData = useMemo(() => {
    const versionCounts: { [key: string]: { [env: string]: number } } = {}
    filteredData.forEach((item: any) => {
      if (!versionCounts[item.value]) {
        versionCounts[item.value] = { DEV: 0, BETA: 0, PROD: 0 }
      }
      versionCounts[item.value][item.environment]++
    })
    return Object.entries(versionCounts).map(([version, counts]) => ({
      version,
      ...counts,
    }))
  }, [filteredData])

  const enhancedColumns = useMemo(() => {
    return [
      ...columns,
      {
        id: 'latestVersion',
        header: 'Latest Version',
        cell: ({ row }: { row: any }) => (
          <LatestVersionCell currentVersion={row.value} searchKey={row.key} />
        ),
      },
      {
        id: 'eol',
        header: 'End of Life',
        cell: ({ row }: { row: any }) => {
          const searchKey = row.key.toLowerCase()
          const version = row.value
          const cycle = version ? extractCycle(version) : null
          return searchKey && cycle ? (
            <EndOfLifeCell searchKey={searchKey} version={cycle} />
          ) : null
        },
      },
    ]
  }, [columns])

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 flex justify-between gap-4 bg-background p-2">
        <Input
          placeholder={`Search by ${searchField}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus={true}
        />
        {selectedEnvironment !== 'all' && (
          <div className="flex h-9 min-w-fit items-center gap-2 rounded-md border px-3 py-2 text-sm">
            Show Lando
            <Switch checked={showLando} onCheckedChange={setShowLando} />
          </div>
        )}
        <Select
          value={selectedEnvironment}
          onValueChange={(value) => setSelectedEnvironment(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Environments</SelectItem>
            <SelectItem value="DEV">DEV</SelectItem>
            <SelectItem value="BETA">BETA</SelectItem>
            <SelectItem value="PROD">PROD</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {showChart && (
        <div className="mb-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={versionData}>
              <XAxis dataKey="version" />
              <YAxis />
              <Bar dataKey="DEV" fill="#3b82f6" stackId="stack" />
              <Bar dataKey="BETA" fill="#f97316" stackId="stack" />
              <Bar dataKey="PROD" fill="#22c55e" stackId="stack" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="flex-grow overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {enhancedColumns.map((column) => (
                <TableHead key={column.id}>
                  {column.header as React.ReactNode}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={enhancedColumns.length}
                  className="text-center"
                >
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row: any, rowIndex) => (
                <TableRow key={rowIndex}>
                  {enhancedColumns.map((column) => (
                    <TableCell key={column.id}>
                      {renderCellContent(column, row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function renderCellContent(column: any, row: any) {
  if (column.cell && typeof column.cell === 'function') {
    return column.cell({ row })
  }

  if (column.accessorKey === 'environment') {
    return getEnvironmentBadge(row[column.accessorKey])
  }

  if (
    column.accessorKey === 'created_at' ||
    column.accessorKey === 'modified_at'
  ) {
    return formatDate(row[column.accessorKey])
  }

  return row[column.accessorKey]
}

const getEnvironmentBadge = (environment: string) => {
  switch (environment) {
    case 'DEV':
      return (
        <Badge className="bg-blue-500 text-white hover:bg-blue-600">DEV</Badge>
      )
    case 'BETA':
      return (
        <Badge className="bg-orange-500 text-white hover:bg-orange-600">
          BETA
        </Badge>
      )
    case 'PROD':
      return (
        <Badge className="bg-green-500 text-white hover:bg-green-600">
          PROD
        </Badge>
      )
    default:
      return <Badge variant="outline">{environment}</Badge>
  }
}
