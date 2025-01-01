import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendData } from "../types/trends"

interface OrdersCustomersChartProps {
  data: TrendData[]
}

export const OrdersCustomersChart = ({ data }: OrdersCustomersChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commandes et clients</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#8884d8" name="Commandes" />
              <Bar dataKey="customers" fill="#82ca9d" name="Clients" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}