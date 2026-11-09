import {NextResponse} from 'next/server';import {z} from 'zod';import bcrypt from 'bcryptjs';import {prisma} from '@/lib/prisma';import {createSession} from '@/lib/auth';

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7).max(20),
  password: z.string().min(8).max(128).regex(/^(?=.*[A-Za-z])(?=.*\d).+$/),
});

export async function POST(req:Request){
  try {
    const data = schema.parse(await req.json());
    const email = data.email.trim().toLowerCase();
    const exists = await prisma.user.findUnique({ where: { email } });

    if (exists) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email,
        phone: data.phone.trim(),
        passwordHash: await bcrypt.hash(data.password, 12),
      },
    });

    await createSession({ id: user.id, role: user.role, name: user.name });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Please check your details and try again.' }, { status: 400 });
  }
}
