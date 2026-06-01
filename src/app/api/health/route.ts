import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'ALCHEMIST_FORTRESS_ACTIVE',
    uptime: process.uptime(),
    timestamp: Date.now(),
    vault: 'LOCKED' 
  }, { status: 200 });
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}