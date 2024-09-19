import { Routes, Route } from 'react-router-dom';
import OrderList from './components/OrderList';
import OrderDetails from './components/OrderDetail';
import OrderForm from './components/OrderForm';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/orders" element={<OrderList />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/create-order" element={<OrderForm />} />
        <Route path="/edit-order/:id" element={<OrderForm />} />
      </Routes>
    </div>
  );
}

export default App;