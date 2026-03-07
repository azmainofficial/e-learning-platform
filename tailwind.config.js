import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                brand: {
                    cyan: '#00CDFF',
                    pink: '#E62176',
                    orange: '#F16550',
                    blue: '#0082C3',
                    yellow: '#FAB239',
                    navy: '#05192d',
                },
                cinematic: {
                    obsidian: {
                        DEFAULT: '#0a0a0b',
                        light: '#161618',
                        dark: '#000000',
                    },
                    gold: {
                        DEFAULT: '#d4af37',
                        light: '#f5d67b',
                        dark: '#9a7b0c',
                    },
                    silver: {
                        DEFAULT: '#c0c0c0',
                        light: '#e8e8e8',
                        dark: '#808080',
                    }
                },
                datacamp: {
                    navy: {
                        DEFAULT: '#05192d',
                        light: '#1c3044',
                        dark: '#030d1a',
                    },
                    green: {
                        DEFAULT: '#00C74E',
                        light: '#65FF8F',
                        dark: '#00a340',
                    },
                    purple: '#7933ff',
                    gray: {
                        50: '#f7f8f9',
                        100: '#eef0f2',
                        200: '#dde2e6',
                        300: '#bcc3c9',
                        400: '#94a0ab',
                        500: '#73818f',
                        600: '#4d5d6c',
                        700: '#344453',
                        800: '#1a2b3a',
                        900: '#05192d',
                    }
                }
            },
        },
    },

    plugins: [forms],
};
