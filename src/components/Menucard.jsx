import "../App.css";

const MenuCard = ({ image, price, name, description, discount = 0 }) => {
  // Calculate the discounted price
  const discountedPrice = price - (price * discount) / 100

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden w-full max-w-[450px] flash-shine ">
      <img src={image} alt={name} className="w-full h-60 object-cover " />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        <p className="text-gray-600 whitespace-pre-line mb-4">{description}</p>

        {discount > 0 ? (
          <div className="flex items-center gap-2">
            <p className="text-gray-500 line-through text-sm">${price.toFixed(2)}</p>
            <p className="text-green-600 font-semibold text-lg">
              ${discountedPrice.toFixed(2)} <span className="text-sm text-red-500">({discount}% off)</span>
            </p>
          </div>
        ) : (
          <p className="text-green-600 font-semibold text-lg">${price.toFixed(2)}</p>
        )}
      </div>
    </div>
  )
}

export default MenuCard
