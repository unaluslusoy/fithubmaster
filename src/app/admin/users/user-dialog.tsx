
"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { createUser, updateUser, UserData, getUserGroupOptions } from "./actions"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  role: z.string(),
  status: z.string(),
  userGroupId: z.string().optional().nullable(),
  password: z.string().optional(),
})

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: UserData
  onSuccess: () => void
}

export function UserDialog({ open, onOpenChange, user, onSuccess }: UserDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [groupOptions, setGroupOptions] = useState<{id: string, name: string}[]>([])
  const isEdit = !!user

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "EDITOR",
      status: "ACTIVE",
      userGroupId: "none",
      password: "",
    },
  })

  useEffect(() => {
    async function loadOptions() {
        const res = await getUserGroupOptions()
        if (res.success && res.data) {
            setGroupOptions(res.data)
        }
    }
    if (open) {
        loadOptions()
    }
  }, [open])

  useEffect(() => {
      if (open) {
        if (user) {
            form.reset({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                status: user.status,
                userGroupId: user.userGroupId || "none",
                password: "", 
            })
        } else {
            form.reset({
                firstName: "",
                lastName: "",
                email: "",
                role: "EDITOR", 
                status: "ACTIVE",
                userGroupId: "none",
                password: "",
            })
        }
      }
  }, [open, user, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    
    // Convert "none" to null for backend
    const submissionData = {
        ...values,
        userGroupId: values.userGroupId === "none" ? null : values.userGroupId
    }

    if (!isEdit && (!values.password || values.password.length < 6)) {
        form.setError("password", { message: "Şifre en az 6 karakter olmalıdır" })
        setIsLoading(false)
        return
    }

    try {
        if (isEdit) {
            const res = await updateUser(user.id, submissionData)
            if (res.success) {
                toast.success("Başarılı", { description: "Kullanıcı güncellendi" })
                onSuccess()
                onOpenChange(false)
            } else {
                toast.error("Hata", { description: res.error || "Hata oluştu" })
            }
        } else {
            const res = await createUser(submissionData)
            if (res.success) {
                toast.success("Başarılı", { description: "Kullanıcı oluşturuldu" })
                onSuccess()
                onOpenChange(false)
            } else {
                toast.error("Hata", { description: res.error || "Hata oluştu" })
            }
        }
    } catch (error) {
        toast.error("Hata", { description: "Beklenmeyen bir hata oluştu" })
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-visible">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı Ekle"}</DialogTitle>
          <DialogDescription>
            Sisteme yeni bir kullanıcı ekleyin.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Ad</FormLabel>
                    <FormControl>
                        <Input placeholder="Ad" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Soyad</FormLabel>
                    <FormControl>
                        <Input placeholder="Soyad" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-posta</FormLabel>
                  <FormControl>
                    <Input placeholder="ornek@domain.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEdit ? "Şifre (Değiştirmek için girin)" : "Şifre"}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Rol seçin" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="SUPER_ADMIN">Süper Admin</SelectItem>
                        <SelectItem value="EDITOR">Editör</SelectItem>
                        <SelectItem value="SUPPORT">Destek</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Durum</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Durum seçin" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="ACTIVE">Aktif</SelectItem>
                        <SelectItem value="PENDING">Beklemede</SelectItem>
                        <SelectItem value="INACTIVE">Pasif</SelectItem>
                        <SelectItem value="SUSPENDED">Askıda</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <FormField
                control={form.control}
                name="userGroupId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Kullanıcı Grubu (Yetki)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || "none"} value={field.value || "none"}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Grup seçin" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="none">-- Grup Yok --</SelectItem>
                        {groupOptions.map(group => (
                             <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>İptal</Button>
              <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEdit ? "Güncelle" : "Oluştur"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
