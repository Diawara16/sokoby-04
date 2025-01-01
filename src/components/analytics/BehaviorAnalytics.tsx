import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BehaviorData {
  date: string;
  count: number;
}

export const BehaviorAnalytics = () => {
  const [data, setData] = useState<BehaviorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBehaviorData = async () => {
      try {
        const { data: behaviors, error } = await supabase
          .from('user_behaviors')
          .select('created_at')
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Group by date and count events
        const groupedData = behaviors?.reduce((acc: Record<string, number>, item) => {
          const date = new Date(item.created_at).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        const formattedData = Object.entries(groupedData || {}).map(([date, count]) => ({
          date,
          count,
        }));

        setData(formattedData);
      } catch (error) {
        console.error('Error fetching behavior data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBehaviorData();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analyse comportementale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse comportementale</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" name="Événements" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};