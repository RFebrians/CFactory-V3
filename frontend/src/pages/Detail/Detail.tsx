import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./Detail.css";
import { assets } from "../../assets/frontend_assets/assets"; // Assuming the assets are correctly imported

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [foodItem, setFoodItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const url = import.meta.env.VITE_BACKEND_API_URL;

  // Ensure that the StoreContext is properly typed and available
  const { cartItems = {}, addToCart, removeFromCart } = useContext(StoreContext) || {};

  useEffect(() => {
    const fetchFoodDetail = async () => {
      if (!id) {
        console.error("ID is undefined or not provided");
        return;
      }

      try {
        const response = await fetch(`${url}/api/menu/${id}`);
        const data = await response.json();
        if (data.success) {
          setFoodItem(data.data);
        } else {
          console.error("Error fetching food details:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetail();
  }, [id, url]);

  if (loading) return <p>Loading...</p>;
  if (!foodItem) return <p>Food item not found!</p>;

  return (
    <div className="detail-container">
      <div className="detail-card">
        {/* Left Image Section */}
        <div className="detail-image">
          <img src={`${url}/images/${foodItem.image}`} alt={foodItem.name} />
        </div>

        {/* Right Info Section */}
        <div className="detail-info">
          <h1>{foodItem.name}</h1>
          <p className="detail-price">Rp. {foodItem.price}</p>
          <p className="detail-description">{foodItem.description}</p>

          {/* Add to Cart Button or Counter */}
          {id && !cartItems?.[id] ? (
            <button
              className="add-to-cart"
              onClick={() => addToCart(id)} // Add item to cart
            >
              Add to Cart
            </button>
          ) : (
            <div className="food-item-counter">
              <img
                onClick={() => removeFromCart(id)} // Decrease item count
                src={assets.remove_icon_red}
                alt="Remove"
              />
              <p>{cartItems[id]}</p>
              <img
                onClick={() => addToCart(id)} // Increase item count
                src={assets.add_icon_green}
                alt="Add"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Detail;
