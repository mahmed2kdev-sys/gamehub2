import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import { ThemeProvider, useTheme } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'
import * as React from 'react'

/* eslint-disable react-refresh/only-export-components -- hooks and components intentionally share the file */

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        gray: {
          50: { value: '#f9f9f9' },
          100: { value: '#ededed' },
          200: { value: '#d3d3d3' },
          300: { value: '#b3b3b3' },
          400: { value: '#a0a0a0' },
          500: { value: '#898989' },
          600: { value: '#6c6c6c' },
          700: { value: '#202020' },
          800: { value: '#121212' },
          900: { value: '#111' },
          950: { value: '#0a0a0a' },
        },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: '{colors.orange.500}' },
          contrast: { value: 'white' },
        },
        bg: {
          panel: { value: { _light: '{colors.white}', _dark: '{colors.gray.700}' } },
          muted: { value: { _light: '{colors.gray.100}', _dark: '{colors.gray.800}' } },
          emphasized: { value: { _light: '{colors.gray.200}', _dark: '{colors.gray.600}' } },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)

export type ColorModeProviderProps = ThemeProviderProps

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      defaultTheme="dark"
      {...props}
    />
  )
}

export type ColorMode = 'light' | 'dark'

export function useColorMode(): {
  colorMode: ColorMode
  setColorMode: (colorMode: ColorMode) => void
  toggleColorMode: () => void
} {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const toggleColorMode = React.useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])
  return {
    colorMode: theme as ColorMode,
    setColorMode: setTheme,
    toggleColorMode,
  }
}

export function useColorModeValue<T>(light: T, dark: T): T {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? dark : light
}
