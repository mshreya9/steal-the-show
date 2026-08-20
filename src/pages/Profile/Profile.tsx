import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Pencil, Scissors } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useAuth } from '../../context/AuthContext'
import { useOrders } from '../../context/OrderContext'
import { saveUserProfile } from '../../services/authService'
import { formatINR } from '../../utils/inventory'

export default function Profile() {
  const { user, refreshProfile } = useAuth()
  const { ordersForUser } = useOrders()
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

  const orders = ordersForUser(user.uid)

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

      <div className="mt-8 rounded-2xl border border-grey-200 bg-white p-5 sm:p-6">
        <h2 className="font-display text-xl font-bold text-ink">My Orders</h2>

        {orders.length === 0 ? (
          <p className="mt-3 text-sm text-grey-DEFAULT">You haven&apos;t placed any orders yet.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-xl border border-grey-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-grey">{order.id}</p>
                    <p className="mt-0.5 text-xs text-grey-DEFAULT">
                      {new Date(order.placedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-ink">{formatINR(order.total)}</p>
                </div>
                <div className="mt-3 flex flex-col gap-1.5 border-t border-grey-200 pt-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 text-sm">
                      <span className="flex items-center gap-1.5 text-ink">
                        <Package size={13} className="shrink-0 text-plum-400" />
                        {item.name}
                        <span className="text-xs text-grey">
                          ({item.mode === 'rent' ? 'Rent' : 'Buy'} · Size {item.size} · Qty {item.quantity})
                        </span>
                      </span>
                      <span className="shrink-0 font-semibold text-ink">
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <Link
          to="/finder"
          className="mt-5 flex items-center gap-2 rounded-xl border border-dashed border-grey-300 p-3 text-xs font-semibold text-grey-DEFAULT hover:border-plum hover:text-plum"
        >
          <Scissors size={14} className="shrink-0 text-plum-400" />
          Need alterations on an order? Find nearby stitching services.
        </Link>
      </div>
    </div>
  )
}
