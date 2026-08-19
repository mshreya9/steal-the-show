import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

export default function AuthPromptModal() {
  const { authPromptOpen, closeAuthPrompt } = useAuth()
  const navigate = useNavigate()

  return (
    <Modal open={authPromptOpen} onClose={closeAuthPrompt} title="Login required">
      <p className="text-sm text-grey-DEFAULT">Please login to continue.</p>
      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <Button
          fullWidth
          onClick={() => {
            closeAuthPrompt()
            navigate('/login')
          }}
        >
          Login
        </Button>
        <Button variant="secondary" fullWidth onClick={closeAuthPrompt}>
          Cancel
        </Button>
      </div>
    </Modal>
  )
}
