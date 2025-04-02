import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Lấy giỏ hàng từ API
  const fetchCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;
  
      const response = await api.get(`/cart/${user.id}`);
      console.log("Dữ liệu response từ API cart:", response.data);
  
      // Nếu không phải mảng, gán mảng rỗng
      const items = Array.isArray(response.data) ? response.data : [];
  
      const formattedCart = items.map(item => ({
        ...item,
        price: Number(item.price) || 0,
        quantity: Number(item.requestedQuantity) || 0,
        imageUrl: item.imageUrl || "",
      }));
  
      setCartItems(formattedCart);
      setCartCount(formattedCart.length);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
    }
  };
  


  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (productId, quantityChange = 1) => {
    try {
        await api.post("/cart/add", null, { params: { productId, requestedQuantity: quantityChange } });
        fetchCart(); // Cập nhật giỏ hàng sau khi thêm
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    }
};

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = async (productId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      await api.delete(`/cart/remove`, { params: { userId: user.id, productId } });

      // Cập nhật lại giỏ hàng sau khi xóa
      setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
      setCartCount(prevCount => Math.max(0, prevCount - 1));

      setTimeout(fetchCart, 500); // Đợi một chút rồi cập nhật lại từ server
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchCart(); // Lấy giỏ hàng khi app khởi chạy
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, addToCart, removeFromCart, fetchCart, setCartItems, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart phải được sử dụng bên trong CartProvider");
  }
  return context;
};
