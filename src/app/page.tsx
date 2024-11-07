import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { ArrowRight, Package, BarChart } from 'lucide-react'
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
        </div>

        <div className="mt-20 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          <FeatureCard
            icon={<BarChart className="h-8 w-8" />}
            title="Dashboard Overview"
            description="Get a quick overview of your projects and dependencies"
            buttonText="Go to Dashboard"
            buttonHref="/dashboard"
          />
          <FeatureCard
            icon={<Package className="h-8 w-8" />}
            title="Dependency Management"
            description="Keep track of all your project dependencies in one place"
            buttonText="View Projects"
            buttonHref="/projects"
          />
          <FeatureCard
            icon={<ArrowRight className="h-8 w-8" />}
            title="Project Overview"
            description="Get a comprehensive view of all your projects and their dependencies"
            buttonText="View Versions"
            buttonHref="/versions"
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
  buttonText: string
  buttonHref: string
}

function FeatureCard({
  icon,
  title,
  description,
  buttonText,
  buttonHref,
}: FeatureCardProps) {
  return (
    <Card className="flex flex-col bg-card" hover={false}>
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
      <CardFooter className="mt-auto">
        <Link prefetch={true} href={buttonHref} className="w-full">
          <Button variant="outline" className="w-full">
            {buttonText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
