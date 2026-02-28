'use client'

import { Card } from '@/components/ui'
import { PiHandHeartDuotone, PiCurrencyCircleDollarDuotone, PiUsersThreeDuotone, PiNewspaperDuotone, PiTrendUpDuotone, PiEnvelopeSimpleDuotone, PiClockDuotone } from 'react-icons/pi'
import { useEffect, useState } from 'react'
import Chart from '@/components/shared/Chart'
import { getCampaignStats } from '@/server/actions/campaign'
import { getRecentDonations, type DonationRow } from '@/server/actions/donation'
import { getCampaigns, type CampaignRow } from '@/server/actions/campaign'

type Stats = {
    totalDonations: number
    activeCampaigns: number
    totalDonors: number
    publishedNews: number
    pendingDonations: number
    thisMonthDonations: number
    unreadContacts: number
}

type StatCardProps = {
    title: string
    value: string
    subtitle: string
    icon: React.ReactNode
    color: string
}

const StatCard = ({ title, value, subtitle, icon, color }: StatCardProps) => (
    <Card className="p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</h3>
                <div className="flex items-center gap-1 mt-2 text-sm text-gray-400">
                    <PiTrendUpDuotone className="text-success" />
                    <span>{subtitle}</span>
                </div>
            </div>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl text-white ${color}`}>
                {icon}
            </div>
        </div>
    </Card>
)

const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) return `Rp ${(amount / 1000000000).toFixed(1)} M`
    if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(1)} Jt`
    if (amount >= 1000) return `Rp ${(amount / 1000).toFixed(0)} Rb`
    return `Rp ${amount}`
}

const DashboardPage = () => {
    const [stats, setStats] = useState<Stats | null>(null)
    const [recentDonations, setRecentDonations] = useState<DonationRow[]>([])
    const [activeCampaigns, setActiveCampaigns] = useState<CampaignRow[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                const [statsData, donations, campaigns] = await Promise.all([
                    getCampaignStats(),
                    getRecentDonations(5),
                    getCampaigns('active'),
                ])
                setStats(statsData)
                setRecentDonations(donations)
                setActiveCampaigns(campaigns.slice(0, 4))
            } catch (error) {
                console.error('Error loading dashboard:', error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <Card key={i} className="p-6"><div className="animate-pulse"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3" /><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32" /></div></Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Total Donasi Terverifikasi"
                    value={formatCurrency(stats?.totalDonations || 0)}
                    subtitle={`${formatCurrency(stats?.thisMonthDonations || 0)} bulan ini`}
                    icon={<PiCurrencyCircleDollarDuotone />}
                    color="bg-primary"
                />
                <StatCard
                    title="Campaign Aktif"
                    value={String(stats?.activeCampaigns || 0)}
                    subtitle="campaign berjalan"
                    icon={<PiHandHeartDuotone />}
                    color="bg-info"
                />
                <StatCard
                    title="Total Donatur"
                    value={String(stats?.totalDonors || 0)}
                    subtitle="donatur unik"
                    icon={<PiUsersThreeDuotone />}
                    color="bg-warning"
                />
                <StatCard
                    title="Berita Dipublikasi"
                    value={String(stats?.publishedNews || 0)}
                    subtitle={`${stats?.pendingDonations || 0} donasi menunggu`}
                    icon={<PiNewspaperDuotone />}
                    color="bg-success"
                />
            </div>

            {/* Quick Alert: Pending items */}
            {((stats?.pendingDonations || 0) > 0 || (stats?.unreadContacts || 0) > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(stats?.pendingDonations || 0) > 0 && (
                        <Card className="p-4 border-l-4 border-l-warning">
                            <div className="flex items-center gap-3">
                                <PiClockDuotone className="text-2xl text-warning" />
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{stats?.pendingDonations} Donasi Menunggu Verifikasi</p>
                                    <a href="/dashboard/donasi" className="text-sm text-primary hover:underline">Verifikasi sekarang →</a>
                                </div>
                            </div>
                        </Card>
                    )}
                    {(stats?.unreadContacts || 0) > 0 && (
                        <Card className="p-4 border-l-4 border-l-info">
                            <div className="flex items-center gap-3">
                                <PiEnvelopeSimpleDuotone className="text-2xl text-info" />
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{stats?.unreadContacts} Pesan Belum Dibaca</p>
                                    <a href="/dashboard/kontak" className="text-sm text-primary hover:underline">Lihat pesan →</a>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            )}

            {/* Donation Chart */}
            <Card>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-900 dark:text-gray-100">Statistik Donasi 7 Hari Terakhir</h4>
                    </div>
                    <Chart
                        type="area"
                        height={300}
                        series={[{ name: 'Total Donasi', data: [1500000, 2000000, 1800000, 3200000, 2500000, 4800000, 3500000] }]}
                        xAxis={['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Ming']}
                        customOptions={{
                            colors: ['#0f766e'],
                            fill: {
                                type: 'gradient',
                                gradient: {
                                    shadeIntensity: 1,
                                    opacityFrom: 0.7,
                                    opacityTo: 0.1,
                                    stops: [0, 90, 100]
                                }
                            },
                        }}
                    />
                </div>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Recent Donations */}
                <Card>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="font-bold text-gray-900 dark:text-gray-100">Donasi Terbaru</h4>
                            <a href="/dashboard/donasi" className="text-primary text-sm hover:underline">Lihat Semua →</a>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-500">Donatur</th>
                                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-500">Campaign</th>
                                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-500">Jumlah</th>
                                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentDonations.map((donation) => (
                                        <tr key={donation.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                                            <td className="py-3 px-2 text-sm">{donation.is_anonymous ? 'Anonim' : donation.donor_name}</td>
                                            <td className="py-3 px-2 text-sm text-gray-500 max-w-[150px] truncate">{donation.campaign_title}</td>
                                            <td className="py-3 px-2 text-sm font-semibold">{formatCurrency(donation.amount)}</td>
                                            <td className="py-3 px-2">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${donation.status === 'verified'
                                                    ? 'bg-success-subtle text-success'
                                                    : donation.status === 'rejected'
                                                        ? 'bg-error-subtle text-error'
                                                        : 'bg-warning-subtle text-warning'
                                                    }`}>
                                                    {donation.status === 'verified' ? 'Terverifikasi' : donation.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentDonations.length === 0 && (
                                        <tr><td colSpan={4} className="text-center py-6 text-gray-400 text-sm">Belum ada donasi</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>

                {/* Active Campaigns Progress */}
                <Card>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="font-bold text-gray-900 dark:text-gray-100">Progress Campaign</h4>
                            <a href="/dashboard/campaigns" className="text-primary text-sm hover:underline">Lihat Semua →</a>
                        </div>
                        <div className="flex flex-col gap-5">
                            {activeCampaigns.map((campaign) => {
                                const progress = campaign.target_amount > 0 ? Math.round((campaign.collected_amount / campaign.target_amount) * 100) : 0
                                return (
                                    <div key={campaign.id}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate mr-4">{campaign.title}</span>
                                            <span className="text-sm font-bold text-primary">{progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                            <div
                                                className="bg-primary h-2.5 rounded-full transition-all duration-500"
                                                style={{ width: `${Math.min(progress, 100)}%` }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-xs text-gray-500">Terkumpul: {formatCurrency(campaign.collected_amount)}</span>
                                            <span className="text-xs text-gray-500">Target: {formatCurrency(campaign.target_amount)}</span>
                                        </div>
                                    </div>
                                )
                            })}
                            {activeCampaigns.length === 0 && (
                                <p className="text-center py-6 text-gray-400 text-sm">Belum ada campaign aktif</p>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default DashboardPage
