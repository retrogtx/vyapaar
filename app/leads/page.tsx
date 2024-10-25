'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, Plus, X, Users, Activity, Twitter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataTable } from '@/components/ui/data-table';
import { columns, Lead } from './columns';

export default function LeadsPage() {
  const [topics, setTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [filters, setFilters] = useState({
    minFollowers: 1000,
    minEngagement: 10,
  });
  const [autoRefresh, setAutoRefresh] = useState(false);
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Lead Generation</h1>
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
          <DataTable columns={columns} data={leads} />
        </CardContent>
      </Card>
    </div>
  );
}
