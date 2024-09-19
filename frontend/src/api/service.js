import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const getOrders = async () => {
  const response = await axios.get(`${API_URL}/orders`);
  return response.data;
};

export const getOrderItems = async (orderId) => {
  const response = await axios.get(`${API_URL}/orders/${orderId}/items`);
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await axios.post(`${API_URL}/orders`, orderData);
  return response.data;
};

export const updateOrder = async (orderId, orderData) => {
  const response = await axios.put(`${API_URL}/orders/${orderId}`, orderData);
  return response.data;
};

export const deleteOrder = async (orderId) => {
  const response = await axios.delete(`${API_URL}/orders/${orderId}`);
  return response.data;
};
