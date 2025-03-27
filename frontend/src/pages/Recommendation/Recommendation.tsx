import { useState, useEffect } from "react";
import "./Recommendation.css";

interface FoodItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const Recommendation: React.FC = () => {
  type Message = { text: string; sender: "user" | "bot" };
  
  const [messages, setMessages] = useState<Message[]>(() => {
    // Load messages from localStorage if available
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [foodLoading, setFoodLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
const FOOD_API_URL = import.meta.env.VITE_BACKEND_API_URL + "/api/menu/list";

  // Load food items on component mount
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await fetch(FOOD_API_URL);
        const data = await response.json();
        if (data.success) {
          setFoodItems(data.data);
          // Add introductory message with food items
          const introMessage = generateFoodIntroduction(data.data);
          setMessages(prev => [...prev, { text: introMessage, sender: "bot" }]);
        }
      } catch (error) {
        console.error("Error fetching food items:", error);
        setMessages(prev => [...prev, { 
          text: "Saya tidak dapat memuat menu saat ini, tetapi Anda masih dapat bertanya kepada saya!", 
          sender: "bot" 
        }]);
      } finally {
        setFoodLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const generateFoodIntroduction = (items: FoodItem[]): string => {
    const categories: Record<string, FoodItem[]> = {};
    
    // Group items by category
    items.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    });

    let intro = "Selamat datang di restoran kami! Berikut menu kami:\n\n";
    
    for (const [category, items] of Object.entries(categories)) {
      intro += `${category}:\n`;
      items.forEach(item => {
        intro += `- ${item.name}: ${item.description} (Rp. ${item.price})\n`;
      });
      intro += "\n";
    }

    intro += "Jangan ragu untuk bertanya kepada saya tentang hidangan apa pun atau memberikan rekomendasi!";
    return intro;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { text: input, sender: "user" };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Anda adalah seorang koki profesional dan asisten restoran. Berikut adalah menu kami: ${JSON.stringify(foodItems)}. 
                  Pengguna bertanya: ${input}. Tanggapi dengan cara yang ramah dan membantu. 
                  Jika mereka bertanya tentang item menu, gunakan informasi yang disediakan. 
                  Jaga jawaban tetap singkat (maksimal 1-2 paragraf).`
                }                
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      const botResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                         "Saya tidak yakin bagaimana menanggapinya. Bisakah Anda bertanya secara berbeda?";

      setMessages(prev => [...prev, { text: botResponse, sender: "bot" }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { 
        text: "Maaf, saya mengalami masalah dalam merespons. Silakan coba lagi nanti.", 
        sender: "bot" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="recommendation-container">
      <h1>Rekomendasi AI</h1>
      <p>
        Tanyakan tentang menu kami atau buat permintaan khusus...
      </p>
      
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text.split('\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        ))}
        {isLoading && (
          <div className="message bot">Ajukan pertanyaan Anda...</div>
        )}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanyakan tentang menu kami atau buat permintaan khusus..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          disabled={foodLoading}
        />
        <button onClick={sendMessage} disabled={isLoading || foodLoading}>
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </div>
    </div>

  );
};

export default Recommendation;