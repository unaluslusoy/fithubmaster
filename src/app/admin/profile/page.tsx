import { getProfile } from "./actions"
import { ProfileForm } from "./profile-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default async function ProfilePage() {
  const { success, data, error } = await getProfile()

  if (!success || !data) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>
            {error || "Profil bilgileri yüklenemedi. Lütfen veritabanında en az bir yönetici olduğundan emin olun."}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight">Kullanıcı Profilim</h1>
      </div>

      <ProfileForm user={data} />
    </div>
  )
}
