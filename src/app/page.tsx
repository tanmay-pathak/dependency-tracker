import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { ArrowRight, Package } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Dependency Tracker
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
            Effortlessly track dependencies across all your projects
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/projects">
              <Button size="lg" variant="default">
                View Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/versions">
              <Button size="lg" variant="outline">
                View Versions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Package className="h-8 w-8" />}
            title="Dependency Management"
            description="Keep track of all your project dependencies in one place"
          />
          <FeatureCard
            icon={<ArrowRight className="h-8 w-8" />}
            title="Project Overview"
            description="Get a comprehensive view of all your projects and their dependencies"
          />
        </div>
      </main>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}
