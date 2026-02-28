'use client'

import { Button } from '@/components/ui'
import Link from 'next/link'
import Image from 'next/image'
import { PiHandHeartDuotone, PiUsersThreeDuotone, PiHandshakeDuotone, PiLightbulbDuotone, PiArrowRightDuotone, PiInstagramLogoDuotone, PiEnvelopeSimpleDuotone, PiPhoneDuotone, PiMapPinDuotone, PiHeartDuotone, PiTreeDuotone, PiBookOpenTextDuotone, PiFacebookLogoDuotone, PiYoutubeLogoDuotone, PiCurrencyCircleDollarDuotone, PiUsersFourDuotone, PiTargetDuotone, PiStarFourDuotone, PiArrowUpRightDuotone, PiCheckCircleDuotone, PiPlayDuotone, PiQuotesDuotone, PiCalendarCheckDuotone, PiChartLineUpDuotone, PiShieldCheckDuotone, PiHandsPrayingDuotone } from 'react-icons/pi'
import { useState, useEffect } from 'react'
import PublicNavbar from '@/components/public/PublicNavbar'
import { getFeaturedCampaigns, type CampaignRow } from '@/server/actions/campaign'
import { getSettings } from '@/server/actions/settings'

/* ───── DATA ───── */
const stats = [
    { label: 'Penerima Manfaat', value: '500+', icon: <PiUsersThreeDuotone /> },
    { label: 'Program Aktif', value: '15+', icon: <PiTargetDuotone /> },
    { label: 'Relawan', value: '50+', icon: <PiHandshakeDuotone /> },
]

const programs = [
    { icon: <PiBookOpenTextDuotone className="text-3xl" />, title: 'Pendidikan', desc: 'Beasiswa dan bantuan pendidikan untuk anak-anak kurang mampu dan yatim piatu di Sukabumi.' },
    { icon: <PiHeartDuotone className="text-3xl" />, title: 'Kesehatan', desc: 'Program kesehatan masyarakat, pengobatan gratis, dan bantuan alat kesehatan.' },
    { icon: <PiHandshakeDuotone className="text-3xl" />, title: 'Pemberdayaan UMKM', desc: 'Pelatihan dan pendampingan UMKM untuk kemandirian ekonomi masyarakat.' },
    { icon: <PiTreeDuotone className="text-3xl" />, title: 'Lingkungan', desc: 'Penghijauan, pengelolaan sampah, dan konservasi lingkungan berkelanjutan.' },
    { icon: <PiHandsPrayingDuotone className="text-3xl" />, title: 'Wakaf Produktif', desc: 'Mengelola aset wakaf secara produktif untuk manfaat jangka panjang umat.' },
    { icon: <PiUsersFourDuotone className="text-3xl" />, title: 'Kemanusiaan', desc: 'Tanggap darurat bencana, bantuan pangan, dan santunan bagi yang membutuhkan.' },
]



const testimonials = [
    { name: 'Ahmad Fauzi', role: 'Donatur Tetap', text: 'Saling Bantu Kreasi adalah wadah yang tepat untuk berbagi. Transparansi dan akuntabilitas yang mereka tunjukkan membuat saya percaya setiap rupiah disalurkan dengan baik.', avatar: 'AF' },
    { name: 'Siti Nurhaliza', role: 'Penerima Manfaat', text: 'Berkat program beasiswa dari Yayasan SBK, anak saya bisa melanjutkan pendidikan. Terima kasih atas kepedulian yang luar biasa.', avatar: 'SN' },
    { name: 'Budi Santoso', role: 'Relawan', text: 'Menjadi relawan di SBK mengajarkan saya makna gotong royong yang sesungguhnya. Bersama kita bisa membuat perubahan nyata.', avatar: 'BS' },
]

const newsItems = [
    { title: 'Penyaluran Donasi Wakaf Produktif Tahap Pertama', date: '28 Feb 2026', category: 'Laporan' },
    { title: 'Kegiatan Bakti Sosial di Desa Cikaret', date: '25 Feb 2026', category: 'Kegiatan' },
    { title: 'Kisah Inspiratif: Anak Yatim Raih Beasiswa', date: '20 Feb 2026', category: 'Inspirasi' },
]

