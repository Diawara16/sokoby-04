import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Mail, Phone, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const ContactSection = () => {
  const { toast } = useToast()

  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copié !",
      description: `${type} copié dans le presse-papier`,
    })
  }

  return (
    <Card className="hover:shadow-lg transition-all">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-4 flex-1">
            <h2 className="text-2xl font-semibold">Contactez-nous</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email:</p>
                  <button 
                    onClick={() => handleCopyToClipboard('support@sokoby.com', 'Email support')}
                    className="hover:text-primary transition-colors"
                  >
                    support@sokoby.com
                  </button>
                  <br />
                  <button
                    onClick={() => handleCopyToClipboard('contact@sokoby.com', 'Email contact')}
                    className="hover:text-primary transition-colors"
                  >
                    contact@sokoby.com
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone:</p>
                  <button
                    onClick={() => handleCopyToClipboard('+1 514 512 7993', 'Numéro de téléphone')}
                    className="hover:text-primary transition-colors"
                  >
                    +1 514 512 7993
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Adresse:</p>
                  <button
                    onClick={() => handleCopyToClipboard('7188 Rue Saint-hubert\nH2R2N1, Montréal, Québec', 'Adresse')}
                    className="hover:text-primary transition-colors"
                  >
                    <p>7188 Rue Saint-hubert</p>
                    <p>H2R2N1, Montréal, Québec</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ContactSection