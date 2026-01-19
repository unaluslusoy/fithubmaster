"use client"

import { useEffect, useState } from "react"
import { getCardioUnits, CardioUnitData } from "./actions"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CardioUnitDialog } from "./cardio-unit-dialog"
import { Plus } from "lucide-react"

export default function CardioUnitsPage() {
  const [units, setUnits] = useState<CardioUnitData[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  async function loadData() {
    setLoading(true)
    const res = await getCardioUnits()
    if (res.success && res.data) {
      setUnits(res.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight">Kardiyo Birimleri</h1>
         <Button onClick={() => setShowCreateDialog(true)}>
             <Plus className="mr-2 h-4 w-4" /> Yeni Birim
         </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Birim Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="flex items-center justify-center p-8">Yükleniyor...</div>
          ) : (
             <DataTable columns={columns} data={units} />
          )}
        </CardContent>
      </Card>

      <CardioUnitDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
        onSuccess={loadData}
      />
    </div>
  )
}
