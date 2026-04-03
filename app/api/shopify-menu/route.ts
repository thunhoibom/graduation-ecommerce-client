import { NextResponse } from 'next/server';
import { getMenu } from 'lib/shopify';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const menu = await getMenu('next-js-frontend-header-menu');
    return NextResponse.json(menu);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
