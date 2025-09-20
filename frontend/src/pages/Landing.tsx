import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import { Car, Truck, Clock, Shield, Star, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import featuresImage from "@/assets/features-image.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-hero/10 to-accent/5" />
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Your Ride, Your Way with{" "}
                <span className="bg-gradient-to-r from-hero to-accent bg-clip-text text-transparent">
                  DropBy
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Fast, reliable transportation and delivery services at your fingertips. 
                Book a ride or get your packages delivered in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-hero to-hero/90 hover:from-hero/90 hover:to-hero shadow-elegant" asChild>
                  <Link to="/user/signup">Get Started as User</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-captain text-captain hover:bg-captain hover:text-captain-foreground" asChild>
                  <Link to="/captain/signup">Drive with DropBy</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="DropBy Transportation Services" 
                className="w-full h-[400px] md:h-[500px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose DropBy?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide the best transportation and delivery experience with cutting-edge technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Quick Booking</h3>
                <p className="text-muted-foreground">Book your ride or delivery in under 30 seconds</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
                <p className="text-muted-foreground">Verified drivers and secure payment options</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
                <p className="text-muted-foreground">Track your ride or delivery in real-time</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Top Rated</h3>
                <p className="text-muted-foreground">5-star service from verified drivers</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Car className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Multiple Options</h3>
                <p className="text-muted-foreground">Cars, motorcycles, and auto rickshaws</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Delivery Service</h3>
                <p className="text-muted-foreground">Fast and reliable package delivery</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src={featuresImage} 
                alt="DropBy Features" 
                className="w-full h-[400px] object-cover rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Experience the Future of Transportation?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of satisfied customers who trust DropBy for their daily commute and delivery needs.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold mb-2">For Riders</h3>
                  <p className="text-muted-foreground mb-4">Book rides and deliveries</p>
                  <Button className="w-full bg-gradient-to-r from-hero to-hero/90" asChild>
                    <Link to="/user/signup">Sign Up as User</Link>
                  </Button>
                </Card>
                
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold mb-2">For Drivers</h3>
                  <p className="text-muted-foreground mb-4">Earn money driving</p>
                  <Button className="w-full bg-gradient-to-r from-captain to-captain/90" asChild>
                    <Link to="/captain/signup">Join as Captain</Link>
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/50 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">DropBy</span>
            </div>
            <p className="text-muted-foreground">© 2025 DropBy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;