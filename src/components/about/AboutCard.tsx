import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface AboutCardProps {
  icon: LucideIcon
  title: string
  description: string
}

const AboutCard = ({ icon: Icon, title, description }: AboutCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AboutCard