import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { captainLogout } from "@/service/API/captainAPIs";
import { Truck, LogOut, User, MapPin, DollarSign, Clock } from "lucide-react";

function CaptainHome() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await captainLogout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-captain/5 to-background p-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <Truck className="h-8 w-8 text-captain" />
          <h1 className="text-2xl font-bold text-captain">Captain Dashboard</h1>
        </div>
        <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </header>

      {/* Welcome Section */}
      <div className="mb-8">
        <Card className="border-captain/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-captain">
              <User className="h-5 w-5" />
              <span>Welcome back, Captain!</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Ready to start earning? Check your dashboard below for new ride requests and manage your vehicle status.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Earnings Card */}
        <Card className="border-captain/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-captain" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-captain">₹0.00</div>
            <p className="text-xs text-muted-foreground">Start taking rides to earn</p>
          </CardContent>
        </Card>

        {/* Rides Completed Card */}
        <Card className="border-captain/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rides Completed</CardTitle>
            <MapPin className="h-4 w-4 text-captain" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-captain">0</div>
            <p className="text-xs text-muted-foreground">Complete your first ride</p>
          </CardContent>
        </Card>

        {/* Online Time Card */}
        <Card className="border-captain/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Time</CardTitle>
            <Clock className="h-4 w-4 text-captain" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-captain">0h 0m</div>
            <p className="text-xs text-muted-foreground">Go online to start earning</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-captain/20">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-captain/10 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="h-6 w-6 text-captain" />
              </div>
              <h3 className="text-lg font-semibold">Go Online</h3>
              <p className="text-sm text-muted-foreground">
                Start receiving ride requests in your area
              </p>
              <Button className="w-full" variant="captain">
                Go Online
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-captain/20">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-captain/10 rounded-full flex items-center justify-center mx-auto">
                <User className="h-6 w-6 text-captain" />
              </div>
              <h3 className="text-lg font-semibold">Profile Settings</h3>
              <p className="text-sm text-muted-foreground">
                Update your personal and vehicle information
              </p>
              <Button className="w-full" variant="outline">
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <Card className="border-captain/20">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">Complete your first ride to see activity here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CaptainHome;
