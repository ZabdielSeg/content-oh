import { pool } from "../database/dbConnection.js";

export const getOrders = async (req, res) => {
  try {
    const [orders] = await pool.query("SELECT * FROM orders");

    if (!orders.length)
      return res.status(200).json({ message: "No existen registros" });

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener órdenes", error });
  }
};

export const getOrderItemsById = async (req, res) => {
  const orderId = req.params.id;
  try {
    const [items] = await pool.query(
      "SELECT * FROM order_items WHERE order_id = ?",
      [orderId]
    );
    return res.json(items);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener los productos", error });
  }
};

export const createNewOrder = async (req, res) => {
  const { customer_name, order_date, total_amount, items } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      "INSERT INTO orders (customer_name, order_date, total_amount) VALUES (?, ?, ?)",
      [customer_name, order_date, total_amount]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await connection.query(
        "INSERT INTO order_items (order_id, product_name, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.product_name, item.quantity, item.price]
      );
    }

    await connection.commit();
    return res
      .status(201)
      .json({ message: "Orden creada exitosamente", orderId });
  } catch (error) {
    await connection.rollback();
    return res.status(500).json({ message: "Error al crear la orden", error });
  } finally {
    connection.release();
  }
};

export const editOrder = async (req, res) => {
  const orderId = req.params.id;
  const { customer_name, order_date, total_amount, items } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      "UPDATE orders SET customer_name = ?, order_date = ?, total_amount = ? WHERE id = ?",
      [customer_name, order_date, total_amount, orderId]
    );

    for (const item of items) {
      if (item.id) {
        await connection.query(
          "UPDATE order_items SET product_name = ?, quantity = ?, price = ? WHERE id = ?",
          [item.product_name, item.quantity, item.price, item.id]
        );
      } else {
        await connection.query(
          "INSERT INTO order_items (order_id, product_name, quantity, price) VALUES (?, ?, ?, ?)",
          [orderId, item.product_name, item.quantity, item.price]
        );
      }
    }

    await connection.commit();
    connection.release();

    return res.json({ message: "Orden actualizada exitosamente" });
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    return res
      .status(500)
      .json({ message: "Error al actualizar la orden", error });
  }
};

export const deleteOrder = async (req, res) => {
  const orderId = req.params.id;

  try {
    await pool.query("DELETE FROM orders WHERE id = ?", [orderId]);
    return res.json({ message: "Orden eliminada exitosamente", ok: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al eliminar la orden", error });
  }
};
