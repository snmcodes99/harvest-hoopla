import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Thermometer, User } from "lucide-react";

interface LogisticsUpdate {
  id: string;
  timestamp: string;
  location: string;
  status: string;
  temperature?: string;
  notes?: string;
  updatedBy: string;
}

interface ProductTimelineProps {
  updates: LogisticsUpdate[];
  showFullTimeline?: boolean;
}

const ProductTimeline = ({ updates, showFullTimeline = false }: ProductTimelineProps) => {
  const displayUpdates = showFullTimeline ? updates : updates.slice(-3);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Picked Up": return "bg-farm-green text-farm-green-foreground";
      case "In Transit": return "bg-sky-blue text-sky-blue-foreground";
      case "At Warehouse": return "bg-earth-brown text-earth-brown-foreground";
      case "Out for Delivery": return "bg-secondary text-secondary-foreground";
      case "Delivered": return "bg-primary text-primary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground text-sm">
        {showFullTimeline ? "Complete Journey" : "Recent Updates"}
      </h3>
      
      <div className="space-y-3">
        {displayUpdates.map((update, index) => {
          const { date, time } = formatDate(update.timestamp);
          const isLatest = index === 0 && !showFullTimeline;
          
          return (
            <div key={update.id} className="relative">
              {index < displayUpdates.length - 1 && (
                <div className="absolute left-4 top-8 h-6 w-px bg-border" />
              )}
              
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full border-2 ${isLatest ? 'border-primary bg-primary' : 'border-border bg-background'} flex items-center justify-center`}>
                  <div className={`w-2 h-2 rounded-full ${isLatest ? 'bg-primary-foreground' : 'bg-muted-foreground'}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <Card className={`p-3 ${isLatest ? 'border-primary/20 bg-primary/5' : ''}`}>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getStatusColor(update.status)}>
                        {update.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground text-right">
                        <div>{date}</div>
                        <div>{time}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-foreground">
                        <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                        {update.location}
                      </div>
                      
                      {update.temperature && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Thermometer className="h-3 w-3 mr-1" />
                          {update.temperature}
                        </div>
                      )}
                      
                      <div className="flex items-center text-xs text-muted-foreground">
                        <User className="h-3 w-3 mr-1" />
                        {update.updatedBy}
                      </div>
                      
                      {update.notes && (
                        <div className="text-xs text-muted-foreground mt-1 italic">
                          "{update.notes}"
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {!showFullTimeline && updates.length > 3 && (
        <div className="text-center">
          <button className="text-xs text-primary hover:underline">
            View Complete Timeline ({updates.length} updates)
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductTimeline;