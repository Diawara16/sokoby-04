import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useToast } from "@/hooks/use-toast"
import { TrendingUp, Lightbulb } from "lucide-react"

interface Prediction {
  month: string
  amount: number
  growth: number
}

interface PredictionsData {
  predictions: Prediction[]
  insights: string
  recommendations: string[]
}

export const SalesPredictions = () => {
  const [data, setData] = useState<PredictionsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('sales-predictions')
        
        if (error) throw error
        
        setData(data)
      } catch (error) {
        console.error('Error fetching predictions:', error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les prévisions de ventes",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPredictions()
  }, [])

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Prévisions de ventes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Prévisions de ventes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.predictions}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                name="Montant prévu"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Analyse
            </h4>
            <p className="text-sm text-muted-foreground">{data.insights}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Recommandations</h4>
            <ul className="list-disc list-inside space-y-1">
              {data.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}