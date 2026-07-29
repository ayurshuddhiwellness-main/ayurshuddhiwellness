'use client'

import { RevealGroup, RevealItem } from '../ui/Reveal'
import { PROFILE, initialsOf } from '../../lib/profile-mock'

export default function ProfileHeader() {
  return (
    <section className="bg-background px-6 pb-16 pt-32 lg:px-12 lg:pb-20">
      <RevealGroup className="mx-auto max-w-content">
        <RevealItem>
          <p className="mb-6 font-sans text-sm uppercase tracking-[0.25em] text-primary">
            Your Account
          </p>
        </RevealItem>

        <RevealItem>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            <span
              aria-hidden="true"
              className="flex h-20 w-20 shrink-0 select-none items-center justify-center rounded-full bg-primary font-serif text-2xl text-white"
            >
              {initialsOf(PROFILE.name)}
            </span>

            <div>
              <h1 className="font-serif text-4xl font-normal leading-tight text-foreground md:text-5xl">
                {PROFILE.name}
              </h1>
              <p className="mt-2 font-sans text-base text-muted">
                {PROFILE.email}
              </p>
            </div>
          </div>
        </RevealItem>
      </RevealGroup>
    </section>
  )
}
