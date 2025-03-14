import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      const response = await api.get(`/cart/${user.username}`);
      const formattedCart = response.data.map(item => ({
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

  const addToCart = async (productId, quantityChange = 1) => {
    try {
      await api.post("/cart/add", null, { params: { productId, requestedQuantity: quantityChange } });
      fetchCart(); 
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const userId = JSON.parse(localStorage.getItem("user")).username;
      
      setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
      setCartCount(prevCount => prevCount - 1);

      await api.delete(`/cart/remove`, { params: { userId, productId } });

      setTimeout(fetchCart, 500);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, cartCount, addToCart, removeFromCart, fetchCart }}>
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
