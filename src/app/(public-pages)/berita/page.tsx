'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PiHandHeartDuotone, PiNewspaperDuotone, PiCalendarDuotone, PiEyeDuotone, PiUserDuotone, PiMagnifyingGlassDuotone } from 'react-icons/pi'
import { getPublishedNews, type NewsRow } from '@/server/actions/news'
import { getNewsCategories, type CategoryRow } from '@/server/actions/settings'
import PublicNavbar from '@/components/public/PublicNavbar'

const formatDate = (date: string) => new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

const BeritaPublicPage = () => {
    const [news, setNews] = useState<NewsRow[]>([])
    const [categories, setCategories] = useState<CategoryRow[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')

    useEffect(() => {
        const loadData = async () => {
            try {
                const [newsData, catsData] = await Promise.all([getPublishedNews(), getNewsCategories()])
                setNews(newsData)
                setCategories(catsData)
            } catch (error) {
                console.error('Error:', error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    const filtered = news.filter((n) => {
        const matchSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchCategory = selectedCategory === 'all' || n.category_id === selectedCategory
        return matchSearch && matchCategory
    })

    const featured = filtered[0]
    const rest = filtered.slice(1)

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Navbar */}
            <PublicNavbar />

            {/* Hero */}
            <section className="pt-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)' }}>
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Berita & Kegiatan</h1>
                    <p className="text-white/70 max-w-lg mx-auto">Ikuti perkembangan terbaru dari kegiatan sosial dan program Yayasan Saling Bantu Kreasi Indonesia.</p>
                </div>
            </section>

            {/* Search & Filter */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <PiMagnifyingGlassDuotone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                        <input type="text" placeholder="Cari berita..." className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        <button onClick={() => setSelectedCategory('all')} className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCategory === 'all' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}>Semua</button>
                        {categories.map((cat) => (
                            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}>{cat.name}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-3xl h-72" />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <PiNewspaperDuotone className="text-5xl mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500 text-lg">Tidak ada berita ditemukan.</p>
                    </div>
                ) : (
                    <>
                        {/* Featured Article */}
                        {featured && (
                            <Link href={`/berita/${featured.slug}`}>
                                <div className="group bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 mb-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                                        <div className="h-64 md:h-80 relative overflow-hidden">
                                            {featured.image ? (
                                                <img src={featured.image} alt={featured.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <>
                                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-500" />
                                                    <div className="absolute inset-0 flex items-center justify-center"><PiNewspaperDuotone className="text-white/15 text-7xl" /></div>
                                                </>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                            <div className="absolute top-4 left-4 bg-white/90 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-lg">{featured.category_name || 'Umum'}</div>
                                        </div>
                                        <div className="p-8 flex flex-col justify-center">
                                            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3 group-hover:text-emerald-600 transition-colors">{featured.title}</h2>
                                            <p className="text-gray-500 text-sm mb-4 line-clamp-3">{featured.excerpt}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-400">
                                                <span className="flex items-center gap-1"><PiUserDuotone /> {featured.author_name || 'Admin'}</span>
                                                <span className="flex items-center gap-1"><PiCalendarDuotone /> {formatDate(featured.published_at || featured.created_at)}</span>
                                                <span className="flex items-center gap-1"><PiEyeDuotone /> {featured.view_count}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Rest of Articles */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {rest.map((item) => (
                                <Link key={item.id} href={`/berita/${item.slug}`}>
                                    <div className="group bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
                                        <div className="h-44 relative overflow-hidden">
                                            {item.image ? (
                                                <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <>
                                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/80 to-teal-500/80" />
                                                    <div className="absolute inset-0 flex items-center justify-center"><PiNewspaperDuotone className="text-white/15 text-5xl" /></div>
                                                </>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                            <div className="absolute top-3 left-3 bg-white/90 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-lg">{item.category_name || 'Umum'}</div>
                                        </div>
                                        <div className="p-5 flex flex-col flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">{item.title}</h3>
                                            <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{item.excerpt}</p>
                                            <div className="flex items-center justify-between text-xs text-gray-400">
                                                <span className="flex items-center gap-1"><PiCalendarDuotone /> {formatDate(item.published_at || item.created_at)}</span>
                                                <span className="flex items-center gap-1"><PiEyeDuotone /> {item.view_count}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </section>

            <footer className="border-t border-gray-100 dark:border-gray-800 py-8 text-center">
                <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Yayasan Saling Bantu Kreasi Indonesia</p>
            </footer>
        </div>
    )
}

export default BeritaPublicPage
