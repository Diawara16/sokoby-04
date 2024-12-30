import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface ProductFiltersProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

const CATEGORIES = [
  "Vêtements",
  "Accessoires",
  "Électronique",
  "Maison",
  "Sport",
];

export const ProductFilters = ({
  priceRange,
  setPriceRange,
  selectedCategories,
  setSelectedCategories,
  sortBy,
  setSortBy,
}: ProductFiltersProps) => {
  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div className="w-full md:w-64 space-y-4">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger>Prix</AccordionTrigger>
          <AccordionContent>
            <div className="px-2 py-4">
              <Slider
                defaultValue={[priceRange[0], priceRange[1]]}
                max={1000}
                step={10}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="my-4"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{priceRange[0]}€</span>
                <span>{priceRange[1]}€</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="categories">
          <AccordionTrigger>Catégories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {CATEGORIES.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
                  <label
                    htmlFor={category}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="pt-4">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Prix croissant</SelectItem>
            <SelectItem value="price-desc">Prix décroissant</SelectItem>
            <SelectItem value="name-asc">Nom A-Z</SelectItem>
            <SelectItem value="name-desc">Nom Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};