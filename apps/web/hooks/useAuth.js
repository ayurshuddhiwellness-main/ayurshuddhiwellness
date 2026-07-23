'use client'

import { useState, useEffect } from 'react'

// Client-side auth state.
//
// TEMPORARY: the Firebase client SDK is not wired up yet, so this returns a mock
// user after a short async delay (to mimic onAuthStateChanged resolving). The UI
// is fully reviewable now.
//
// To preview the signed-out auth gate, visit /book?auth=out
//
// SWAP-IN (one block) once `firebase` is installed and lib/firebase-client.js
// exports `auth`:
//   import { onAuthStateChanged } from 'firebase/auth'
//   import { auth } from '../lib/firebase-client'
//   useEffect(() => onAuthStateChanged(auth, (u) =>
//     setState({ loading: false, user: u })), [])
export function useAuth() {
  const [state, setState] = useState({ loading: true, user: null })

  useEffect(() => {
    const timer = setTimeout(() => {
      const signedOut =
        typeof window !== 'undefined' &&
        new URLSearchParams(window.location.search).get('auth') === 'out'

      setState({
        loading: false,
        user: signedOut
          ? null
          : { uid: 'mock-user', email: 'guest@ayurshuddhi.com', displayName: 'Guest' },
      })
    }, 600)

    return () => clearTimeout(timer)
  }, [])

  return state
}
