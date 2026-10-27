import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import StatePanel from '@/components/StatePanel'
import { buttonClass } from '@/utils/ui'

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
      <StatePanel
        icon={Compass}
        title="That page doesn't exist"
        description="The link may be out of date. Head back to the breed explorer to keep browsing."
        action={
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/breeds" className={buttonClass('primary', 'md')}>
              Explore breeds
            </Link>
            <Link to="/" className={buttonClass('outline', 'md')}>
              Back to home
            </Link>
          </div>
        }
      />
    </div>
  )
}
