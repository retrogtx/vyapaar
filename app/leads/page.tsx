'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, Plus, X, Users, Activity, Twitter, MessageSquare, Copy, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataTable } from '@/components/ui/data-table';
import { columns, Lead } from './columns';

interface LeadWithMessage extends Lead {
  generatedMessage?: string;
  isGenerating?: boolean;
}

interface MessageTemplate {
  id: string;
  name: string;
  style: string;
  description: string;
}

export default function LeadsPage() {
  const [topics, setTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState('');
  const [leads, setLeads] = useState<LeadWithMessage[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [filters, setFilters] = useState({
    minFollowers: 1000,
    minEngagement: 10,
  });
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [messageTemplates] = useState<MessageTemplate[]>([
    {
      id: 'casual',
      name: 'Casual',
      style: 'friendly and conversational',
      description: 'A relaxed, approachable tone'
    },
    {
      id: 'professional',
      name: 'Professional',
      style: 'formal and business-focused',
      description: 'Traditional business communication'
    },
    {
      id: 'direct',
      name: 'Direct',
      style: 'concise and straightforward',
      description: 'Straight to the point'
    }
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('casual');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isMonitoring) {
      fetchLeads();
      
      interval = setInterval(fetchLeads, 60000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring]);

  const addTopic = () => {
    if (newTopic && !topics.includes(newTopic)) {
      setTopics([...topics, newTopic]);
      setNewTopic('');
    }
  };

  const removeTopic = (topic: string) => {
    setTopics(topics.filter(t => t !== topic));
  };

  const startMonitoring = async () => {
    if (topics.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one topic to monitor",
        variant: "destructive",
      });
      return;
    }

    setIsMonitoring(true);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/twitter-monitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topics,
          filters: [
            { type: 'followerCount', minFollowers: filters.minFollowers },
            { type: 'engagement', minEngagement: filters.minEngagement },
          ],
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch leads');

      const data = await response.json();
      setLeads(prevLeads => {
        const newLeads = data.leads.filter(
          (lead: Lead) => !prevLeads.find(p => p.id === lead.id)
        );
        return [...newLeads, ...prevLeads];
      });

    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error",
        description: "Failed to fetch leads",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (text: string, leadId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(leadId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateMessage = async (lead: LeadWithMessage) => {
    try {
      setLeads(prevLeads => 
        prevLeads.map(l => 
          l.id === lead.id 
            ? { ...l, isGenerating: true }
            : l
        )
      );

      const response = await fetch('/api/generate-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lead,
          matchedTopics: lead.topics,
          template: selectedTemplate
        }),
      });

      if (!response.ok) throw new Error('Failed to generate message');

      const data = await response.json();
      
      setLeads(prevLeads => 
        prevLeads.map(l => 
          l.id === lead.id 
            ? { ...l, generatedMessage: data.message, isGenerating: false }
            : l
        )
      );

      toast({
        title: "Message Generated",
        description: "Custom message has been created for this lead",
      });

    } catch (error) {
      console.error('Error generating message:', error);
      // Reset loading state on error
      setLeads(prevLeads => 
        prevLeads.map(l => 
          l.id === lead.id 
            ? { ...l, isGenerating: false }
            : l
        )
      );
      toast({
        title: "Error",
        description: "Failed to generate message",
        variant: "destructive",
      });
    }
  };

  const columnsWithMessage = [
    ...columns,
    {
      id: 'actions',
      cell: ({ row }) => {
        const lead = row.original as LeadWithMessage;
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="h-8 rounded-md border border-input bg-background px-2 text-sm"
              >
                {messageTemplates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateMessage(lead)}
                className="flex items-center gap-1"
                disabled={lead.isGenerating}
              >
                {lead.isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MessageSquare className="h-4 w-4" />
                )}
                {lead.generatedMessage ? 'Regenerate' : 'Generate'} Message
              </Button>
            </div>
            {lead.generatedMessage && (
              <div className="relative max-w-[400px] rounded-md border p-3 text-sm">
                <p className="pr-8 text-muted-foreground">
                  {lead.generatedMessage}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2"
                  onClick={() => copyToClipboard(lead.generatedMessage!, lead.id)}
                >
                  {copiedId === lead.id ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">AI Lead Generation</h1>
          <p className="text-muted-foreground mt-2">
            Monitor X/Twitter for potential leads based on your topics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
            <span className="text-sm">Auto-refresh</span>
          </div>
          <Button
            variant={isMonitoring ? "secondary" : "default"}
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            disabled={topics.length === 0}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isMonitoring ? 'animate-spin' : ''}`} />
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Topics</CardTitle>
            <CardDescription>Add topics to monitor on X/Twitter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="Enter topic to monitor..."
                onKeyPress={(e) => e.key === 'Enter' && addTopic()}
              />
              <Button onClick={addTopic} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <AnimatePresence>
              <div className="flex flex-wrap gap-2">
                {topics.map(topic => (
                  <motion.div
                    key={topic}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge 
                      variant="secondary"
                      className="cursor-pointer px-3 py-1 flex items-center gap-2"
                    >
                      {topic}
                      <X 
                        className="h-3 w-3 hover:text-destructive" 
                        onClick={() => removeTopic(topic)}
                      />
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Set minimum requirements for leads</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Minimum Followers
                </label>
                <span className="text-sm text-muted-foreground">
                  {filters.minFollowers.toLocaleString()}
                </span>
              </div>
              <Slider
                value={[filters.minFollowers]}
                onValueChange={([value]) => setFilters(f => ({ ...f, minFollowers: value }))}
                max={10000}
                step={100}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Minimum Engagement
                </label>
                <span className="text-sm text-muted-foreground">
                  {filters.minEngagement}
                </span>
              </div>
              <Slider
                value={[filters.minEngagement]}
                onValueChange={([value]) => setFilters(f => ({ ...f, minEngagement: value }))}
                max={100}
                step={1}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Twitter className="h-5 w-5" />
            Leads
          </CardTitle>
          <CardDescription>
            {leads.length} potential leads found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columnsWithMessage} data={leads} />
        </CardContent>
      </Card>
    </div>
  );
}
