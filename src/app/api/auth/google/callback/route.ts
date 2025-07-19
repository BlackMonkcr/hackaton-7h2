import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    // Redirect to error page or show error
    return NextResponse.redirect(new URL(`/testing?error=${error}`, request.url));
  }

  if (code) {
    // Redirect to testing page with the code
    return NextResponse.redirect(new URL(`/testing?code=${code}`, request.url));
  }

  return NextResponse.redirect(new URL("/testing", request.url));
}
