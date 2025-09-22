import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { setToken } from "@/utils/cookieUtils";
import { userLogin } from "@/service/API/userAPIs";

const UserLogin = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.email.length < 3) {
      toast({
        title: "Invalid Email",
        description: "Email must be at least 3 characters",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 3) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 3 characters",
        variant: "destructive",
      });
      return;
    }

    const userData = {
      email: formData.email,
      password: formData.password,
    };
    try {
      const response = await userLogin(userData);
      if (response.status === 200) {
        toast({
          title: "Welcome back!",
          description: "Login successful",
        });

        // Set token in cookie using utility
        if (response.data.token) {
          setToken(response.data.token);
        }

        navigate("/home");
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
        navigate("/user/login");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFormData({
        email: "",
        password: "",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">DropBy</span>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your account to book rides and deliveries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" variant="hero">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <Link
              to="/user/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up here
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/captain/login"
              className="text-captain hover:underline font-medium text-sm"
            >
              Are you a captain? Login here
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserLogin;
