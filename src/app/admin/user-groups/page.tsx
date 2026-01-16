"use client"

import { useEffect, useState } from "react"
import { getUserGroups, createUserGroup } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Users, Shield } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type UserGroup = {
  id: string
  name: string
  description: string | null
  createdAt: Date
  _count: {
    users: number
  }
}

export default function UserGroupsPage() {
  const [groups, setGroups] = useState<UserGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadGroups()
  }, [])

  async function loadGroups() {
    setLoading(true)
    const res = await getUserGroups()
    if (res.success && res.data) {
      setGroups(res.data as unknown as UserGroup[])
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    
    const formData = new FormData(e.currentTarget)
    const res = await createUserGroup(null, formData)
    
    if (res.success) {
      setOpen(false)
      loadGroups()
    } else {
      setError(res.error || "Bir hata oluştu")
    }
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
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Yeni Grup Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Yeni Grup Oluştur</DialogTitle>
              <DialogDescription>
                Yeni bir kullanıcı grubu tanımlayın. Daha sonra bu gruba yetkiler atayabilirsiniz.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Grup Adı</Label>
                <Input id="name" name="name" placeholder="Örn: Editörler" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea id="description" name="description" placeholder="Bu grubun amacı..." />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <DialogFooter>
                <Button type="submit">Oluştur</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
            <Card key={group.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription className="line-clamp-2 h-10">
                  {group.description || "Açıklama yok."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                   <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {group._count.users} Üye
                   </div>
                   <Badge variant="outline">Aktif</Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
