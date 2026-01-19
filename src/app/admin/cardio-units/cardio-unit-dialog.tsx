"use client"

import { useState } from "react"
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
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createCardioUnit } from "./actions"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Birim adı en az 2 karakter olmalıdır.",
  }),
  description: z.string().optional(),
  metValue: z.string().transform((v) => (v ? parseFloat(v) : undefined)).optional(),
  defaultDuration: z.string().transform((v) => (v ? parseInt(v) : undefined)).optional(),
})

interface CardioUnitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CardioUnitDialog({ open, onOpenChange, onSuccess }: CardioUnitDialogProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      metValue: undefined,
      defaultDuration: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    const res = await createCardioUnit({
        name: values.name,
        description: values.description,
        metValue: values.metValue,
        defaultDuration: values.defaultDuration
    })
    
    setLoading(false)

    if (res.success) {
      toast.success("Kardiyo birimi başarıyla oluşturuldu.")
      form.reset()
      onSuccess()
      onOpenChange(false)
    } else {
      toast.error(res.error || "Bir hata oluştu")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Kardiyo Birimi</DialogTitle>
          <DialogDescription>
            Sisteme yeni bir kardiyo egzersiz tipi ekleyin.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birim Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn: Koşu Bandı" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="metValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MET Değeri</FormLabel>
                    <FormControl>
                      {/* type="number" step="0.1" allows decimals */}
                      <Input type="number" step="0.1" placeholder="Örn: 8.0" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormDescription>Yakılan kalori katsayısı</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="defaultDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Süre (Dk)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Örn: 30" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormDescription>Varsayılan süre</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Kısa bir açıklama..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
