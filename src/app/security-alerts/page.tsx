import { TableSkeleton } from '@/components/table-list-skeleton'
import { Suspense } from 'react'
import SecurityAlertsTable from '../dashboard/SecurityAlertsTable'

const SecurityAlerts = () => {
  return (
    <div className="container mx-auto p-6">
      <Suspense fallback={<TableSkeleton />}>
        <SecurityAlertsTable />
      </Suspense>
    </div>
  )
}

export default SecurityAlerts
