import { useEffect, useState } from "react";
import { getOrders } from "../api/service";
import { Link } from "react-router-dom";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";

function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      const data = await getOrders();
      const refactorDate = data.map(obj => {
        const [realDate] = obj.order_date.split('T');
        return {
            ...obj,
            order_date: realDate
        }
      })
      setOrders(refactorDate);
    }
    fetchOrders();
  }, []);

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Esta es la página de órdenes
      </Typography>

      <List>
        {orders.map((order) => (
          <ListItem
            key={order.id}
            button
            component={Link}
            to={`/orders/${order.id}`}
            sx={{
              mb: 2,
              border: "1px solid #ccc",
              borderRadius: 1,
              padding: 2,
            }}
          >
            <ListItemText
              primary={<strong>{order.customer_name}</strong>}
              secondary={`Fecha: ${order.order_date} - Total: $${order.total_amount}`}
            />
          </ListItem>
        ))}
      </List>

      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/create-order"
        sx={{ mt: 3 }}
      >
        Crear nueva orden
      </Button>
    </div>
  );
}

export default OrderList;
