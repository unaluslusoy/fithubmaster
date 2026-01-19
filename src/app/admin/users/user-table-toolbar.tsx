"use client"

import { Table } from "@tanstack/react-table"
import { X, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"


interface UserTableToolbarProps<TData> {
  table: Table<TData>
}

export function UserTableToolbar<TData>({
  table,
}: UserTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder="E-posta ile ara..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        
        {/* Role Filter */}
        {table.getColumn("role") && (
            <Select 
                value={(table.getColumn("role")?.getFilterValue() as string) ?? "all"}
                onValueChange={(value) => table.getColumn("role")?.setFilterValue(value === "all" ? undefined : value)}
            >
                <SelectTrigger className="h-8 w-[150px] border-dashed">
                    <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="SUPER_ADMIN">Süper Admin</SelectItem>
                    <SelectItem value="EDITOR">Editör</SelectItem>
                    <SelectItem value="SUPPORT">Destek</SelectItem>
                </SelectContent>
            </Select>
        )}

        {/* Status Filter */}
        {table.getColumn("status") && (
            <Select 
                value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
                onValueChange={(value) => table.getColumn("status")?.setFilterValue(value === "all" ? undefined : value)}
            >
                <SelectTrigger className="h-8 w-[150px] border-dashed">
                    <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="ACTIVE">Aktif</SelectItem>
                    <SelectItem value="PENDING">Beklemede</SelectItem>
                    <SelectItem value="INACTIVE">Pasif</SelectItem>
                </SelectContent>
            </Select>
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Sıfırla
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
