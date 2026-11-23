import { Star, StarHalf } from "lucide-react"

const Rating = ({ value = 0, text, color = "#B58A45" }) => {
  const rating = Math.min(5, Math.max(0, Number(value) || 0))

  return (
    <div
      className="flex items-center gap-2"
      role="img"
      aria-label={`Rating: ${rating.toFixed(1)} out of 5`}
    >
      <span className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((index) => {
          const isFull = rating >= index
          const isHalf = !isFull && rating >= index - 0.5

          return (
            <span key={index}>
              {isFull ? (
                <Star
                  size={17}
                  fill={color}
                  stroke={color}
                  strokeWidth={1.5}
                />
              ) : isHalf ? (
                <StarHalf
                  size={17}
                  fill={color}
                  stroke={color}
                  strokeWidth={1.5}
                />
              ) : (
                <Star
                  size={17}
                  fill="none"
                  stroke="#C8BBA7"
                  strokeWidth={1.5}
                />
              )}
            </span>
          )
        })}
      </span>

      {text !== undefined && text !== null && text !== "" && (
        <span className="text-sm text-[#766956]">
          {text}
        </span>
      )}
    </div>
  )
}

export default Rating