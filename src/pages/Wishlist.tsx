import { Navigate } from "react-router-dom"
import PageHeader from "../components/PageHeader"

interface IProps {
  isAuthenticated: boolean
}

const Wishlist = ({ isAuthenticated }: IProps) => {

  if (!isAuthenticated) return <Navigate to="/" replace />

  return (
    <div>
      <PageHeader title="Wishlist" />
    </div>
  )
}

export default Wishlist
