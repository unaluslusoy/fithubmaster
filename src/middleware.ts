import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "default_fallback_secret_key_2026")

export async function middleware(request: NextRequest) {
  // 1. Admin rotalarını kontrol et
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // Login ve Forgot Password sayfalarına gidiyorsa kontrol etme
    const publicAdminPaths = ['/admin/login', '/admin/forgot-password']
    if (publicAdminPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
      return NextResponse.next()
    }

    // Cookie kontrolü
    const token = request.cookies.get('admin_session')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      // Token doğrulama
      await jwtVerify(token, SECRET_KEY)
      return NextResponse.next()
    } catch (err) {
      // Token geçersizse login'e at
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Diğer rotalar için (şimdilik) izin ver
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Admin path'lerini eşleştir
    '/admin/:path*',
  ],
}
