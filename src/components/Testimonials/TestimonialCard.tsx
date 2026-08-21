import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import Badge from '../ui/Badge'
import type { Testimonial } from '../../data/testimonials'

export default function TestimonialCard({ item }: { item: Testimonial }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  // Only play a clip once it's actually on screen, so the rail doesn't burn
  // bandwidth/CPU decoding every video at once.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.6 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className="group relative h-72 shrink-0 snap-start overflow-hidden rounded-2xl bg-ink shadow-card sm:h-80 lg:h-[420px]"
      style={{ aspectRatio: item.aspect }}
    >
      {item.type === 'photo' ? (
        <img src={item.src} alt={item.caption} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <>
          <video
            ref={videoRef}
            src={item.src}
            muted={muted}
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
          <button
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? 'Unmute video' : 'Mute video'}
            className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-ink/50 text-white backdrop-blur-sm hover:bg-ink/70"
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-3.5">
        <Badge tone="white" className="mb-1.5">
          {item.tag}
        </Badge>
        <p className="font-display text-base font-bold text-white drop-shadow-sm">{item.caption}</p>
      </div>
    </div>
  )
}
