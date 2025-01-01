import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { format, subMonths } from "date-fns"
import { fr } from "date-fns/locale"
import { TrendData } from "../types/trends"

const fetchTrendsData = async () => {
  const startDate = subMonths(new Date(), 6)
  
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id, total_amount, user_id, created_at')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true })

  if (ordersError) throw ordersError

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

  return Object.entries(monthlyData).map(([_, month]) => ({
    date: month.date,
    sales: month.sales,
    orders: month.orders,
    customers: month.uniqueCustomers.size,
    averageOrderValue: month.sales / month.orders
  }))
}

export const useTrendsData = () => {
  return useQuery({
    queryKey: ['trends-data'],
    queryFn: fetchTrendsData
  })
}