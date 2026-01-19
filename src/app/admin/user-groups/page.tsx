"use client"

import { useEffect, useState } from "react"
import { getUserGroups, UserGroupData } from "./actions"
import { Button } from "@/components/ui/button"
import { Plus, Users, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserGroupDialog } from "./user-group-dialog"
import { UserGroupRowActions } from "./user-group-row-actions"

export default function UserGroupsPage() {
  const [groups, setGroups] = useState<UserGroupData[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    loadGroups()
  }, [])

  async function loadGroups() {
    setLoading(true)
    const res = await getUserGroups()
    if (res.success && res.data) {
      setGroups(res.data)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kullanıcı Grupları</h2>
          <p className="text-muted-foreground">
            Sistemdeki kullanıcı rollerini ve yetki gruplarını yönetin.
          </p>
        </div>
        
        <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Yeni Grup Ekle
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
             <div className="col-span-full text-center py-10">Yükleniyor...</div>
        ) : groups.length === 0 ? (
            <div className="col-span-full text-center py-10 text-muted-foreground border border-dashed rounded-lg">
                Henüz hiç grup oluşturulmamış.
            </div>
        ) : (
          groups.map((group) => (
            <Card key={group.id} className="relative group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <UserGroupRowActions group={group} onSuccess={loadGroups} />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        {group.name}
                    </CardTitle>
                </div>
                <CardDescription className="line-clamp-2 h-10">
                  {group.description || "Açıklama yok."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                   <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {group._count.admins} Üye
                   </div>
                   <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="text-xs">
                          {group.permissions.length} Yetki
                      </Badge>
                   </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    
      <UserGroupDialog 
         open={showCreateDialog} 
         onOpenChange={setShowCreateDialog} 
         onSuccess={loadGroups} 
      />
    </div>
  )
}
