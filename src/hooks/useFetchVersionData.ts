import { UseQueryResult, useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface VersionData {
  [key: string]: string
}

export async function fetchVersionData(
  tech: string,
  version: string,
): Promise<VersionData> {
  let actualTech = tech
  if (tech === 'db') {
    actualTech = version.toLowerCase().includes('mariadb') ? 'mariadb' : 'mysql'
  }

  async function fetchDataForSpecificVersion(
    versionToFetch: string,
  ): Promise<VersionData | null> {
    const url = `https://endoflife.date/api/${actualTech}/${versionToFetch}.json`
    try {
      const { data } = await axios.get<VersionData>(url)
      return data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null
      }
      throw new Error('Failed to fetch EOL data')
    }
  }

  let versionToTry = version
  let data: VersionData | null = null

  while (versionToTry) {
    data = await fetchDataForSpecificVersion(versionToTry)
    if (data) break

    const versionParts = versionToTry.split('.')
    versionParts.pop()
    versionToTry = versionParts.join('.')
  }

  if (!data) throw new Error('Failed to fetch version data')

  return { Tech: actualTech, Showing_Info_For_Version: versionToTry, ...data }
}

const useFetchVersionData = (
  tech: string,
  version: string,
): UseQueryResult<VersionData, Error> =>
  useQuery({
    queryKey: ['versionData', tech, version],
    queryFn: () => fetchVersionData(tech, version),
    enabled: !!tech && !!version,
  })

export default useFetchVersionData
