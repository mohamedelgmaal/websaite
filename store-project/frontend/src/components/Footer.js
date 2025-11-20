import { FaFacebookF, FaWhatsapp, FaInstagram } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        
        {/* حقوق الملكية */}
        <p className="mb-4 md:mb-0 text-sm">
          &copy; {new Date().getFullYear()} ProShop. All rights reserved.
        </p>

        {/* أيقونات التواصل */}
        <div className="flex space-x-4">
          <a 
            href="https://www.facebook.com/share/1951DWeaCp/" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Facebook"
            className="hover:text-gray-400"
          >
            <FaFacebookF size={24} />
          </a>
          <a 
            href="https://wa.me/201068466261"  
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="WhatsApp"
            className="hover:text-gray-400"
          >
            <FaWhatsapp size={24} />
          </a>
          <a 
            href="https://www.instagram.com/elpop_elmasry123?igsh=d29zNXY4dzEzZ3lu" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Instagram"
            className="hover:text-gray-400"
          >
            <FaInstagram size={24} />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer