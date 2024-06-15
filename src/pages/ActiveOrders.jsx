import React, { useState, useEffect } from 'react';
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import SaleOrderForm from '../Components/SaleOrderForm';

const ActiveOrders = () => {
  // State variables
  const [orders, setOrders] = useState([]); // State for active orders
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [editOrder, setEditOrder] = useState(null); // State to track order being edited
  const [customers, setCustomers] = useState([]); // State for customers data

  // Fetch customers data on component mount
  useEffect(() => {
    // Dummy customers data (replace with actual fetch operation)
    const dummyCustomers = [
      { id: 11908, name: 'Aryan' },
      { id: 11909, name: 'Dinesh' },
      { id: 11910, name: 'Gita' },
      { id: 11911, name: 'Priya' },
      { id: 11912, name: 'Sourav' }
    ];
    setCustomers(dummyCustomers);
  }, []);
  
    // Fetch active orders data from localStorage on component mount
    useEffect(() => {
      const activeOrders = JSON.parse(localStorage.getItem('activeOrders')) || [];
      setOrders(activeOrders);
    }, []);

  // Function to open modal for adding a new order
  const handleAddOrder = () => {
    setEditOrder(null); // Reset editOrder state
    setIsModalOpen(true); // Open modal
  };

  // Function to open modal for editing an order
  const handleEditOrder = (order) => {
    setEditOrder(order); // Set order to be edited
    setIsModalOpen(true); // Open modal
  };

  // Function to handle form submission from SaleOrderForm
  const handleFormSubmit = (data) => {
    // Find customer based on customer_id from form data
    const customer = customers.find(c => c.id === data.customer_id);
    // Add customer_name to form data
    const orderWithCustomerName = { ...data, customer_name: customer.name };

    let updatedOrders;
    // Update orders based on whether it's an edit or addition
    if (editOrder) {
      // If editing, update the specific order
      updatedOrders = orders.map((order) => (order.id === editOrder.id ? orderWithCustomerName : order));
    } else {
      // If adding, append the new order to existing orders
      updatedOrders = [...orders, { ...orderWithCustomerName, id: orders.length + 1 }];
    }
    setOrders(updatedOrders);
    localStorage.setItem('activeOrders', JSON.stringify(updatedOrders)); // Store active orders in localStorage
    setIsModalOpen(false); // Close modal
  };

  // Function to mark an order as completed
  const handleMarkAsCompleted = (order) => {
    // Remove the completed order from active orders
    const updatedOrders = orders.filter((o) => o.id !== order.id);
    setOrders(updatedOrders);
    localStorage.setItem('activeOrders', JSON.stringify(updatedOrders)); // Update active orders in localStorage
    // Store completed orders in localStorage
    const completedOrders = JSON.parse(localStorage.getItem('completedOrders')) || [];
    completedOrders.push(order);
    localStorage.setItem('completedOrders', JSON.stringify(completedOrders));
  };

  // Render component
  return (
    <Box p="4" overflow="auto">
      {/* Button to add new order */}
      <Button colorScheme='teal' onClick={handleAddOrder}>Add Sell Product</Button>
      {/* Table to display active orders */}
      <Table mt="4">
        <Thead>
          <Tr>
            <Th>Invoice No</Th>
            <Th>Customer ID</Th>
            <Th>Customer Name</Th>
            <Th>Price</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {/* Render each order row */}
          {orders.map((order) => (
            <Tr key={order.id}>
              <Td>{order.invoice_no}</Td>
              <Td>{order.customer_id}</Td>
              <Td>{order.customer_name}</Td>
              <Td>{order.items[0].price}</Td>
              <Td>
                {/* Button to edit order */}
                <Button onClick={() => handleEditOrder(order)}>Edit</Button>
                {/* Button to mark order as completed */}
                <Button ml={2} onClick={() => handleMarkAsCompleted(order)}>Mark as Completed</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {/* SaleOrderForm component */}
      <SaleOrderForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        defaultValues={editOrder}
      />
    </Box>
  );
};

export default ActiveOrders;
