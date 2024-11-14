import { TableSkeleton } from '@/components/table-list-skeleton'
import { Suspense } from 'react'
import SecurityAlertsTable from '../dashboard/SecurityAlertsTable'

const SecurityAlerts = () => {
  return (
    <div className="container mx-auto p-6">
      <Suspense fallback={<LoadingState />}>
        <SecurityAlertsTable />
      </Suspense>
    </div>
  )
}

const LoadingState = () => {
  return (
    <>
      <div className="prose mb-3 max-w-none text-center">
        <h1>Loading...</h1>
      </div>
      <TableSkeleton
        headers={['Project', 'Environment', 'Count', 'Details', 'Last Updated']}
      />
    </>
  )
}

export default SecurityAlerts
