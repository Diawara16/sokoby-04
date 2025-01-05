import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { niches } from "@/data/niches"
import { UseFormRegister } from "react-hook-form"
import { ProductFormData } from "../types"

interface Props {
  register: UseFormRegister<ProductFormData>
}

export function NicheField({ register }: Props) {
  return (
    <div>
      <Label htmlFor="niche">Catégorie</Label>
      <Select 
        onValueChange={(value) => register("niche").onChange({ target: { value } })}
        required
      >
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Choisir une catégorie" />
        </SelectTrigger>
        <SelectContent>
          {niches.map((niche) => (
            <SelectItem key={niche.name} value={niche.name}>
              <div className="flex items-center gap-2">
                <span>{niche.icon}</span>
                <span>{niche.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}