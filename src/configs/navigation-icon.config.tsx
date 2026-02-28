import {
    PiHouseLineDuotone,
    PiHandHeartDuotone,
    PiListChecksDuotone,
    PiPlusCircleDuotone,
    PiCurrencyCircleDollarDuotone,
    PiNewspaperDuotone,
    PiPenNibDuotone,
    PiUsersThreeDuotone,
    PiEnvelopeSimpleDuotone,
    PiGearSixDuotone,
    PiArticleDuotone,
    PiShieldCheckDuotone,
    PiMegaphoneSimpleDuotone,
} from 'react-icons/pi'
import type { JSX } from 'react'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    dashboard: <PiHouseLineDuotone />,
    campaign: <PiHandHeartDuotone />,
    campaignList: <PiListChecksDuotone />,
    campaignCreate: <PiPlusCircleDuotone />,
    donasi: <PiCurrencyCircleDollarDuotone />,
    content: <PiArticleDuotone />,
    berita: <PiNewspaperDuotone />,
    beritaCreate: <PiPenNibDuotone />,
    admin: <PiShieldCheckDuotone />,
    users: <PiUsersThreeDuotone />,
    kontak: <PiEnvelopeSimpleDuotone />,
    settings: <PiGearSixDuotone />,
}

export default navigationIcon
