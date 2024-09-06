import Header from '@/components/Header'
import Link from 'next/link'

export default async function Index() {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-20">
      <Header />
      <main className="prose prose-lg text-center dark:prose-invert">
        <h1>Welcome to zu dependency tracker</h1>
        <Link
          href="/projects"
          className="inline-block rounded bg-blue-500 px-4 py-2 font-bold text-white no-underline hover:bg-blue-600"
        >
          View Projects
        </Link>
      </main>
    </div>
  )
}
