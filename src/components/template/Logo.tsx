import classNames from 'classnames'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'
import { PiHandHeartDuotone } from 'react-icons/pi'

interface LogoProps extends CommonProps {
    type?: 'full' | 'streamline'
    mode?: 'light' | 'dark'
    imgClass?: string
    logoWidth?: number
    logoHeight?: number
}

const Logo = (props: LogoProps) => {
    const {
        type = 'full',
        mode = 'light',
        className,
        style,
    } = props

    return (
        <div className={classNames('logo flex items-center gap-2', className)} style={style}>
            <div className={classNames(
                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                'bg-primary'
            )}>
                <PiHandHeartDuotone className="text-white text-lg" />
            </div>
            {type === 'full' && (
                <span className={classNames(
                    'font-bold text-sm whitespace-nowrap leading-tight',
                    mode === 'dark' ? 'text-white' : 'text-gray-900 dark:text-white'
                )}>
                    {APP_NAME}
                </span>
            )}
        </div>
    )
}

export default Logo