/* ───── COMPONENTS ───── */

const CountUpNumber = ({ target, suffix = '' }: { target: string; suffix?: string }) => {
    const numericPart = parseInt(target.replace(/\D/g, ''), 10)
    const [count, setCount] = useState(0)

    useEffect(() => {
        const duration = 2000
        const steps = 60
        const increment = numericPart / steps
        let current = 0
        const timer = setInterval(() => {
            current += increment
            if (current >= numericPart) {
                setCount(numericPart)
                clearInterval(timer)
            } else {
                setCount(Math.round(current))
            }
        }, duration / steps)
        return () => clearInterval(timer)
    }, [numericPart])

    return <>{count}{suffix}</>
}

/* ───── MAIN PAGE ───── */
const LandingPage = () => {
    const [campaigns, setCampaigns] = useState<CampaignRow[]>([])
    const [s, setS] = useState<Record<string, string>>({})

    useEffect(() => {
        getFeaturedCampaigns().then(data => setCampaigns(data)).catch(console.error)
        getSettings().then(data => setS(data)).catch(console.error)
    }, [])

    const formatCurrency = (amount: number) => {
        if (amount >= 1000000000) return `Rp ${(amount / 1000000000).toFixed(1)} M`
        if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(1)} Jt`
        if (amount >= 1000) return `Rp ${(amount / 1000).toFixed(0)} Rb`
        return `Rp ${amount.toLocaleString('id-ID')}`
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
            {/* ═══════════════════════════ NAVBAR ═══════════════════════════ */}
            <PublicNavbar variant="transparent" />

            {/* ═══════════════════════════ HERO ═══════════════════════════ */}
            <section className="relative min-h-[100vh] flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 30%, #047857 60%, #059669 100%)' }}>
                {/* Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                {/* Glow Effects */}
                <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-teal-400/15 rounded-full blur-[100px]" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 pb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                        {/* Left: Text Content */}
                        <div className="max-w-xl">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-emerald-200 text-sm font-medium px-4 py-2 rounded-full border border-white/10 mb-8">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                {s.hero_badge || 'Badan Wakaf Produktif'}
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-white leading-[1.1] mb-6">
                                {(s.hero_title || 'Bersama Membangun Harapan untuk Negeri').split(' ').reduce((acc: string[][], word, i) => {
                                    const lineIdx = Math.floor(i / 2)
                                    if (!acc[lineIdx]) acc[lineIdx] = []
                                    acc[lineIdx].push(word)
                                    return acc
                                }, []).map((words, i) => (
                                    <span key={i} className="block text-4xl sm:text-5xl lg:text-6xl font-extrabold italic">
                                        {words.join(' ')}
                                    </span>
                                ))}
                            </h1>

                            {/* Description */}
                            <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-10 max-w-lg">
                                {s.hero_subtitle || 'Yayasan Saling Bantu Kreasi Indonesia hadir untuk mendorong kolaborasi, pemberdayaan komunitas, dan inovasi sosial demi kesejahteraan masyarakat Indonesia.'}
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap items-center gap-4 mb-14">
                                <Link href="/campaigns">
                                    <button className="inline-flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 text-sm font-bold px-7 py-3.5 rounded-full shadow-xl shadow-black/10 transition-all hover:-translate-y-0.5 hover:shadow-2xl">
                                        <PiHeartDuotone className="text-lg" />
                                        {s.hero_cta_text || 'Mulai Berdonasi'}
                                    </button>
                                </Link>
                                <Link href="/tentang">
                                    <button className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 text-sm font-semibold px-7 py-3.5 rounded-full border border-white/20 transition-all">
                                        {s.hero_cta_secondary || 'Tentang Kami'}
                                        <PiArrowRightDuotone />
                                    </button>
                                </Link>
                            </div>

                            {/* Stats Row */}
                            <div className="flex items-center gap-8 sm:gap-12">
                                {[
                                    { label: 'Penerima Manfaat', value: s.stat_beneficiaries || '500+' },
                                    { label: 'Program Aktif', value: s.stat_programs || '15+' },
                                    { label: 'Relawan', value: s.stat_volunteers || '50+' },
                                ].map((stat, i) => (
                                    <div key={i} className="text-center">
                                        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                                            <CountUpNumber target={stat.value} suffix="+" />
                                        </h3>
                                        <p className="text-xs sm:text-sm text-white/50 mt-1">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Image Collage */}
                        <div className="relative hidden lg:block">
                            <div className="relative w-full h-[540px]">
                                {/* Main Large Image */}
                                <div className="absolute top-0 left-0 w-[55%] h-[75%] rounded-3xl overflow-hidden shadow-2xl shadow-black/30 border-2 border-white/10">
                                    <Image
                                        src="/img/landing/hero-1.png"
                                        alt="Kegiatan sosial Saling Bantu Kreasi"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>

                                {/* Secondary Image */}
                                <div className="absolute top-12 right-0 w-[50%] h-[65%] rounded-3xl overflow-hidden shadow-2xl shadow-black/30 border-2 border-white/10">
                                    <Image
                                        src="/img/landing/hero-2.png"
                                        alt="Relawan Saling Bantu Kreasi"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>

                                {/* Floating Card - Top Right */}
                                <div className="absolute -top-2 right-4 bg-white dark:bg-gray-800 rounded-2xl px-5 py-4 shadow-xl shadow-black/10 flex items-center gap-3 z-10 animate-float">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                                        <PiUsersFourDuotone className="text-white text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Kolaborasi</p>
                                        <p className="text-xs text-gray-500">Bersama Komunitas</p>
                                    </div>
                                </div>

                                {/* Floating Card - Bottom Left */}
                                <div className="absolute bottom-8 left-8 bg-white dark:bg-gray-800 rounded-2xl px-5 py-4 shadow-xl shadow-black/10 z-10 animate-float-delayed">
                                    <p className="text-xl font-extrabold text-emerald-600">Rp 20 Jt+</p>
                                    <p className="text-xs text-gray-500">Dana terkumpul</p>
                                </div>

                                {/* Decorative Ring */}
                                <div className="absolute -bottom-4 right-20 w-28 h-28 rounded-full border-4 border-emerald-400/20" />
                                <div className="absolute top-24 -left-6 w-16 h-16 rounded-full border-4 border-emerald-400/15" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Scroll Indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
                    <span className="text-white/40 text-xs">Scroll</span>
                    <div className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ ABOUT ═══════════════════════════ */}
            <section id="tentang" className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl p-10 sm:p-14">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/25">
                                    <PiHandHeartDuotone className="text-white text-4xl" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-3">Saling Bantu Kreasi</h3>
                                <p className="text-gray-500 text-center text-sm">Indonesia</p>
                                <div className="flex justify-center gap-6 mt-8">
                                    {[
                                        { label: 'Tahun Berdiri', value: '2024' },
                                        { label: 'Lokasi', value: 'Sukabumi' },
                                        { label: 'Status', value: 'Aktif' },
                                    ].map((item, i) => (
                                        <div key={i} className="text-center">
                                            <p className="text-lg font-bold text-emerald-600">{item.value}</p>
                                            <p className="text-xs text-gray-500">{item.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Decorative */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-100 dark:bg-emerald-800/20 rounded-2xl -z-10" />
                            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-teal-100 dark:bg-teal-800/20 rounded-xl -z-10" />
                        </div>
                        <div>
                            <span className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                                <PiStarFourDuotone /> Tentang Kami
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                                Yayasan Saling Bantu<br />Kreasi Indonesia
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                Yayasan Saling Bantu Kreasi Indonesia didirikan dengan tekad menjadi wadah kolaborasi masyarakat untuk menciptakan perubahan sosial yang positif dan berkelanjutan di Indonesia.
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                                Berlokasi di Sukabumi, Jawa Barat, kami bergerak dalam bidang filantropi, pemberdayaan masyarakat, wakaf produktif, dan inovasi sosial. Dengan semangat gotong royong, kami percaya bahwa perubahan besar dimulai dari kebaikan kecil yang dilakukan bersama.
                            </p>
                            <div className="flex flex-col gap-3">
                                {[
                                    'Transparansi dalam setiap penyaluran dana',
                                    'Akuntabilitas program yang terukur',
                                    'Kolaborasi dengan komunitas lokal',
                                    'Inovasi sosial yang berkelanjutan',
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <PiCheckCircleDuotone className="text-emerald-500 text-xl flex-shrink-0" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ VISI & MISI ═══════════════════════════ */}
            <section id="visi-&-misi" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)' }}>
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                <div className="container mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 text-emerald-300 bg-white/10 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                            <PiLightbulbDuotone /> Visi & Misi
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Arah dan Tujuan Kami</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center mb-6">
                                <PiLightbulbDuotone className="text-white text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Visi</h3>
                            <p className="text-white/70 leading-relaxed">
                                Menjadi organisasi filantropi terdepan yang mendorong kolaborasi dan inovasi sosial untuk menciptakan masyarakat Indonesia yang mandiri, berdaya, dan berkeadilan.
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center mb-6">
                                <PiTargetDuotone className="text-white text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Misi</h3>
                            <ul className="space-y-3 text-white/70">
                                <li className="flex items-start gap-2"><PiCheckCircleDuotone className="text-emerald-400 mt-0.5 flex-shrink-0" /> Memberdayakan komunitas melalui program sosial yang terukur</li>
                                <li className="flex items-start gap-2"><PiCheckCircleDuotone className="text-emerald-400 mt-0.5 flex-shrink-0" /> Mengelola wakaf produktif secara profesional dan transparan</li>
                                <li className="flex items-start gap-2"><PiCheckCircleDuotone className="text-emerald-400 mt-0.5 flex-shrink-0" /> Mendorong inovasi sosial berbasis kolaborasi</li>
                                <li className="flex items-start gap-2"><PiCheckCircleDuotone className="text-emerald-400 mt-0.5 flex-shrink-0" /> Membangun jaringan filantropi yang kuat dan berkelanjutan</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ PROGRAMS ═══════════════════════════ */}
            <section id="program" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                            <PiTargetDuotone /> Program Kami
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Program Unggulan</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Beragam program yang kami jalankan untuk menciptakan dampak sosial berkelanjutan bagi masyarakat Indonesia.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {programs.map((program, i) => (
                            <div key={i} className="group bg-white dark:bg-gray-800 p-7 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 cursor-pointer hover:-translate-y-1">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mb-5 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-emerald-700 group-hover:text-white group-hover:shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300">
                                    {program.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 transition-colors">{program.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{program.desc}</p>
                                <div className="mt-5 flex items-center gap-1 text-emerald-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    Selengkapnya <PiArrowRightDuotone />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ CAMPAIGNS ═══════════════════════════ */}
            <section id="campaign" className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                            <PiHandHeartDuotone /> Campaign Donasi
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Donasi Terbaru</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Setiap rupiah yang Anda donasikan membantu mengubah kehidupan. Pilih campaign yang ingin Anda dukung.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {campaigns.map((campaign) => {
                            const progress = campaign.target_amount > 0 ? Math.round((campaign.collected_amount / campaign.target_amount) * 100) : 0
                            const daysLeft = campaign.end_date ? Math.max(0, Math.ceil((new Date(campaign.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null
                            return (
                                <Link key={campaign.id} href={`/campaigns/${campaign.slug}`}>
                                    <div className="group bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-1 cursor-pointer h-full">
                                        {/* Campaign Image */}
                                        <div className="h-52 relative overflow-hidden">
                                            {campaign.image ? (
                                                <img src={campaign.image} alt={campaign.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <>
                                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500" />
                                                    <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <PiHandHeartDuotone className="text-white/20 text-7xl" />
                                                    </div>
                                                </>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                            {/* Category Badge */}
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
                                                {campaign.category_name || 'Umum'}
                                            </div>
                                            {/* Days Left */}
                                            {daysLeft !== null && (
                                                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1">
                                                    <PiCalendarCheckDuotone /> {daysLeft > 0 ? `${daysLeft} hari lagi` : 'Berakhir'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 group-hover:text-emerald-600 transition-colors">
                                                {campaign.title}
                                            </h3>
                                            {/* Progress */}
                                            <div className="mb-4">
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="font-bold text-emerald-600">{formatCurrency(campaign.collected_amount)}</span>
                                                    <span className="text-gray-400">{formatCurrency(campaign.target_amount)}</span>
                                                </div>
                                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                                                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-1000"
                                                        style={{ width: `${Math.min(progress, 100)}%` }} />
                                                </div>
                                                <div className="flex justify-between items-center mt-3">
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <PiUsersThreeDuotone />{campaign.donor_count} donatur
                                                    </span>
                                                    <span className="text-xs font-bold text-emerald-600">{progress}%</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-semibold py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                                <PiHeartDuotone /> Donasi Sekarang
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                    <div className="text-center mt-12">
                        <Link href="/campaigns">
                            <button className="inline-flex items-center gap-2 border-2 border-emerald-200 dark:border-emerald-700 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 font-semibold px-8 py-3.5 rounded-full transition-all text-sm">
                                Lihat Semua Campaign
                                <PiArrowRightDuotone />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ WHY US ═══════════════════════════ */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                            <PiShieldCheckDuotone /> Kenapa Kami
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Mengapa Memilih Kami</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <PiShieldCheckDuotone className="text-3xl" />, title: 'Transparan', desc: 'Laporan keuangan terbuka dan bisa diakses kapan saja oleh donatur.' },
                            { icon: <PiChartLineUpDuotone className="text-3xl" />, title: 'Terukur', desc: 'Setiap program memiliki indikator keberhasilan yang jelas dan terukur.' },
                            { icon: <PiHandshakeDuotone className="text-3xl" />, title: 'Kolaboratif', desc: 'Bekerja sama dengan komunitas lokal dan mitra strategis.' },
                            { icon: <PiHeartDuotone className="text-3xl" />, title: 'Berdampak', desc: 'Fokus pada dampak nyata dan keberlanjutan program untuk masyarakat.' },
                        ].map((item, i) => (
                            <div key={i} className="text-center p-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/20">
                                    {item.icon}
                                </div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ TESTIMONIALS ═══════════════════════════ */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                            <PiQuotesDuotone /> Testimoni
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Apa Kata Mereka</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {testimonials.map((t, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow relative">
                                <PiQuotesDuotone className="text-emerald-100 dark:text-emerald-900/30 text-5xl absolute top-4 right-4" />
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 relative z-10">&quot;{t.text}&quot;</p>
                                <div className="flex items-center gap-3 relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-sm font-bold">
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{t.name}</p>
                                        <p className="text-xs text-emerald-600">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ NEWS ═══════════════════════════ */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
                        <div>
                            <span className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                                <PiCalendarCheckDuotone /> Berita Terbaru
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Berita & Kegiatan</h2>
                        </div>
                        <Link href="/berita" className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm hover:gap-3 transition-all">
                            Lihat Semua <PiArrowRightDuotone />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {newsItems.map((news, i) => (
                            <Link key={i} href={`/berita/${news.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')}`}>
                                <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
                                    <div className="h-48 bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/20 flex items-center justify-center">
                                        <PiBookOpenTextDuotone className="text-emerald-300 text-5xl" />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-md">{news.category}</span>
                                            <span className="text-xs text-gray-400">{news.date}</span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors leading-snug">{news.title}</h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ CTA ═══════════════════════════ */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)' }}>
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-[80px]" />
                <div className="absolute bottom-10 right-10 w-60 h-60 bg-teal-400/10 rounded-full blur-[80px]" />
                <div className="container mx-auto relative z-10 text-center">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
                        Mari Bersama<br />Wujudkan Kebaikan
                    </h2>
                    <p className="text-white/70 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
                        Setiap kebaikan yang kita lakukan, sekecil apapun, akan membawa dampak besar bagi mereka yang membutuhkan.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/campaigns">
                            <button className="inline-flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-sm px-8 py-4 rounded-full shadow-xl transition-all hover:-translate-y-0.5">
                                <PiHeartDuotone className="text-lg" /> Mulai Berdonasi
                            </button>
                        </Link>
                        <Link href="/kontak">
                            <button className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 font-semibold text-sm px-8 py-4 rounded-full border border-white/20 transition-all">
                                Hubungi Kami
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ CONTACT ═══════════════════════════ */}
            <section id="kontak" className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                            <PiEnvelopeSimpleDuotone /> Kontak
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Hubungi Kami</h2>
                        <p className="text-gray-500">Punya pertanyaan? Jangan ragu untuk menghubungi kami.</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {[
                            { icon: <PiEnvelopeSimpleDuotone className="text-2xl" />, title: 'Email', value: 'info@salingbantukreasi.or.id' },
                            { icon: <PiPhoneDuotone className="text-2xl" />, title: 'Telepon', value: '+62-266-XXXXXXX' },
                            { icon: <PiMapPinDuotone className="text-2xl" />, title: 'Alamat', value: 'Sukabumi, Jawa Barat, Indonesia' },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
                                    {item.icon}
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                                <p className="text-sm text-gray-500">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ FOOTER ═══════════════════════════ */}
            <footer className="bg-gray-950 text-white py-20 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        <div className="lg:col-span-2">
                            {/* Logo */}
                            <div className="flex items-center gap-2.5 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                                    <PiHandHeartDuotone className="text-white text-xl" />
                                </div>
                                <div className="leading-tight">
                                    <span className="font-bold text-base block text-white">Saling Bantu</span>
                                    <span className="font-bold text-base block text-emerald-400 -mt-0.5">Kreasi</span>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-md mb-6">
                                Mendorong kolaborasi, pemberdayaan komunitas, dan inovasi sosial untuk Indonesia yang lebih baik. Bersama kita bisa.
                            </p>
                            <div className="flex items-center gap-3">
                                {[
                                    { icon: <PiInstagramLogoDuotone /> },
                                    { icon: <PiFacebookLogoDuotone /> },
                                    { icon: <PiYoutubeLogoDuotone /> },
                                ].map((s, i) => (
                                    <a key={i} href="#" className="w-11 h-11 rounded-xl bg-white/5 hover:bg-emerald-600 flex items-center justify-center transition-all text-lg text-gray-400 hover:text-white">
                                        {s.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-5 text-sm uppercase tracking-wider text-gray-400">Tautan</h4>
                            <ul className="flex flex-col gap-3 text-sm text-gray-500">
                                <li><Link href="/tentang" className="hover:text-emerald-400 transition-colors">Tentang Kami</Link></li>
                                <li><Link href="/campaigns" className="hover:text-emerald-400 transition-colors">Campaign</Link></li>
                                <li><Link href="/berita" className="hover:text-emerald-400 transition-colors">Berita</Link></li>
                                <li><Link href="/kontak" className="hover:text-emerald-400 transition-colors">Kontak</Link></li>
                                <li><Link href="/sign-in" className="hover:text-emerald-400 transition-colors">Masuk Admin</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-5 text-sm uppercase tracking-wider text-gray-400">Donasi Via</h4>
                            <div className="bg-white/5 rounded-2xl p-5">
                                <p className="text-sm text-gray-400 mb-2">Bank Syariah Indonesia (BSI)</p>
                                <p className="text-white font-bold text-sm mb-3">a.n. Yayasan Saling Bantu Kreasi Indonesia</p>
                                <hr className="border-white/10 mb-3" />
                                <p className="text-xs text-gray-500">Konfirmasi donasi via WhatsApp atau email.</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white/10 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} Yayasan Saling Bantu Kreasi Indonesia. Hak Cipta Dilindungi.</p>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                            <a href="#" className="hover:text-gray-400 transition-colors">Kebijakan Privasi</a>
                            <a href="#" className="hover:text-gray-400 transition-colors">Syarat & Ketentuan</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* ═══════════════════════════ CUSTOM CSS ═══════════════════════════ */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 5s ease-in-out infinite 1s;
                }
            `}</style>
        </div>
    )
}

export default LandingPage
