import Header from '@/components/Header'  // Changed from import { Header } to import Header

export default function VisualizerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col w-full">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
        </div>
    )
}