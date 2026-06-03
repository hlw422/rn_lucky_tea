import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import DataTable, { Column } from '../components/DataTable';
import FormModal, { FormField } from '../components/FormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Pagination from '../components/Pagination';
import { goodsApi, Goods } from '../api/goods';
import { categoriesApi, Category } from '../api/categories';

export default function GoodsPage() {
  const [goods, setGoods] = useState<Goods[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [searchText, setSearchText] = useState('');

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [editingGoods, setEditingGoods] = useState<Goods | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Delete states
  const [deletingGoods, setDeletingGoods] = useState<Goods | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchGoods();
  }, [page, selectedCategoryId]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getList();
      setCategories(response.data);
    } catch (error) {
      console.error('获取分类失败:', error);
    }
  };

  const fetchGoods = async () => {
    setLoading(true);
    try {
      const response = await goodsApi.getList({ 
        page, 
        pageSize, 
        categoryId: selectedCategoryId 
      });
      setGoods(response.data.list);
      setTotal(response.data.total);
    } catch (error) {
      console.error('获取商品失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    setFormLoading(true);
    try {
      if (editingGoods) {
        await goodsApi.update(editingGoods.id, values as any);
      } else {
        await goodsApi.create(values as any);
      }
      setShowForm(false);
      setEditingGoods(null);
      fetchGoods();
    } catch (error: any) {
      alert(error.message || '操作失败');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingGoods) return;
    setDeleteLoading(true);
    try {
      await goodsApi.delete(deletingGoods.id);
      setDeletingGoods(null);
      fetchGoods();
    } catch (error: any) {
      alert(error.message || '删除失败');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formFields: FormField[] = [
    { 
      name: 'categoryId', 
      label: '商品分类', 
      type: 'select', 
      required: true,
      options: categories.map(c => ({ value: c.id, label: c.name }))
    },
    { name: 'name', label: '商品名称', type: 'text', required: true, placeholder: '请输入商品名称' },
    { name: 'characteristic', label: '商品描述', type: 'textarea', placeholder: '请输入商品描述' },
    { name: 'originalPrice', label: '价格', type: 'number', required: true, min: 0, step: 0.01 },
    { name: 'pic', label: '图片URL', type: 'text', placeholder: '请输入图片链接' },
  ];

  const filteredGoods = goods.filter(g => 
    !searchText || g.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: Column<Goods>[] = [
    { 
      key: 'id', 
      title: 'ID',
      width: '60px'
    },
    { 
      key: 'pic', 
      title: '图片',
      width: '80px',
      render: (_, record) => (
        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
          {record.pic ? (
            <img src={record.pic} alt={record.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Package className="w-6 h-6" />
            </div>
          )}
        </div>
      )
    },
    { key: 'name', title: '商品名称' },
    { key: 'categoryName', title: '分类' },
    { 
      key: 'originalPrice', 
      title: '价格',
      render: (value) => `¥${Number(value).toFixed(2)}`
    },
    { 
      key: 'characteristic', 
      title: '描述',
      render: (value) => (
        <span className="text-gray-500 line-clamp-1">{value || '-'}</span>
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
              setEditingGoods(record);
              setShowForm(true);
            }}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingGoods(record)}
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
        title="商品管理" 
        description="管理商品信息，支持增删改查"
        icon={Package}
        actions={
          <button
            onClick={() => {
              setEditingGoods(null);
              setShowForm(true);
            }}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            新增商品
          </button>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="搜索商品名称..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
          <select
            value={selectedCategoryId || ''}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value ? Number(e.target.value) : undefined);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">全部分类</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable 
        columns={columns} 
        data={filteredGoods} 
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
          title={editingGoods ? '编辑商品' : '新增商品'}
          fields={formFields}
          initialValues={editingGoods || {}}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingGoods(null);
          }}
          loading={formLoading}
        />
      )}

      {/* Delete Confirm */}
      {deletingGoods && (
        <ConfirmDialog
          title="删除商品"
          message={`确定要删除商品"${deletingGoods.name}"吗？此操作不可撤销。`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingGoods(null)}
          loading={deleteLoading}
          type="danger"
        />
      )}
    </Layout>
  );
}
