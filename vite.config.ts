import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode, command }) => {
  const tagId = loadEnv(mode, process.cwd(), 'VITE_').VITE_GOOGLE_TAG_ID;
  if (tagId && !/^G-[A-Z0-9]+$/.test(tagId))
    throw new Error('Invalid Google tag ID.');
  return {
    plugins: [
      {
        name: 'production-google-tag',
        transformIndexHtml() {
          if (command !== 'build' || !tagId) return [];
          return [
            {
              tag: 'script',
              attrs: {
                async: true,
                src: `https://www.googletagmanager.com/gtag/js?id=${tagId}`,
              },
              injectTo: 'head' as const,
            },
            {
              tag: 'script',
              children: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${tagId}');`,
              injectTo: 'head' as const,
            },
          ];
        },
      },
    ],
    base: './',
    server: { port: 5173, strictPort: true },
    preview: { port: 4173, strictPort: true },
  };
});
