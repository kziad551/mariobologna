import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {vitePlugin as remix} from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    hydrogen(),
    oxygen(),
    remix({
      presets: [hydrogen.preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
  ssr: {
    optimizeDeps: {
      include: [
        'react-qr-code',
        'primereact/dropdown',
        'i18next',
        'react-i18next',
        '@react-google-maps/api',
        'react-countdown',
        'react-helmet-async',
      ],
    },
  },
  optimizeDeps: {
    include: [
      'clsx',
      '@headlessui/react',
      'react-intersection-observer',
      'react-use/esm/useScroll',
      'react-use/esm/useDebounce',
      'react-use/esm/useWindowScroll',
      'react-qr-code',
      'primereact/dropdown',
      'i18next',
      'react-i18next',
      '@react-google-maps/api',
      'react-countdown',
      'react-helmet-async',
    ],
  },
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
    sourcemap: 'hidden',
    rollupOptions: {
      output: {
        sourcemapExcludeSources: true,
      },
    },
  },
});
