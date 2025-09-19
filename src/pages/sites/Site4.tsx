import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import StaticSite from '@/components/StaticSite';

const Site4 = () => {
  const [siteData, setSiteData] = useState({
    siteName: 'Site Four',
    whatsappNumber: '+1234567893'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const { data } = await supabase
          .from('sites')
          .select('site_name, whatsapp_number')
          .eq('domain', 'site4.example.com')
          .single();
        
        if (data) {
          setSiteData({
            siteName: data.site_name,
            whatsappNumber: data.whatsapp_number
          });
        }
      } catch (error) {
        console.error('Error fetching site data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteData();

    // Set up real-time subscription for updates
    const channel = supabase
      .channel('site4-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sites',
          filter: 'domain=eq.site4.example.com'
        },
        (payload) => {
          if (payload.new) {
            setSiteData({
              siteName: payload.new.site_name,
              whatsappNumber: payload.new.whatsapp_number
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <StaticSite
      siteName={siteData.siteName}
      whatsappNumber={siteData.whatsappNumber}
    />
  );
};

export default Site4;