"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingDown,
  Download,
  CheckCircle,
  DollarSign,
  BarChart3,
  Zap,
} from "lucide-react";
import { mockAnalysis } from "@/lib/mock-data";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function AnalysisPage() {
  const analysis = mockAnalysis;

  const chartData = analysis.results.map((r) => ({
    name: r.medicationName.split(" ")[0],
    cheapest: r.cheapestPrice,
    average: r.averagePrice,
    savings: r.averagePrice - r.cheapestPrice,
  }));

  const generatePDF = async () => {
    const { jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Umuti - Analysis Report", 14, 22);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Requisition: ${analysis.requisitionId}`, 14, 36);

    // Summary
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 14, 48);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Cost (Optimized): R${analysis.totalCost.toFixed(2)}`, 14, 56);
    doc.text(`Total Savings: R${analysis.totalSavings.toFixed(2)}`, 14, 62);
    doc.text(`Average Savings: ${analysis.averageSavingsPercent.toFixed(1)}%`, 14, 68);
    doc.text(`Best Strategy: ${analysis.bestStrategy}`, 14, 74);

    // Table
    const tableData = analysis.results.map((r) => [
      r.medicationName,
      `${r.quantity} ${r.unit}`,
      r.cheapestDepot,
      `R${r.cheapestPrice.toFixed(2)}`,
      `R${r.averagePrice.toFixed(2)}`,
      `${r.savingsPercent.toFixed(1)}%`,
    ]);

    autoTable(doc, {
      startY: 82,
      head: [["Medication", "Quantity", "Best Depot", "Best Price", "Avg Price", "Savings"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [15, 23, 42], fontSize: 9 },
      bodyStyles: { fontSize: 8 },
    });

    // Depot breakdown
    const finalY = (doc as unknown as Record<string, number>).lastAutoTable?.finalY ?? 160;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Depot Comparison", 14, finalY + 12);

    const depotData: string[][] = [];
    analysis.results.forEach((r) => {
      r.quotes.forEach((q) => {
        depotData.push([
          r.medicationName,
          q.depotName,
          `R${q.unitPrice.toFixed(2)}`,
          `R${q.totalPrice.toFixed(2)}`,
          `${q.deliveryDays} days`,
          q.inStock ? "Yes" : "No",
        ]);
      });
    });

    autoTable(doc, {
      startY: finalY + 18,
      head: [["Medication", "Depot", "Unit Price", "Total", "Delivery", "In Stock"]],
      body: depotData,
      theme: "grid",
      headStyles: { fillColor: [15, 23, 42], fontSize: 9 },
      bodyStyles: { fontSize: 8 },
    });

    doc.save(`umuti_analysis_${analysis.id}.pdf`);
    toast.success("PDF report downloaded");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analysis</h2>
          <p className="text-muted-foreground">
            AI-powered price comparison and savings analysis
          </p>
        </div>
        <Button onClick={generatePDF}>
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50">
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Optimized Cost</p>
                <p className="text-xl font-bold">R{analysis.totalCost.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <TrendingDown className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Savings</p>
                <p className="text-xl font-bold">R{analysis.totalSavings.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-50">
                <BarChart3 className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Savings %</p>
                <p className="text-xl font-bold">{analysis.averageSavingsPercent.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50">
                <Zap className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Medications</p>
                <p className="text-xl font-bold">{analysis.results.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best Strategy */}
      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-sm text-emerald-900">Recommended Strategy</p>
              <p className="text-sm text-emerald-700 mt-1">{analysis.bestStrategy}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Price Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R${v}`} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `R${value.toFixed(2)}`,
                    name === "cheapest" ? "Best Price" : name === "average" ? "Average Price" : "Savings",
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend />
                <Bar dataKey="cheapest" fill="#10b981" name="Best Price" radius={[4, 4, 0, 0]} />
                <Bar dataKey="average" fill="#94a3b8" name="Average Price" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cheapest Depot per Medication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Best Depot</TableHead>
                  <TableHead className="text-right">Best Price</TableHead>
                  <TableHead className="text-right">Avg Price</TableHead>
                  <TableHead className="text-right">Savings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analysis.results.map((result) => (
                  <TableRow key={result.medicationName}>
                    <TableCell>
                      <p className="font-medium text-sm">{result.medicationName}</p>
                      <p className="text-xs text-muted-foreground">{result.genericName}</p>
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {result.quantity} {result.unit}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs text-emerald-700 border-emerald-300 bg-emerald-50">
                        {result.cheapestDepot}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      R{result.cheapestPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground tabular-nums">
                      R{result.averagePrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-emerald-600 font-medium tabular-nums">
                        {result.savingsPercent.toFixed(1)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Full Depot Quotes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Depot Quotes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {analysis.results.map((result) => (
            <div key={result.medicationName}>
              <h4 className="font-medium text-sm mb-2">{result.medicationName}</h4>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Depot</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Delivery</TableHead>
                      <TableHead>In Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.quotes.map((quote) => (
                      <TableRow
                        key={quote.depotName}
                        className={
                          quote.depotName === result.cheapestDepot
                            ? "bg-emerald-50/50"
                            : ""
                        }
                      >
                        <TableCell className="font-medium text-sm">
                          {quote.depotName}
                          {quote.depotName === result.cheapestDepot && (
                            <Badge className="ml-2 text-[10px]" variant="default">
                              Best
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          R{quote.unitPrice.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          R{quote.totalPrice.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {quote.deliveryDays} days
                        </TableCell>
                        <TableCell>
                          {quote.inStock ? (
                            <Badge variant="outline" className="text-xs text-emerald-700 border-emerald-300">
                              Yes
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs text-destructive border-destructive/30">
                              No
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
