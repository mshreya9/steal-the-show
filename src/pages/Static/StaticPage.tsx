import { useLocation } from 'react-router-dom'

const CONTENT: Record<string, { title: string; body: string[] }> = {
  '/legal/terms': {
    title: 'Terms of Use',
    body: [
      'This is a prototype build of STEAL THE SHOW. These Terms of Use are placeholder content for demonstration purposes only and do not constitute a binding agreement.',
      'By using this prototype you acknowledge that authentication, payments, inventory and order fulfilment are all mocked and no real transactions take place.',
    ],
  },
  '/legal/privacy': {
    title: 'Privacy Policy',
    body: [
      'This Privacy Policy is placeholder content for the STEAL THE SHOW prototype. No real personal data is collected, stored or transmitted by this build — all account and order data lives only in your browser.',
    ],
  },
  '/legal/rental-terms': {
    title: 'Rental Terms',
    body: [
      'Placeholder rental terms for the prototype. In the production product, this page would cover rental duration, late fees, damage policy and deposit handling.',
    ],
  },
  '/help/contact': {
    title: 'Contact Us',
    body: ['Reach the STEAL THE SHOW team at hello@stealtheshow.example (placeholder) for prototype feedback.'],
  },
  '/help/delivery': {
    title: 'Delivery Information',
    body: [
      'Most looks marked with the ⚡ 24-Hour badge can be delivered by tomorrow evening. Other looks typically arrive within 2 days.',
    ],
  },
  '/help/returns': {
    title: 'Returns',
    body: ['Bought items can be returned within 7 days in original condition. This is placeholder policy copy for the prototype.'],
  },
  '/help/rental-policy': {
    title: 'Rental Policy',
    body: ['Rented items are due back by the end of the rental period shown on the product page. Placeholder copy for the prototype.'],
  },
  '/help/cancellation': {
    title: 'Cancellation',
    body: ['Orders can be cancelled before dispatch. Placeholder copy for the prototype.'],
  },
  '/help/faqs': {
    title: 'FAQs',
    body: ['Frequently asked questions will live here. This is placeholder content for the prototype phase.'],
  },
  '/company/about': {
    title: 'About Us',
    body: [
      'STEAL THE SHOW is an event-fashion and costume platform helping people find the right look for any occasion — fast.',
    ],
  },
  '/company/careers': {
    title: 'Careers',
    body: ['We are not hiring through this prototype yet — check back once the product goes live.'],
  },
  '/company/partner': {
    title: 'Partner With Us',
    body: ['Interested in listing your costumes or outfits on STEAL THE SHOW? This is placeholder copy for the prototype.'],
  },
}

export default function StaticPage() {
  const { pathname } = useLocation()
  const entry = CONTENT[pathname] ?? { title: 'Coming Soon', body: ['This page is part of a future phase of STEAL THE SHOW.'] }

  return (
    <div className="container-shell max-w-2xl py-14">
      <h1 className="font-display text-3xl font-extrabold text-ink">{entry.title}</h1>
      <div className="mt-5 flex flex-col gap-4">
        {entry.body.map((p, i) => (
          <p key={i} className="text-sm leading-relaxed text-grey-DEFAULT">
            {p}
          </p>
        ))}
      </div>
    </div>
  )
}
