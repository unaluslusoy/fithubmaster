"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CardioUnitData, deleteCardioUnit } from "./actions"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export const columns: ColumnDef<CardioUnitData>[] = [
  {
    accessorKey: "name",
    header: "Birim Adı",
  },
  {
    accessorKey: "metValue",
    header: "MET Değeri",
    cell: ({ row }) => {
      const val = row.getValue("metValue")
      return val ? val : "-"
    },
  },
  {
    accessorKey: "defaultDuration",
    header: "Varsayılan Süre (dk)",
    cell: ({ row }) => {
      const val = row.getValue("defaultDuration")
      return val ? val + " dk" : "-"
    },
  },
  {
    accessorKey: "description",
    header: "Açıklama",
    cell: ({ row }) => {
      const val = row.getValue("description") as string
      return val ? <span className="text-muted-foreground text-sm truncate max-w-[200px] block" title={val}>{val}</span> : "-"
    },
  },
  {
    accessorKey: "createdAt",
    header: "Oluşturulma",
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString("tr-TR")
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const unit = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Menü</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(unit.id)}
            >
              ID Kopyala
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                if(!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
                
                const res = await deleteCardioUnit(unit.id)
                if (res.success) {
                  toast.success("Kardiyo birimi silindi")
                  // Sayfa yenilemesi gerekebilir veya state güncellenebilir
                  // Ancak actions.ts içinde revalidatePath var, next.js halleder
                } else {
                  toast.error(res.error)
                }
              }}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" /> Sil
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
