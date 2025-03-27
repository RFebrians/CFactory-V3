import axios from "axios";
import { createContext, useEffect, useState, ReactNode } from "react";
import { toast } from "react-toastify";
// All things connected into middleware here

interface FoodItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface BusinessInfo {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  googleMapEmbedUrl: string;
}

interface StoreContextType {
  food_list: FoodItem[];
  cartItems: Record<string, number>; // Mapping of item ID to quantity
  setCartItems: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  addToCart: (itemId: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  getTotalCartAmount: () => number;
  url: string;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  businessInfo: BusinessInfo | null;
}

export const StoreContext = createContext<StoreContextType | null>(null);

interface StoreContextProviderProps {
  children: ReactNode;
}

const StoreContextProvider: React.FC<StoreContextProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const url = import.meta.env.VITE_BACKEND_API_URL;
  const [token, setToken] = useState<string>("");
  const [food_list, setFoodList] = useState<FoodItem[]>([]);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);

  const addToCart = async (itemId: string) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));

    if (token) {
      const response = await axios.post(
        `${url}/api/cart/add`,
        { itemId },
        { headers: { token } }
      );
      response.data.success ? toast.success("Item added to cart") : toast.error("Something went wrong");
    }
  };

  const removeFromCart = async (itemId: string) => {
    setCartItems((prev) => ({ ...prev, [itemId]: Math.max((prev[itemId] || 0) - 1, 0) }));

    if (token) {
      const response = await axios.post(
        `${url}/api/cart/remove`,
        { itemId },
        { headers: { token } }
      );
      response.data.success ? toast.success("Item removed from cart") : toast.error("Something went wrong");
    }
  };

  const getTotalCartAmount = (): number => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(`${url}/api/menu/list`);
    response.data.success ? setFoodList(response.data.data) : alert("Error fetching products");
  };

  const loadCartData = async (token: string) => {
    const response = await axios.post(`${url}/api/cart/get`, {}, { headers: { token } });
    setCartItems(response.data.cartData || {});
  };

  const fetchBusinessInfo = async () => {
    try {
      const response = await axios.get(`${url}/api/business-info`);
      if (response.data.success) {
        setBusinessInfo(response.data.data);
      } else {
        console.error("Failed to fetch business info");
      }
    } catch (error) {
      console.error("Error fetching business info", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
      }
    };
    loadData();
    fetchBusinessInfo();
  }, []);

  const contextValue: StoreContextType = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    businessInfo
  };

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
};

export default StoreContextProvider;
