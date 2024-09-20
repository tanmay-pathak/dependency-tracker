'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dependency } from '@/constants/types'
import { EndOfLifeCell } from './EndOfLifeCell'
import { dependencyBySearch } from '@/constants/dependency-mappings'

interface ProjectToolsTableProps {
  data: Dependency[]
}

export function FutureProjectToolsTable({ data }: ProjectToolsTableProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-grow overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">Tool</TableHead>
              <TableHead className="w-1/2">End of Life</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.key}>
                <TableCell>
                  {dependencyBySearch[item.key.toLowerCase()].name}
                </TableCell>
                <TableCell>
                  <EndOfLifeCell searchKey={item.key} version={item.value} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
