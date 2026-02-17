import { StockItem, Requisition, AnalysisReport, Order, User } from "./types";

export const mockUser: User = {
  id: "usr_001",
  name: "Dr. Sarah Nkosi",
  email: "sarah@umuti.co.za",
  role: "admin",
  pharmacyName: "Greenfield Pharmacy",
};

export const mockStock: StockItem[] = [
  { id: "stk_001", name: "Amoxicillin 500mg", genericName: "Amoxicillin", category: "Antibiotics", currentStock: 240, minThreshold: 100, unit: "capsules", expiryDate: "2027-03-15", supplier: "MedSupply SA", unitPrice: 2.50 },
  { id: "stk_002", name: "Ibuprofen 400mg", genericName: "Ibuprofen", category: "Anti-inflammatory", currentStock: 45, minThreshold: 80, unit: "tablets", expiryDate: "2026-11-20", supplier: "PharmaCo", unitPrice: 1.20 },
  { id: "stk_003", name: "Metformin 850mg", genericName: "Metformin", category: "Antidiabetic", currentStock: 0, minThreshold: 50, unit: "tablets", expiryDate: "2026-08-10", supplier: "DiabCare", unitPrice: 3.10 },
  { id: "stk_004", name: "Paracetamol 500mg", genericName: "Paracetamol", category: "Analgesic", currentStock: 500, minThreshold: 200, unit: "tablets", expiryDate: "2027-06-01", supplier: "MedSupply SA", unitPrice: 0.80 },
  { id: "stk_005", name: "Omeprazole 20mg", genericName: "Omeprazole", category: "Gastrointestinal", currentStock: 12, minThreshold: 40, unit: "capsules", expiryDate: "2026-09-25", supplier: "GastroMed", unitPrice: 4.50 },
  { id: "stk_006", name: "Ciprofloxacin 500mg", genericName: "Ciprofloxacin", category: "Antibiotics", currentStock: 0, minThreshold: 30, unit: "tablets", expiryDate: "2026-12-15", supplier: "PharmaCo", unitPrice: 5.20 },
  { id: "stk_007", name: "Atorvastatin 20mg", genericName: "Atorvastatin", category: "Cardiovascular", currentStock: 85, minThreshold: 60, unit: "tablets", expiryDate: "2027-01-30", supplier: "HeartCare", unitPrice: 6.80 },
  { id: "stk_008", name: "Losartan 50mg", genericName: "Losartan", category: "Cardiovascular", currentStock: 20, minThreshold: 45, unit: "tablets", expiryDate: "2027-02-28", supplier: "HeartCare", unitPrice: 4.20 },
  { id: "stk_009", name: "Fluoxetine 20mg", genericName: "Fluoxetine", category: "Antidepressant", currentStock: 0, minThreshold: 25, unit: "capsules", expiryDate: "2026-10-15", supplier: "MindWell", unitPrice: 7.50 },
  { id: "stk_010", name: "Salbutamol Inhaler", genericName: "Salbutamol", category: "Respiratory", currentStock: 30, minThreshold: 20, unit: "units", expiryDate: "2027-04-20", supplier: "BreathEasy", unitPrice: 45.00 },
  { id: "stk_011", name: "Prednisone 5mg", genericName: "Prednisone", category: "Corticosteroid", currentStock: 8, minThreshold: 30, unit: "tablets", expiryDate: "2026-07-18", supplier: "MedSupply SA", unitPrice: 2.10 },
  { id: "stk_012", name: "Amlodipine 5mg", genericName: "Amlodipine", category: "Cardiovascular", currentStock: 150, minThreshold: 50, unit: "tablets", expiryDate: "2027-05-10", supplier: "HeartCare", unitPrice: 3.40 },
];

export const mockRequisitions: Requisition[] = [
  {
    id: "req_001",
    title: "Monthly Restock - January",
    items: [
      { id: "ri_001", medicationName: "Ibuprofen 400mg", genericName: "Ibuprofen", quantity: 200, unit: "tablets", priority: "high" },
      { id: "ri_002", medicationName: "Metformin 850mg", genericName: "Metformin", quantity: 100, unit: "tablets", priority: "critical" },
      { id: "ri_003", medicationName: "Omeprazole 20mg", genericName: "Omeprazole", quantity: 80, unit: "capsules", priority: "high" },
    ],
    status: "analyzed",
    createdAt: "2026-01-15T08:00:00Z",
    updatedAt: "2026-01-15T10:30:00Z",
    totalItems: 3,
  },
  {
    id: "req_002",
    title: "Emergency Restock - Antibiotics",
    items: [
      { id: "ri_004", medicationName: "Ciprofloxacin 500mg", genericName: "Ciprofloxacin", quantity: 60, unit: "tablets", priority: "critical" },
      { id: "ri_005", medicationName: "Amoxicillin 500mg", genericName: "Amoxicillin", quantity: 150, unit: "capsules", priority: "medium" },
    ],
    status: "submitted",
    createdAt: "2026-02-01T14:00:00Z",
    updatedAt: "2026-02-01T14:00:00Z",
    totalItems: 2,
  },
  {
    id: "req_003",
    title: "Cardiovascular Medications",
    items: [
      { id: "ri_006", medicationName: "Losartan 50mg", genericName: "Losartan", quantity: 50, unit: "tablets", priority: "medium" },
      { id: "ri_007", medicationName: "Atorvastatin 20mg", genericName: "Atorvastatin", quantity: 40, unit: "tablets", priority: "low" },
    ],
    status: "draft",
    createdAt: "2026-02-10T09:00:00Z",
    updatedAt: "2026-02-10T09:00:00Z",
    totalItems: 2,
  },
];

