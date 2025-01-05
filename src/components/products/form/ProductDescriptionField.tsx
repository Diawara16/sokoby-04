import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UseFormRegister } from "react-hook-form"
import { ProductFormData } from "../types"

interface Props {
  register: UseFormRegister<ProductFormData>
}

export function ProductDescriptionField({ register }: Props) {
  return (
    <div>
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        {...register("description")}
        className="mt-1 h-32"
      />
    </div>
  )
}