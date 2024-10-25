'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function EmailCampaignPage() {
  const [product, setProduct] = useState('');
  const [region, setRegion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const { toast } = useToast();

  const handleCraftEmail = async () => {
    if (!product.trim() || !region.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both product and region fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/craft-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product, region }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to craft email');
      }

      toast({
        title: "Success",
        description: "Emails sent successfully!",
      });

      // Reset form
      setProduct('');
      setRegion('');
      setEmailContent('');

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send emails",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Email Campaign</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create Targeted Email Campaign</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product</label>
            <Input
              placeholder="Enter product name"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Region</label>
            <Input
              placeholder="Enter target region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button 
            onClick={handleCraftEmail} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Sending...' : 'Craft & Send Email'}
          </Button>
        </CardContent>
      </Card>

      {emailContent && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Email Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
              {emailContent}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
