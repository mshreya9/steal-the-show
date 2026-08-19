import { useState } from 'react'
import { Pencil } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useAuth } from '../../context/AuthContext'
import { saveUserProfile } from '../../services/authService'

export default function Profile() {
  const { user, refreshProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [address, setAddress] = useState(user?.address ?? '')
  const [city, setCity] = useState(user?.city ?? '')
  const [state, setState] = useState(user?.state ?? '')
  const [pincode, setPincode] = useState(user?.pincode ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  if (!user) return null

  const startEdit = () => {
    setName(user.name)
    setEmail(user.email ?? '')
    setAddress(user.address ?? '')
    setCity(user.city ?? '')
    setState(user.state ?? '')
    setPincode(user.pincode ?? '')
    setError('')
    setEditing(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    const result = await saveUserProfile(user.uid, {
      name: name.trim(),
      email,
      mobile: user.mobile,
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode,
    })
    setSaving(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    await refreshProfile()
    setEditing(false)
  }

  return (
    <div className="container-shell max-w-lg py-10 sm:py-14">
      <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">My Profile</h1>
      <p className="mt-1 text-sm text-grey-DEFAULT">Your account details.</p>

      <div className="mt-8 rounded-2xl border border-grey-200 bg-white p-5 sm:p-6">
        {!editing ? (
          <>
            <dl className="flex flex-col gap-4">
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-grey">Name</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">{user.name || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-grey">Email</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">{user.email || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-grey">Mobile Number</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">+91 {user.mobile}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-grey">Delivery Address</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">
                  {user.address ? (
                    <>
                      {user.address}
                      <br />
                      {[user.city, user.state, user.pincode].filter(Boolean).join(', ')}
                    </>
                  ) : (
                    '—'
                  )}
                </dd>
              </div>
            </dl>
            <Button variant="secondary" size="sm" className="mt-6" onClick={startEdit}>
              <Pencil size={14} /> Edit Profile
            </Button>
          </>
        ) : (
          <div className="flex flex-col gap-4">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Home Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} />
              <Input label="State" value={state} onChange={(e) => setState(e.target.value)} />
            </div>
            <Input
              label="Pincode"
              type="tel"
              inputMode="numeric"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
            {error && (
              <p className="rounded-lg bg-coral-50 px-3 py-2 text-sm font-medium text-coral-700" role="alert">
                {error}
              </p>
            )}
            <div className="flex gap-2.5">
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setEditing(false)} disabled={saving}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
