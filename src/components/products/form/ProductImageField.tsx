import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UseFormRegister, FieldErrors } from "react-hook-form"
import { ProductFormData } from "../types"

interface Props {
  register: UseFormRegister<ProductFormData>
  errors: FieldErrors<ProductFormData>
}

export function ProductImageField({ register, errors }: Props) {
  return (
    <div>
      <Label htmlFor="imageUrl">URL de l'image</Label>
      <Input
        id="imageUrl"
        type="url"
        placeholder="https://example.com/image.jpg"
        {...register("imageUrl")}
        className="mt-1"
      />
      {errors.imageUrl && (
        <p className="text-sm text-red-500 mt-1">{errors.imageUrl.message}</p>
      )}
    </div>
  )
}
