import React, { useState, useEffect } from 'react';
import { ShoppingCart, Clock, CheckCircle, XCircle, User } from 'lucide-react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import DataTable, { Column } from '../components/DataTable';
import Pagination from '../components/Pagination';
import { ordersApi, Order } from '../api/orders';

const statusOptions = [
  { value: '', label: '全部状态' },
  { value: 'pending', label: '待处理' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-3.5 h-3.5" />,
  completed: <CheckCircle className="w-3.5 h-3.5" />,
  cancelled: <XCircle className="w-3.5 h-3.5" />,
};

const statusLabels: Record<string, string> = {
  pending: '待处理',
  completed: '已完成',
  cancelled: '已取消',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [page, selectedStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersApi.getList({ 
        page, 
        pageSize, 
        status: selectedStatus || undefined 
      });
      setOrders(response.data.list);
      setTotal(response.data.total);
    } catch (error) {
      console.error('获取订单失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: Order['status']) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      fetchOrders();
    } catch (error: any) {
      alert(error.message || '更新失败');
    }
  };

  const columns: Column<Order>[] = [
    { 
      key: 'orderNum', 
      title: '订单号',
      render: (value) => (
        <span className="font-mono text-sm">{value}</span>
      )
    },
    { 
      key: 'userName', 
      title: '用户',
      render: (value, record) => (
        <div className="flex items-center">
          <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center mr-2">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-sm font-medium">{value || '未知'}</div>
            <div className="text-xs text-gray-500">{record.userEmail}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'goodsName', 
      title: '商品',
      render: (value) => (
        <span className="text-sm">{value}</span>
      )
    },
    { 
      key: 'price', 
      title: '金额',
      render: (value) => (
        <span className="font-medium text-gray-800">¥{Number(value).toFixed(2)}</span>
      )
    },
    { 
      key: 'time', 
      title: '下单时间',
      render: (value) => (
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-1 text-gray-400" />
          {value}
        </div>
      )
    },
    { 
      key: 'status', 
      title: '状态',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[value]}`}>
          {statusIcons[value]}
          <span className="ml-1">{statusLabels[value]}</span>
        </span>
      )
    },
    {
      key: 'actions',
      title: '操作',
      width: '120px',
      render: (_, record) => (
        <select
          value={record.status}
          onChange={(e) => handleStatusChange(record.id, e.target.value as Order['status'])}
          className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="pending">待处理</option>
          <option value="completed">已完成</option>
          <option value="cancelled">已取消</option>
        </select>
      )
    },
  ];

  return (
    <Layout>
      <PageHeader 
        title="订单管理" 
        description="查看和管理所有订单，支持状态筛选"
        icon={ShoppingCart}
      />

      {/* Status Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map(option => (
            <button
              key={option.value}
              onClick={() => {
                setSelectedStatus(option.value);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === option.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">待处理</p>
              <p className="text-2xl font-bold text-orange-600">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">已完成</p>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 'completed').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">已取消</p>
              <p className="text-2xl font-bold text-red-600">
                {orders.filter(o => o.status === 'cancelled').length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable 
        columns={columns} 
        data={orders} 
        loading={loading}
      />

      {/* Pagination */}
      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={setPage}
      />
    </Layout>
  );
}
