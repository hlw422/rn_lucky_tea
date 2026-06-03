import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import DataTable, { Column } from '../components/DataTable';
import FormModal, { FormField } from '../components/FormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { categoriesApi, Category } from '../api/categories';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Delete states
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoriesApi.getList();
      setCategories(response.data);
    } catch (error) {
      console.error('获取分类失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    setFormLoading(true);
    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, values as any);
      } else {
        await categoriesApi.create(values as any);
      }
      setShowForm(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error: any) {
      alert(error.message || '操作失败');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    setDeleteLoading(true);
    try {
      await categoriesApi.delete(deletingCategory.id);
      setDeletingCategory(null);
      fetchCategories();
    } catch (error: any) {
      alert(error.message || '删除失败');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formFields: FormField[] = [
    { name: 'name', label: '分类名称', type: 'text', required: true, placeholder: '请输入分类名称' },
    { name: 'description', label: '分类描述', type: 'textarea', placeholder: '请输入分类描述' },
  ];

  const columns: Column<Category>[] = [
    { key: 'id', title: 'ID', width: '60px' },
    { key: 'name', title: '分类名称' },
    { 
      key: 'description', 
      title: '描述',
      render: (value) => (
        <span className="text-gray-500">{value || '-'}</span>
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
              setEditingCategory(record);
              setShowForm(true);
            }}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingCategory(record)}
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
        title="分类管理" 
        description="管理商品分类，支持增删改查"
        icon={FolderTree}
        actions={
          <button
            onClick={() => {
              setEditingCategory(null);
              setShowForm(true);
            }}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            新增分类
          </button>
        }
      />

      {/* Table */}
      <DataTable 
        columns={columns} 
        data={categories} 
        loading={loading}
      />

      {/* Form Modal */}
      {showForm && (
        <FormModal
          title={editingCategory ? '编辑分类' : '新增分类'}
          fields={formFields}
          initialValues={editingCategory || {}}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
          loading={formLoading}
        />
      )}

      {/* Delete Confirm */}
      {deletingCategory && (
        <ConfirmDialog
          title="删除分类"
          message={`确定要删除分类"${deletingCategory.name}"吗？如果该分类下有商品，将无法删除。`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingCategory(null)}
          loading={deleteLoading}
          type="danger"
        />
      )}
    </Layout>
  );
}
