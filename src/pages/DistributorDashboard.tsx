import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Truck, Scan, Package, MapPin, Clock, ArrowRight, Store, Thermometer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProductTimeline from "@/components/ProductTimeline";

interface LogisticsUpdate {
  id: string;
  timestamp: string;
  location: string;
  status: string;
  temperature?: string;
  notes?: string;
  updatedBy: string;
}

interface Product {
  id: string;
  name: string;
  batchId: string;
  farmer: string;
  currentLocation: string;
  status: "Picked Up" | "In Transit" | "Ready for Handover" | "Delivered to Retailer";
  assignedRetailer?: string;
  timeline: LogisticsUpdate[];
  lastUpdate: string;
}

const DistributorDashboard = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Organic Tomatoes",
      batchId: "TOM-2024-001",
      farmer: "Green Valley Farm",
      currentLocation: "Distribution Center, CA",
      status: "Ready for Handover",
      assignedRetailer: "FreshMart Grocery",
      lastUpdate: "2 hours ago",
      timeline: [
        {
          id: "1",
          timestamp: "2024-01-15T08:00:00Z",
          location: "Green Valley Farm, CA",
          status: "Picked Up from Farm",
          temperature: "4°C",
          updatedBy: "Distributor: FreshLogistics Co."
        },
        {
          id: "2", 
          timestamp: "2024-01-15T14:30:00Z",
          location: "Distribution Center, CA",
          status: "Ready for Handover",
          temperature: "3°C",
          updatedBy: "Distributor: FreshLogistics Co."
        }
      ]
    }
  ]);
  
  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [scanInput, setScanInput] = useState("");
  const [updateForm, setUpdateForm] = useState({
    location: "",
    status: "",
    temperature: "",
    notes: ""
  });

  const handleScanQR = () => {
    if (!scanInput) {
      toast({
        title: "Invalid QR Code",
        description: "Please enter a valid QR code",
        variant: "destructive"
      });
      return;
    }

    // Simulate finding product by QR code
    const found = products.find(p => p.batchId.includes(scanInput.replace(/[^A-Z0-9]/g, '')));
    
    if (found) {
      setSelectedProduct(found);
      setUpdateForm({
        location: "",
        status: "",
        temperature: "",
        notes: ""
      });
      setIsScanDialogOpen(false);
      setIsUpdateDialogOpen(true);
      
      toast({
        title: "Product Found",
        description: `${found.name} (${found.batchId}) loaded successfully`
      });
    } else {
      toast({
        title: "Product Not Found",
        description: "No product found with this QR code",
        variant: "destructive"
      });
    }
    
    setScanInput("");
  };

  const handleUpdateLogistics = () => {
    if (!selectedProduct || !updateForm.location || !updateForm.status) {
      toast({
        title: "Missing Information",
        description: "Please fill in location and status",
        variant: "destructive"
      });
      return;
    }

    const newUpdate: LogisticsUpdate = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      location: updateForm.location,
      status: updateForm.status,
      temperature: updateForm.temperature,
      notes: updateForm.notes,
      updatedBy: "Distributor: Mike Wilson"
    };

    const updatedProducts = products.map(p => 
      p.id === selectedProduct.id 
        ? {
            ...p,
            currentLocation: updateForm.location,
            status: updateForm.status as Product['status'],
            timeline: [...p.timeline, newUpdate],
            lastUpdate: "Just now"
          }
        : p
    );

    setProducts(updatedProducts);
    setIsUpdateDialogOpen(false);
    setSelectedProduct(null);
    
    toast({
      title: "Logistics Updated",
      description: `${selectedProduct.name} status updated to ${updateForm.status}`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Picked Up": return "bg-farm-green text-farm-green-foreground";
      case "In Transit": return "bg-sky-blue text-sky-blue-foreground";
      case "Ready for Handover": return "bg-earth-brown text-earth-brown-foreground";
      case "Delivered to Retailer": return "bg-primary text-primary-foreground";
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
              <div className="w-10 h-10 rounded-full bg-sky-blue/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-sky-blue" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Distributor Dashboard</h1>
                <p className="text-muted-foreground">Manage logistics and track products</p>
              </div>
            </div>
            
            <Dialog open={isScanDialogOpen} onOpenChange={setIsScanDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-sky-blue hover:bg-sky-blue/90">
                  <Scan className="h-4 w-4 mr-2" />
                  Scan QR Code
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Scan Product QR Code</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="qr-input">QR Code / Batch ID</Label>
                    <Input 
                      id="qr-input"
                      placeholder="Enter QR code or batch ID (e.g., TOM-2024-001)"
                      value={scanInput}
                      onChange={(e) => setScanInput(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      className="flex-1 bg-sky-blue hover:bg-sky-blue/90" 
                      onClick={handleScanQR}
                    >
                      <Scan className="h-4 w-4 mr-2" />
                      Scan Product
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setIsScanDialogOpen(false);
                        setScanInput("");
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

      {/* Update Logistics Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Logistics - {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-location">Current Location *</Label>
              <Input 
                id="current-location"
                placeholder="e.g., Distribution Center, CA"
                value={updateForm.location}
                onChange={(e) => setUpdateForm({...updateForm, location: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status *</Label>
              <select 
                id="status"
                className="w-full p-2 border border-input bg-background rounded-md text-foreground"
                value={updateForm.status}
                onChange={(e) => setUpdateForm({...updateForm, status: e.target.value})}
              >
                <option value="">Select Status</option>
                <option value="Picked Up">Picked Up</option>
                <option value="In Transit">In Transit</option>
                <option value="Ready for Handover">Ready for Handover</option>
                <option value="Delivered to Retailer">Delivered to Retailer</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="temperature">Storage Temperature</Label>
              <Input 
                id="temperature"
                placeholder="e.g., 4°C"
                value={updateForm.temperature}
                onChange={(e) => setUpdateForm({...updateForm, temperature: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input 
                id="notes"
                placeholder="Additional notes or observations"
                value={updateForm.notes}
                onChange={(e) => setUpdateForm({...updateForm, notes: e.target.value})}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                className="flex-1 bg-sky-blue hover:bg-sky-blue/90" 
                onClick={handleUpdateLogistics}
              >
                Update Logistics
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setIsUpdateDialogOpen(false);
                  setSelectedProduct(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Products</p>
                  <p className="text-2xl font-bold text-foreground">{products.length}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">In Transit</p>
                  <p className="text-2xl font-bold text-sky-blue">
                    {products.filter(p => p.status === "In Transit").length}
                  </p>
                </div>
                <Truck className="h-8 w-8 text-sky-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Ready for Handover</p>
                  <p className="text-2xl font-bold text-earth-brown">
                    {products.filter(p => p.status === "Ready for Handover").length}
                  </p>
                </div>
                <MapPin className="h-8 w-8 text-earth-brown" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Delivered to Retailer</p>
                  <p className="text-2xl font-bold text-primary">
                    {products.filter(p => p.status === "Delivered to Retailer").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">Product Tracking</h2>
          
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-foreground">{product.name}</CardTitle>
                    <p className="text-muted-foreground text-sm">{product.batchId} • {product.farmer}</p>
                  </div>
                  <Badge className={getStatusColor(product.status)}>
                    {product.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      Current Location: {product.currentLocation}
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      Last Update: {product.lastUpdate}
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Thermometer className="h-4 w-4 mr-2" />
                      Temperature: {product.timeline[product.timeline.length - 1]?.temperature || "N/A"}
                    </div>
                  </div>
                  
                  <div>
                    <ProductTimeline updates={product.timeline} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DistributorDashboard;