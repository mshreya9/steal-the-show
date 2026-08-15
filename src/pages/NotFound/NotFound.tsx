import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'

export default function NotFound() {
  return (
    <div className="container-shell flex flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-6xl font-extrabold text-plum-200">404</p>
      <h1 className="mt-3 font-display text-2xl font-bold text-ink">This scene doesn't exist.</h1>
      <p className="mt-2 text-grey-DEFAULT">Let's get you back to something you'll love.</p>
      <Link to="/">
        <Button className="mt-6">Back to Home</Button>
      </Link>
    </div>
  )
}
