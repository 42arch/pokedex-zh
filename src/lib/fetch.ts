const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export async function fetchData<T>(url: string) {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    cache: 'force-cache'
  })
  const data = (await res.json()) as T
  return data
}
