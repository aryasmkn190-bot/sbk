'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PiHandHeartDuotone, PiEyeDuotone, PiTargetDuotone, PiUsersThreeDuotone, PiLightbulbDuotone, PiHandshakeDuotone, PiPlantDuotone, PiShieldCheckDuotone, PiGlobeDuotone, PiBookOpenTextDuotone, PiHeartDuotone, PiArrowRightDuotone } from 'react-icons/pi'
import PublicNavbar from '@/components/public/PublicNavbar'
import { getSettings } from '@/server/actions/settings'

const values = [
    { icon: <PiHandshakeDuotone />, title: 'Kolaborasi', desc: 'Membangun sinergi antara berbagai pihak untuk menciptakan dampak sosial yang lebih besar.' },
    { icon: <PiShieldCheckDuotone />, title: 'Transparansi', desc: 'Menjamin keterbukaan dalam pengelolaan dana dan pelaporan kegiatan kepada seluruh pemangku kepentingan.' },
    { icon: <PiPlantDuotone />, title: 'Keberlanjutan', desc: 'Mengembangkan program yang berdaya guna jangka panjang dan memberdayakan masyarakat secara mandiri.' },
    { icon: <PiHeartDuotone />, title: 'Ketulusan', desc: 'Setiap langkah dilandasi niat baik dan keikhlasan untuk membantu sesama tanpa pamrih.' },
]

const milestones = [
    { year: '2020', event: 'Berdiri sebagai komunitas filantropi di Sukabumi' },
    { year: '2021', event: 'Resmi terdaftar sebagai yayasan dan menjalankan program pertama' },
    { year: '2022', event: 'Menyalurkan bantuan ke lebih dari 500 penerima manfaat' },
    { year: '2023', event: 'Menjalin kerja sama dengan Pemerintah Daerah Sukabumi' },
    { year: '2024', event: 'Meluncurkan program Wakaf Produktif dan Pemberdayaan UMKM' },
    { year: '2025', event: 'Menyentuh lebih dari 2000 penerima manfaat di seluruh Sukabumi' },
]

