import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({ 
  title, 
  message, 
  onConfirm, 
  onCancel,
  loading = false,
  type = 'danger'
}: ConfirmDialogProps) {
  const iconColors = {
    danger: 'text-red-500 bg-red-100',
    warning: 'text-orange-500 bg-orange-100',
    info: 'text-blue-500 bg-blue-100',
  };

  const buttonColors = {
    danger: 'bg-red-500 hover:bg-red-600',
    warning: 'bg-orange-500 hover:bg-orange-600',
    info: 'bg-primary hover:bg-primary/90',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-start">
            <div className={`p-3 rounded-full ${iconColors[type]}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <p className="text-sm text-gray-600 mt-2">{message}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 px-6 py-4 bg-gray-50 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonColors[type]}`}
          >
            {loading ? '处理中...' : '确定'}
          </button>
        </div>
      </div>
    </div>
  );
}
