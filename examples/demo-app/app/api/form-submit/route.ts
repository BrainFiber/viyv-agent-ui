import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	const body = await request.json();
	console.log('Form submitted:', body);
	return NextResponse.json({
		success: true,
		message: `${body.name ?? 'ユーザー'} 様、お問い合わせありがとうございます。`,
		receivedAt: new Date().toISOString(),
	});
}
