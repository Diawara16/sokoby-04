import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface OrdersCustomersChartProps {
  data: Array<{
    created_at: string;
  }>;
}

export const OrdersCustomersChart = ({ data }: OrdersCustomersChartProps) => {
  // Grouper les commandes par jour
  const groupedData = data.reduce((acc, item) => {
    const date = new Date(item.created_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(groupedData).map(([date, count]) => ({
    date,
    orders: count,
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="orders" fill="#82ca9d" name="Commandes" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};