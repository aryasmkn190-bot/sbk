import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const protectedRoutes: Routes = {
    '/dashboard': {
        key: 'dashboard',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
            header: { title: 'Dashboard' },
        },
    },
    '/dashboard/campaigns': {
        key: 'campaigns',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
            header: { title: 'Manajemen Campaign' },
        },
    },
    '/dashboard/campaigns/create': {
        key: 'campaignCreate',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
            header: { title: 'Buat Campaign Baru' },
        },
    },
    '/dashboard/donasi': {
        key: 'donasi',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
            header: { title: 'Manajemen Donasi' },
        },
    },
    '/dashboard/berita': {
        key: 'berita',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
            header: { title: 'Manajemen Berita' },
        },
    },
    '/dashboard/berita/create': {
        key: 'beritaCreate',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
            header: { title: 'Tulis Berita Baru' },
        },
    },
    '/dashboard/users': {
        key: 'users',
        authority: ['admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
            header: { title: 'Manajemen User' },
        },
    },
    '/dashboard/kontak': {
        key: 'kontak',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
            header: { title: 'Pesan Masuk' },
        },
    },
    '/dashboard/settings': {
        key: 'settings',
        authority: ['admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
            header: { title: 'Pengaturan' },
        },
    },
}

export const publicRoutes: Routes = {
    '/landing': {
        key: 'landing',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    '/campaigns': {
        key: 'publicCampaigns',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    '/berita': {
        key: 'publicBerita',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    '/tentang': {
        key: 'tentang',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    '/kontak': {
        key: 'kontakPublic',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
}

export const authRoutes = authRoute
