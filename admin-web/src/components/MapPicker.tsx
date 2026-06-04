import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface MapPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
  className?: string;
}

export default function MapPicker({ 
  latitude = 39.9042,  // 默认北京
  longitude = 116.4074,
  onLocationChange,
  className = ''
}: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // 动态加载Leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // 动态加载Leaflet JS
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => initMap();
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const L = window.L;
    
    // 创建地图
    const map = L.map(mapRef.current).setView([latitude, longitude], 13);
    
    // 添加高德地图瓦片图层（国内可用）
    L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
      subdomains: '1234',
      attribution: '&copy; 高德地图'
    }).addTo(map);

    // 创建自定义图标
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="color: #e74c3c; font-size: 32px; transform: translate(-50%, -100%);">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 24 34" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 22 12 22s12-13 12-22C24 5.4 18.6 0 12 0zm0 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
        </svg>
      </div>`,
      iconSize: [32, 42],
      iconAnchor: [16, 42]
    });

    // 添加标记
    const marker = L.marker([latitude, longitude], { 
      icon: customIcon,
      draggable: true 
    }).addTo(map);

    // 标记拖拽结束事件
    marker.on('dragend', function(e: any) {
      const pos = e.target.getLatLng();
      onLocationChange(pos.lat, pos.lng);
    });

    // 地图点击事件
    map.on('click', function(e: any) {
      marker.setLatLng(e.latlng);
      onLocationChange(e.latlng.lat, e.latlng.lng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;
    setMapLoaded(true);
  };

  // 更新标记位置
  useEffect(() => {
    if (markerRef.current && latitude && longitude) {
      markerRef.current.setLatLng([latitude, longitude]);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([latitude, longitude], mapInstanceRef.current.getZoom());
      }
    }
  }, [latitude, longitude]);

  // 使用浏览器定位到当前位置
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('浏览器不支持定位功能');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 15);
        }
        if (markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
        }
        onLocationChange(latitude, longitude);
      },
      (error) => {
        console.error('定位失败:', error);
        alert('定位失败，请直接点击地图选择位置');
      }
    );
  };

  // 搜索功能提示
  const handleSearch = () => {
    alert('请直接在地图上点击选择位置，或使用"定位到我"按钮获取当前位置');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* 操作栏 */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleLocateMe}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          定位到我
        </button>
      </div>

      {/* 地图容器 */}
      <div 
        ref={mapRef} 
        className="w-full h-[300px] rounded-lg border border-gray-300 overflow-hidden"
      />

      {/* 提示信息 */}
      <div className="flex items-center text-xs text-gray-500">
        <MapPin className="w-3 h-3 mr-1" />
        <span>点击地图选择位置，或拖拽标记调整</span>
      </div>
    </div>
  );
}

// 扩展Window类型
declare global {
  interface Window {
    L: any;
  }
}
