import SiteShell from '../layout/SiteShell'

/* Centres the auth form in the shared shell.

   These two routes previously rendered no bar and no footer at all, which left
   no way back into the site. The min-height is deliberately not 100vh: the bar
   and the footer now take their own space above and below, so a full viewport
   here would push the footer off-screen on every load. */
export default function AuthShell({ children }) {
  return (
    <SiteShell mainClassName="flex min-h-[calc(100vh-16rem)] items-center justify-center px-6 py-20 md:py-28">
      {children}
    </SiteShell>
  )
}
