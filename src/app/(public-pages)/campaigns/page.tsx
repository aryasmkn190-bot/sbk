'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PiHandHeartDuotone, PiMagnifyingGlassDuotone, PiUsersThreeDuotone, PiCalendarCheckDuotone, PiArrowRightDuotone, PiFunnelDuotone } from 'react-icons/pi'
import { getActiveCampaigns, type CampaignRow } from '@/server/actions/campaign'
import { getCampaignCategories, type CategoryRow } from '@/server/actions/settings'
import PublicNavbar from '@/components/public/PublicNavbar'

const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) return `Rp ${(amount / 1000000000).toFixed(1)} M`
    if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(1)} Jt`
    if (amount >= 1000) return `Rp ${(amount / 1000).toFixed(0)} Rb`
    return `Rp ${amount.toLocaleString('id-ID')}`
}

const CampaignsPublicPage = () => {
    const [campaigns, setCampaigns] = useState<CampaignRow[]>([])
    const [categories, setCategories] = useState<CategoryRow[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')

    useEffect(() => {
        const loadData = async () => {
            try {
                const [campaignsData, catsData] = await Promise.all([
                    getActiveCampaigns(),
                    getCampaignCategories(),
                ])
                setCampaigns(campaignsData)
                setCategories(catsData)
            } catch (error) {
                console.error('Error loading campaigns:', error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    const filtered = campaigns.filter((c) => {
        const matchSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchCategory = selectedCategory === 'all' || c.category_id === selectedCategory
        return matchSearch && matchCategory
    })

    const getDaysLeft = (endDate: string) => {
        if (!endDate) return null
        const end = new Date(endDate)
        const now = new Date()
        const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return diff > 0 ? diff : 0
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Header */}
            <PublicNavbar />

            {/* Hero Banner */}
            <section className="pt-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)' }}>
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Campaign Donasi</h1>
                    <p className="text-white/70 max-w-lg mx-auto">Pilih campaign yang ingin Anda dukung. Setiap rupiah memiliki dampak nyata bagi mereka yang membutuhkan.</p>
                </div>
            </section>

            {/* Search & Filter */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <PiMagnifyingGlassDuotone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                            type="text"
                            placeholder="Cari campaign..."
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCategory === 'all'
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                                }`}
                        >
                            Semua
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat.id
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Campaign Grid */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-3xl h-96" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <PiFunnelDuotone className="text-5xl mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500 text-lg">Tidak ada campaign ditemukan.</p>
                        <p className="text-gray-400 text-sm mt-1">Coba ubah kata kunci atau filter kategori.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map((campaign) => {
                            const progress = campaign.target_amount > 0 ? Math.round((campaign.collected_amount / campaign.target_amount) * 100) : 0
                            const daysLeft = getDaysLeft(campaign.end_date)
                            return (
                                <Link key={campaign.id} href={`/campaigns/${campaign.slug}`}>
                                    <div className="group bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
                                        {/* Image area */}
                                        <div className="h-52 relative overflow-hidden">
                                            {campaign.image ? (
                                                <img src={campaign.image} alt={campaign.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <>
                                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500" />
                                                    <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <PiHandHeartDuotone className="text-white/20 text-7xl group-hover:scale-110 transition-transform duration-500" />
                                                    </div>
                                                </>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
                                                {campaign.category_name || 'Umum'}
                                            </div>
                                            {daysLeft !== null && (
                                                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1">
                                                    <PiCalendarCheckDuotone /> {daysLeft > 0 ? `${daysLeft} hari lagi` : 'Berakhir'}
                                                </div>
                                            )}
                                        </div>
                                        {/* Content */}
                                        <div className="p-6 flex flex-col flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">{campaign.title}</h3>
                                            <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{campaign.description}</p>
                                            {/* Progress */}
                                            <div>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="font-bold text-emerald-600">{formatCurrency(campaign.collected_amount)}</span>
                                                    <span className="text-gray-400">{formatCurrency(campaign.target_amount)}</span>
                                                </div>
                                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                                                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${Math.min(progress, 100)}%` }} />
                                                </div>
                                                <div className="flex justify-between items-center mt-3">
                                                    <span className="text-xs text-gray-500 flex items-center gap-1"><PiUsersThreeDuotone />{campaign.donor_count} donatur</span>
                                                    <span className="text-xs font-bold text-emerald-600">{progress}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </section>

            {/* Footer Mini */}
            <footer className="border-t border-gray-100 dark:border-gray-800 py-8 text-center">
                <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Yayasan Saling Bantu Kreasi Indonesia</p>
            </footer>
        </div>
    )
}

export default CampaignsPublicPage
