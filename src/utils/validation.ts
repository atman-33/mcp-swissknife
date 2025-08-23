import fs from 'node:fs/promises';

/**
 * Validate that directories exist and are accessible
 */
export async function validateDirectories(
  directories: string[],
): Promise<void> {
  await Promise.all(
    directories.map(async (dir) => {
      try {
        const stats = await fs.stat(dir);
        if (!stats.isDirectory()) {
          console.error(`Error: ${dir} is not a directory`);
          process.exit(1);
        }
      } catch (error) {
        console.error(`Error accessing directory ${dir}:`, error);
        process.exit(1);
      }
    }),
  );
}
