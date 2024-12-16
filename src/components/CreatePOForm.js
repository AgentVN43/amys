// components/CreatePOForm.js
import React, { useEffect, useState } from "react";
import { Form, Input, Button, notification, Select } from "antd";
import axios from "axios";

const CreatePOForm = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([
    { product: "", quantity: "", price: "" },
  ]);
  const [warehouse, setWarehouse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://gold.annk.info/api/warehouses"); // Fetch data from the API
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json(); // Parse the JSON data
        setWarehouse(data); // Update the state with the fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the fetchData function
  }, []);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { product: "", quantity: "", price: "" }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        "https://gold.annk.info/api/purchaseorders",
        {
          ...values,
          items,
        }
      );
      notification.success({
        message: "Success",
        description: "Purchase order created successfully!",
      });
      form.resetFields();
      setItems([{ product: "", quantity: "", price: "" }]);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to create purchase order.",
      });
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="warehouseId"
        label="Warehouse"
        rules={[{ required: true, message: "Please select a warehouse" }]}
      >
        <Select>
          {warehouse?.map((item, index) => (
            <Select.Option key={item._id} value={item._id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {items.map((item, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <Form.Item
            label={`Product ${index + 1}`}
            style={{ display: "inline-block", width: "calc(33% - 10px)" }}
            required
          >
            <Input
              value={item.product}
              onChange={(e) =>
                handleItemChange(index, "product", e.target.value)
              }
              placeholder="Product Name"
            />
          </Form.Item>
          <Form.Item
            label="Quantity"
            style={{ display: "inline-block", width: "calc(33% - 10px)" }}
            required
          >
            <Input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
              placeholder="Quantity"
            />
          </Form.Item>
          <Form.Item
            label="Price"
            style={{ display: "inline-block", width: "calc(33% - 10px)" }}
            required
          >
            <Input
              type="number"
              value={item.price}
              onChange={(e) => handleItemChange(index, "price", e.target.value)}
              placeholder="Price"
            />
          </Form.Item>
          <Button onClick={() => handleRemoveItem(index)} danger>
            Remove
          </Button>
        </div>
      ))}
      <Button type="dashed" onClick={handleAddItem}>
        Add Item
      </Button>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Purchase Order
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreatePOForm;
