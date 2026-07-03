'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { EASE } from '../ui/motion'

const ERROR_COLOR = '#B85C5C'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Each block fades up independently with an incrementing delay (quick + quiet).
function Item({ delay, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

function Field({ id, label, type = 'text', value, onChange, error, autoComplete, adornment }) {
  return (
    <div>
      <label htmlFor={id} className="block font-sans text-sm text-foreground">
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={`w-full rounded-lg border bg-white px-4 py-3 font-sans text-sm text-foreground outline-none transition-colors duration-200 focus:ring-1 ${
            adornment ? 'pr-11' : ''
          } ${
            error
              ? 'border-[#B85C5C] focus:border-[#B85C5C] focus:ring-[#B85C5C]'
              : 'border-border focus:border-primary focus:ring-primary'
          }`}
        />
        {adornment}
      </div>
      {error && (
        <p className="mt-1.5 font-sans text-xs" style={{ color: ERROR_COLOR }}>
          {error}
        </p>
      )}
    </div>
  )
}

function EyeToggle({ shown, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={shown ? 'Hide password' : 'Show password'}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors duration-200 hover:text-foreground"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {shown ? (
          <>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <path d="M6.61 6.61A18.5 18.5 0 0 0 2 12s3 8 10 8a9.12 9.12 0 0 0 5.39-1.61" />
            <line x1="2" y1="2" x2="22" y2="22" />
          </>
        ) : (
          <>
            <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8z" />
            <circle cx="12" cy="12" r="3" />
          </>
        )}
      </svg>
    </button>
  )
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v3a5 5 0 0 0-5 5H4z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  )
}

export default function AuthForm({ mode = 'login' }) {
  const isSignup = mode === 'signup'
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const update = (key) => (e) =>
    setValues((v) => ({ ...v, [key]: e.target.value }))

  const validate = () => {
    const next = {}
    if (isSignup && !values.fullName.trim()) next.fullName = 'Please enter your name.'
    if (!values.email.trim()) next.email = 'Please enter your email.'
    else if (!EMAIL_RE.test(values.email)) next.email = 'Please enter a valid email address.'
    if (!values.password) next.password = 'Please enter your password.'
    else if (values.password.length < 6) next.password = 'Password must be at least 6 characters.'
    if (isSignup) {
      if (!values.confirmPassword) next.confirmPassword = 'Please confirm your password.'
      else if (values.confirmPassword !== values.password) next.confirmPassword = 'Passwords do not match.'
    }
    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return
    setLoading(true)
    // No real auth wiring yet — Firebase comes later.
    console.log('[auth] submit', mode, values)
    setTimeout(() => setLoading(false), 1200)
  }

  let row = 0
  const delay = () => 0.08 * row++

  return (
    <div className="w-full max-w-sm">
      <Item delay={delay()}>
        <Link href="/" className="font-serif text-xl font-semibold text-foreground">
          AyurshuddhiWellness
        </Link>
      </Item>

      <Item delay={delay()}>
        <h1 className="mt-8 font-serif text-2xl font-normal text-foreground">
          {isSignup ? 'Create your account' : 'Sign in to your account'}
        </h1>
      </Item>

      <Item delay={delay()}>
        <p className="mb-8 mt-2 font-sans text-sm text-muted">
          {isSignup ? 'Already have an account? ' : 'New here? '}
          <Link
            href={isSignup ? '/login' : '/signup'}
            className="text-primary transition-colors duration-200 hover:text-primary-hover"
          >
            {isSignup ? 'Sign in →' : 'Create an account →'}
          </Link>
        </p>
      </Item>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {isSignup && (
          <Item delay={delay()}>
            <Field
              id="fullName"
              label="Full name"
              value={values.fullName}
              onChange={update('fullName')}
              error={errors.fullName}
              autoComplete="name"
            />
          </Item>
        )}

        <Item delay={delay()}>
          <Field
            id="email"
            label="Email"
            type="email"
            value={values.email}
            onChange={update('email')}
            error={errors.email}
            autoComplete="email"
          />
        </Item>

        <Item delay={delay()}>
          <Field
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={update('password')}
            error={errors.password}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            adornment={
              <EyeToggle
                shown={showPassword}
                onToggle={() => setShowPassword((s) => !s)}
              />
            }
          />
          {!isSignup && (
            <div className="mt-1.5 text-right">
              <Link
                href="#"
                className="font-sans text-xs text-primary transition-colors duration-200 hover:text-primary-hover"
              >
                Forgot password?
              </Link>
            </div>
          )}
        </Item>

        {isSignup && (
          <Item delay={delay()}>
            <Field
              id="confirmPassword"
              label="Confirm password"
              type={showPassword ? 'text' : 'password'}
              value={values.confirmPassword}
              onChange={update('confirmPassword')}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />
          </Item>
        )}

        <Item delay={delay()}>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="flex w-full items-center justify-center rounded-full bg-primary py-3.5 font-sans text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-hover disabled:opacity-70"
          >
            {loading ? <Spinner /> : isSignup ? 'Create Account' : 'Sign In'}
          </motion.button>
        </Item>
      </form>

      {/* Divider */}
      <Item delay={delay()}>
        <div className="my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-border" />
          <span className="font-sans text-xs uppercase tracking-widest text-muted">Or</span>
          <span className="h-px flex-1 bg-border" />
        </div>
      </Item>

      {/* Google OAuth */}
      <Item delay={delay()}>
        <button
          type="button"
          onClick={() => console.log('[auth] continue with Google')}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-white py-3.5 font-sans text-sm font-medium text-foreground transition-colors duration-300 hover:bg-card"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </Item>

      {/* Small print */}
      <Item delay={delay()}>
        <p className="mt-8 text-center font-sans text-xs leading-relaxed text-muted">
          By continuing, you agree to our{' '}
          <Link href="#" className="text-primary transition-colors duration-200 hover:text-primary-hover">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="#" className="text-primary transition-colors duration-200 hover:text-primary-hover">
            Privacy Policy
          </Link>
          .
        </p>
      </Item>
    </div>
  )
}
