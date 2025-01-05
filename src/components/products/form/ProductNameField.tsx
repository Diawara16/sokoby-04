import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UseFormRegister } from "react-hook-form"
import { ProductFormData } from "../types"

interface Props {
  register: UseFormRegister<ProductFormData>
}

export function ProductNameField({ register }: Props) {
  return (
    <div>
      <Label htmlFor="name">Nom du produit</Label>
      <Input
        id="name"
        {...register("name", { required: true })}
        className="mt-1"
      />
    </div>
  )
}