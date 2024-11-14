import { Skeleton } from './ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'

interface TableSkeletonProps {
  headers: string[]
  rowCount?: number
}

export const TableSkeleton = ({
  headers,
  rowCount = 15,
}: TableSkeletonProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((header, i) => (
            <TableHead key={i}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rowCount }).map((_, i) => (
          <TableRowSkeleton key={i} cellCount={headers.length} />
        ))}
      </TableBody>
    </Table>
  )
}

interface TableRowSkeletonProps {
  cellCount: number
}

export const TableRowSkeleton = ({ cellCount }: TableRowSkeletonProps) => {
  return (
    <TableRow>
      {Array.from({ length: cellCount }).map((_, i) => (
        <TableCell key={i}>
          <Skeleton className="h-4 w-16" />
        </TableCell>
      ))}
    </TableRow>
  )
}
