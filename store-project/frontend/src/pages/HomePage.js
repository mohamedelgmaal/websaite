"use client" // Add this directive if not already present, as GSAP will interact with the DOM

import { Link } from "react-router-dom"
import { useEffect, useRef } from "react" // New: Import useEffect and useRef
import { gsap } from "gsap" // New: Import GSAP

function HomePage() {
  const headingRef = useRef(null) // New: Ref for the heading
  const paragraphRef = useRef(null) // New: Ref for the paragraph
  const buttonRef = useRef(null) // New: Ref for the button

  useEffect(() => {
    // Animate the heading, paragraph, and button on page load
    gsap.fromTo(headingRef.current, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
    gsap.fromTo(
      paragraphRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" },
    )
    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8, delay: 0.6, ease: "back.out(1.7)" },
    )
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center">
      <h1 ref={headingRef} className="text-5xl font-bold text-gray-800 mb-4">
        Welcome to Our Store!
      </h1>
      <p ref={paragraphRef} className="text-xl text-gray-600 mb-8">
        Discover the latest products and best deals.
      </p>
      <Link
        ref={buttonRef}
        to="/products"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
      >
        Browse Products
      </Link>
    </div>
  )
}

export default HomePage
