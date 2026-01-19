"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { createUserGroup, updateUserGroup, getAllPermissions, PermissionData, UserGroupData } from "./actions"
import { Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const formSchema = z.object({
  name: z.string().min(2, "Grup adı en az 2 karakter olmalıdır"),
  description: z.string().optional(),
  permissionIds: z.array(z.string()).optional(),
})

interface UserGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  group?: UserGroupData // existing group for edit mode
  onSuccess: () => void
}

export function UserGroupDialog({ open, onOpenChange, group, onSuccess }: UserGroupDialogProps) {
  const [loading, setLoading] = useState(false)
  const [permissions, setPermissions] = useState<PermissionData[]>([])
  
  const isEdit = !!group

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      permissionIds: [],
    },
  })

  // Load available permissions when dialog opens
  useEffect(() => {
    async function loadPermissions() {
      const res = await getAllPermissions()
      if (res.success && res.data) {
        setPermissions(res.data)
      }
    }
    if (open) {
      loadPermissions()
    }
  }, [open])

  // Set default values if editing
  useEffect(() => {
    if (open) {
      if (group) {
        form.reset({
          name: group.name,
          description: group.description || "",
          permissionIds: group.permissions.map(p => p.id),
        })
      } else {
        form.reset({
            name: "",
            description: "",
            permissionIds: [],
        })
      }
    }
  }, [open, group, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      if (isEdit) {
         const res = await updateUserGroup(group.id, values)
         if (res.success) {
            toast.success("Başarılı", { description: "Grup güncellendi." })
            onSuccess()
            onOpenChange(false)
         } else {
            toast.error("Hata", { description: res.error })
         }
      } else {
         const res = await createUserGroup(values)
         if (res.success) {
            toast.success("Başarılı", { description: "Grup oluşturuldu." })
            onSuccess()
            onOpenChange(false)
         } else {
            toast.error("Hata", { description: res.error })
         }
      }
    } catch (error) {
        toast.error("Hata", { description: "Beklenmeyen bir hata oluştu." })
    } finally {
      setLoading(false)
    }
  }

  // Group permissions by subject for better UI
  const groupedPermissions = permissions.reduce((acc, perm) => {
    const subject = perm.subject
    if (!acc[subject]) {
      acc[subject] = []
    }
    acc[subject].push(perm)
    return acc
  }, {} as Record<string, PermissionData[]>)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Grubu Düzenle" : "Yeni Grup Ekle"}</DialogTitle>
          <DialogDescription>
            Kullanıcı grubu detaylarını ve yetkilerini belirleyin.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1 overflow-hidden flex flex-col">
            
            <div className="space-y-4 px-1">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Grup Adı</FormLabel>
                    <FormControl>
                        <Input placeholder="Örn: Editörler" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Açıklama</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Grup açıklaması..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <div className="flex-1 overflow-auto border rounded-md p-4">
               <h4 className="mb-4 text-sm font-medium leading-none">Yetkiler</h4>
               <ScrollArea className="h-[300px]">
                <FormField
                    control={form.control}
                    name="permissionIds"
                    render={() => (
                        <FormItem>
                            <div className="grid gap-6">
                            {Object.entries(groupedPermissions).map(([subject, perms]) => (
                                <div key={subject}>
                                    <h5 className="mb-2 text-sm font-semibold capitalize text-muted-foreground">{subject}</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {perms.map((perm) => (
                                        <FormField
                                            key={perm.id}
                                            control={form.control}
                                            name="permissionIds"
                                            render={({ field }) => {
                                            return (
                                                <FormItem
                                                key={perm.id}
                                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm bg-card"
                                                >
                                                <FormControl>
                                                    <Switch
                                                    checked={field.value?.includes(perm.id)}
                                                    onCheckedChange={(checked) => {
                                                        return checked
                                                        ? field.onChange([...(field.value || []), perm.id])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                                (value) => value !== perm.id
                                                            )
                                                            )
                                                    }}
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel className="capitalize cursor-pointer">
                                                    {perm.action}
                                                    </FormLabel>
                                                    <FormDescription>
                                                    {perm.description || `${perm.action} ${perm.subject}`}
                                                    </FormDescription>
                                                </div>
                                                </FormItem>
                                            )
                                            }}
                                        />
                                        ))}
                                    </div>
                                </div>
                            ))}
                            </div>
                        <FormMessage />
                        </FormItem>
                    )}
                />
               </ScrollArea>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                İptal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? "Güncelle" : "Oluştur"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
