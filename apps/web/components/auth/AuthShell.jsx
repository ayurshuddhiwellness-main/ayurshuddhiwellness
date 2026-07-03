// Centers the auth form on a full-height linen page.
export default function AuthShell({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8 md:p-16">
      {children}
    </div>
  )
}
