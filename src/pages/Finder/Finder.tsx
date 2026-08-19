import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { MapPin, Navigation, Phone, Scissors, Star } from 'lucide-react'
import { STITCHING_SERVICES } from '../../data/stitchingServices'
import { DEFAULT_CENTER, distanceKm } from '../../utils/geo'

// Leaflet's default marker icon paths break under bundlers (Vite included) since
// it expects them relative to the page, not the built asset graph — this is the
// standard fix: point the default icon at the bundler-resolved image URLs.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

type LocationState =
  | { status: 'locating' }
  | { status: 'granted'; center: [number, number] }
  | { status: 'fallback'; center: [number, number] }

export default function Finder() {
  const [location, setLocation] = useState<LocationState>({ status: 'locating' })

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ status: 'fallback', center: DEFAULT_CENTER })
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ status: 'granted', center: [pos.coords.latitude, pos.coords.longitude] }),
      () => setLocation({ status: 'fallback', center: DEFAULT_CENTER }),
      { timeout: 8000 },
    )
  }, [])

  const center = location.status === 'locating' ? DEFAULT_CENTER : location.center

  const services = useMemo(
    () =>
      STITCHING_SERVICES.map((s) => {
        const position: [number, number] = [center[0] + s.latOffset, center[1] + s.lngOffset]
        return { ...s, position, distance: distanceKm(center, position) }
      }).sort((a, b) => a.distance - b.distance),
    [center],
  )

  return (
    <div className="container-shell py-8">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-coral-600">
        <Scissors size={13} /> Good to have
      </p>
      <h1 className="mt-1 font-display text-3xl font-extrabold text-ink sm:text-4xl">Stitching Services Finder</h1>
      <p className="mt-2 max-w-2xl text-sm text-grey-DEFAULT">
        Need alterations, a resize, or a quick repair after your order arrives? Here are stitching and tailoring
        services near you.
      </p>

      {location.status === 'fallback' && (
        <p className="mt-4 rounded-lg bg-plum-50 px-3 py-2 text-xs font-medium text-plum-600">
          Couldn't access your location, so we're showing results around a default city. Allow location access and
          reload to see services near you instead.
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        <div className="h-[420px] overflow-hidden rounded-2xl border border-grey-200 sm:h-[520px]">
          {location.status === 'locating' ? (
            <div className="flex h-full w-full items-center justify-center bg-plum-50 text-sm text-grey">
              Finding your location…
            </div>
          ) : (
            <MapContainer center={center} zoom={13} scrollWheelZoom className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <CircleMarker center={center} radius={9} pathOptions={{ color: '#4B164C', fillColor: '#4B164C', fillOpacity: 0.9 }}>
                <Popup>{location.status === 'granted' ? 'You are here' : 'Default location'}</Popup>
              </CircleMarker>
              {services.map((s) => (
                <Marker key={s.id} position={s.position}>
                  <Popup>
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-xs">{s.specialty}</p>
                    <p className="text-xs">{s.distance.toFixed(1)} km away</p>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {services.map((s) => (
            <div key={s.id} className="rounded-2xl border border-grey-200 bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-ink">{s.name}</p>
                <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-ink">
                  <Star size={12} className="fill-amber-400 text-amber-400" /> {s.rating}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-grey">{s.specialty}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-grey-DEFAULT">
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-plum-400" /> {s.distance.toFixed(1)} km away
                </span>
                <span className="flex items-center gap-1">
                  <Phone size={12} className="text-plum-400" /> {s.phone}
                </span>
              </div>
              <a
                href={`https://www.openstreetmap.org/directions?to=${s.position[0]}%2C${s.position[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-plum hover:underline"
              >
                <Navigation size={12} /> Get directions
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
