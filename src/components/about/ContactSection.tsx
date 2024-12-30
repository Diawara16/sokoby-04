import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Mail, Phone, MapPin } from "lucide-react"

const ContactSection = () => {
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
                  <a href="mailto:support@sokoby.com" className="hover:text-primary transition-colors">
                    support@sokoby.com
                  </a>
                  <br />
                  <a href="mailto:contact@sokoby.com" className="hover:text-primary transition-colors">
                    contact@sokoby.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone:</p>
                  <a href="tel:+15145127993" className="hover:text-primary transition-colors">
                    +1 514 512 7993
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Adresse:</p>
                  <p>7188 Rue Saint-hubert</p>
                  <p>H2R2N1, Montréal, Québec</p>
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