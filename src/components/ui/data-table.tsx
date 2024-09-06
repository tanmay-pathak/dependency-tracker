'use client'

import React, { useState } from 'react'
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
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
            {filteredData.map((row: any, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {(column as AccessorKeyColumnDef<TData, TValue>)
                      .accessorKey === 'created_at' ||
                    (column as AccessorKeyColumnDef<TData, TValue>)
                      .accessorKey === 'modified_at'
                      ? formatDate(
                          row[
                            (column as AccessorKeyColumnDef<TData, TValue>)
                              .accessorKey as keyof TData
                          ] as string,
                        )
                      : (row[
                          (column as AccessorKeyColumnDef<TData, TValue>)
                            .accessorKey as keyof TData
                        ] as React.ReactNode)}
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
