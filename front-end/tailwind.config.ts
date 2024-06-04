import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
    content: [
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                roboto: ['var(--font-roboto)'],
            },
            height: {
                'full-height': 'calc(var(--vh) * 100)',
            },
            colors: {
                primary: 'var(--md-sys-color-primary)',
                onPrimary: 'var(--md-sys-color-on-primary)',
                primaryContainer: 'var(--md-sys-color-primary-container)',
                onPrimaryContainer: 'var(--md-sys-color-on-primary-container)',
                primaryFixed: 'var(--md-sys-color-primary-fixed)',
                onPrimaryFixed: 'var(--md-sys-color-on-primary-fixed)',
                primaryFixedDim: 'var(--md-sys-color-primary-fixed-dim)',
                onPrimaryFixedVariant: 'var(--md-sys-color-on-primary-fixed-variant)',
                secondary: 'var(--md-sys-color-secondary)',
                onSecondary: 'var(--md-sys-color-on-secondary)',
                secondaryContainer: 'var(--md-sys-color-secondary-container)',
                onSecondaryContainer: 'var(--md-sys-color-on-secondary-container)',
                secondaryFixed: 'var(--md-sys-color-secondary-fixed)',
                onSecondaryFixed: 'var(--md-sys-color-on-secondary-fixed)',
                secondaryFixedDim: 'var(--md-sys-color-secondary-fixed-dim)',
                onSecondaryFixedVariant: 'var(--md-sys-color-on-secondary-fixed-variant)',
                tertiary: 'var(--md-sys-color-tertiary)',
                onTertiary: 'var(--md-sys-color-on-tertiary)',
                tertiaryContainer: 'var(--md-sys-color-tertiary-container)',
                onTertiaryContainer: 'var(--md-sys-color-on-tertiary-container)',
                tertiaryFixed: 'var(--md-sys-color-tertiary-fixed)',
                onTertiaryFixed: 'var(--md-sys-color-on-tertiary-fixed)',
                tertiaryFixedDim: 'var(--md-sys-color-tertiary-fixed-dim)',
                onTertiaryFixedVariant: 'var(--md-sys-color-on-tertiary-fixed-variant)',
                error: 'var(--md-sys-color-error)',
                onError: 'var(--md-sys-color-on-error)',
                errorContainer: 'var(--md-sys-color-error-container)',
                onErrorContainer: 'var(--md-sys-color-on-error-container)',
                outline: 'var(--md-sys-color-outline)',
                surface: 'var(--md-sys-color-surface)',
                onSurface: 'var(--md-sys-color-on-surface)',
                onSurfaceVariant: 'var(--md-sys-color-on-surface-variant)',
                inverseSurface: 'var(--md-sys-color-inverse-surface)',
                inverseOnSurface: 'var(--md-sys-color-inverse-on-surface)',
                inversePrimary: 'var(--md-sys-color-inverse-primary)',
                shadow: 'var(--md-sys-color-shadow)',
                outlineVariant: 'var(--md-sys-color-outline-variant)',
                scrim: 'var(--md-sys-color-scrim)',
                surfaceContainerHighest: 'var(--md-sys-color-surface-container-highest)',
                surfaceContainerHigh: 'var(--md-sys-color-surface-container-high)',
                surfaceContainer: 'var(--md-sys-color-surface-container)',
                surfaceContainerLow: 'var(--md-sys-color-surface-container-low)',
                surfaceContainerLowest: 'var(--md-sys-color-surface-container-lowest)',
                surfaceBright: 'var(--md-sys-color-surface-bright)',
                surfaceDim: 'var(--md-sys-color-surface-dim)',
            },
            animation: {
                fadeIn: 'fade 0.5s ease forwards',
                bottomUp: 'bottomUp 0.2s ease-out forwards',
                bottomDown: 'bottomDown 0.2s ease-in forwards',
                slideInLeft: 'slieInLeft 0.25s ease-out forwards',
                slideOutRight: 'slideOutRight 0.25s ease-in forwards',
            },
            keyframes: {
                fade: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                bottomUp: {
                    '0%': { bottom: '-20%', opacity: '0' },
                    '100%': { bottom: '0', opacity: '1' },
                },
                bottomDown: {
                    '0%': { bottom: '0rem', opacity: '1' },
                    '100%': { bottom: '-20%', opacity: '0' },
                },
                slieInLeft: {
                    '0%': { left: '100%', opacity: '0.7' },
                    '100%': { left: '50%', opacity: '1' },
                },
                slideOutRight: {
                    '0%': { left: '50%', opacity: '1' },
                    '100%': { left: '100%', opacity: '0.7' },
                },
            },
        },
    },
    darkMode: 'class',
    plugins: [nextui()],
};
export default config;
