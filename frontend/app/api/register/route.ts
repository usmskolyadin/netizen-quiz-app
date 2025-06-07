import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tg_id = searchParams.get('tg_id');

    if (!tg_id) {
      return NextResponse.json(
        { error: 'Missing tg_id parameter' },
        { status: 400 }
      );
    }

    const response = await axios.get(`http://localhost:8000/tma/users/${tg_id}`);
    return NextResponse.json(response.data);
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'User registration failed' },
      { status: 500 }
    );
  }
}