import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Save, X, LogOut, Eye, RefreshCw } from 'lucide-react';

interface Site {
  id: string;
  domain: string;
  whatsapp_number: string;
  site_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('site_name');

      if (error) throw error;
      setSites(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch sites',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (site: Site) => {
    setEditingId(site.id);
    setEditValue(site.whatsapp_number);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const saveEdit = async (siteId: string, oldNumber: string) => {
    if (!editValue.trim()) {
      toast({
        title: 'Error',
        description: 'WhatsApp number cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    setUpdating(true);
    
    try {
      // Update the site
      const { error: updateError } = await supabase
        .from('sites')
        .update({ whatsapp_number: editValue.trim() })
        .eq('id', siteId);

      if (updateError) throw updateError;

      // Log the change
      const { error: logError } = await supabase
        .from('site_change_logs')
        .insert({
          site_id: siteId,
          admin_user_id: user?.id,
          change_type: 'whatsapp_update',
          old_value: oldNumber,
          new_value: editValue.trim(),
          description: `WhatsApp number updated from ${oldNumber} to ${editValue.trim()}`,
        });

      if (logError) throw logError;

      // Update local state
      setSites(sites.map(site => 
        site.id === siteId 
          ? { ...site, whatsapp_number: editValue.trim(), updated_at: new Date().toISOString() }
          : site
      ));

      setEditingId(null);
      setEditValue('');
      
      toast({
        title: 'Success',
        description: 'WhatsApp number updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update WhatsApp number',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const triggerRedeploy = async (site: Site) => {
    // This is a placeholder for redeploy functionality
    // In a real implementation, this would trigger a webhook or API call
    toast({
      title: 'Redeploy Triggered',
      description: `Redeploy initiated for ${site.site_name}`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage your 10 static sites and their WhatsApp numbers
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.email}
            </span>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sites Management</CardTitle>
            <CardDescription>
              View and edit WhatsApp numbers for all your sites
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site Name</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>WhatsApp Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sites.map((site) => (
                    <TableRow key={site.id}>
                      <TableCell className="font-medium">
                        {site.site_name}
                      </TableCell>
                      <TableCell>{site.domain}</TableCell>
                      <TableCell>
                        {editingId === site.id ? (
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            placeholder="WhatsApp number"
                            className="w-40"
                          />
                        ) : (
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {site.whatsapp_number}
                          </code>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={site.is_active ? 'default' : 'secondary'}>
                          {site.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(site.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {editingId === site.id ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => saveEdit(site.id, site.whatsapp_number)}
                                disabled={updating}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEdit}
                                disabled={updating}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEdit(site)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(`https://${site.domain}`, '_blank')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => triggerRedeploy(site)}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;