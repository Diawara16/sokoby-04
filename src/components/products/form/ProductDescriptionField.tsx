import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UseFormRegister, FieldErrors } from "react-hook-form"
import { ProductFormData } from "../types"

interface Props {
  register: UseFormRegister<ProductFormData>
  errors: FieldErrors<ProductFormData>
}

export function ProductDescriptionField({ register, errors }: Props) {
  return (
    <div>
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        {...register("description", { required: "La description est requise" })}
        className="mt-1 h-32"
      />
      {errors.description && (
        <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
      )}
    </div>
  )
}