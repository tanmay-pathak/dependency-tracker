import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export type RepoData = {
  id: number
  name: string
  full_name: string
  private: boolean
  // Add other relevant fields as needed
}

const fetchRepos = async (owner: string): Promise<RepoData[]> => {
  const response = await axios.get<RepoData[]>(
    `https://api.github.com/users/${owner}/repos`,
    {
      headers: {
        Authorization: `${process.env.GH_ACCESS_TOKEN}`,
      },
    },
  )
  return response.data
}

export async function POST(req: NextRequest) {
  const { owner } = await req.json()

  if (!owner) {
    return NextResponse.json({ error: 'Owner is required' }, { status: 400 })
  }

  try {
    const repos = await fetchRepos(owner)
    return NextResponse.json(repos)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: errorMessage }, { status: 500 })
  }
}
