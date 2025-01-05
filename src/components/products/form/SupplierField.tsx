import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { applications } from "@/data/applications"
import { UseFormRegister } from "react-hook-form"
import { ProductFormData } from "../types"

interface Props {
  register: UseFormRegister<ProductFormData>
}

export function SupplierField({ register }: Props) {
  const dropshippingApps = applications.filter(app => app.type === "dropshipping")

  return (
    <div>
      <Label htmlFor="supplier">Fournisseur</Label>
      <Select 
        onValueChange={(value) => register("supplier").onChange({ target: { value } })}
        required
      >
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Choisir un fournisseur" />
        </SelectTrigger>
        <SelectContent>
          {dropshippingApps.map((app) => (
            <SelectItem key={app.id} value={app.id}>
              <div className="flex items-center gap-2">
                <app.icon className="h-4 w-4" />
                <span>{app.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}