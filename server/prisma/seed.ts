/**
 * Prisma Seed Script
 * Creates sample tasks for development/demo purposes.
 * Run with: npm run db:seed (from /server) or npm run db:seed (from root)
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedTasks = [
    {
        title: 'Set up the project repository',
        description: 'Initialize Git, add .gitignore, README, and configure workspaces.',
        status: 'done',
        priority: 'high',
        dueDate: new Date('2026-01-15'),
    },
    {
        title: 'Design the database schema',
        description: 'Define the Task model with all required fields in Prisma.',
        status: 'done',
        priority: 'high',
        dueDate: new Date('2026-01-20'),
    },
    {
        title: 'Build the REST API',
        description: 'Implement CRUD endpoints with Express, Zod validation, and error handling.',
        status: 'doing',
        priority: 'high',
        dueDate: new Date('2026-02-01'),
    },
    {
        title: 'Create the React frontend',
        description: 'Build TaskList, TaskForm, TaskCard and filter components with React Query.',
        status: 'doing',
        priority: 'medium',
        dueDate: new Date('2026-02-10'),
    },
    {
        title: 'Write unit tests for the API',
        description: 'Cover health check, task creation, list, and validation error endpoints.',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date('2026-02-15'),
    },
    {
        title: 'Add Docker support',
        description: 'Write Dockerfiles for server and client, and a docker-compose.yml.',
        status: 'todo',
        priority: 'low',
        dueDate: null,
    },
    {
        title: 'Write the README',
        description: 'Document setup instructions, architecture overview, and API endpoints.',
        status: 'todo',
        priority: 'low',
        dueDate: null,
    },
];

async function main() {
    console.info('🌱 Seeding database...');

    // Clear existing data before seeding
    await prisma.task.deleteMany();

    for (const task of seedTasks) {
        await prisma.task.create({ data: task });
    }

    console.info(`✅ Seeded ${seedTasks.length} tasks successfully.`);
}

main()
    .catch((err) => {
        console.error('❌ Seed failed:', err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
