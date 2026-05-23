import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

const baseUrl = process.env.EXPO_PUBLIC_BASE_URL ?? '/stickera';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#E85D4C" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Stickera" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="manifest" href={`${baseUrl}/manifest.webmanifest`} />
        <link rel="icon" href={`${baseUrl}/icon.svg`} type="image/svg+xml" />
        <link rel="apple-touch-icon" href={`${baseUrl}/icon-192.png`} />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
