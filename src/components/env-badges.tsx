import { Badge } from './ui/badge'

export const getEnvironmentBadge = (environment: string) => {
  switch (environment) {
    case 'LOCAL':
      return (
        <Badge className="w-full justify-center bg-orange-500 text-white hover:bg-orange-600">
          LOCAL
        </Badge>
      )
    case 'DEV':
      return (
        <Badge className="w-full justify-center bg-blue-500 text-white hover:bg-blue-600">
          DEV
        </Badge>
      )
    case 'BETA':
      return (
        <Badge className="w-full justify-center bg-orange-500 text-white hover:bg-orange-600">
          BETA
        </Badge>
      )
    case 'PROD':
      return (
        <Badge className="w-full justify-center bg-green-500 text-white hover:bg-green-600">
          PROD
        </Badge>
      )
    default:
      return (
        <Badge className="w-full justify-center" variant="outline">
          {environment}
        </Badge>
      )
  }
}
