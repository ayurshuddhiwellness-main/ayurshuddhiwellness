import AuthShell from '../../components/auth/AuthShell'
import AuthForm from '../../components/auth/AuthForm'

export const metadata = {
  title: 'Sign In | AyurshuddhiWellness',
  description: 'Sign in to continue your wellness journey with AyurshuddhiWellness.',
}

export default function LoginPage() {
  return (
    <AuthShell>
      <AuthForm mode="login" />
    </AuthShell>
  )
}
