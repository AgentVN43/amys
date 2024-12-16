// client/src/components/RawMaterialCRUD.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;

const RawMaterial = () => {
  const [materials, setMaterials] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [form] = Form.useForm();
  const fetchMaterials = async () => {
    const res = await axios.get('https://gold.annk.info/api/raw-materials');
    setMaterials(res.data);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleAdd = () => {
    setEditingMaterial(null);
    setIsModalVisible(true);
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://gold.annk.info/api/raw-materials/${id}`);
    fetchMaterials();
  };

  const handleFormSubmit = async (values) => {
    if (editingMaterial) {
      await axios.put(`https://gold.annk.info/api/raw-materials/${editingMaterial._id}`, values);
    } else {
      await axios.post('https://gold.annk.info/api/raw-materials', values);
    }
    setIsModalVisible(false);
    fetchMaterials();
  };

  const columns = [
    { title: 'Material Name', dataIndex: 'name', key: 'name' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Unit', dataIndex: 'unit', key: 'unit' },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record._id)} danger>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd}>Add Raw Material</Button>
      <Table columns={columns} dataSource={materials} rowKey="_id" />

      <Modal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
          form.validateFields().then((values) => {
            form.resetFields();
            handleFormSubmit(values);
          });
        }}
      >
        <Form
          layout="vertical"
          initialValues={editingMaterial || { unit: 'kg' }}
        >
          <Form.Item name="name" label="Material Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
            <Select>
              <Option value="kg">Kilogram</Option>
              <Option value="g">Gram</Option>
            </Select>
          </Form.Item>
          <Form.Item name="expiryDate" label="Expiry Date" rules={[{ required: true }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RawMaterial;
