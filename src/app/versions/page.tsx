import TechnologyList from './TechnologyList'
import { dependency } from '@/constants/dependency-mappings'

export default function VersionsPage() {
  return (
    <div className="container mx-auto p-4">
      <TechnologyList technologies={dependency} />
    </div>
  )
}
