"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Send,
  Trash2,
  Sparkles,
  FileText,
  Loader2,
} from "lucide-react";
import { FileUpload } from "@/components/file-upload";
import { mockRequisitions } from "@/lib/mock-data";
import type { Requisition, RequisitionItem } from "@/lib/types";
import { toast } from "sonner";

export default function RequisitionsPage() {
  const [requisitions, setRequisitions] = useState<Requisition[]>(mockRequisitions);
  const [selectedReq, setSelectedReq] = useState<Requisition | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newItems, setNewItems] = useState<RequisitionItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Manual add form
  const [medName, setMedName] = useState("");
  const [medGeneric, setMedGeneric] = useState("");
  const [medQty, setMedQty] = useState("");
  const [medUnit, setMedUnit] = useState("tablets");
  const [medPriority, setMedPriority] = useState<"low" | "medium" | "high" | "critical">("medium");

  const handleDataParsed = (data: Record<string, string>[]) => {
    const items: RequisitionItem[] = data.map((row, i) => ({
      id: `ri_new_${Date.now()}_${i}`,
      medicationName: row.name || row.medication || row.Name || "Unknown",
      genericName: row.genericName || row.generic || row.name || "Unknown",
      quantity: parseInt(row.quantity || row.qty || "1"),
      unit: row.unit || "tablets",
      priority: (row.priority as RequisitionItem["priority"]) || "medium",
    }));
    setNewItems((prev) => [...prev, ...items]);
    toast.success(`Added ${items.length} items from file`);
  };

  const addManualItem = () => {
    if (!medName || !medQty) {
      toast.error("Please fill medication name and quantity");
      return;
    }
    const item: RequisitionItem = {
      id: `ri_manual_${Date.now()}`,
      medicationName: medName,
      genericName: medGeneric || medName,
      quantity: parseInt(medQty),
      unit: medUnit,
      priority: medPriority,
    };
    setNewItems((prev) => [...prev, item]);
    setMedName("");
    setMedGeneric("");
    setMedQty("");
    setDialogOpen(false);
    toast.success("Item added");
  };

  const removeItem = (id: string) => {
    setNewItems((prev) => prev.filter((item) => item.id !== id));
  };

  const createRequisition = () => {
    if (!newTitle || newItems.length === 0) {
      toast.error("Please add a title and at least one item");
      return;
    }
    const req: Requisition = {
      id: `req_${Date.now()}`,
      title: newTitle,
      items: newItems,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalItems: newItems.length,
    };
    setRequisitions((prev) => [req, ...prev]);
    setNewItems([]);
    setNewTitle("");
    setShowCreate(false);
    toast.success("Requisition created");
  };

  const submitForAnalysis = (reqId: string) => {
    setAnalyzing(true);
    setTimeout(() => {
      setRequisitions((prev) =>
        prev.map((r) =>
          r.id === reqId
            ? { ...r, status: "analyzing" as const, updatedAt: new Date().toISOString() }
            : r
        )
      );
      setTimeout(() => {
        setRequisitions((prev) =>
          prev.map((r) =>
            r.id === reqId
              ? { ...r, status: "analyzed" as const, updatedAt: new Date().toISOString() }
              : r
          )
        );
        setAnalyzing(false);
        toast.success("AI analysis complete! View results in Analysis tab.");
      }, 2000);
    }, 1000);
  };

  const priorityColor = (p: string) => {
    switch (p) {
      case "critical": return "destructive" as const;
      case "high": return "default" as const;
      case "medium": return "secondary" as const;
      default: return "outline" as const;
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "analyzed": return "default" as const;
      case "analyzing": return "secondary" as const;
      case "submitted": return "secondary" as const;
      case "ordered": return "default" as const;
      default: return "outline" as const;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Requisitions</h2>
          <p className="text-muted-foreground">
            Create and manage medication requisitions
          </p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}>
          <Plus className="w-4 h-4 mr-2" />
          New Requisition
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create New Requisition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Requisition Title</Label>
              <Input
                placeholder="e.g., Monthly Restock - February"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="mt-1"
              />
            </div>

            <FileUpload
              onDataParsed={handleDataParsed}
              label="Upload medication list (CSV, XLSX, or PDF)"
            />

            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">or add manually</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Medication
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Medication</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <Label>Medication Name</Label>
                    <Input
                      value={medName}
                      onChange={(e) => setMedName(e.target.value)}
                      placeholder="e.g., Amoxicillin 500mg"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Generic Name</Label>
                    <Input
                      value={medGeneric}
                      onChange={(e) => setMedGeneric(e.target.value)}
                      placeholder="e.g., Amoxicillin"
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={medQty}
                        onChange={(e) => setMedQty(e.target.value)}
                        placeholder="100"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Unit</Label>
                      <Select value={medUnit} onValueChange={setMedUnit}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tablets">Tablets</SelectItem>
                          <SelectItem value="capsules">Capsules</SelectItem>
                          <SelectItem value="units">Units</SelectItem>
                          <SelectItem value="ml">mL</SelectItem>
                          <SelectItem value="vials">Vials</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Select value={medPriority} onValueChange={(v) => setMedPriority(v as typeof medPriority)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={addManualItem} className="w-full">
                    Add Item
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {newItems.length > 0 && (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medication</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <p className="font-medium text-sm">{item.medicationName}</p>
                          <p className="text-xs text-muted-foreground">{item.genericName}</p>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{item.quantity}</TableCell>
                        <TableCell className="text-sm">{item.unit}</TableCell>
                        <TableCell>
                          <Badge variant={priorityColor(item.priority)} className="text-xs capitalize">
                            {item.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {newItems.length > 0 && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setShowCreate(false); setNewItems([]); setNewTitle(""); }}>
                  Cancel
                </Button>
                <Button onClick={createRequisition}>
                  <FileText className="w-4 h-4 mr-2" />
                  Create Requisition
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Existing Requisitions */}
      <div className="space-y-4">
        {requisitions.map((req) => (
          <Card key={req.id} className="overflow-hidden">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => setSelectedReq(selectedReq?.id === req.id ? null : req)}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{req.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {req.totalItems} items &middot; {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={statusColor(req.status)} className="capitalize text-xs">
                  {req.status === "analyzing" && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                  {req.status}
                </Badge>
                {(req.status === "draft" || req.status === "submitted") && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      submitForAnalysis(req.id);
                    }}
                    disabled={analyzing}
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Analyze
                  </Button>
                )}
              </div>
            </div>

            {selectedReq?.id === req.id && (
              <CardContent className="border-t pt-4">
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medication</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {req.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <p className="font-medium text-sm">{item.medicationName}</p>
                            <p className="text-xs text-muted-foreground">{item.genericName}</p>
                          </TableCell>
                          <TableCell className="text-right tabular-nums">{item.quantity}</TableCell>
                          <TableCell className="text-sm">{item.unit}</TableCell>
                          <TableCell>
                            <Badge variant={priorityColor(item.priority)} className="text-xs capitalize">
                              {item.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {item.notes || "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {req.status === "draft" && (
                  <div className="flex justify-end mt-4">
                    <Button onClick={() => submitForAnalysis(req.id)} disabled={analyzing}>
                      <Send className="w-4 h-4 mr-2" />
                      Submit for AI Analysis
                    </Button>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
