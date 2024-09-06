import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'

export default async function Page({ params: { projectId } }: { params: { projectId: string } }) {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { data: dependency, error } = await supabase
        .from('dependency')
        .select('*')
        .eq('project', projectId)

    return <pre>{JSON.stringify(dependency, null, 2)}</pre>
}