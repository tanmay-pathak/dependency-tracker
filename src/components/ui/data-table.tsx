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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = data.filter((item: any) =>
    item.key.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div>
      <Input
        placeholder="Search by key..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm mb-4"
      />
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id}>{column.header as React.ReactNode}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((row: any, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  {(column as AccessorKeyColumnDef<TData, TValue>).accessorKey === 'created_at' || 
                   (column as AccessorKeyColumnDef<TData, TValue>).accessorKey === 'modified_at'
                    ? formatDate(row[(column as AccessorKeyColumnDef<TData, TValue>).accessorKey as keyof TData] as string)
                    : row[(column as AccessorKeyColumnDef<TData, TValue>).accessorKey as keyof TData] as React.ReactNode}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}