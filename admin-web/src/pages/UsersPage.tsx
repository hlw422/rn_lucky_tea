import React, { useState, useEffect } from 'react';
import { Users, Shield, User, Mail, Calendar } from 'lucide-react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import DataTable, { Column } from '../components/DataTable';
import Pagination from '../components/Pagination';
import { usersApi, User as UserType } from '../api/users';

const roleColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  user: 'bg-blue-100 text-blue-700',
};

const roleLabels: Record<string, string> = {
  admin: '管理员',
  user: '普通用户',
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await usersApi.getList({ page, pageSize });
      setUsers(response.data.list);
      setTotal(response.data.total);
    } catch (error) {
      console.error('获取用户失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<UserType>[] = [
    { 
      key: 'id', 
      title: 'ID',
      width: '60px'
    },
    { 
      key: 'name', 
      title: '用户信息',
      render: (value, record) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
            {record.avatar ? (
              <img src={record.avatar} alt={value} className="w-10 h-10 rounded-full" />
            ) : (
              <User className="w-5 h-5 text-primary" />
            )}
          </div>
          <div>
            <div className="font-medium text-gray-800">{value}</div>
            <div className="flex items-center text-sm text-gray-500">
              <Mail className="w-3.5 h-3.5 mr-1" />
              {record.email}
            </div>
          </div>
        </div>
      )
    },
    { 
      key: 'role', 
      title: '角色',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[value] || roleColors.user}`}>
          <Shield className="w-3.5 h-3.5 mr-1" />
          {roleLabels[value] || value}
        </span>
      )
    },
    { 
      key: 'created_at', 
      title: '注册时间',
      render: (value) => (
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
          {value ? new Date(value).toLocaleDateString('zh-CN') : '-'}
        </div>
      )
    },
  ];

  return (
    <Layout>
      <PageHeader 
        title="用户管理" 
        description="查看系统用户列表"
        icon={Users}
      />

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            共 <span className="font-semibold text-gray-800">{total}</span> 个用户
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="w-2.5 h-2.5 bg-purple-500 rounded-full mr-2"></span>
              <span className="text-sm text-gray-600">管理员</span>
            </div>
            <div className="flex items-center">
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-2"></span>
              <span className="text-sm text-gray-600">普通用户</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable 
        columns={columns} 
        data={users} 
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
