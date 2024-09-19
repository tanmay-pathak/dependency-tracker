import TechnologyList from './TechnologyList'
import { dependency } from '@/constants/dependency-mappings'

export default function VersionsPage() {
  const sortedDependencies = [...dependency].sort((a, b) =>
    a.name.localeCompare(b.name),
  )

  return (
    <div className="container mx-auto p-4">
      <TechnologyList technologies={sortedDependencies} />
    </div>
  )
}
