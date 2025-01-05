import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UseFormRegister, FieldErrors } from "react-hook-form"
import { ProductFormData } from "../types"

interface Props {
  register: UseFormRegister<ProductFormData>
  errors: FieldErrors<ProductFormData>
}

export function ProductNameField({ register, errors }: Props) {
  return (
    <div>
      <Label htmlFor="name">Nom du produit</Label>
      <Input
        id="name"
        {...register("name", { required: "Le nom du produit est requis" })}
        className="mt-1"
      />
      {errors.name && (
        <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
      )}
    </div>
  )
}