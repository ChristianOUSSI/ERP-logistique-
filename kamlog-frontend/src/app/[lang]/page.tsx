import { redirect } from 'next/navigation'

export default function Page({ params }: { params: { lang: 'fr' | 'en' } }) {
  // Redirect root to the module/dashboard area.
  return redirect(`/${params.lang}/dashboard`)
}

