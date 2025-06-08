import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const res = await fetch('https://netizenworld.ru/tma/tma/quizes/');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quizes' }, { status: 500 });
  }
};