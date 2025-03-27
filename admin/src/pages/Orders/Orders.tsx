import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import "./Orders.css";

type OrdersProps = {
  url: string;
};

type Order = {
  _id: string;
  items: { name: string; quantity: number }[];
  address: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
    phone: string;
  };
  amount: number;
  status: string;
};

const Orders = ({ url }: OrdersProps) => {
  const navigate = useNavigate();
  
  // Use context with proper type checking
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("StoreContext is not available");
  }

  const { token, admin } = store;
  
  // Use State with correct type
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchAllOrder = async () => {
    try {
      const response = await axios.get(url + "/api/order/list", {
        headers: { token },
      });

      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  const statusHandler = async (event: React.ChangeEvent<HTMLSelectElement>, orderId: string) => {
    try {
      const response = await axios.post(
        url + "/api/order/status",
        {
          orderId,
          status: event.target.value,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAllOrder();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  useEffect(() => {
    if (!admin && !token) {
      toast.error("Please Login First");
      navigate("/");
    } else {
      fetchAllOrder();
    }
  }, [admin, token]);

  return (
    <div className="order add">
    <h3>Order Page</h3>
    <div className="order-list">
      {orders.map((order) => (
        <div key={order._id} className="order-item">
          <img src={assets.parcel_icon} alt="Parcel Icon" className="order-item-img" />
          <div className="order-item-details">
            <p className="order-item-food">
              {order.items.map((item) => `${item.name} x ${item.quantity}`).join(", ")}
            </p>
            <p className="order-item-name">
              {order.address.firstName + " " + order.address.lastName}
            </p>
            <div className="order-item-address">
              <p>{order.address.street + ","}</p>
              <p>{`${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.zipcode}`}</p>
            </div>
            <p className="order-item-phone">{order.address.phone}</p>
          </div>
          <div className="order-item-footer">
            <p>Items: {order.items.length}</p>
            <p>Rp. {order.amount}</p>
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
            >
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  </div>
  

  );
};

export default Orders;
