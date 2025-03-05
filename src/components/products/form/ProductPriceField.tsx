
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UseFormRegister, FieldErrors } from "react-hook-form"
import { ProductFormData } from "../types"

interface Props {
  register: UseFormRegister<ProductFormData>
  errors: FieldErrors<ProductFormData>
}

export function ProductPriceField({ register, errors }: Props) {
  return (
    <div>
      <Label htmlFor="price">Prix ($)</Label>
      <Input
        id="price"
        type="number"
        step="0.01"
        {...register("price", { required: "Le prix est requis" })}
        className="mt-1"
      />
      {errors.price && (
        <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
      )}
    </div>
  )
}
