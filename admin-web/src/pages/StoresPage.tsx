import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Store, MapPin, Phone, Clock } from 'lucide-react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import DataTable, { Column } from '../components/DataTable';
import FormModal, { FormField } from '../components/FormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Pagination from '../components/Pagination';
import { storesApi, Store as StoreType } from '../api/stores';

export default function StoresPage() {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreType | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Delete states
  const [deletingStore, setDeletingStore] = useState<StoreType | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchStores();
  }, [page]);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await storesApi.getList({ page, pageSize });
      setStores(response.data.list);
      setTotal(response.data.total);
    } catch (error) {
      console.error('获取门店失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    setFormLoading(true);
    try {
      if (editingStore) {
        await storesApi.update(editingStore.id, values as any);
      } else {
        await storesApi.create(values as any);
      }
      setShowForm(false);
      setEditingStore(null);
      fetchStores();
    } catch (error: any) {
      alert(error.message || '操作失败');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingStore) return;
    setDeleteLoading(true);
    try {
      await storesApi.delete(deletingStore.id);
      setDeletingStore(null);
      fetchStores();
    } catch (error: any) {
      alert(error.message || '删除失败');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formFields: FormField[] = [
    { name: 'name', label: '门店名称', type: 'text', required: true, placeholder: '请输入门店名称' },
    { name: 'address', label: '门店地址', type: 'text', required: true, placeholder: '请输入详细地址' },
    { name: 'latitude', label: '纬度', type: 'number', required: true, step: 0.0000001 },
    { name: 'longitude', label: '经度', type: 'number', required: true, step: 0.0000001 },
    { name: 'businessHours', label: '营业时间', type: 'text', placeholder: '如: 07:00-22:00' },
    { name: 'phone', label: '联系电话', type: 'text', placeholder: '请输入联系电话' },
  ];

  const columns: Column<StoreType>[] = [
    { key: 'id', title: 'ID', width: '60px' },
    { 
      key: 'name', 
      title: '门店名称',
      render: (value, record) => (
        <div>
          <div className="font-medium text-gray-800">{value}</div>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <MapPin className="w-3 h-3 mr-1" />
            {record.address}
          </div>
        </div>
      )
    },
    { 
      key: 'businessHours', 
      title: '营业时间',
      render: (value) => (
        <div className="flex items-center text-sm">
          <Clock className="w-4 h-4 mr-1 text-gray-400" />
          {value || '-'}
        </div>
      )
    },
    { 
      key: 'phone', 
      title: '联系电话',
      render: (value) => (
        <div className="flex items-center text-sm">
          <Phone className="w-4 h-4 mr-1 text-gray-400" />
          {value || '-'}
        </div>
      )
    },
    {
      key: 'actions',
      title: '操作',
      width: '150px',
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setEditingStore(record);
              setShowForm(true);
            }}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingStore(record)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    },
  ];

  return (
    <Layout>
      <PageHeader 
        title="门店管理" 
        description="管理门店信息，支持增删改查"
        icon={Store}
        actions={
          <button
            onClick={() => {
              setEditingStore(null);
              setShowForm(true);
            }}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            新增门店
          </button>
        }
      />

      {/* Table */}
      <DataTable 
        columns={columns} 
        data={stores} 
        loading={loading}
      />

      {/* Pagination */}
      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={setPage}
      />

      {/* Form Modal */}
      {showForm && (
        <FormModal
          title={editingStore ? '编辑门店' : '新增门店'}
          fields={formFields}
          initialValues={editingStore || { businessHours: '07:00-22:00' }}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingStore(null);
          }}
          loading={formLoading}
        />
      )}

      {/* Delete Confirm */}
      {deletingStore && (
        <ConfirmDialog
          title="删除门店"
          message={`确定要删除门店"${deletingStore.name}"吗？此操作不可撤销。`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingStore(null)}
          loading={deleteLoading}
          type="danger"
        />
      )}
    </Layout>
  );
}
