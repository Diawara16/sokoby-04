import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UseFormRegister } from "react-hook-form"
import { ProductFormData } from "../types"

interface Props {
  register: UseFormRegister<ProductFormData>
}

export function ProductPriceField({ register }: Props) {
  return (
    <div>
      <Label htmlFor="price">Prix</Label>
      <Input
        id="price"
        type="number"
        step="0.01"
        {...register("price", { required: true })}
        className="mt-1"
      />
    </div>
  )
}