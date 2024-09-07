import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function Index() {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-20">
      <Header />
      <main className="prose prose-lg text-center dark:prose-invert">
        <h1>Welcome to dependency tracker</h1>
        <h4>Track your dependencies across all of your projects</h4>
        <div className="mx-auto flex w-fit flex-col gap-4">
          <Link href="/projects">
            <Button>View Projects</Button>
          </Link>
          <Link href="/versions">
            <Button>View Versions</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
