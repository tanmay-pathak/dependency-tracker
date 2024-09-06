import Header from '@/components/Header' // Changed from import { Header } to import Header

export default function VisualizerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
    </div>
  )
}
