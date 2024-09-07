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
import { ColumnDef, AccessorKeyColumnDef } from '@tanstack/react-table'
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  techInfo?: any
  searchField?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  techInfo,
  searchField = 'key',
}: DataTableProps<TData, TValue>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('all')

  const filteredData = useMemo(() => {
    return data.filter(
      (item: any) =>
        item[searchField].toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedEnvironment === 'all' ||
          item.environment === selectedEnvironment),
    )
  }, [data, searchTerm, selectedEnvironment, searchField])

  const enhancedData = useMemo(() => {
    if (!techInfo) return filteredData
    return filteredData.map((item: any) => ({
      ...item,
      latestVersion: techInfo[0]?.latest,
    }))
  }, [filteredData, techInfo])

  const formatDate = (dateString: string): string => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`
    if (diffInSeconds < 31536000)
      return `${Math.floor(diffInSeconds / 2592000)} months ago`

    return `${Math.floor(diffInSeconds / 31536000)} years ago`
  }

  const getEnvironmentBadge = (environment: string) => {
    switch (environment) {
      case 'DEV':
        return (
          <Badge className="bg-blue-500 text-white hover:bg-blue-600">
            DEV
          </Badge>
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

  const versionData = useMemo(() => {
    const versionCounts: { [key: string]: { [env: string]: number } } = {}
    enhancedData.forEach((item: any) => {
      if (!versionCounts[item.value]) {
        versionCounts[item.value] = { DEV: 0, BETA: 0, PROD: 0 }
      }
      versionCounts[item.value][item.environment]++
    })
    return Object.entries(versionCounts).map(([version, counts]) => ({
      version,
      ...counts,
    }))
  }, [enhancedData])

  return (
    <div className="flex h-full flex-col">
      {techInfo && (
        <Table className="mb-4">
          <TableBody>
            <TableRow className="flex justify-center">
              <TableCell>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  Latest Version:
                </span>
                <span className="ml-2 text-gray-800 dark:text-gray-200">
                  {techInfo[0]?.latest}
                </span>
              </TableCell>
              {techInfo[0]?.releaseDate && (
                <TableCell>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    Release Date:
                  </span>
                  <span className="ml-2 text-gray-800 dark:text-gray-200">
                    {techInfo[0].releaseDate}
                  </span>
                </TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      )}
      <div className="sticky top-0 z-10 flex justify-between gap-4 bg-background p-2">
        <Input
          placeholder={`Search by ${searchField}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus={true}
        />
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
      <div className="flex-grow overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id}>
                  {column.header as React.ReactNode}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {enhancedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results found
                </TableCell>
              </TableRow>
            )}
            {enhancedData.map((row: any, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {(column as AccessorKeyColumnDef<TData, TValue>)
                      .accessorKey === 'environment' ? (
                      getEnvironmentBadge(
                        // @ts-ignore
                        row[column.accessorKey as keyof TData] as string,
                      )
                    ) : (column as AccessorKeyColumnDef<TData, TValue>)
                        .accessorKey === 'value' ? (
                      <div className="flex w-full items-center justify-between">
                        <span>{row.value}</span>
                        {row.latestVersion && (
                          <Badge
                            variant={
                              row.value === row.latestVersion
                                ? 'default'
                                : 'destructive'
                            }
                          >
                            {row.value === row.latestVersion
                              ? 'Up to date'
                              : `Latest: ${row.latestVersion}`}
                          </Badge>
                        )}
                      </div>
                    ) : (column as AccessorKeyColumnDef<TData, TValue>)
                        .accessorKey === 'created_at' ||
                      (column as AccessorKeyColumnDef<TData, TValue>)
                        .accessorKey === 'modified_at' ? (
                      formatDate(
                        row[
                          (column as AccessorKeyColumnDef<TData, TValue>)
                            .accessorKey as keyof TData
                        ] as string,
                      )
                    ) : (
                      (row[
                        (column as AccessorKeyColumnDef<TData, TValue>)
                          .accessorKey as keyof TData
                      ] as React.ReactNode)
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
