import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { niches } from "@/data/niches"
import { UseFormRegister, FieldErrors } from "react-hook-form"
import { ProductFormData } from "../types"

interface Props {
  register: UseFormRegister<ProductFormData>
  errors: FieldErrors<ProductFormData>
  onValueChange: (value: string) => void
}

export function NicheField({ register, errors, onValueChange }: Props) {
  return (
    <div>
      <Label htmlFor="niche">Catégorie</Label>
      <Select 
        onValueChange={onValueChange}
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
      {errors.niche && (
        <p className="text-sm text-red-500 mt-1">{errors.niche.message}</p>
      )}
    </div>
  )
}