import AuthShell from '../../components/auth/AuthShell'
import AuthForm from '../../components/auth/AuthForm'

export const metadata = {
  title: 'Create Account | AyurshuddhiWellness',
  description: 'Create your AyurshuddhiWellness account and begin your wellness journey.',
}

export default function SignupPage() {
  return (
    <AuthShell>
      <AuthForm mode="signup" />
    </AuthShell>
  )
}
