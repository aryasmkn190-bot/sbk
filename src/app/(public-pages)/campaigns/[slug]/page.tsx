'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { PiHandHeartDuotone, PiUsersThreeDuotone, PiCalendarCheckDuotone, PiArrowLeftDuotone, PiCheckCircleDuotone, PiShareNetworkDuotone, PiCopyDuotone, PiHeartDuotone, PiUserDuotone, PiClockDuotone, PiCurrencyCircleDollarDuotone, PiWarningCircleDuotone, PiUploadDuotone } from 'react-icons/pi'
import { getCampaignBySlug, type CampaignRow } from '@/server/actions/campaign'
import { createDonation, updatePaymentProof } from '@/server/actions/donation'
import { uploadImage } from '@/server/actions/upload'
import { getCampaignDonors, type DonorListRow } from '@/server/actions/publicData'
import PublicNavbar from '@/components/public/PublicNavbar'

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

const timeAgo = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Hari ini'
    if (diffDays === 1) return 'Kemarin'
    if (diffDays < 7) return `${diffDays} hari lalu`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`
    return `${Math.floor(diffDays / 30)} bulan lalu`
}

const quickAmounts = [25000, 50000, 100000, 250000, 500000, 1000000]

const CampaignDetailPage = () => {
    const params = useParams()
    const slug = params?.slug as string

    const [campaign, setCampaign] = useState<CampaignRow | null>(null)
    const [donors, setDonors] = useState<DonorListRow[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'info' | 'donors'>('info')

    // Donation form
    const [donorName, setDonorName] = useState('')
    const [donorEmail, setDonorEmail] = useState('')
    const [donorPhone, setDonorPhone] = useState('')
    const [amount, setAmount] = useState('')
    const [message, setMessage] = useState('')
    const [isAnonymous, setIsAnonymous] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [donationId, setDonationId] = useState('')
    const [proofUploaded, setProofUploaded] = useState(false)
    const [uploadingProof, setUploadingProof] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadData = async () => {
            try {
                const campaignData = await getCampaignBySlug(slug)
                setCampaign(campaignData)
                if (campaignData) {
                    const donorsData = await getCampaignDonors(campaignData.id)
                    setDonors(donorsData)
                }
            } catch (err) {
                console.error('Error:', err)
            } finally {
                setLoading(false)
            }
        }
        if (slug) loadData()
    }, [slug])

    const handleSubmitDonation = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!donorName || !donorEmail || !amount || parseFloat(amount) < 10000) {
            setError('Mohon lengkapi semua field. Minimal donasi Rp 10.000.')
            return
        }

        if (!campaign) return

        setSubmitting(true)
        try {
            const result = await createDonation({
                campaign_id: campaign.id,
                donor_name: donorName,
                donor_email: donorEmail,
                donor_phone: donorPhone,
                amount: parseFloat(amount),
                message,
                is_anonymous: isAnonymous,
                payment_method: 'Transfer Bank',
            })
            setDonationId(result.id)
            setSuccess(true)
        } catch (err) {
            setError('Terjadi kesalahan. Silakan coba lagi.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                <div className="animate-pulse text-center">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mx-auto mb-4" />
                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
                </div>
            </div>
        )
    }

    if (!campaign) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <PiWarningCircleDuotone className="text-5xl text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Campaign Tidak Ditemukan</h2>
                    <Link href="/campaigns" className="text-emerald-600 hover:underline text-sm">← Kembali ke daftar campaign</Link>
                </div>
            </div>
        )
    }

    const progress = campaign.target_amount > 0 ? Math.round((campaign.collected_amount / campaign.target_amount) * 100) : 0
    const daysLeft = campaign.end_date ? Math.max(0, Math.ceil((new Date(campaign.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Navbar */}
            <PublicNavbar />

            {/* Campaign Hero */}
            <section className="pt-16">
                <div className="h-64 sm:h-80 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #047857 60%, #059669 100%)' }}>
                    {campaign.image ? (
                        <img src={campaign.image} alt={campaign.title} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                        <>
                            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <PiHandHeartDuotone className="text-white/10 text-[120px]" />
                            </div>
                        </>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
                        {campaign.category_name || 'Umum'}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Campaign Info */}
                    <div className="lg:col-span-2">
                        {/* Progress Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8 mb-6">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">{campaign.title}</h1>
                            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
                                <span className="flex items-center gap-1"><PiUsersThreeDuotone className="text-emerald-500" /> {campaign.donor_count} donatur</span>
                                <span className="flex items-center gap-1"><PiCalendarCheckDuotone className="text-emerald-500" /> {formatDate(campaign.start_date)}</span>
                                {daysLeft !== null && <span className="flex items-center gap-1"><PiClockDuotone className="text-emerald-500" /> {daysLeft > 0 ? `${daysLeft} hari tersisa` : 'Campaign berakhir'}</span>}
                            </div>
                            {/* Progress */}
                            <div className="mb-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-xl font-extrabold text-emerald-600">{formatCurrency(campaign.collected_amount)}</span>
                                    <span className="text-sm text-gray-400 self-end">dari {formatCurrency(campaign.target_amount)}</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4">
                                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-4 rounded-full transition-all duration-1000 relative" style={{ width: `${Math.min(progress, 100)}%` }}>
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white">{progress}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden">
                            <div className="flex border-b border-gray-200 dark:border-gray-700">
                                <button onClick={() => setActiveTab('info')} className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === 'info' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}>
                                    Informasi
                                </button>
                                <button onClick={() => setActiveTab('donors')} className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === 'donors' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}>
                                    Donatur ({donors.length})
                                </button>
                            </div>

                            <div className="p-6 sm:p-8">
                                {activeTab === 'info' ? (
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-3">Tentang Campaign</h3>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{campaign.description}</p>
                                        {campaign.content && (
                                            <>
                                                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Detail</h3>
                                                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed"
                                                    dangerouslySetInnerHTML={{ __html: campaign.content }}
                                                />
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        {donors.length === 0 ? (
                                            <div className="text-center py-8"><p className="text-gray-400">Belum ada donatur. Jadilah yang pertama!</p></div>
                                        ) : (
                                            <div className="flex flex-col gap-4">
                                                {donors.map((donor, i) => (
                                                    <div key={i} className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                                                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                                            <PiUserDuotone />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-semibold text-sm text-gray-900 dark:text-white">{donor.is_anonymous ? 'Hamba Allah' : donor.donor_name}</span>
                                                                <span className="text-xs text-gray-400">{timeAgo(donor.created_at)}</span>
                                                            </div>
                                                            <p className="text-sm font-bold text-emerald-600">{formatCurrency(donor.amount)}</p>
                                                            {donor.message && <p className="text-xs text-gray-500 mt-1 italic">&quot;{donor.message}&quot;</p>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Donation Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sticky top-24">
                            {success ? (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                                        <PiCheckCircleDuotone className="text-emerald-600 text-3xl" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Terima Kasih! 🤲</h3>
                                    <p className="text-sm text-gray-500 mb-4">Donasi Anda sebesar <strong className="text-emerald-600">{formatCurrency(parseFloat(amount || '0'))}</strong> telah tercatat.</p>

                                    {/* Bank Info */}
                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 mb-4 text-left">
                                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">Transfer ke rekening:</p>
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-xs text-gray-500">Bank Syariah Indonesia (BSI)</p>
                                            <button onClick={() => navigator.clipboard.writeText('XXX-XXXX-XXX')} className="text-emerald-600 hover:text-emerald-700">
                                                <PiCopyDuotone className="text-sm" />
                                            </button>
                                        </div>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">XXX-XXXX-XXX</p>
                                        <p className="text-xs text-gray-500">a.n. Yayasan Saling Bantu Kreasi Indonesia</p>
                                    </div>

                                    {/* Upload Bukti Pembayaran */}
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 mb-4 text-left">
                                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">📎 Upload Bukti Transfer</p>
                                        {proofUploaded ? (
                                            <div className="flex items-center gap-2 text-emerald-600">
                                                <PiCheckCircleDuotone />
                                                <span className="text-xs font-medium">Bukti transfer berhasil diunggah!</span>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-[11px] text-gray-400 mb-3">Upload bukti transfer untuk mempercepat proses verifikasi.</p>
                                                <label className="block">
                                                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                                        const file = e.target.files?.[0]
                                                        if (!file || !donationId) return
                                                        setUploadingProof(true)
                                                        try {
                                                            const formData = new FormData()
                                                            formData.append('file', file)
                                                            const res = await uploadImage(formData)
                                                            await updatePaymentProof(donationId, res.url)
                                                            setProofUploaded(true)
                                                        } catch (err) {
                                                            console.error('Upload error:', err)
                                                        } finally {
                                                            setUploadingProof(false)
                                                        }
                                                    }} />
                                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-500 transition-colors">
                                                        {uploadingProof ? (
                                                            <p className="text-xs text-gray-500">Mengunggah...</p>
                                                        ) : (
                                                            <>
                                                                <PiUploadDuotone className="text-2xl text-gray-400 mx-auto mb-1" />
                                                                <p className="text-xs text-gray-500">Klik untuk memilih foto</p>
                                                                <p className="text-[10px] text-gray-400">JPG, PNG (Maks. 2MB)</p>
                                                            </>
                                                        )}
                                                    </div>
                                                </label>
                                            </>
                                        )}
                                    </div>

                                    <p className="text-xs text-gray-400 mb-4">Donasi akan diverifikasi dalam 1x24 jam setelah transfer.</p>
                                    <button onClick={() => { setSuccess(false); setProofUploaded(false); setDonationId(''); setDonorName(''); setDonorEmail(''); setAmount(''); setMessage('') }} className="text-emerald-600 text-sm font-medium hover:underline">
                                        Donasi lagi
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitDonation}>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                        <PiHeartDuotone className="text-emerald-600" /> Berikan Donasi
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-5">Setiap kebaikan akan kembali pada kita.</p>

                                    {error && (
                                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 text-xs p-3 rounded-xl mb-4 flex items-center gap-2">
                                            <PiWarningCircleDuotone /> {error}
                                        </div>
                                    )}

                                    {/* Quick Amounts */}
                                    <div className="mb-4">
                                        <label className="text-xs font-medium text-gray-500 mb-2 block">Pilih Nominal</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {quickAmounts.map((qa) => (
                                                <button key={qa} type="button" onClick={() => setAmount(String(qa))}
                                                    className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${amount === String(qa)
                                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                                                        }`}>
                                                    {qa >= 1000000 ? `${qa / 1000000} Jt` : `${qa / 1000} Rb`}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Custom Amount */}
                                    <div className="mb-4">
                                        <label className="text-xs font-medium text-gray-500 mb-1 block">Atau nominal lainnya</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">Rp</span>
                                            <input type="number" className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="text-xs font-medium text-gray-500 mb-1 block">Nama Lengkap *</label>
                                        <input type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Nama Anda" value={donorName} onChange={(e) => setDonorName(e.target.value)} />
                                    </div>

                                    <div className="mb-3">
                                        <label className="text-xs font-medium text-gray-500 mb-1 block">Email *</label>
                                        <input type="email" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="email@example.com" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} />
                                    </div>

                                    <div className="mb-3">
                                        <label className="text-xs font-medium text-gray-500 mb-1 block">No. WhatsApp</label>
                                        <input type="tel" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="08xxxxxxxxxx" value={donorPhone} onChange={(e) => setDonorPhone(e.target.value)} />
                                    </div>

                                    <div className="mb-3">
                                        <label className="text-xs font-medium text-gray-500 mb-1 block">Pesan / Doa</label>
                                        <textarea className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none" placeholder="Semoga bermanfaat..." rows={2} value={message} onChange={(e) => setMessage(e.target.value)} />
                                    </div>

                                    <label className="flex items-center gap-2 mb-5 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 rounded accent-emerald-600" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
                                        <span className="text-xs text-gray-500">Sembunyikan nama saya (Hamba Allah)</span>
                                    </label>

                                    <button type="submit" disabled={submitting}
                                        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm">
                                        {submitting ? 'Memproses...' : <><PiHeartDuotone className="text-lg" /> Donasi Sekarang</>}
                                    </button>

                                    <p className="text-[10px] text-gray-400 text-center mt-3">Dengan berdonasi, Anda menyetujui syarat dan ketentuan yang berlaku.</p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CampaignDetailPage
