import React from 'react'

interface LogoProps {
    className?: string
    size?: 'sm' | 'md' | 'lg'
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }): JSX.Element => {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-10 h-10'
    }

    return (
        <svg
            className={`${sizeClasses[size]} ${className}`}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            {/* N_ logo design */}
            <path
                d="M6 6V26H10V14.5L18 22.5V26H22V6H18V17.5L10 9.5V6H6Z"
                fill="currentColor"
            />
            <rect
                x="24"
                y="22"
                width="6"
                height="4"
                fill="currentColor"
            />
            {/* Subtle glow effect */}
            <path
                d="M6 6V26H10V14.5L18 22.5V26H22V6H18V17.5L10 9.5V6H6Z"
                fill="url(#logoGlow)"
                opacity="0.3"
            />
            <defs>
                <linearGradient id="logoGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
            </defs>
        </svg>
    )
}

export default Logo
