'use client'

import { RevealGroup, RevealItem } from '../ui/Reveal'
import SectionScrim from '../ui/SectionScrim'
import { EYEBROW, HEADING, BODY, PANEL, PANEL_BG } from '../ui/surfaces'
import { PROFILE, initialsOf } from '../../lib/profile-mock'

export default function ProfileHeader() {
  return (
    <section className="relative px-6 pb-16 pt-32 lg:px-12 lg:pb-20">
      <SectionScrim focus="left" />

      <RevealGroup className="relative z-10 mx-auto max-w-content">
        <RevealItem>
          <p className={`mb-6 ${EYEBROW}`}>Your Account</p>
        </RevealItem>

        <RevealItem>
          <div
            style={{ background: PANEL_BG }}
            className={`flex flex-col gap-6 ${PANEL} p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8`}
          >
            <span
              aria-hidden="true"
              className="flex h-20 w-20 shrink-0 select-none items-center justify-center rounded-full bg-primary font-serif text-2xl text-white ring-1 ring-white/25"
            >
              {initialsOf(PROFILE.name)}
            </span>

            <div>
              <h1 className={`${HEADING} text-4xl md:text-5xl`}>{PROFILE.name}</h1>
              <p className={`mt-2 ${BODY} text-base`}>{PROFILE.email}</p>
            </div>
          </div>
        </RevealItem>
      </RevealGroup>
    </section>
  )
}
