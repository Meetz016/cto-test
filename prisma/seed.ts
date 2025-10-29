import { prisma } from '../src/utils/prisma';

async function main() {
  await prisma.todo.deleteMany();

  await prisma.todo.createMany({
    data: [
      {
        title: 'Review pull requests',
        description: 'Take a look at the latest open PRs and provide feedback.',
      },
      {
        title: 'Plan sprint tasks',
        description: 'Outline priorities for the upcoming sprint planning session.',
      },
    ],
  });

  // eslint-disable-next-line no-console
  console.log('Database seeded with starter todos.');
}

main()
  .catch((error) => {
    console.error('Seeding failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
