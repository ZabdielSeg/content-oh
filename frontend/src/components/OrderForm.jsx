import { useEffect, useState } from 'react';
import { createOrder, getOrderItems, updateOrder } from '../api/service';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';

function OrderForm() {
  const { id } = useParams();
  const [customerName, setCustomerName] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if(id) {
      async function fetchItems() {
        const data = await getOrderItems(id);
        setItems(data);
      }
      fetchItems();
    }
  }, [])

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([...items, { product_name: '', quantity: 1, price: 0 }]);
  };

  const calculateTotalAmount = () => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('pressed')
    const orderData = {
      customer_name: customerName,
      order_date: orderDate,
      total_amount: calculateTotalAmount(),
      items: items.map(item => ({
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price
      }))
    };

    if (id) {
      await updateOrder(id, orderData);
    } else {
      await createOrder(orderData);
    }

    navigate('/orders')
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h6" component="h1" gutterBottom>
        Crear / Editar Orden
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre del Cliente"
          variant="outlined"
          fullWidth
          margin="normal"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />

        <TextField
          label="Fecha de la Orden"
          type="date"
          variant="outlined"
          fullWidth
          margin="normal"
          value={orderDate}
          onChange={(e) => setOrderDate(e.target.value)}
          required
        />

        <Typography variant="h6" component="h3" gutterBottom>
          Productos
        </Typography>

        {items.map((item, index) => (
          <Box key={index} sx={{ mb: 2, display: 'flex', gap: 2 }}>
            <TextField
              label="Nombre del Producto"
              variant="outlined"
              fullWidth
              value={item.product_name}
              onChange={(e) => handleItemChange(index, 'product_name', e.target.value)}
              required
            />
            <TextField
              label="Cantidad"
              type="number"
              variant="outlined"
              fullWidth
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              min="1"
              required
            />
            <TextField
              label="Precio"
              type="number"
              variant="outlined"
              fullWidth
              value={item.price}
              onChange={(e) => handleItemChange(index, 'price', e.target.value)}
              step="0.01"
              required
            />
          </Box>
        ))}

        <Button
          variant="outlined"
          color="primary"
          onClick={handleAddItem}
          sx={{ mb: 2 }}
        >
          Añadir Producto
        </Button>

        <Typography variant="h6" component="h3" gutterBottom>
          Total: ${calculateTotalAmount()}
        </Typography>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Guardar Orden
        </Button>
      </form>
    </Box>
  );
}

export default OrderForm;
