import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprout, Truck, ShoppingCart, QrCode, Shield, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-farm-chain.jpg";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/40" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
            Farm to Fork
            <span className="block text-primary">Transparency</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            Track every step of your food's journey with blockchain-powered transparency from farm to consumer
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Tracking <QrCode className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Choose Your Role</h2>
            <p className="text-xl text-muted-foreground">
              Access your dashboard based on your role in the supply chain
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {/* Farmer Dashboard */}
            <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-farm-green group cursor-pointer"
                  onClick={() => navigate('/farmer')}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-farm-green/10 flex items-center justify-center group-hover:bg-farm-green/20 transition-colors">
                <Sprout className="h-10 w-10 text-farm-green" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Farmer</h3>
              <p className="text-muted-foreground mb-6">
                Register produce, generate QR codes, and manage your harvest data
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                <li>• Add new produce batches</li>
                <li>• Generate QR codes</li>
                <li>• Track harvest status</li>
                <li>• Upload certificates</li>
              </ul>
              <Button variant="outline" className="w-full group-hover:border-farm-green group-hover:text-farm-green">
                Access Farmer Dashboard
              </Button>
            </Card>

            {/* Distributor Dashboard */}
            <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-sky-blue group cursor-pointer"
                  onClick={() => navigate('/distributor')}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-sky-blue/10 flex items-center justify-center group-hover:bg-sky-blue/20 transition-colors">
                <Truck className="h-10 w-10 text-sky-blue" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Distributor</h3>
              <p className="text-muted-foreground mb-6">
                Scan QR codes, manage logistics, and coordinate with retailers
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                <li>• Scan product QR codes</li>
                <li>• Update logistics info</li>
                <li>• Assign to retailers</li>
                <li>• Track shipments</li>
              </ul>
              <Button variant="outline" className="w-full group-hover:border-sky-blue group-hover:text-sky-blue">
                Access Distributor Dashboard
              </Button>
            </Card>

            {/* Retailer Dashboard */}
            <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-secondary group cursor-pointer"
                  onClick={() => navigate('/retailer')}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                <ShoppingCart className="h-10 w-10 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Retailer</h3>
              <p className="text-muted-foreground mb-6">
                Receive produce, manage inventory, and prepare for consumer sales
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                <li>• Receive from distributors</li>
                <li>• Manage inventory</li>
                <li>• Mark ready for sale</li>
                <li>• Track sales</li>
              </ul>
              <Button variant="outline" className="w-full group-hover:border-secondary group-hover:text-secondary">
                Access Retailer Dashboard
              </Button>
            </Card>

            {/* Consumer Dashboard */}
            <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-primary group cursor-pointer"
                  onClick={() => navigate('/consumer')}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <QrCode className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Consumer</h3>
              <p className="text-muted-foreground mb-6">
                Scan products to view their complete journey and verify authenticity
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                <li>• Scan product QR codes</li>
                <li>• View complete journey</li>
                <li>• Check certificates</li>
                <li>• Verify authenticity</li>
              </ul>
              <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary">
                Access Consumer View
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Why Choose Our Platform?</h2>
            <p className="text-xl text-muted-foreground">
              Built for transparency, trust, and traceability
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Verified Quality</h3>
              <p className="text-muted-foreground">
                Every product comes with verified certificates and quality assurance
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                <Clock className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Real-time Tracking</h3>
              <p className="text-muted-foreground">
                Track your products in real-time from farm to your table
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-farm-green/10 flex items-center justify-center">
                <QrCode className="h-8 w-8 text-farm-green" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Easy Verification</h3>
              <p className="text-muted-foreground">
                Simple QR code scanning reveals complete product history
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;