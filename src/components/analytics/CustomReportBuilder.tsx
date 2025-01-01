import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays } from "date-fns"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DateRange } from "react-day-picker"

const metrics = [
  { id: "sales", label: "Ventes" },
  { id: "orders", label: "Commandes" },
  { id: "customers", label: "Clients" },
  { id: "average_order", label: "Panier moyen" }
]

const periods = [
  { id: "daily", label: "Quotidien" },
  { id: "weekly", label: "Hebdomadaire" },
  { id: "monthly", label: "Mensuel" }
]

export const CustomReportBuilder = () => {
  const [selectedMetric, setSelectedMetric] = useState("sales")
  const [selectedPeriod, setSelectedPeriod] = useState("daily")
  const [date, setDate] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })

  // Données simulées pour l'exemple
  const data = [
    { name: "Jan", value: 400 },
    { name: "Fév", value: 300 },
    { name: "Mar", value: 600 },
    { name: "Avr", value: 800 },
    { name: "Mai", value: 700 }
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Rapport personnalisé</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une métrique" />
              </SelectTrigger>
              <SelectContent>
                {metrics.map((metric) => (
                  <SelectItem key={metric.id} value={metric.id}>
                    {metric.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une période" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.id} value={period.id}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DatePickerWithRange date={date} setDate={setDate} />
          </div>

          <div className="h-[400px] mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}