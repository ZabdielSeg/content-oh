import { useEffect, useState } from "react";
import { getOrderItems, deleteOrder } from "../api/service";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";

function OrderDetail() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchItems() {
      const data = await getOrderItems(id);
      setItems(data);
    }
    fetchItems();
  }, [id]);

  const handleDelete = async () => {
    const { ok } = await deleteOrder(id);
    if (ok) {
      navigate("/orders");
    }
  };

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Detalles de la Orden #{id} (Productos)
      </Typography>

      <List>
        {items.map(({ id, product_name, quantity, price }) => (
          <ListItem
            key={id}
            sx={{
              mb: 2,
              border: "1px solid #ccc",
              borderRadius: 1,
              padding: 2,
            }}
          >
            <ListItemText
              primary={`Nombre: ${product_name}`}
              secondary={`Cantidad: ${quantity} - Precio: $${price}`}
            />
          </ListItem>
        ))}
      </List>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(`/edit-order/${id}`)}
        sx={{ mr: 2 }}
      >
        Editar Orden
      </Button>
      <Button variant="contained" color="secondary" onClick={handleDelete}>
        Eliminar Orden
      </Button>
    </div>
  );
}

export default OrderDetail;
