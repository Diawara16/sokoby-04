import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDistance } from "date-fns"
import { fr } from "date-fns/locale"

export const LoyaltyHistory = () => {
  const { data: history, isLoading } = useQuery({
    queryKey: ["loyalty-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loyalty_points_history")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Points</TableHead>
          <TableHead>Raison</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {history?.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>
              {formatDistance(new Date(entry.created_at), new Date(), {
                addSuffix: true,
                locale: fr,
              })}
            </TableCell>
            <TableCell className={entry.points_change >= 0 ? "text-green-600" : "text-red-600"}>
              {entry.points_change >= 0 ? "+" : ""}{entry.points_change}
            </TableCell>
            <TableCell>{entry.reason}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}