const TentangPage = () => {
    const [s, setS] = useState<Record<string, string>>({})

    useEffect(() => {
        getSettings().then(data => setS(data)).catch(console.error)
    }, [])

    const misiList = [
        s.about_misi_1, s.about_misi_2, s.about_misi_3, s.about_misi_4, s.about_misi_5
    ].filter(Boolean)

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Navbar */}
            <PublicNavbar />

            {/* Hero */}
            <section className="pt-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)' }}>
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 text-center">
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">Tentang Kami</h1>
                    <p className="text-white/70 max-w-2xl mx-auto text-lg">Mendorong kolaborasi, pemberdayaan komunitas, dan inovasi sosial untuk Indonesia yang lebih baik.</p>
                </div>
            </section>

            {/* About */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                        <div>
                            <span className="inline-block text-xs uppercase tracking-widest text-emerald-600 font-bold mb-3">Siapa Kami</span>
                            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">{s.about_title || 'Yayasan Saling Bantu Kreasi Indonesia'}</h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                {s.about_description || 'Yayasan Saling Bantu Kreasi Indonesia (YSBKI) adalah organisasi nirlaba yang bergerak di bidang filantropi dan pemberdayaan masyarakat, berbasis di Sukabumi, Jawa Barat.'}
                            </p>
                        </div>
                        <div className="h-72 rounded-3xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #064e3b 100%)' }}>
                            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <PiHandHeartDuotone className="text-white/15 text-[80px]" />
                            </div>
                        </div>
                    </div>

                    {/* Visi Misi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl p-8 border border-emerald-100 dark:border-emerald-800">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center mb-5">
                                <PiEyeDuotone className="text-white text-2xl" />
                            </div>
                            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-3">Visi</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {s.about_visi || 'Menjadi organisasi filantropi terdepan yang mendorong kolaborasi, pemberdayaan komunitas, dan inovasi sosial untuk menciptakan masyarakat Indonesia yang sejahtera, mandiri, dan berdaya.'}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl p-8 border border-emerald-100 dark:border-emerald-800">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center mb-5">
                                <PiTargetDuotone className="text-white text-2xl" />
                            </div>
                            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-3">Misi</h3>
                            <ul className="text-gray-600 dark:text-gray-400 leading-relaxed space-y-2">
                                {(misiList.length > 0 ? misiList : [
                                    'Menyelenggarakan program donasi dan wakaf yang transparan dan akuntabel',
                                    'Memberdayakan UMKM dan ekonomi kerakyatan',
                                    'Memberikan bantuan pendidikan dan kesehatan bagi kaum dhuafa',
                                    'Membangun jaringan kolaborasi lintas sektor',
                                ]).map((misi, i) => (
                                    <li key={i} className="flex items-start gap-2"><span className="text-emerald-500 mt-1.5">•</span> {misi}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Values */}
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <span className="inline-block text-xs uppercase tracking-widest text-emerald-600 font-bold mb-2">Prinsip Kami</span>
                            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Nilai-Nilai yang Kami Pegang</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {values.map((v, i) => (
                                <div key={i} className="flex items-start gap-4 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:shadow-emerald-500/5 transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 text-xl flex-shrink-0">{v.icon}</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">{v.title}</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <span className="inline-block text-xs uppercase tracking-widest text-emerald-600 font-bold mb-2">Perjalanan Kami</span>
                            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Jejak Langkah</h2>
                        </div>
                        <div className="relative">
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-emerald-200 dark:bg-emerald-800" />
                            <div className="flex flex-col gap-8">
                                {milestones.map((m, i) => (
                                    <div key={i} className="flex items-start gap-6 ml-0">
                                        <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center font-extrabold text-white text-sm flex-shrink-0 z-10 shadow-lg shadow-emerald-500/25">{m.year}</div>
                                        <div className="pt-2">
                                            <p className="text-gray-700 dark:text-gray-300 font-medium">{m.event}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Programs */}
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <span className="inline-block text-xs uppercase tracking-widest text-emerald-600 font-bold mb-2">Area Fokus</span>
                            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Program Kami</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { icon: <PiBookOpenTextDuotone />, title: 'Pendidikan', desc: 'Beasiswa, bantuan alat sekolah, dan pelatihan pendidik' },
                                { icon: <PiUsersThreeDuotone />, title: 'Kemanusiaan', desc: 'Bantuan bencana alam, santunan, dan sembako' },
                                { icon: <PiLightbulbDuotone />, title: 'Pemberdayaan', desc: 'Pelatihan UMKM, kewirausahaan, dan ekonomi kreatif' },
                                { icon: <PiGlobeDuotone />, title: 'Lingkungan', desc: 'Konservasi, penghijauan, dan pengelolaan sampah' },
                                { icon: <PiHandshakeDuotone />, title: 'Wakaf Produktif', desc: 'Pengelolaan wakaf untuk manfaat berkelanjutan' },
                                { icon: <PiHandHeartDuotone />, title: 'Kesehatan', desc: 'Pengobatan gratis dan santunan kesehatan' },
                            ].map((p, i) => (
                                <div key={i} className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-emerald-200 transition-all">
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 text-2xl mx-auto mb-4">{p.icon}</div>
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">{p.title}</h4>
                                    <p className="text-sm text-gray-500">{p.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl p-12">
                        <h3 className="text-2xl font-extrabold text-white mb-3">Mari Bersama Wujudkan Kebaikan</h3>
                        <p className="text-white/80 mb-6 max-w-md mx-auto">Setiap langkah kecil, setiap kontribusi, memiliki dampak besar bagi mereka yang membutuhkan.</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/campaigns" className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors text-sm">
                                Lihat Campaign <PiArrowRightDuotone />
                            </Link>
                            <Link href="/kontak" className="inline-flex items-center gap-2 bg-white/20 text-white font-bold py-3 px-6 rounded-xl hover:bg-white/30 transition-colors text-sm">
                                Hubungi Kami
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="border-t border-gray-100 dark:border-gray-800 py-8 text-center">
                <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Yayasan Saling Bantu Kreasi Indonesia</p>
            </footer>
        </div>
    )
}

export default TentangPage
