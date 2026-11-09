import {NextResponse} from 'next/server';import {z} from 'zod';import bcrypt from 'bcryptjs';import {prisma} from '@/lib/prisma';import {createSession} from '@/lib/auth';

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

export async function POST(req:Request){
  try {
    const data = schema.parse(await req.json());
    const email = data.email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    await createSession({ id: user.id, role: user.role, name: user.name });
    return NextResponse.json({ ok: true, role: user.role });
  } catch {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 400 });
  }
}
