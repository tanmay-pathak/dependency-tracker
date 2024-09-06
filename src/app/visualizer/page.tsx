import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'

export default async function Page() {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { data: dependency, error } = await supabase
        .from('dependency')
        .select('*')

    return <pre>{JSON.stringify(dependency, null, 2)}</pre>
}