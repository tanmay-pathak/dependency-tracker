import Header from '@/components/Header'
import Link from 'next/link'

export default async function Index() {

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-20">
        <Header />
        <main className="prose prose-lg dark:prose-invert text-center">
            <h1>Welcome to zu dependency tracker</h1>
            <Link href="/projects" className="inline-block no-underline bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                View Projects
            </Link>
        </main>
    </div>
  )
}
