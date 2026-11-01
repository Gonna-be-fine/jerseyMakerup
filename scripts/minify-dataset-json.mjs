import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const DEFAULT_DIR = 'public/dataset';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run') || args.has('-n');
const targetDir = getOptionValue('--dir') ?? DEFAULT_DIR;
const rootDir = path.resolve(process.cwd(), targetDir);

function getOptionValue(name) {
  const argv = process.argv.slice(2);
  const inline = argv.find((arg) => arg.startsWith(`${name}=`));

  if (inline) {
    return inline.slice(name.length + 1);
  }

  const index = argv.indexOf(name);
  return index >= 0 ? argv[index + 1] : undefined;
}

async function collectJsonFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectJsonFiles(fullPath)));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.json')) {
      files.push(fullPath);
    }
  }

  return files;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function minifyFile(filePath) {
  const original = await readFile(filePath, 'utf8');
  const parsed = JSON.parse(original);
  const minified = `${JSON.stringify(parsed)}\n`;
  const before = Buffer.byteLength(original);
  const after = Buffer.byteLength(minified);

  if (!dryRun && original !== minified) {
    await writeFile(filePath, minified, 'utf8');
  }

  return {
    filePath,
    before,
    after,
    saved: before - after,
    changed: original !== minified,
  };
}

async function main() {
  const stats = await stat(rootDir).catch(() => null);

  if (!stats?.isDirectory()) {
    throw new Error(`Dataset directory not found: ${rootDir}`);
  }

  const files = await collectJsonFiles(rootDir);

  if (files.length === 0) {
    console.log(`No JSON files found in ${targetDir}`);
    return;
  }

  let totalBefore = 0;
  let totalAfter = 0;
  let changedCount = 0;
  const failures = [];

  for (const filePath of files) {
    try {
      const result = await minifyFile(filePath);
      totalBefore += result.before;
      totalAfter += result.after;
      if (result.changed) changedCount += 1;

      const relativePath = path.relative(process.cwd(), result.filePath);
      const savedLabel = result.saved > 0 ? `-${formatBytes(result.saved)}` : 'no change';
      console.log(`${dryRun ? '[dry-run] ' : ''}${relativePath}: ${formatBytes(result.before)} -> ${formatBytes(result.after)} (${savedLabel})`);
    } catch (error) {
      failures.push({ filePath, error });
    }
  }

  const saved = totalBefore - totalAfter;
  console.log('');
  console.log(`${dryRun ? 'Would minify' : 'Minified'} ${changedCount}/${files.length} file(s).`);
  console.log(`Total: ${formatBytes(totalBefore)} -> ${formatBytes(totalAfter)} (${saved > 0 ? `saved ${formatBytes(saved)}` : 'no savings'})`);

  if (failures.length > 0) {
    console.error('');
    console.error('Failed to parse these JSON files:');
    for (const { filePath, error } of failures) {
      console.error(`- ${path.relative(process.cwd(), filePath)}: ${error.message}`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
