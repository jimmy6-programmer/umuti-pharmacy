"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Search,
  AlertTriangle,
  Package,
  ArrowRight,
} from "lucide-react";
import { FileUpload } from "@/components/file-upload";
import { mockStock } from "@/lib/mock-data";
import type { StockItem, StockFilter } from "@/lib/types";
import { toast } from "sonner";

export default function StockPage() {
  const [stock, setStock] = useState<StockItem[]>(mockStock);
  const [filter, setFilter] = useState<StockFilter>("all");
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const filteredStock = useMemo(() => {
    let items = stock;
    if (filter === "out_of_stock") {
      items = items.filter((s) => s.currentStock === 0);
    } else if (filter === "low_stock") {
      items = items.filter(
        (s) => s.currentStock > 0 && s.currentStock < s.minThreshold
      );
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.genericName.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }
    return items;
  }, [stock, filter, search]);

  const handleDataParsed = useCallback(
    (data: Record<string, string>[]) => {
      const newItems: StockItem[] = data.map((row, i) => ({
        id: `uploaded_${Date.now()}_${i}`,
        name: row.name || row.Name || row.medication || "Unknown",
        genericName: row.genericName || row.generic || row.name || "Unknown",
        category: row.category || row.Category || "Uncategorized",
        currentStock: parseInt(row.currentStock || row.stock || row.quantity || "0"),
        minThreshold: parseInt(row.minThreshold || row.threshold || row.min || "50"),
        unit: row.unit || row.Unit || "units",
        expiryDate: row.expiryDate || row.expiry || "2027-01-01",
        supplier: row.supplier || row.Supplier || "Unknown",
        unitPrice: parseFloat(row.unitPrice || row.price || "0"),
      }));
      setStock((prev) => [...prev, ...newItems]);
      setShowUpload(false);
    },
    []
  );

  const convertLowStockToRequisition = () => {
    const lowStock = stock.filter(
      (s) => s.currentStock >= 0 && s.currentStock < s.minThreshold
    );
    toast.success(
      `Created requisition with ${lowStock.length} items. Redirecting to Requisitions...`
    );
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Generic Name",
      "Category",
      "Current Stock",
      "Min Threshold",
      "Unit",
      "Expiry Date",
      "Supplier",
      "Unit Price",
    ];
    const rows = filteredStock.map((s) =>
      [
        s.name,
        s.genericName,
        s.category,
        s.currentStock,
        s.minThreshold,
        s.unit,
        s.expiryDate,
        s.supplier,
        s.unitPrice,
      ].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stock_export_${filter}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Stock data exported");
  };

  const outOfStockCount = stock.filter((s) => s.currentStock === 0).length;
  const lowStockCount = stock.filter(
    (s) => s.currentStock > 0 && s.currentStock < s.minThreshold
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Stock Management</h2>
          <p className="text-muted-foreground">
            Monitor inventory levels and manage stock alerts
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUpload(!showUpload)}
          >
            <Package className="w-4 h-4 mr-2" />
            Upload Stock
          </Button>
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter("all")}>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-medium text-muted-foreground">Total Items</p>
            <p className="text-2xl font-bold">{stock.length}</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter("out_of_stock")}>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-medium text-destructive">Out of Stock</p>
            <p className="text-2xl font-bold text-destructive">{outOfStockCount}</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter("low_stock")}>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-medium text-amber-600">Low Stock</p>
            <p className="text-2xl font-bold text-amber-600">{lowStockCount}</p>
          </CardContent>
        </Card>
      </div>

      {showUpload && (
        <Card>
          <CardContent className="pt-6">
            <FileUpload
              onDataParsed={handleDataParsed}
              label="Upload Stock File (CSV, XLSX, or PDF)"
            />
          </CardContent>
        </Card>
      )}

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <CardTitle className="text-base">Inventory</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search medications..."
                  className="pl-9 w-full sm:w-64"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select
                value={filter}
                onValueChange={(v) => setFilter(v as StockFilter)}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Threshold</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStock.map((item) => {
                  const isOutOfStock = item.currentStock === 0;
                  const isLowStock =
                    item.currentStock > 0 &&
                    item.currentStock < item.minThreshold;
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.genericName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{item.category}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {item.currentStock}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground tabular-nums">
                        {item.minThreshold}
                      </TableCell>
                      <TableCell className="text-sm">{item.unit}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm">{item.supplier}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        R{item.unitPrice.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {isOutOfStock ? (
                          <Badge variant="destructive" className="text-xs">
                            Out of Stock
                          </Badge>
                        ) : isLowStock ? (
                          <Badge
                            variant="outline"
                            className="text-xs text-amber-700 border-amber-300 bg-amber-50"
                          >
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Low
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-xs text-emerald-700 border-emerald-300 bg-emerald-50"
                          >
                            In Stock
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredStock.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {(filter === "low_stock" || filter === "out_of_stock") && filteredStock.length > 0 && (
            <div className="mt-4 flex justify-end">
              <Button onClick={convertLowStockToRequisition}>
                Convert to Requisition
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
