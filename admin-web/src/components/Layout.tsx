import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Store, 
  ShoppingCart, 
  Users, 
  LogOut,
  Menu,
  X,
  Coffee
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: '数据概览' },
  { path: '/goods', icon: Package, label: '商品管理' },
  { path: '/categories', icon: FolderTree, label: '分类管理' },
  { path: '/stores', icon: Store, label: '门店管理' },
  { path: '/orders', icon: ShoppingCart, label: '订单管理' },
  { path: '/users', icon: Users, label: '用户管理' },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('admin_user') || '{}');

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-full bg-background-dark text-white transition-all duration-300 z-50 ${
          sidebarOpen ? 'w-60' : 'w-16'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-white/10">
          <Coffee className="w-8 h-8 text-primary-light flex-shrink-0" />
          {sidebarOpen && (
            <span className="ml-3 text-lg font-semibold">管理后台</span>
          )}
        </div>

        {/* Menu Items */}
        <nav className="mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center h-12 px-4 transition-colors ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="ml-3">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center w-full h-12 px-4 text-white/70 hover:bg-red-500/20 hover:text-red-400 transition-colors absolute bottom-0 border-t border-white/10"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span className="ml-3">退出登录</span>}
        </button>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-16'}`}>
        {/* Header */}
        <header className="fixed right-0 top-0 h-16 bg-white shadow-sm flex items-center justify-between px-6 z-40" 
                style={{ left: sidebarOpen ? '240px' : '64px' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              欢迎，{user.name || '管理员'}
            </span>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
              {(user.name || 'A')[0]}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 mt-16 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
