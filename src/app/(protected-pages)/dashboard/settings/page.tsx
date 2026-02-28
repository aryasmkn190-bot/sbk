'use client'

import { useState, useEffect } from 'react'
import { Card, Button, Input, Tabs, Notification, toast } from '@/components/ui'
import { PiFloppyDiskDuotone, PiGlobeDuotone, PiShareNetworkDuotone, PiBankDuotone, PiHouseDuotone, PiInfoDuotone } from 'react-icons/pi'
import { getSettings, updateSettings } from '@/server/actions/settings'

const { TabNav, TabList, TabContent } = Tabs

const FieldGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        {children}
    </div>
)

const SettingsPage = () => {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState<Record<string, string>>({})

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const data = await getSettings()
                setSettings(data)
            } catch (error) {
                console.error('Error loading settings:', error)
            } finally {
                setLoading(false)
            }
        }
        loadSettings()
    }, [])

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            await updateSettings(settings)
            toast.push(<Notification type="success" title="Berhasil">Pengaturan berhasil disimpan.</Notification>)
        } catch (error) {
            toast.push(<Notification type="danger" title="Error">Gagal menyimpan pengaturan.</Notification>)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <Card className="p-8 text-center text-gray-400">Memuat pengaturan...</Card>
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-lg">Pengaturan Website</h4>
                    <p className="text-sm text-gray-500">Kelola semua konten dan informasi yang tampil di website</p>
                </div>
                <Button variant="solid" icon={<PiFloppyDiskDuotone />} loading={saving} onClick={handleSave}>Simpan Pengaturan</Button>
            </div>

            <Tabs defaultValue="site">
                <TabList>
                    <TabNav value="site" icon={<PiGlobeDuotone />}>Informasi Situs</TabNav>
                    <TabNav value="home" icon={<PiHouseDuotone />}>Beranda</TabNav>
                    <TabNav value="about" icon={<PiInfoDuotone />}>Tentang</TabNav>
                    <TabNav value="social" icon={<PiShareNetworkDuotone />}>Media Sosial</TabNav>
                    <TabNav value="bank" icon={<PiBankDuotone />}>Rekening Bank</TabNav>
                </TabList>

                {/* ═══ Tab: Informasi Situs ═══ */}
                <TabContent value="site">
                    <Card>
                        <div className="p-6">
                            <h5 className="font-bold mb-1">Informasi Situs</h5>
                            <p className="text-sm text-gray-500 mb-6">Informasi dasar website yang tampil di semua halaman.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FieldGroup label="Nama Situs">
                                    <Input value={settings.site_name || ''} onChange={(e) => handleChange('site_name', e.target.value)} />
                                </FieldGroup>
                                <FieldGroup label="Tagline">
                                    <Input value={settings.site_tagline || ''} onChange={(e) => handleChange('site_tagline', e.target.value)} />
                                </FieldGroup>
                                <FieldGroup label="Email">
                                    <Input type="email" value={settings.site_email || ''} onChange={(e) => handleChange('site_email', e.target.value)} />
                                </FieldGroup>
                                <FieldGroup label="Telepon">
                                    <Input value={settings.site_phone || ''} onChange={(e) => handleChange('site_phone', e.target.value)} />
                                </FieldGroup>
                                <div className="md:col-span-2">
                                    <FieldGroup label="Alamat">
                                        <Input textArea value={settings.site_address || ''} onChange={(e) => handleChange('site_address', e.target.value)} />
                                    </FieldGroup>
                                </div>
                            </div>
                        </div>
                    </Card>
                </TabContent>

                {/* ═══ Tab: Beranda ═══ */}
                <TabContent value="home">
                    <div className="flex flex-col gap-6">
                        {/* Hero Section */}
                        <Card>
                            <div className="p-6">
                                <h5 className="font-bold mb-1">🏠 Hero Section</h5>
                                <p className="text-sm text-gray-500 mb-6">Bagian utama yang pertama kali dilihat pengunjung di halaman beranda.</p>
                                <div className="flex flex-col gap-4">
                                    <FieldGroup label="Badge Teks (kecil di atas judul)">
                                        <Input value={settings.hero_badge || ''} onChange={(e) => handleChange('hero_badge', e.target.value)} placeholder="Badan Wakaf Produktif" />
                                    </FieldGroup>
                                    <FieldGroup label="Judul Utama Hero">
                                        <Input value={settings.hero_title || ''} onChange={(e) => handleChange('hero_title', e.target.value)} placeholder="Bersama Membangun Harapan untuk Negeri" />
                                    </FieldGroup>
                                    <FieldGroup label="Sub-judul Hero">
                                        <Input textArea value={settings.hero_subtitle || ''} onChange={(e) => handleChange('hero_subtitle', e.target.value)} placeholder="Deskripsi singkat tentang yayasan..." />
                                    </FieldGroup>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FieldGroup label="Teks Tombol CTA Utama">
                                            <Input value={settings.hero_cta_text || ''} onChange={(e) => handleChange('hero_cta_text', e.target.value)} placeholder="Mulai Berdonasi" />
                                        </FieldGroup>
                                        <FieldGroup label="Teks Tombol CTA Sekunder">
                                            <Input value={settings.hero_cta_secondary || ''} onChange={(e) => handleChange('hero_cta_secondary', e.target.value)} placeholder="Tentang Kami" />
                                        </FieldGroup>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Statistik */}
                        <Card>
                            <div className="p-6">
                                <h5 className="font-bold mb-1">📊 Statistik</h5>
                                <p className="text-sm text-gray-500 mb-6">Angka pencapaian yang ditampilkan di beranda.</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FieldGroup label="Penerima Manfaat">
                                        <Input value={settings.stat_beneficiaries || ''} onChange={(e) => handleChange('stat_beneficiaries', e.target.value)} placeholder="500+" />
                                    </FieldGroup>
                                    <FieldGroup label="Program Aktif">
                                        <Input value={settings.stat_programs || ''} onChange={(e) => handleChange('stat_programs', e.target.value)} placeholder="15+" />
                                    </FieldGroup>
                                    <FieldGroup label="Relawan">
                                        <Input value={settings.stat_volunteers || ''} onChange={(e) => handleChange('stat_volunteers', e.target.value)} placeholder="50+" />
                                    </FieldGroup>
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabContent>

                {/* ═══ Tab: Tentang ═══ */}
                <TabContent value="about">
                    <div className="flex flex-col gap-6">
                        <Card>
                            <div className="p-6">
                                <h5 className="font-bold mb-1">📖 Profil Yayasan</h5>
                                <p className="text-sm text-gray-500 mb-6">Informasi yang tampil di halaman Tentang Kami.</p>
                                <div className="flex flex-col gap-4">
                                    <FieldGroup label="Judul Halaman Tentang">
                                        <Input value={settings.about_title || ''} onChange={(e) => handleChange('about_title', e.target.value)} />
                                    </FieldGroup>
                                    <FieldGroup label="Deskripsi Yayasan">
                                        <Input textArea value={settings.about_description || ''} onChange={(e) => handleChange('about_description', e.target.value)} />
                                    </FieldGroup>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="p-6">
                                <h5 className="font-bold mb-1">🎯 Visi & Misi</h5>
                                <p className="text-sm text-gray-500 mb-6">Visi dan misi yayasan yang tampil di halaman Tentang.</p>
                                <div className="flex flex-col gap-4">
                                    <FieldGroup label="Visi">
                                        <Input textArea value={settings.about_visi || ''} onChange={(e) => handleChange('about_visi', e.target.value)} />
                                    </FieldGroup>
                                    <FieldGroup label="Misi 1">
                                        <Input value={settings.about_misi_1 || ''} onChange={(e) => handleChange('about_misi_1', e.target.value)} />
                                    </FieldGroup>
                                    <FieldGroup label="Misi 2">
                                        <Input value={settings.about_misi_2 || ''} onChange={(e) => handleChange('about_misi_2', e.target.value)} />
                                    </FieldGroup>
                                    <FieldGroup label="Misi 3">
                                        <Input value={settings.about_misi_3 || ''} onChange={(e) => handleChange('about_misi_3', e.target.value)} />
                                    </FieldGroup>
                                    <FieldGroup label="Misi 4">
                                        <Input value={settings.about_misi_4 || ''} onChange={(e) => handleChange('about_misi_4', e.target.value)} />
                                    </FieldGroup>
                                    <FieldGroup label="Misi 5">
                                        <Input value={settings.about_misi_5 || ''} onChange={(e) => handleChange('about_misi_5', e.target.value)} />
                                    </FieldGroup>
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabContent>

                {/* ═══ Tab: Media Sosial ═══ */}
                <TabContent value="social">
                    <Card>
                        <div className="p-6">
                            <h5 className="font-bold mb-1">Media Sosial</h5>
                            <p className="text-sm text-gray-500 mb-6">Link akun media sosial yang tampil di footer dan halaman kontak.</p>
                            <div className="flex flex-col gap-4">
                                <FieldGroup label="Instagram">
                                    <Input placeholder="https://instagram.com/..." value={settings.site_instagram || ''} onChange={(e) => handleChange('site_instagram', e.target.value)} />
                                </FieldGroup>
                                <FieldGroup label="Facebook">
                                    <Input placeholder="https://facebook.com/..." value={settings.site_facebook || ''} onChange={(e) => handleChange('site_facebook', e.target.value)} />
                                </FieldGroup>
                                <FieldGroup label="YouTube">
                                    <Input placeholder="https://youtube.com/..." value={settings.site_youtube || ''} onChange={(e) => handleChange('site_youtube', e.target.value)} />
                                </FieldGroup>
                            </div>
                        </div>
                    </Card>
                </TabContent>

                {/* ═══ Tab: Rekening Bank ═══ */}
                <TabContent value="bank">
                    <Card>
                        <div className="p-6">
                            <h5 className="font-bold mb-1">Rekening Bank</h5>
                            <p className="text-sm text-gray-500 mb-6">Informasi rekening yang ditampilkan setelah donatur berdonasi.</p>
                            <div className="flex flex-col gap-4">
                                <FieldGroup label="Nama Bank">
                                    <Input value={settings.bank_name || ''} onChange={(e) => handleChange('bank_name', e.target.value)} />
                                </FieldGroup>
                                <FieldGroup label="Nomor Rekening">
                                    <Input value={settings.bank_account || ''} onChange={(e) => handleChange('bank_account', e.target.value)} />
                                </FieldGroup>
                                <FieldGroup label="Atas Nama">
                                    <Input value={settings.bank_holder || ''} onChange={(e) => handleChange('bank_holder', e.target.value)} />
                                </FieldGroup>
                            </div>
                        </div>
                    </Card>
                </TabContent>
            </Tabs>

            <div className="flex justify-end">
                <Button variant="solid" icon={<PiFloppyDiskDuotone />} loading={saving} onClick={handleSave}>Simpan Semua Pengaturan</Button>
            </div>
        </div>
    )
}

export default SettingsPage
