import cookie from 'cookie'
import * as React from 'react'
import type { IncomingMessage } from 'http'
import type { AppProps, AppContext } from 'next/app'

// Module '"../node_modules/@react-keycloak/nextjs"' has no exported member 'ServerPersistors'.
// import { SSRKeycloakProvider, ServerPersistors } from '@react-keycloak/nextjs'

// Module '"../node_modules/@react-keycloak/ssr"' has no exported member 'ServerPersistors'.
// import { SSRKeycloakProvider, ServerPersistors } from '@react-keycloak/ssr'

import { SSRKeycloakProvider, Persistors } from '@react-keycloak/ssr'
import type { KeycloakCookies } from '@react-keycloak/nextjs'

const keycloakCfg = {
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM ?? '',
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL ?? '',
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? '',
}

interface InitialProps {
  cookies: KeycloakCookies
}

function MyApp({ Component, pageProps, cookies }: AppProps & InitialProps) {
  return (
    <SSRKeycloakProvider
      keycloakConfig={keycloakCfg}
      persistor={Persistors.SSRCookies(cookies)}
    >
      <Component {...pageProps} />
    </SSRKeycloakProvider>
  )
}

function parseCookies(req?: IncomingMessage) {
  if (!req || !req.headers) {
    return {}
  }
  return cookie.parse(req.headers.cookie || '')
}

MyApp.getInitialProps = async (context: AppContext) => {
  // Extract cookies from AppContext
  return {
    cookies: parseCookies(context?.ctx?.req),
  }
}

export default MyApp
