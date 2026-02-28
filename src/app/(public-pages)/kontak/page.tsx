'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PiHandHeartDuotone, PiEnvelopeSimpleDuotone, PiPhoneDuotone, PiMapPinDuotone, PiInstagramLogoDuotone, PiFacebookLogoDuotone, PiCheckCircleDuotone, PiPaperPlaneTiltDuotone, PiWarningCircleDuotone, PiClockDuotone } from 'react-icons/pi'
import { submitContactForm } from '@/server/actions/publicData'
import PublicNavbar from '@/components/public/PublicNavbar'
import { getSettings } from '@/server/actions/settings'

const KontakPublicPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [s, setS] = useState<Record<string, string>>({})

    useEffect(() => {
        getSettings().then(data => setS(data)).catch(console.error)
    }, [])

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            setError('Mohon lengkapi semua field yang wajib diisi.')
            return
        }

        setSubmitting(true)
        try {
            await submitContactForm(formData)
            setSuccess(true)
        } catch (err) {
            setError('Terjadi kesalahan. Silakan coba lagi.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Navbar */}
            <PublicNavbar />

            {/* Hero */}
            <section className="pt-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)' }}>
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Hubungi Kami</h1>
                    <p className="text-white/70 max-w-lg mx-auto">Ada pertanyaan, saran, atau ingin berkolaborasi? Jangan ragu untuk menghubungi kami.</p>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Informasi Kontak</h2>
                            <p className="text-sm text-gray-500">Kami siap membantu Anda. Silakan hubungi kami melalui salah satu kanal berikut.</p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-4 p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                    <PiEnvelopeSimpleDuotone className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">Email</h3>
                                    <a href={`mailto:${s.site_email || 'info@salingbantukreasi.or.id'}`} className="text-sm text-emerald-600 hover:underline">{s.site_email || 'info@salingbantukreasi.or.id'}</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                    <PiPhoneDuotone className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">Telepon</h3>
                                    <p className="text-sm text-gray-500">{s.site_phone || '+62-266-XXXXXXX'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                    <PiMapPinDuotone className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">Alamat</h3>
                                    <p className="text-sm text-gray-500">{s.site_address || 'Sukabumi, Jawa Barat, Indonesia'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                    <PiClockDuotone className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">Jam Operasional</h3>
                                    <p className="text-sm text-gray-500">Senin - Jumat: 08:00 - 17:00 WIB</p>
                                </div>
                            </div>
                        </div>

                        {/* Social */}
                        <div className="flex items-center gap-3 mt-2">
                            <a href="https://instagram.com/salingbantukreasi" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all">
                                <PiInstagramLogoDuotone className="text-xl" />
                            </a>
                            <a href="https://facebook.com/salingbantukreasi" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all">
                                <PiFacebookLogoDuotone className="text-xl" />
                            </a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 sm:p-10">
                            {success ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
                                        <PiCheckCircleDuotone className="text-emerald-600 text-4xl" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Pesan Terkirim!</h3>
                                    <p className="text-gray-500 mb-6">Terima kasih telah menghubungi kami. Kami akan membalas pesan Anda dalam 1-2 hari kerja.</p>
                                    <button onClick={() => { setSuccess(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }) }}
                                        className="text-emerald-600 font-medium hover:underline text-sm">Kirim pesan lain</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Kirim Pesan</h2>
                                    <p className="text-sm text-gray-500 mb-8">Isi form di bawah ini dan kami akan segera menindaklanjuti pesan Anda.</p>

                                    {error && (
                                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 text-sm p-4 rounded-xl mb-6 flex items-center gap-2">
                                            <PiWarningCircleDuotone /> {error}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nama Lengkap *</label>
                                            <input type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" placeholder="Nama Anda" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
                                            <input type="email" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" placeholder="email@example.com" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">No. Telepon</label>
                                            <input type="tel" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" placeholder="08xxxxxxxxxx" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subjek *</label>
                                            <input type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" placeholder="Perihal pesan" value={formData.subject} onChange={(e) => handleChange('subject', e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Pesan *</label>
                                        <textarea className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none" rows={5} placeholder="Tulis pesan Anda di sini..." value={formData.message} onChange={(e) => handleChange('message', e.target.value)} />
                                    </div>

                                    <button type="submit" disabled={submitting}
                                        className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm">
                                        {submitting ? 'Mengirim...' : <><PiPaperPlaneTiltDuotone className="text-lg" /> Kirim Pesan</>}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <footer className="border-t border-gray-100 dark:border-gray-800 py-8 text-center">
                <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Yayasan Saling Bantu Kreasi Indonesia</p>
            </footer>
        </div>
    )
}

export default KontakPublicPage
