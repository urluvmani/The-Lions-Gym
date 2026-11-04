import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: ['/admin/dashboard/:path*', '/admin/attendance/:path*', '/admin/members/:path*']
}

// Note: For Next.js 16+, consider migrating to proxy configuration
// Run: npx @next/codemod@canary middleware-to-proxy .
