import { EditOutlined } from "@ant-design/icons";
import { Button, message, Modal, notification, Popconfirm, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ListPO() {
  const [listPO, setListPO] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPO, setEditingPO] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://gold.annk.info/api/purchaseorders"
        ); // Fetch data from the API
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json(); // Parse the JSON data
        setListPO(data); // Update the state with the fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the fetchData function
  }, []);

  const handleApprove = async (poId) => {
    try {
      const response = await axios.put(
        `https://gold.annk.info/api/purchaseorders/${poId}/approve`
      );
      notification.success({
        message: "Success",
        description: "Purchase order approved and items imported to warehouse!",
      });
      setListPO((prevState) =>
        prevState.map((po) =>
          po._id === poId ? { ...po, status: "approved" } : po
        )
      );
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to approve purchase order.",
      });
    }
  };

  // Function to show modal for editing
  const showEditModal = (poId) => {
    // Fetch data for the selected PO from the API
    axios
      .get(`/api/purchaseorders/${poId}`)
      .then((response) => {
        setEditingPO(response.data); // Set the PO data to the editing state
        setIsModalVisible(true); // Show the modal
      })
      .catch((error) => {
        message.error("Failed to fetch purchase order data.");
      });
  };

  // Function to handle modal close
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingPO(null);
  };

  // Function to delete a purchase order
  const handleDelete = (poId) => {
    // Call the API to delete the purchase order
    axios
      .delete(`https://gold.annk.info/api/purchaseorders/${poId}`)
      .then(() => {
        setListPO((prevState) => prevState.filter((po) => po._id !== poId));
        message.success("Purchase Order deleted successfully.");
      })
      .catch(() => message.error("Failed to delete Purchase Order."));
  };

  // Function to fetch purchase order data
  const fetchPurchaseOrder = (poId) => {
    axios
      .get(`https://gold.annk.info/api/purchaseorders/${poId}`)
      .then((response) => {
        // Handle the response data (e.g., show it in a modal)
        message.success(`Fetched PO details for ${poId}`);
      })
      .catch(() => message.error("Failed to fetch Purchase Order."));
  };

  // Define table columns
  const columns = [
    {
      title: "PO ID",
      dataIndex: "_id",
      key: "_id",
      render: (poId) => (
        <Button type="link" onClick={() => fetchPurchaseOrder(poId)}>
          {poId}
        </Button>
      ),
    },
    {
      title: "Warehouse",
      dataIndex: "warehouseId",
      key: "warehouseId",
      render: (warehouse) => warehouse.name,
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) =>
        record.status !== "approved" ? (
          <>
            <Button
              icon={<EditOutlined />}
              onClick={() => showEditModal(record._id)}
              type="primary"
              style={{ marginRight: 8 }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Are you sure to delete this purchase order?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="danger">Delete</Button>
            </Popconfirm>
          </>
        ) : (
          <span>Approved</span>
        ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={listPO}
        rowKey="_id"
        pagination={false}
      />

      {/* Modal for Editing PO */}
      <Modal
        title="Edit Purchase Order"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {editingPO && (
          <div>
            <p>Warehouse: {editingPO.warehouseId.name}</p>
            <p>Status: {editingPO.status}</p>
            <p>Total Amount: {editingPO.totalAmount}</p>
            {/* Add more fields as necessary */}
            {/* Form for editing PO */}
            <Button type="primary" onClick={handleCancel}>
              Save Changes
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}
