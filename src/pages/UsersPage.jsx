import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Popconfirm,
} from "antd";
import { api } from "../api";

const genderOptions = [
  { label: "All", value: "All" },
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
];

export default function UsersPage() {
  const [form] = Form.useForm();
  const [rows, setRows] = useState([]);
  const [genderFilter, setGenderFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users", { params: { deleted: false } });
      setRows(res.data);
    } catch (e) {
      console.error(e);
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const data = useMemo(() => {
    if (genderFilter === "All") return rows;
    return rows.filter((u) => u.gender === genderFilter);
  }, [rows, genderFilter]);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const onConfirmDelete = async (record) => {
    try {
      setRows((prev) => prev.filter((u) => u.id !== record.id));
      await api.patch(`/users/${record.id}`, { deleted: true });
      message.success("User deleted");
    } catch (e) {
      console.error(e);
      message.error("Delete failed");
      fetchUsers();
    }
  };

  const submit = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      if (editing) {
        const { data: updated } = await api.patch(
          `/users/${editing.id}`,
          values
        );
        setRows((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        message.success("User updated");
      } else {
        const { data: created } = await api.post("/users", values);
        setRows((prev) => [created, ...prev]);
        message.success("User added");
      }

      setModalOpen(false);
      form.resetFields();
      setEditing(null);
    } catch (e) {
      if (e?.errorFields) return;
      console.error(e);
      message.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => openEdit(record)}>Edit</Button>
          <Popconfirm
            title="Soft delete this user?"
            description={`Mark "${record.name}" as deleted?`}
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => onConfirmDelete(record)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-4">
        <Space wrap>
          <Select
            value={genderFilter}
            onChange={setGenderFilter}
            options={genderOptions}
            style={{ width: 180 }}
          />
        </Space>

        <Button type="primary" onClick={openAdd}>
          Add User
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={editing ? "Edit User" : "Add User"}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onOk={submit}
        confirmLoading={saving}
        okText={editing ? "Save Changes" : "Create"}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Full name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="email@example.com" />
          </Form.Item>

          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select
              placeholder="Select gender"
              options={[{ value: "Male" }, { value: "Female" }]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
