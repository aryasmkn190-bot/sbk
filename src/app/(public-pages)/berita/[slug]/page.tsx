'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { PiHandHeartDuotone, PiArrowLeftDuotone, PiCalendarDuotone, PiEyeDuotone, PiUserDuotone, PiShareNetworkDuotone, PiNewspaperDuotone, PiWarningCircleDuotone } from 'react-icons/pi'
import { type NewsRow } from '@/server/actions/news'
import { getNewsBySlug, getRelatedNews } from '@/server/actions/publicData'
import PublicNavbar from '@/components/public/PublicNavbar'

const formatDate = (date: string) => new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

const BeritaDetailPage = () => {
    const params = useParams()
    const slug = params?.slug as string

    const [article, setArticle] = useState<(NewsRow & { category_name: string; author_name: string }) | null>(null)
    const [related, setRelated] = useState<(NewsRow & { category_name: string })[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getNewsBySlug(slug)
                setArticle(data)
                if (data) {
                    const relatedData = await getRelatedNews(data.id, data.category_id)
                    setRelated(relatedData)
                }
            } catch (err) {
                console.error('Error:', err)
            } finally {
                setLoading(false)
            }
        }
        if (slug) loadData()
    }, [slug])

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
                <div className="animate-pulse text-center">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 mx-auto mb-4" />
                    <div className="h-4 w-48 bg-gray-200 rounded mx-auto" />
                </div>
            </div>
        )
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <PiWarningCircleDuotone className="text-5xl text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Berita Tidak Ditemukan</h2>
                    <Link href="/berita" className="text-emerald-600 hover:underline text-sm">← Kembali ke daftar berita</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Navbar */}
            <PublicNavbar />

            {/* Hero Image */}
            <div className="pt-16 h-72 sm:h-96 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #047857 60%, #059669 100%)' }}>
                {article.image ? (
                    <img src={article.image} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                    <>
                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                        <div className="absolute inset-0 flex items-center justify-center"><PiNewspaperDuotone className="text-white/10 text-[100px]" /></div>
                    </>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-lg">{article.category_name || 'Umum'}</div>
            </div>

            {/* Article */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-20">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 sm:p-12">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">{article.title}</h1>

                        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><PiUserDuotone className="text-emerald-500" /> {article.author_name || 'Redaksi SBK'}</span>
                            <span className="flex items-center gap-1"><PiCalendarDuotone className="text-emerald-500" /> {formatDate(article.published_at || article.created_at)}</span>
                            <span className="flex items-center gap-1"><PiEyeDuotone className="text-emerald-500" /> {article.view_count} views</span>
                        </div>

                        {article.excerpt && (
                            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6 font-medium border-l-4 border-emerald-500 pl-4 italic">{article.excerpt}</p>
                        )}

                        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    </div>

                    {/* Related */}
                    {related.length > 0 && (
                        <div className="mt-12">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Berita Terkait</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {related.map((item) => (
                                    <Link key={item.id} href={`/berita/${item.slug}`}>
                                        <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                            <div className="h-32 relative bg-gradient-to-br from-emerald-500 to-teal-400">
                                                <div className="absolute inset-0 flex items-center justify-center"><PiNewspaperDuotone className="text-white/15 text-4xl" /></div>
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors line-clamp-2 mb-1">{item.title}</h4>
                                                <span className="text-xs text-gray-400">{formatDate(item.published_at || item.created_at)}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BeritaDetailPage
