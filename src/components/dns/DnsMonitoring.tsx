import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Monitor, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DnsRecord {
  id: string
  domain_name: string
  status: string
  last_check_time: string
  issues: string[]
}

export function DnsMonitoring() {
  const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchDnsRecords()
    // Mettre en place un canal temps réel pour les mises à jour
    const channel = supabase
      .channel('dns-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dns_monitoring'
        },
        (payload) => {
          console.log('DNS update received:', payload)
          fetchDnsRecords()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchDnsRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('dns_monitoring')
        .select('*')
        .order('last_check_time', { ascending: false })

      if (error) throw error

      setDnsRecords(data)
    } catch (error) {
      console.error('Error fetching DNS records:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les enregistrements DNS",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('fr-FR', {
      dateStyle: 'short',
      timeStyle: 'short'
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <Monitor className="h-8 w-8 animate-pulse text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (dnsRecords.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertDescription>
              Aucun domaine n'est actuellement surveillé.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Monitoring DNS
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dnsRecords.map((record) => (
            <div
              key={record.id}
              className="flex items-start justify-between rounded-lg border p-4"
            >
              <div className="space-y-1">
                <p className="font-medium">{record.domain_name}</p>
                <p className="text-sm text-muted-foreground">
                  Dernière vérification: {formatDate(record.last_check_time)}
                </p>
                {record.issues && record.issues.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {record.issues.map((issue, index) => (
                      <li key={index} className="text-sm text-red-500">
                        • {issue}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="ml-4">
                {record.status === 'ok' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}