export const mockAnalysis: AnalysisReport = {
  id: "anl_001",
  requisitionId: "req_001",
  results: [
    {
      medicationName: "Ibuprofen 400mg",
      genericName: "Ibuprofen",
      quantity: 200,
      unit: "tablets",
      quotes: [
        { depotName: "MedSupply SA", unitPrice: 1.20, totalPrice: 240, deliveryDays: 3, inStock: true },
        { depotName: "PharmaCo", unitPrice: 1.05, totalPrice: 210, deliveryDays: 5, inStock: true },
        { depotName: "QuickMeds", unitPrice: 1.35, totalPrice: 270, deliveryDays: 2, inStock: true },
      ],
      cheapestDepot: "PharmaCo",
      cheapestPrice: 210,
      averagePrice: 240,
      savingsPercent: 12.5,
    },
    {
      medicationName: "Metformin 850mg",
      genericName: "Metformin",
      quantity: 100,
      unit: "tablets",
      quotes: [
        { depotName: "DiabCare", unitPrice: 3.10, totalPrice: 310, deliveryDays: 4, inStock: true },
        { depotName: "MedSupply SA", unitPrice: 2.85, totalPrice: 285, deliveryDays: 3, inStock: true },
        { depotName: "PharmaCo", unitPrice: 3.40, totalPrice: 340, deliveryDays: 5, inStock: false },
      ],
      cheapestDepot: "MedSupply SA",
      cheapestPrice: 285,
      averagePrice: 311.67,
      savingsPercent: 8.56,
    },
    {
      medicationName: "Omeprazole 20mg",
      genericName: "Omeprazole",
      quantity: 80,
      unit: "capsules",
      quotes: [
        { depotName: "GastroMed", unitPrice: 4.50, totalPrice: 360, deliveryDays: 2, inStock: true },
        { depotName: "MedSupply SA", unitPrice: 4.20, totalPrice: 336, deliveryDays: 3, inStock: true },
        { depotName: "QuickMeds", unitPrice: 5.00, totalPrice: 400, deliveryDays: 1, inStock: true },
      ],
      cheapestDepot: "MedSupply SA",
      cheapestPrice: 336,
      averagePrice: 365.33,
      savingsPercent: 8.02,
    },
  ],
  totalCost: 831,
  totalSavings: 86,
  averageSavingsPercent: 9.69,
  bestStrategy: "Split order: PharmaCo for Ibuprofen, MedSupply SA for Metformin & Omeprazole",
  createdAt: "2026-01-15T10:30:00Z",
};

export const mockOrders: Order[] = [
  {
    id: "ord_001",
    requisitionId: "req_001",
    depot: "PharmaCo",
    items: [
      { medicationName: "Ibuprofen 400mg", quantity: 200, unitPrice: 1.05, totalPrice: 210 },
    ],
    totalAmount: 210,
    status: "delivered",
    paymentStatus: "paid",
    orderDate: "2026-01-16T08:00:00Z",
    expectedDelivery: "2026-01-21T08:00:00Z",
    receivedDate: "2026-01-20T14:30:00Z",
  },
  {
    id: "ord_002",
    requisitionId: "req_001",
    depot: "MedSupply SA",
    items: [
      { medicationName: "Metformin 850mg", quantity: 100, unitPrice: 2.85, totalPrice: 285 },
      { medicationName: "Omeprazole 20mg", quantity: 80, unitPrice: 4.20, totalPrice: 336 },
    ],
    totalAmount: 621,
    status: "shipped",
    paymentStatus: "paid",
    orderDate: "2026-01-16T08:00:00Z",
    expectedDelivery: "2026-01-19T08:00:00Z",
  },
  {
    id: "ord_003",
    requisitionId: "req_002",
    depot: "PharmaCo",
    items: [
      { medicationName: "Ciprofloxacin 500mg", quantity: 60, unitPrice: 4.80, totalPrice: 288 },
      { medicationName: "Amoxicillin 500mg", quantity: 150, unitPrice: 2.30, totalPrice: 345 },
    ],
    totalAmount: 633,
    status: "confirmed",
    paymentStatus: "unpaid",
    orderDate: "2026-02-02T10:00:00Z",
    expectedDelivery: "2026-02-07T08:00:00Z",
  },
  {
    id: "ord_004",
    requisitionId: "req_003",
    depot: "HeartCare",
    items: [
      { medicationName: "Losartan 50mg", quantity: 50, unitPrice: 3.90, totalPrice: 195 },
      { medicationName: "Atorvastatin 20mg", quantity: 40, unitPrice: 6.50, totalPrice: 260 },
    ],
    totalAmount: 455,
    status: "pending",
    paymentStatus: "unpaid",
    orderDate: "2026-02-11T09:00:00Z",
    expectedDelivery: "2026-02-16T08:00:00Z",
  },
];

export const dashboardStats = {
  totalRequisitions: mockRequisitions.length,
  pendingAnalysis: mockRequisitions.filter((r) => r.status === "submitted").length,
  totalOrders: mockOrders.length,
  monthlySpending: mockOrders.reduce((sum, o) => sum + o.totalAmount, 0),
};
