"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "@/navigation"
import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"

export function LanguageToggle() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "zh" : "en"
    router.push(pathname, { locale: nextLocale })
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleLanguage}>
      <Languages className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Toggle language</span>
    </Button>
  )
}
