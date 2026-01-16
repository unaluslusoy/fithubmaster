"use client"

import { useEffect, useState } from "react"
import { getAdminUsers } from "./actions"
import { User, columns } from "./columns"
import { DataTable } from "./data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUsers() {
      const res = await getAdminUsers()
      if (res.success && res.data) {
        // Need to map dates from JSON to Date objects if needed, but DataTable handles string/date usually
        setUsers(res.data as unknown as User[]) 
      }
      setLoading(false)
    }
    loadUsers()
  }, [])

  return (
    <div className="space-y-6">
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
    </div>
  )
}
