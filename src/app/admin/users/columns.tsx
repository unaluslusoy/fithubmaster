"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { UserData } from "./actions"
import { UserRowActions } from "./user-row-actions"

export const columns: ColumnDef<UserData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Tümünü seç"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Satırı seç"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ad Soyad
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    cell: ({ row }) => {
        return <div className="font-medium">{`${row.original.firstName} ${row.original.lastName}`}</div>
    }
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      let displayRole = role
      let variant: "default" | "destructive" | "secondary" | "outline" = "secondary"

      if (role === "SUPER_ADMIN") {
         displayRole = "Süper Admin"
         variant = "destructive"
      } else if (role === "EDITOR") {
         displayRole = "Editör"
         variant = "default"
      } else if (role === "SUPPORT") {
         displayRole = "Destek"
         variant = "secondary"
      }

      return (
        <Badge variant={variant}>
          {displayRole}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "status",
    header: "Durum",
    cell: ({ row }) => {
        const status = row.getValue("status") as string
        const colorClass = status === "ACTIVE" ? "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-100" : status === "PENDING" ? "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100" : "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-100";
        
        return (
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
            {status}
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserRowActions row={row} />,
  },
]
