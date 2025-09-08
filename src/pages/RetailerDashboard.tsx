import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Store, Package, CheckCircle, Scan, BarChart3, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProductTimeline from "@/components/ProductTimeline";

interface InventoryItem {
  id: string;
  name: string;
  batchId: string;
  farmer: string;
  distributor: string;
  receivedDate: string;
  quantity: number;
  status: "Received" | "In Stock" | "Ready for Sale" | "Sold Out";
  salePrice: number;
  timeline: Array<{
    id: string;
    timestamp: string;
    location: string;
    status: string;
    temperature?: string;
    notes?: string;
    updatedBy: string;
  }>;
}

const RetailerDashboard = () => {
  const { toast } = useToast();
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "1",
      name: "Organic Tomatoes",
      batchId: "TOM-2024-001",
      farmer: "Green Valley Farm",
      distributor: "FreshLogistics Co.",
      receivedDate: "2024-01-17",
      quantity: 50,
      status: "Ready for Sale",
      salePrice: 6.99,
      timeline: [
        {
          id: "1",
          timestamp: "2024-01-15T08:00:00Z",
          location: "Green Valley Farm, CA",
          status: "Harvested",
          temperature: "22°C",
          updatedBy: "Farmer: Maria Rodriguez"
        },
        {
          id: "2",
          timestamp: "2024-01-16T09:00:00Z",
          location: "Distribution Center, CA",
          status: "Picked Up by Distributor",
          temperature: "4°C",
          updatedBy: "Distributor: FreshLogistics Co."
        },
        {
          id: "3",
          timestamp: "2024-01-17T15:20:00Z",
          location: "FreshMart Grocery, SF",
          status: "Delivered to Retailer",
          temperature: "4°C",
          updatedBy: "Retailer: FreshMart Grocery"
        }
      ]
    },
    {
      id: "2",
      name: "Fresh Lettuce",
      batchId: "LET-2024-002",
      farmer: "Green Valley Farm",
      distributor: "FreshLogistics Co.",
      receivedDate: "2024-01-18",
      quantity: 30,
      status: "In Stock",
      salePrice: 3.99,
      timeline: [
        {
          id: "1",
          timestamp: "2024-01-18T08:00:00Z",
          location: "Green Valley Farm, CA",
          status: "Harvested",
          temperature: "20°C",
          updatedBy: "Farmer: Maria Rodriguez"
        },
        {
          id: "2",
          timestamp: "2024-01-18T16:30:00Z",
          location: "FreshMart Grocery, SF",
          status: "Delivered to Retailer",
          temperature: "3°C",
          updatedBy: "Retailer: FreshMart Grocery"
        }
      ]
    }
  ]);
  
  const [isReceiveDialogOpen, setIsReceiveDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [receiveForm, setReceiveForm] = useState({
    batchId: "",
    quantity: "",
    storageLocation: ""
  });

  const handleReceiveProduce = () => {
    if (!receiveForm.batchId || !receiveForm.quantity) {
      toast({
        title: "Missing Information",
        description: "Please fill in batch ID and quantity",
        variant: "destructive"
      });
      return;
    }

    // Simulate receiving produce from distributor
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: "New Produce",
      batchId: receiveForm.batchId,
      farmer: "Demo Farm",
      distributor: "Demo Logistics",
      receivedDate: new Date().toISOString().split('T')[0],
      quantity: parseInt(receiveForm.quantity),
      status: "Received",
      salePrice: 0,
      timeline: [
        {
          id: "1",
          timestamp: new Date().toISOString(),
          location: receiveForm.storageLocation || "FreshMart Grocery",
          status: "Received by Retailer",
          updatedBy: "Retailer: Store Manager"
        }
      ]
    };

    setInventory([newItem, ...inventory]);
    setReceiveForm({ batchId: "", quantity: "", storageLocation: "" });
    setIsReceiveDialogOpen(false);
    
    toast({
      title: "Produce Received",
      description: `Batch ${receiveForm.batchId} has been added to inventory`
    });
  };

  const handleMarkReadyForSale = (item: InventoryItem) => {
    const updatedInventory = inventory.map(inv => 
      inv.id === item.id 
        ? {
            ...inv,
            status: "Ready for Sale" as const,
            salePrice: inv.salePrice || 5.99,
            timeline: [
              ...inv.timeline,
              {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                location: "FreshMart Grocery - Sales Floor",
                status: "Ready for Sale",
                updatedBy: "Retailer: Store Manager"
              }
            ]
          }
        : inv
    );
    
    setInventory(updatedInventory);
    toast({
      title: "Product Ready",
      description: `${item.name} is now available for sale`
    });
  };

  const handleMarkSold = (item: InventoryItem) => {
    const updatedInventory = inventory.map(inv => 
      inv.id === item.id 
        ? {
            ...inv,
            status: "Sold Out" as const,
            timeline: [
              ...inv.timeline,
              {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                location: "FreshMart Grocery - Checkout",
                status: "Sold to Consumer",
                updatedBy: "Retailer: Cashier System"
              }
            ]
          }
        : inv
    );
    
    setInventory(updatedInventory);
    toast({
      title: "Product Sold",
      description: `${item.name} batch has been sold out`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Received": return "bg-sky-blue text-sky-blue-foreground";
      case "In Stock": return "bg-earth-brown text-earth-brown-foreground";
      case "Ready for Sale": return "bg-primary text-primary-foreground";
      case "Sold Out": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Store className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Retailer Dashboard</h1>
                <p className="text-muted-foreground">Manage inventory and sales</p>
              </div>
            </div>
            
            <Dialog open={isReceiveDialogOpen} onOpenChange={setIsReceiveDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-secondary hover:bg-secondary/90">
                  <Package className="h-4 w-4 mr-2" />
                  Receive Produce
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Receive Produce from Distributor</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="batch-id">Batch ID *</Label>
                    <Input 
                      id="batch-id"
                      placeholder="e.g., TOM-2024-003"
                      value={receiveForm.batchId}
                      onChange={(e) => setReceiveForm({...receiveForm, batchId: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="quantity">Quantity (lbs) *</Label>
                    <Input 
                      id="quantity"
                      type="number"
                      placeholder="e.g., 25"
                      value={receiveForm.quantity}
                      onChange={(e) => setReceiveForm({...receiveForm, quantity: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="storage-location">Storage Location</Label>
                    <Input 
                      id="storage-location"
                      placeholder="e.g., Cold Storage Room A"
                      value={receiveForm.storageLocation}
                      onChange={(e) => setReceiveForm({...receiveForm, storageLocation: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      className="flex-1 bg-secondary hover:bg-secondary/90" 
                      onClick={handleReceiveProduce}
                    >
                      Confirm Receipt
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setIsReceiveDialogOpen(false);
                        setReceiveForm({ batchId: "", quantity: "", storageLocation: "" });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Items</p>
                  <p className="text-2xl font-bold text-foreground">{inventory.length}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Ready for Sale</p>
                  <p className="text-2xl font-bold text-primary">
                    {inventory.filter(item => item.status === "Ready for Sale").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">In Stock</p>
                  <p className="text-2xl font-bold text-secondary">
                    {inventory.filter(item => item.status === "In Stock").length}
                  </p>
                </div>
                <Store className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Sold Out</p>
                  <p className="text-2xl font-bold text-muted-foreground">
                    {inventory.filter(item => item.status === "Sold Out").length}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Management */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-6">Inventory Management</h2>
          <div className="grid gap-6">
            {inventory.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-foreground">{item.name}</CardTitle>
                      <p className="text-muted-foreground text-sm">{item.batchId} • {item.farmer}</p>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Package className="h-4 w-4 mr-2" />
                        Quantity: {item.quantity} lbs
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        Received: {new Date(item.receivedDate).toLocaleDateString()}
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        From: {item.distributor}
                      </div>
                      
                      {item.salePrice > 0 && (
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-lg font-semibold text-primary">
                            ${item.salePrice}/lb
                          </span>
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-2">
                        {item.status === "Received" || item.status === "In Stock" ? (
                          <Button 
                            onClick={() => handleMarkReadyForSale(item)}
                            size="sm"
                            className="bg-primary hover:bg-primary/90"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Ready for Sale
                          </Button>
                        ) : item.status === "Ready for Sale" ? (
                          <Button 
                            onClick={() => handleMarkSold(item)}
                            size="sm"
                            variant="outline"
                          >
                            Mark as Sold
                          </Button>
                        ) : null}
                      </div>
                    </div>
                    
                    <div>
                      <ProductTimeline updates={item.timeline} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RetailerDashboard;