"use client"

import { useEffect, useState } from "react"
import { getAdminUsers } from "./actions"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { UserDialog } from "./user-dialog"
import { UserData } from "./actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  async function loadUsers() {
    setLoading(true)
    const res = await getAdminUsers()
    if (res.success && res.data) {
      setUsers(res.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight">Kullanıcı Yönetimi</h1>
         <Button onClick={() => setShowCreateDialog(true)}>
             + Yeni Kullanıcı
         </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kullanıcı Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="flex items-center justify-center p-8">Yükleniyor...</div>
          ) : (
             <DataTable columns={columns} data={users} />
          )}
        </CardContent>
      </Card>

      <UserDialog 
         open={showCreateDialog} 
         onOpenChange={setShowCreateDialog} 
         onSuccess={loadUsers} 
      />
    </div>
  )
}
