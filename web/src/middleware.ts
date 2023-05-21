import { NextRequest, NextResponse } from 'next/server'

const signInURL = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`

export function middleware(request: NextRequest) {
  // check if user is logged in
  const token = request.cookies.get('token')?.value

  // if user is not logged in -> redirect user to login page -> return user to previous route
  if (!token) {
    return NextResponse.redirect(signInURL, {
      headers: {
        'Set-Cookie': `redirectTo=${request.url}; Path=/; HttpOnly; max-age=20;`,
      },
    })
  }

  // if user is logged in -> do nothing
  return NextResponse.next()
}

// Middleware is executed for every path inside /memories
export const config = {
  matcher: '/memories/:path*',
}
