import { DnsMonitoring } from "@/components/dns/DnsMonitoring"

export default function DnsSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configuration DNS</h3>
        <p className="text-sm text-muted-foreground">
          Surveillez l'état de vos configurations DNS en temps réel.
        </p>
      </div>
      
      <DnsMonitoring />
    </div>
  )
}