import { NextResponse } from 'next/server';

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      );
    }

    const backendUrl = `https://netizenworld.ru/tma/tma/quizes/${id}/`;
    const res = await fetch(backendUrl);
    
    if (!res.ok) {
      throw new Error(`Backend responded with status ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
};