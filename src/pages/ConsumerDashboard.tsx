import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingCart, Scan, Shield, MapPin, Clock, Thermometer, Star, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProductTimeline from "@/components/ProductTimeline";

interface ProductInfo {
  id: string;
  name: string;
  batchId: string;
  farmer: {
    name: string;
    location: string;
    certifications: string[];
  };
  currentLocation: string;
  status: string;
  harvestDate: string;
  timeline: Array<{
    id: string;
    timestamp: string;
    location: string;
    status: string;
    temperature?: string;
    notes?: string;
    updatedBy: string;
  }>;
  certificates: string[];
  priceHistory: Array<{
    date: string;
    price: number;
    location: string;
  }>;
  qualityRating: number;
}

const ConsumerDashboard = () => {
  const { toast } = useToast();
  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false);
  const [scanInput, setScanInput] = useState("");
  const [scannedProduct, setScannedProduct] = useState<ProductInfo | null>(null);

  // Mock product data that would come from scanning
    const mockProductData: ProductInfo = {
    id: "1",
    name: "Organic Tomatoes",
    batchId: "TOM-2024-001",
    farmer: {
      name: "Green Valley Farm",
      location: "Fresno County, California",
      certifications: ["USDA Organic", "Non-GMO Project", "Fair Trade"]
    },
    currentLocation: "FreshMart Grocery, San Francisco",
    status: "Available for Purchase",
    harvestDate: "2024-01-15",
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
        timestamp: "2024-01-15T14:30:00Z",
        location: "Farm Processing Center, CA",
        status: "Processed & Packaged",
        temperature: "4°C",
        updatedBy: "Quality Control: James Liu"
      },
      {
        id: "3",
        timestamp: "2024-01-16T09:00:00Z",
        location: "Distribution Center, CA",
        status: "Picked Up by Distributor",
        temperature: "3°C",
        updatedBy: "Distributor: FreshLogistics Co."
      },
      {
        id: "4",
        timestamp: "2024-01-17T10:15:00Z",
        location: "Retailer Warehouse, SF",
        status: "Delivered to Retailer",
        temperature: "4°C",
        updatedBy: "Retailer: FreshMart Grocery"
      },
      {
        id: "5",
        timestamp: "2024-01-17T15:20:00Z",
        location: "FreshMart Grocery, SF",
        status: "Available for Purchase",
        temperature: "4°C",
        updatedBy: "Store Manager: Lisa Chen"
      }
    ],
    certificates: ["Organic Certificate #ORG-2024-001", "Quality Assurance Report", "Pesticide Test Results"],
    priceHistory: [
      { date: "2024-01-15", price: 4.50, location: "Farm Gate" },
      { date: "2024-01-16", price: 5.25, location: "Distribution Center" },
      { date: "2024-01-17", price: 6.99, location: "Retail Store" }
    ],
    qualityRating: 4.8
  };

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
    if (scanInput.toLowerCase().includes("tom") || scanInput.includes("2024")) {
      setScannedProduct(mockProductData);
      setIsScanDialogOpen(false);
      
      toast({
        title: "Product Found!",
        description: `${mockProductData.name} information loaded successfully`
      });
    } else {
      toast({
        title: "Product Not Found",
        description: "No product found with this QR code. Try 'TOM-2024-001'",
        variant: "destructive"
      });
    }
    
    setScanInput("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Product Verification</h1>
                <p className="text-muted-foreground">Scan to verify product authenticity and journey</p>
              </div>
            </div>
            
            <Dialog open={isScanDialogOpen} onOpenChange={setIsScanDialogOpen}>
              <DialogTrigger asChild>
                <Button>
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
                      placeholder="Enter QR code or try 'TOM-2024-001'"
                      value={scanInput}
                      onChange={(e) => setScanInput(e.target.value)}
                    />
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
                    <p className="font-medium mb-2">Demo Instructions:</p>
                    <p>Try scanning with: <code className="bg-background px-2 py-1 rounded">TOM-2024-001</code></p>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      className="flex-1" 
                      onClick={handleScanQR}
                    >
                      <Scan className="h-4 w-4 mr-2" />
                      Verify Product
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!scannedProduct ? (
          /* Welcome State */
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Scan className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-foreground">Scan to Verify Your Food</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Use your phone camera or enter a QR code to see the complete journey of your food from farm to table
            </p>
            <Button 
              size="lg" 
              onClick={() => setIsScanDialogOpen(true)}
              className="text-lg px-8 py-6"
            >
              <Scan className="h-5 w-5 mr-2" />
              Start Scanning
            </Button>
            
            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-farm-green/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-farm-green" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Verify Authenticity</h3>
                <p className="text-muted-foreground">
                  Confirm your product is genuine and meets quality standards
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sky-blue/10 flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-sky-blue" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Track Journey</h3>
                <p className="text-muted-foreground">
                  See exactly where your food has been from farm to store
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">View Certificates</h3>
                <p className="text-muted-foreground">
                  Access organic certifications and quality documents
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Product Information */
          <div className="space-y-8">
            {/* Product Header */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5 border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl text-foreground">{scannedProduct.name}</CardTitle>
                    <p className="text-muted-foreground">Batch ID: {scannedProduct.batchId}</p>
                    <div className="flex items-center mt-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="ml-1 text-sm font-medium">{scannedProduct.qualityRating}/5.0</span>
                      <span className="ml-2 text-sm text-muted-foreground">Quality Rating</span>
                    </div>
                  </div>
                  <Badge className="bg-primary text-primary-foreground">
                    Verified Authentic
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Farm Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">{scannedProduct.farmer.name}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="w-4 h-4 mr-2"></span>
                        {scannedProduct.farmer.location}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        Harvested: {formatDate(scannedProduct.harvestDate)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Thermometer className="h-4 w-4 mr-2" />
                        Current Storage: {scannedProduct.timeline[scannedProduct.timeline.length - 1]?.temperature}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {scannedProduct.farmer.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Journey Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <MapPin className="h-5 w-5 mr-2" />
                  Product Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProductTimeline updates={scannedProduct.timeline} showFullTimeline={true} />
              </CardContent>
            </Card>

            {/* Price History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Price Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scannedProduct.priceHistory.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{entry.location}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(entry.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">${entry.price}/lb</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certificates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Shield className="h-5 w-5 mr-2" />
                  Quality Certificates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {scannedProduct.certificates.map((cert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <span className="font-medium text-foreground">{cert}</span>
                      <Button variant="outline" size="sm">
                        View Document
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-8">
              <Button 
                onClick={() => setScannedProduct(null)}
                variant="outline"
                className="px-8"
              >
                Scan Another Product
              </Button>
              <Button className="px-8">
                Share Product Info
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ConsumerDashboard;