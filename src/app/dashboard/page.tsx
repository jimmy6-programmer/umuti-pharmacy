"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Clock,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Package,
} from "lucide-react";
import { dashboardStats, mockStock, mockOrders, mockRequisitions } from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const stats = [
  {
    title: "Total Requisitions",
    value: dashboardStats.totalRequisitions,
    icon: FileText,
    trend: "+2 this month",
    trendUp: true,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Pending Analysis",
    value: dashboardStats.pendingAnalysis,
    icon: Clock,
    trend: "1 awaiting review",
    trendUp: false,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    title: "Total Orders",
    value: dashboardStats.totalOrders,
    icon: ShoppingCart,
    trend: "+1 this week",
    trendUp: true,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Monthly Spending",
    value: `R${dashboardStats.monthlySpending.toLocaleString()}`,
    icon: DollarSign,
    trend: "9.7% saved",
    trendUp: true,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
];

const stockByCategory = mockStock.reduce(
  (acc, item) => {
    const existing = acc.find((a) => a.category === item.category);
    if (existing) {
      existing.count += 1;
      existing.value += item.currentStock * item.unitPrice;
    } else {
      acc.push({
        category: item.category,
        count: 1,
        value: item.currentStock * item.unitPrice,
      });
    }
    return acc;
  },
  [] as { category: string; count: number; value: number }[]
);

const pieColors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

const lowStockItems = mockStock.filter(
  (s) => s.currentStock > 0 && s.currentStock < s.minThreshold
);
const outOfStockItems = mockStock.filter((s) => s.currentStock === 0);

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, Dr. Sarah Nkosi. Here&apos;s your pharmacy overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.trendUp ? (
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-amber-500" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {stat.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Stock value chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base">Stock Value by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockByCategory}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="category"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R${v}`} />
                  <Tooltip
                    formatter={(value: number) => [`R${value.toFixed(2)}`, "Value"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="category"
                    label={({ category }) => category}
                    fontSize={11}
                  >
                    {stockByCategory.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {outOfStockItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-destructive" />
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.category}
                    </p>
                  </div>
                </div>
                <Badge variant="destructive">Out of Stock</Badge>
              </div>
            ))}
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.currentStock} / {item.minThreshold} {item.unit}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-amber-700 border-amber-300">
                  Low Stock
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Requisitions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Requisitions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockRequisitions.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div>
                  <p className="text-sm font-medium">{req.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {req.totalItems} items &middot;{" "}
                    {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  variant={
                    req.status === "analyzed"
                      ? "default"
                      : req.status === "submitted"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {req.status}
                </Badge>
              </div>
            ))}
            {mockOrders.slice(0, 2).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div>
                  <p className="text-sm font-medium">
                    Order #{order.id.slice(-3)} - {order.depot}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    R{order.totalAmount} &middot;{" "}
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  variant={
                    order.status === "delivered"
                      ? "default"
                      : order.status === "shipped"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {order.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
