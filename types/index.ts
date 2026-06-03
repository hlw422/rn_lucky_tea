export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
}

export interface Category {
  id: number;
  name: string;
  desc?: string;
}

export interface Goods {
  id: number;
  categoryId: number;
  name: string;
  characteristic?: string;
  originalPrice: number;
  pic?: string;
}

export interface Order {
  id: number;
  orderNum: string;
  address: string;
  goodsName: string;
  price: number;
  time: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface Coupon {
  id: number;
  discount: number;
  name: string;
  category?: string;
  expireDate: string;
  used: number;
}

export interface CartItem {
  id: string;
  goodsId: number;
  name: string;
  price: number;
  quantity: number;
  pic?: string;
  temperature?: string;
  sweetness?: string;
  size?: string;
}

export interface Store {
  id: number;
  name: string;
  address: string;
  distance: string;
  businessHours: string;
  phone: string;
}
