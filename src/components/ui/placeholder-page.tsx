import { Construction } from "lucide-react";

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center border-2 border-dashed border-muted rounded-xl bg-muted/10">
      <div className="p-4 bg-background rounded-full mb-4 shadow-sm">
        <Construction className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md">
        Bu modül şu anda geliştirme aşamasındadır. Çok yakında hizmetinizde olacak.
      </p>
    </div>
  );
}
