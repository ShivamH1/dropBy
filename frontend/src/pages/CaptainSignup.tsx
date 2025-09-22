import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, Mail, Lock, User, Car, Hash, Palette, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { setToken } from "@/utils/cookieUtils";
import { captainRegister } from "@/service/API/captainAPIs";

const CaptainSignup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    vehicleColor: "",
    plateNumber: "",
    capacity: "",
    vehicleType: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.firstName.length < 3) {
      toast({
        title: "Invalid First Name",
        description: "First name must be at least 3 characters",
        variant: "destructive",
      });
      return;
    }

    if (formData.lastName && formData.lastName.length < 3) {
      toast({
        title: "Invalid Last Name",
        description: "Last name must be at least 3 characters",
        variant: "destructive",
      });
      return;
    }

    if (formData.email.length < 3) {
      toast({
        title: "Invalid Email",
        description: "Email must be at least 3 characters",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    if (!formData.vehicleColor || !formData.plateNumber || !formData.vehicleType) {
      toast({
        title: "Missing Vehicle Information",
        description: "Please fill in all vehicle details",
        variant: "destructive",
      });
      return;
    }

    if (!formData.capacity || parseInt(formData.capacity) < 1) {
      toast({
        title: "Invalid Capacity",
        description: "Capacity must be at least 1",
        variant: "destructive",
      });
      return;
    }

    const newCaptain = {
      fullName: {
        firstName: formData.firstName,
        lastName: formData.lastName,
      },
      email: formData.email,
      password: formData.password,
      vehicle: {
        color: formData.vehicleColor,
        plateNumber: formData.plateNumber,
        capacity: parseInt(formData.capacity),
        vehicleType: formData.vehicleType,
      },
    };

    try {
      const response = await captainRegister(newCaptain);

      if (response.status === 201) {
        toast({
          title: "Captain Account Created!",
          description: "Welcome to the DropBy Captain community",
        });

        // Set token in cookie using utility
        if (response.data.token) {
          setToken(response.data.token);
        }

        navigate("/captain-home");
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
        navigate("/captain/login");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Signup failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        vehicleColor: "",
        plateNumber: "",
        capacity: "",
        vehicleType: "",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-captain/5 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-captain/20">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Truck className="h-8 w-8 text-captain" />
            <span className="text-2xl font-bold text-captain">DropBy Captain</span>
          </div>
          <CardTitle className="text-2xl">Join as Captain</CardTitle>
          <CardDescription>
            Start earning money by driving with DropBy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-captain">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password (min. 6 chars)"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-captain">Vehicle Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type *</Label>
                  <Select onValueChange={(value) => handleSelectChange('vehicleType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="auto rickshaw">Auto Rickshaw</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity *</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      placeholder="Passenger capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      className="pl-10"
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleColor">Vehicle Color *</Label>
                  <div className="relative">
                    <Palette className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="vehicleColor"
                      name="vehicleColor"
                      placeholder="e.g., Red, Blue, White"
                      value={formData.vehicleColor}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="plateNumber">Plate Number *</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="plateNumber"
                      name="plateNumber"
                      placeholder="e.g., ABC-1234"
                      value={formData.plateNumber}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" variant="captain">
              Create Captain Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have a captain account? </span>
            <Link to="/captain/login" className="text-captain hover:underline font-medium">
              Sign in here
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link to="/user/signup" className="text-primary hover:underline font-medium text-sm">
              Want to be a user instead? Join here
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-muted-foreground hover:text-foreground text-sm">
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CaptainSignup;