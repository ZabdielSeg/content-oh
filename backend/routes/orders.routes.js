import { Router } from "express";
import { createNewOrder, deleteOrder, editOrder, getOrderItemsById, getOrders } from "../controllers/order.controller.js";

const router = Router();

router.get("/orders", getOrders);

router.get("/orders/:id/items", getOrderItemsById);

router.post("/orders", createNewOrder);

router.put("/orders/:id", editOrder);

router.delete("/orders/:id", deleteOrder);

export default router;
