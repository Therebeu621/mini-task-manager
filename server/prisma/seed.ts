/**
 * Prisma Seed Script
 * Creates demo users and tasks for development/demo purposes.
 * Run with: npm run db:seed (from /server) or npm run db:seed (from root)
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const adminEmail = (process.env.SEED_ADMIN_EMAIL ?? 'admin@mini-task.local').toLowerCase().trim();
const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin123!';
const userEmail = (process.env.SEED_USER_EMAIL ?? 'user@mini-task.local').toLowerCase().trim();
const userPassword = process.env.SEED_USER_PASSWORD ?? 'User123!';

const seedTasks = [
    {
        title: 'Set up the project repository',
        description: 'Initialize Git, add .gitignore, README, and configure workspaces.',
        status: 'done',
        priority: 'high',
        dueDate: new Date('2026-01-15'),
        owner: 'admin' as const,
    },
    {
        title: 'Design the database schema',
        description: 'Define the Task model with all required fields in Prisma.',
        status: 'done',
        priority: 'high',
        dueDate: new Date('2026-01-20'),
        owner: 'admin' as const,
    },
    {
        title: 'Build the REST API',
        description: 'Implement CRUD endpoints with Express, Zod validation, and error handling.',
        status: 'doing',
        priority: 'high',
        dueDate: new Date('2026-02-01'),
        owner: 'user' as const,
    },
    {
        title: 'Create the React frontend',
        description: 'Build TaskList, TaskForm, TaskCard and filter components with React Query.',
        status: 'doing',
        priority: 'medium',
        dueDate: new Date('2026-02-10'),
        owner: 'user' as const,
    },
    {
        title: 'Write unit tests for the API',
        description: 'Cover health check, task creation, list, and validation error endpoints.',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date('2026-02-15'),
        owner: 'admin' as const,
    },
    {
        title: 'Add Docker support',
        description: 'Write Dockerfiles for server and client, and a docker-compose.yml.',
        status: 'todo',
        priority: 'low',
        dueDate: null,
        owner: 'user' as const,
    },
    {
        title: 'Write the README',
        description: 'Document setup instructions, architecture overview, and API endpoints.',
        status: 'todo',
        priority: 'low',
        dueDate: null,
        owner: 'admin' as const,
    },
];

async function main() {
    console.info('🌱 Seeding database...');

    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
    const userPasswordHash = await bcrypt.hash(userPassword, 10);

    // Clear existing data before seeding
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();

    const [admin, user] = await Promise.all([
        prisma.user.create({
            data: {
                email: adminEmail,
                passwordHash: adminPasswordHash,
                role: 'admin',
            },
        }),
        prisma.user.create({
            data: {
                email: userEmail,
                passwordHash: userPasswordHash,
                role: 'user',
            },
        }),
    ]);

    for (const task of seedTasks) {
        const owner = task.owner === 'admin' ? admin : user;
        await prisma.task.create({
            data: {
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                dueDate: task.dueDate,
                ownerId: owner.id,
                createdById: owner.id,
                updatedById: owner.id,
            },
        });
    }

    console.info(`✅ Seeded ${seedTasks.length} tasks successfully.`);
    console.info(`👤 Admin: ${adminEmail} / ${adminPassword}`);
    console.info(`👤 User:  ${userEmail} / ${userPassword}`);
}

main()
    .catch((err) => {
        console.error('❌ Seed failed:', err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
