'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { EmailTemplate } from "@/components/email-template";

export default function EmailCampaignPage() {
  const [product, setProduct] = useState('');
  const [region, setRegion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [recipientCount, setRecipientCount] = useState(0);
  const { toast } = useToast();

  const handlePreviewEmail = async () => {
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
      console.log('Sending preview request...');
      const response = await fetch('/api/craft-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          product, 
          region,
          previewOnly: true 
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate email preview');
      }

      setEmailContent(data.emailContent);
      setRecipientCount(data.recipientCount);

      toast({
        title: "Success",
        description: `Email preview generated for ${data.recipientCount} recipients`,
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate preview",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailContent) {
      toast({
        title: "Error",
        description: "Please generate a preview first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Sending email...');
      const response = await fetch('/api/craft-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          product, 
          region,
          previewOnly: false 
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send emails');
      }

      toast({
        title: "Success",
        description: `Emails sent successfully to ${data.recipientCount} recipients!`,
      });

      // Reset form
      setProduct('');
      setRegion('');
      setEmailContent('');
      setRecipientCount(0);

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create Email Campaign</CardTitle>
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
              onClick={handlePreviewEmail} 
              disabled={isLoading}
              className="w-full mb-2"
            >
              {isLoading ? 'Generating...' : 'Generate Preview'}
            </Button>

            {emailContent && (
              <Button 
                onClick={handleSendEmail} 
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Sending...' : `Send to ${recipientCount} Recipients`}
              </Button>
            )}
          </CardContent>
        </Card>

        {emailContent && (
          <Card>
            <CardHeader>
              <CardTitle>Email Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-white">
                <EmailTemplate 
                  firstName="Preview Customer"
                  content={emailContent}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
