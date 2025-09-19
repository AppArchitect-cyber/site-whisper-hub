import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Globe, MessageSquare } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Multi-Site Management System
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Manage 10 static websites with configurable WhatsApp numbers from a single admin dashboard
          </p>
          <Link to="/login">
            <Button size="lg" className="text-lg px-8 py-3">
              <Settings className="mr-2 h-5 w-5" />
              Access Admin Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Globe className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>10 Static Sites</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Each site is deployed on its own domain with customizable WhatsApp integration
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>WhatsApp Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Each site displays its own WhatsApp number for customer contact
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Settings className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Centralized Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Update WhatsApp numbers and manage all sites from a single admin interface
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
