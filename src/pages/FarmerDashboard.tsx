import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sprout, Plus, QrCode, MapPin, Calendar, Package, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Produce {
  id: string;
  name: string;
  batchId: string;
  harvestDate: string;
  farmLocation: string;
  basePrice: number;
  status: "In Farm" | "Assigned to Distributor" | "Delivered to Retailer" | "Sold";
  qrCode: string;
  certificate?: string;
}

const FarmerDashboard = () => {
  const { toast } = useToast();
  const [produces, setProduces] = useState<Produce[]>([
    {
      id: "1",
      name: "Organic Tomatoes",
      batchId: "TOM-2024-001",
      harvestDate: "2024-01-15",
      farmLocation: "Green Valley Farm, CA",
      basePrice: 4.50,
      status: "Delivered to Retailer",
      qrCode: "QR_TOM_2024_001"
    },
    {
      id: "2", 
      name: "Fresh Lettuce",
      batchId: "LET-2024-002",
      harvestDate: "2024-01-18",
      farmLocation: "Green Valley Farm, CA",
      basePrice: 2.25,
      status: "Assigned to Distributor",
      qrCode: "QR_LET_2024_002"
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduce, setNewProduce] = useState({
    name: "",
    harvestDate: "",
    farmLocation: "",
    basePrice: "",
    certificate: ""
  });

  const generateBatchId = (name: string): string => {
    const prefix = name.substring(0, 3).toUpperCase();
    const year = new Date().getFullYear();
    const sequence = String(produces.length + 1).padStart(3, '0');
    return `${prefix}-${year}-${sequence}`;
  };

  const generateQrCode = (batchId: string): string => {
    return `QR_${batchId.replace(/-/g, '_')}`;
  };

  const handleAddProduce = () => {
    if (!newProduce.name || !newProduce.harvestDate || !newProduce.farmLocation || !newProduce.basePrice) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const batchId = generateBatchId(newProduce.name);
    const qrCode = generateQrCode(batchId);
    
    const produce: Produce = {
      id: Date.now().toString(),
      name: newProduce.name,
      batchId,
      harvestDate: newProduce.harvestDate,
      farmLocation: newProduce.farmLocation,
      basePrice: parseFloat(newProduce.basePrice),
      status: "In Farm",
      qrCode,
      certificate: newProduce.certificate
    };

    setProduces([...produces, produce]);
    setNewProduce({
      name: "",
      harvestDate: "",
      farmLocation: "",
      basePrice: "",
      certificate: ""
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Produce Added Successfully",
      description: `${produce.name} with batch ID ${batchId} has been registered`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Farm": return "bg-farm-green text-farm-green-foreground";
      case "Assigned to Distributor": return "bg-sky-blue text-sky-blue-foreground";
      case "Delivered to Retailer": return "bg-secondary text-secondary-foreground";
      case "Sold": return "bg-primary text-primary-foreground";
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
              <div className="w-10 h-10 rounded-full bg-farm-green/10 flex items-center justify-center">
                <Sprout className="h-6 w-6 text-farm-green" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Farmer Dashboard</h1>
                <p className="text-muted-foreground">Manage your produce and generate QR codes</p>
              </div>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-farm-green hover:bg-farm-green/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Produce
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Produce</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="produce-name">Produce Name *</Label>
                    <Input 
                      id="produce-name"
                      placeholder="e.g., Organic Tomatoes"
                      value={newProduce.name}
                      onChange={(e) => setNewProduce({...newProduce, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="harvest-date">Harvest Date *</Label>
                    <Input 
                      id="harvest-date"
                      type="date"
                      value={newProduce.harvestDate}
                      onChange={(e) => setNewProduce({...newProduce, harvestDate: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="farm-location">Farm Location *</Label>
                    <Input 
                      id="farm-location"
                      placeholder="e.g., Green Valley Farm, CA"
                      value={newProduce.farmLocation}
                      onChange={(e) => setNewProduce({...newProduce, farmLocation: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="base-price">Base Price ($/lb) *</Label>
                    <Input 
                      id="base-price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newProduce.basePrice}
                      onChange={(e) => setNewProduce({...newProduce, basePrice: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="certificate">Certificate (Optional)</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="certificate"
                        placeholder="Upload certificate file"
                        value={newProduce.certificate}
                        readOnly
                      />
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      className="flex-1 bg-farm-green hover:bg-farm-green/90" 
                      onClick={handleAddProduce}
                    >
                      Add Produce
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setIsAddDialogOpen(false)}
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
                  <p className="text-muted-foreground text-sm">Total Batches</p>
                  <p className="text-2xl font-bold text-foreground">{produces.length}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">In Farm</p>
                  <p className="text-2xl font-bold text-farm-green">
                    {produces.filter(p => p.status === "In Farm").length}
                  </p>
                </div>
                <Sprout className="h-8 w-8 text-farm-green" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Assigned to Distributor</p>
                  <p className="text-2xl font-bold text-sky-blue">
                    {produces.filter(p => p.status === "Assigned to Distributor").length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-sky-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Delivered to Retailer</p>
                  <p className="text-2xl font-bold text-secondary">
                    {produces.filter(p => p.status === "Delivered to Retailer").length}
                  </p>
                </div>
                <QrCode className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Sold</p>
                  <p className="text-2xl font-bold text-primary">
                    {produces.filter(p => p.status === "Sold").length}
                  </p>
                </div>
                <QrCode className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Produce Grid */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-6">My Produce</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produces.map((produce) => (
              <Card key={produce.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-foreground">{produce.name}</CardTitle>
                      <p className="text-muted-foreground text-sm">{produce.batchId}</p>
                    </div>
                    <Badge className={getStatusColor(produce.status)}>
                      {produce.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      Harvested: {new Date(produce.harvestDate).toLocaleDateString()}
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {produce.farmLocation}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-lg font-semibold text-primary">
                        ${produce.basePrice}/lb
                      </span>
                      <Button variant="outline" size="sm">
                        <QrCode className="h-4 w-4 mr-1" />
                        QR: {produce.qrCode}
                      </Button>
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

export default FarmerDashboard;