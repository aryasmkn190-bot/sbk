'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PiHandHeartDuotone, PiHeartDuotone, PiListDuotone, PiXDuotone, PiArrowRightDuotone, PiHouseDuotone, PiHandbagDuotone, PiNewspaperDuotone, PiInfoDuotone, PiEnvelopeSimpleDuotone, PiSignInDuotone } from 'react-icons/pi'

type NavVariant = 'transparent' | 'solid'

const navLinks = [
    { label: 'Beranda', href: '/landing', icon: <PiHouseDuotone /> },
    { label: 'Campaign', href: '/campaigns', icon: <PiHandbagDuotone /> },
    { label: 'Berita', href: '/berita', icon: <PiNewspaperDuotone /> },
    { label: 'Tentang', href: '/tentang', icon: <PiInfoDuotone /> },
    { label: 'Kontak', href: '/kontak', icon: <PiEnvelopeSimpleDuotone /> },
]

interface PublicNavbarProps {
    variant?: NavVariant
}

const PublicNavbar = ({ variant = 'solid' }: PublicNavbarProps) => {
    const pathname = usePathname()
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false)
    }, [pathname])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [mobileOpen])

    const isTransparent = variant === 'transparent'
    const showSolid = !isTransparent || scrolled

    const isActive = (href: string) => {
        if (href === '/landing') return pathname === '/landing' || pathname === '/'
        return pathname?.startsWith(href)
    }

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${showSolid
                    ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-lg shadow-black/[0.04]'
                    : 'bg-transparent'
                }`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-[68px]">
                        {/* Logo */}
                        <Link href="/landing" className="flex items-center gap-2.5 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow">
                                <PiHandHeartDuotone className="text-white text-xl" />
                            </div>
                            <div className="leading-tight">
                                <span className={`font-extrabold text-sm block tracking-tight ${showSolid ? 'text-gray-900 dark:text-white' : 'text-white'}`}>Saling Bantu</span>
                                <span className={`font-bold text-[11px] block -mt-0.5 tracking-wider uppercase ${showSolid ? 'text-emerald-600' : 'text-emerald-300'}`}>Kreasi</span>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center">
                            <div className={`flex items-center gap-1 p-1.5 rounded-2xl ${showSolid ? 'bg-gray-100/80 dark:bg-gray-800/80' : 'bg-white/[0.08] backdrop-blur-md'}`}>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive(link.href)
                                                ? showSolid
                                                    ? 'bg-white dark:bg-gray-700 text-emerald-600 shadow-sm'
                                                    : 'bg-white/20 text-white'
                                                : showSolid
                                                    ? 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white/60 dark:hover:bg-gray-700/60'
                                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2.5">
                            <Link href="/sign-in" className={`hidden sm:inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl transition-all ${showSolid
                                    ? 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 dark:text-gray-400 dark:hover:text-emerald-400 dark:hover:bg-emerald-900/20'
                                    : 'text-white/80 hover:text-white hover:bg-white/10'
                                }`}>
                                <PiSignInDuotone />
                                Masuk
                            </Link>
                            <Link href="/campaigns">
                                <button className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0">
                                    <PiHeartDuotone />
                                    Donasi
                                </button>
                            </Link>

                            {/* Mobile Hamburger */}
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className={`lg:hidden relative w-10 h-10 rounded-xl flex items-center justify-center transition-all ${showSolid
                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                                aria-label="Toggle menu"
                            >
                                <PiListDuotone className={`text-xl absolute transition-all duration-300 ${mobileOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`} />
                                <PiXDuotone className={`text-xl absolute transition-all duration-300 ${mobileOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setMobileOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <div className={`fixed top-0 right-0 z-50 h-full w-[300px] max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden ${mobileOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className="flex flex-col h-full">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                                <PiHandHeartDuotone className="text-white text-lg" />
                            </div>
                            <span className="font-bold text-sm text-gray-900 dark:text-white">SBK</span>
                        </div>
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <PiXDuotone className="text-lg" />
                        </button>
                    </div>

                    {/* Mobile Nav Links */}
                    <div className="flex-1 py-4 px-3 overflow-y-auto">
                        <div className="flex flex-col gap-1">
                            {navLinks.map((link, i) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(link.href)
                                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                    style={{ animationDelay: `${i * 50}ms` }}
                                >
                                    <span className={`text-lg ${isActive(link.href) ? 'text-emerald-500' : 'text-gray-400'}`}>{link.icon}</span>
                                    {link.label}
                                    {isActive(link.href) && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    )}
                                </Link>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-800 my-4" />

                        <Link
                            href="/sign-in"
                            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <PiSignInDuotone className="text-lg text-gray-400" />
                            Masuk Admin
                        </Link>
                    </div>

                    {/* Mobile Bottom CTA */}
                    <div className="p-5 border-t border-gray-100 dark:border-gray-800">
                        <Link href="/campaigns" className="block">
                            <button className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98]">
                                <PiHeartDuotone className="text-lg" />
                                Donasi Sekarang
                                <PiArrowRightDuotone />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PublicNavbar
