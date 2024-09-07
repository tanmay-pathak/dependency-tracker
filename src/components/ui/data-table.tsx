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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  techInfo?: any
}

export function DataTable<TData, TValue>({
  columns,
  data,
  techInfo,
}: DataTableProps<TData, TValue>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(
    null,
  )

  const filteredData = data.filter(
    (item: any) =>
      item.key.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedEnvironment === null ||
        item.environment === selectedEnvironment),
  )

  const enhancedData = React.useMemo(() => {
    if (!techInfo) return data
    return data.map((item: any) => ({
      ...item,
      latestVersion: techInfo[0]?.latest,
    }))
  }, [data, techInfo])

  const formatDate = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };

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

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 flex justify-between gap-4 bg-background p-2">
        <Input
          placeholder="Search by key..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          onValueChange={(value) =>
            setSelectedEnvironment(value === 'all' ? null : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Environments</SelectItem>
            <SelectItem value="DEV">DEV</SelectItem>
            <SelectItem value="BETA">BETA</SelectItem>
            <SelectItem value="PROD">PROD</SelectItem>
          </SelectContent>
        </Select>
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
                      <div className="flex items-center gap-2">
                        <span>{row.value}</span>
                        {row.latestVersion && (
                          <Badge
                            variant={
                              row.value === row.latestVersion
                                ? 'default'
                                : 'destructive'
                            }
                            className="ml-2"
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
