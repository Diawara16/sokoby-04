import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react"
import { format, subMonths } from "date-fns"
import { fr } from "date-fns/locale"

interface TrendData {
  date: string
  sales: number
  orders: number
  customers: number
  averageOrderValue: number
}

const fetchTrendsData = async () => {
  const startDate = subMonths(new Date(), 6)
  
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id, total_amount, user_id, created_at')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true })

  if (ordersError) throw ordersError

  // Grouper les données par mois
  const monthlyData = orders.reduce((acc: Record<string, Omit<TrendData, 'customers'> & { uniqueCustomers: Set<string> }>, order) => {
    const monthKey = format(new Date(order.created_at), 'yyyy-MM')
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        date: format(new Date(order.created_at), 'MMM yyyy', { locale: fr }),
        sales: 0,
        orders: 0,
        uniqueCustomers: new Set(),
        averageOrderValue: 0
      }
    }
    
    acc[monthKey].sales += order.total_amount
    acc[monthKey].orders += 1
    acc[monthKey].uniqueCustomers.add(order.user_id)
    
    return acc
  }, {})

  // Convertir en tableau et calculer les moyennes
  return Object.entries(monthlyData).map(([_, month]) => ({
    date: month.date,
    sales: month.sales,
    orders: month.orders,
    customers: month.uniqueCustomers.size,
    averageOrderValue: month.sales / month.orders
  }))
}

export const TrendsDashboard = () => {
  const { data: trendsData, isLoading } = useQuery({
    queryKey: ['trends-data'],
    queryFn: fetchTrendsData
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tendances des 6 derniers mois</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Ventes"
          value={`${trendsData?.at(-1)?.sales.toFixed(2) ?? 0}€`}
          trend={calculateTrend(trendsData, 'sales')}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <MetricCard
          title="Commandes"
          value={trendsData?.at(-1)?.orders ?? 0}
          trend={calculateTrend(trendsData, 'orders')}
          icon={<ShoppingBag className="h-4 w-4" />}
        />
        <MetricCard
          title="Clients"
          value={trendsData?.at(-1)?.customers ?? 0}
          trend={calculateTrend(trendsData, 'customers')}
          icon={<Users className="h-4 w-4" />}
        />
        <MetricCard
          title="Panier moyen"
          value={`${trendsData?.at(-1)?.averageOrderValue.toFixed(2) ?? 0}€`}
          trend={calculateTrend(trendsData, 'averageOrderValue')}
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des ventes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#8884d8" 
                    name="Ventes (€)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commandes et clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendsData}>
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
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string | number
  trend: number
  icon: React.ReactNode
}

const MetricCard = ({ title, value, trend, icon }: MetricCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? '+' : ''}{trend.toFixed(1)}% vs mois précédent
        </p>
      </CardContent>
    </Card>
  )
}

const calculateTrend = (data: TrendData[] | undefined, metric: keyof TrendData) => {
  if (!data || data.length < 2) return 0
  
  const current = data.at(-1)?.[metric]
  const previous = data.at(-2)?.[metric]
  
  if (typeof current !== 'number' || typeof previous !== 'number' || previous === 0) return 0
  
  return ((current - previous) / previous) * 100
}