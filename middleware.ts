import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Simplificar o middleware - apenas verificar rotas admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Permitir acesso à página de login
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next()
    }

    // Para outras rotas admin, deixar o componente verificar a autenticação
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
