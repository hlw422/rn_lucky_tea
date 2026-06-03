import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Store, 
  FolderTree, 
  Ticket,
  TrendingUp,
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { statsApi, StatsData } from '../api/stats';

const COLORS = ['#FF9800', '#4CAF50', '#F44336'];

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await statsApi.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const orderStatusData = stats?.orderStats.map(item => ({
    name: item.status === 'pending' ? '待处理' : item.status === 'completed' ? '已完成' : '已取消',
    value: item.count,
  })) || [];

  return (
    <Layout>
      <PageHeader 
        title="数据概览" 
        description="查看系统整体运营数据"
        icon={TrendingUp}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard 
          title="用户总数" 
          value={stats?.counts.users || 0} 
          icon={Users}
          color="info"
        />
        <StatCard 
          title="商品数量" 
          value={stats?.counts.goods || 0} 
          icon={Package}
          color="success"
        />
        <StatCard 
          title="订单总数" 
          value={stats?.counts.orders || 0} 
          icon={ShoppingCart}
          color="warning"
        />
        <StatCard 
          title="门店数量" 
          value={stats?.counts.stores || 0} 
          icon={Store}
          color="primary"
        />
        <StatCard 
          title="分类数量" 
          value={stats?.counts.categories || 0} 
          icon={FolderTree}
          color="danger"
        />
        <StatCard 
          title="优惠券" 
          value={stats?.counts.coupons || 0} 
          icon={Ticket}
          color="info"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Clock className="w-5 h-5 text-primary mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">近7日订单趋势</h3>
          </div>
          <div className="h-64">
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.recentOrders}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#2B4C7E" 
                    strokeWidth={2}
                    dot={{ fill: '#2B4C7E', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                暂无数据
              </div>
            )}
          </div>
        </div>

        {/* Order Status Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-4">
            <ShoppingCart className="w-5 h-5 text-primary mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">订单状态分布</h3>
          </div>
          <div className="h-64">
            {orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {orderStatusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                暂无数据
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">系统信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">待处理订单</p>
            <p className="text-2xl font-bold text-orange-600">
              {stats?.orderStats.find(s => s.status === 'pending')?.count || 0}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">已完成订单</p>
            <p className="text-2xl font-bold text-green-600">
              {stats?.orderStats.find(s => s.status === 'completed')?.count || 0}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">已取消订单</p>
            <p className="text-2xl font-bold text-red-600">
              {stats?.orderStats.find(s => s.status === 'cancelled')?.count || 0}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">平均每日订单</p>
            <p className="text-2xl font-bold text-primary">
              {stats?.recentOrders.length 
                ? Math.round(stats.recentOrders.reduce((sum, item) => sum + item.count, 0) / stats.recentOrders.length)
                : 0}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
