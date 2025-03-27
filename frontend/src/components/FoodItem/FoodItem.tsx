import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

interface FoodItemProps {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

const FoodItem: React.FC<FoodItemProps> = ({ id, name, price, description, image }) => {
  // Cast StoreContext to handle the potential null or undefined case
  const context = useContext(StoreContext);
  const navigate = useNavigate();

  // Check if the context is null or undefined
  if (!context) {
    return <div>Error: StoreContext is not available!</div>;
  }

  const { cartItems, addToCart, removeFromCart, url } = context;

  const handleDetailClick = () => {
    navigate(`/detail/${id}`);
  };

  return (
    <div className="food-item" >
      <div className="food-item-img-container">
        <img src={url + "/images/" + image} alt="" className="food-item-image" />
        <img
            onClick={handleDetailClick} style={{ cursor: "pointer" }}
            className="detailMenu"
            src="https://img.icons8.com/?size=30&id=123415&format=png&color=000000"
            alt="Add to cart"
/>

        {!cartItems[id] ? (
          <img
            className="add"
  onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt=""
          /> 
        ) : (
          <div className="food-item-counter">
            <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="" />
            <p>{cartItems[id]}</p>
            <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="" />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">Rp. {price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
