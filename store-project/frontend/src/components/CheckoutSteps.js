import { Link } from "react-router-dom"

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <nav className="mb-4">
      <ul className="flex justify-center space-x-4">
        <li>
          {step1 ? (
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          ) : (
            <span className="text-gray-400 cursor-not-allowed">Sign In</span>
          )}
        </li>
        <li>
          {step2 ? (
            <Link to="/shipping" className="text-blue-600 hover:underline">
              Shipping
            </Link>
          ) : (
            <span className="text-gray-400 cursor-not-allowed">Shipping</span>
          )}
        </li>
        <li>
          {step3 ? (
            <Link to="/payment" className="text-blue-600 hover:underline">
              Payment
            </Link>
          ) : (
            <span className="text-gray-400 cursor-not-allowed">Payment</span>
          )}
        </li>
        <li>
          {step4 ? (
            <Link to="/placeorder" className="text-blue-600 hover:underline">
              Place Order
            </Link>
          ) : (
            <span className="text-gray-400 cursor-not-allowed">Place Order</span>
          )}
        </li>
      </ul>
    </nav>
  )
}

export default CheckoutSteps
