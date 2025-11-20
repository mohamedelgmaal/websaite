import { Star, StarHalf, StarOff } from "lucide-react" // Import icons

const Rating = ({ value, text, color = "#f8e825" }) => {
  return (
    <div className="flex items-center">
      <span className="flex">
        {[1, 2, 3, 4, 5].map((index) => (
          <span key={index} className="mr-1">
            {value >= index ? (
              <Star size={18} fill={color} stroke={color} />
            ) : value >= index - 0.5 ? (
              <StarHalf size={18} fill={color} stroke={color} />
            ) : (
              <StarOff size={18} color={color} />
            )}
          </span>
        ))}
      </span>
      <span className="ml-2 text-gray-600 text-sm">{text && text}</span>
    </div>
  )
}

export default Rating
