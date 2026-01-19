"use server"

import prisma from "@/lib/prisma"

export async function getCaptchaConfig() {
  const settings = await prisma.systemSetting.findMany({
    where: {
      key: {
        in: ["captcha_provider", "captcha_site_key", "captcha_enabled"]
      }
    }
  })

  const config: Record<string, string> = {}
  settings.forEach(s => {
    config[s.key] = s.value
  })

  return {
    provider: config.captcha_provider || "turnstile",
    siteKey: config.captcha_site_key || "",
    enabled: config.captcha_enabled === "true"
  }
}
