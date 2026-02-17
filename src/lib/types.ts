export type UserRole = "admin" | "pharmacist" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  pharmacyName: string;
}

export interface StockItem {
  id: string;
  name: string;
  genericName: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  unit: string;
  expiryDate: string;
  supplier: string;
  unitPrice: number;
}

export interface RequisitionItem {
  id: string;
  medicationName: string;
  genericName: string;
  quantity: number;
  unit: string;
  priority: "low" | "medium" | "high" | "critical";
  notes?: string;
}

export interface Requisition {
  id: string;
  title: string;
  items: RequisitionItem[];
  status: "draft" | "submitted" | "analyzing" | "analyzed" | "ordered";
  createdAt: string;
  updatedAt: string;
  totalItems: number;
}

export interface DepotQuote {
  depotName: string;
  unitPrice: number;
  totalPrice: number;
  deliveryDays: number;
  inStock: boolean;
}

export interface AnalysisResult {
  medicationName: string;
  genericName: string;
  quantity: number;
  unit: string;
  quotes: DepotQuote[];
  cheapestDepot: string;
  cheapestPrice: number;
  averagePrice: number;
  savingsPercent: number;
}

export interface AnalysisReport {
  id: string;
  requisitionId: string;
  results: AnalysisResult[];
  totalCost: number;
  totalSavings: number;
  averageSavingsPercent: number;
  bestStrategy: string;
  createdAt: string;
}

export interface Order {
  id: string;
  requisitionId: string;
  depot: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  paymentStatus: "unpaid" | "paid" | "partial";
  orderDate: string;
  expectedDelivery: string;
  receivedDate?: string;
}

export interface OrderItem {
  medicationName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type StockFilter = "all" | "out_of_stock" | "low_stock";
