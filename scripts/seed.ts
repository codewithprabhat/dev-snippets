import "dotenv/config";
import { PrismaClient } from "../prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...\n");

  // Clean existing data (order matters for FK constraints)
  await prisma.itemTag.deleteMany();
  await prisma.item.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.itemType.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // ─── User ──────────────────────────────────────────────────────────────────

  const hashedPassword = await hash("12345678", 12);

  const user = await prisma.user.create({
    data: {
      email: "demo@devstash.io",
      name: "Demo User",
      password: hashedPassword,
      isPro: false,
      emailVerified: new Date(),
    },
  });

  console.log(`Created user: ${user.email}`);

  // ─── System Item Types ─────────────────────────────────────────────────────

  const typeDefinitions = [
    { name: "snippet", icon: "Code", color: "#3b82f6" },
    { name: "prompt", icon: "Sparkles", color: "#8b5cf6" },
    { name: "command", icon: "Terminal", color: "#f97316" },
    { name: "note", icon: "StickyNote", color: "#fde047" },
    { name: "file", icon: "File", color: "#6b7280" },
    { name: "image", icon: "Image", color: "#ec4899" },
    { name: "link", icon: "Link", color: "#10b981" },
  ] as const;

  const types: Record<string, string> = {};

  for (const t of typeDefinitions) {
    const itemType = await prisma.itemType.create({
      data: { ...t, isSystem: true },
    });
    types[t.name] = itemType.id;
  }

  console.log(`Created ${typeDefinitions.length} system item types`);

  // ─── Tags ──────────────────────────────────────────────────────────────────

  const tagNames = [
    "react",
    "hooks",
    "typescript",
    "patterns",
    "ai",
    "prompts",
    "docker",
    "ci-cd",
    "git",
    "devops",
    "css",
    "tailwind",
    "design",
    "shell",
    "npm",
    "workflow",
  ];

  const tags: Record<string, string> = {};

  for (const name of tagNames) {
    const tag = await prisma.tag.create({
      data: { name, userId: user.id },
    });
    tags[name] = tag.id;
  }

  console.log(`Created ${tagNames.length} tags`);

  // ─── Collections ───────────────────────────────────────────────────────────

  const reactPatterns = await prisma.collection.create({
    data: {
      name: "React Patterns",
      description: "Reusable React patterns and hooks",
      userId: user.id,
    },
  });

  const aiWorkflows = await prisma.collection.create({
    data: {
      name: "AI Workflows",
      description: "AI prompts and workflow automations",
      userId: user.id,
    },
  });

  const devOps = await prisma.collection.create({
    data: {
      name: "DevOps",
      description: "Infrastructure and deployment resources",
      userId: user.id,
    },
  });

  const terminalCommands = await prisma.collection.create({
    data: {
      name: "Terminal Commands",
      description: "Useful shell commands for everyday development",
      userId: user.id,
    },
  });

  const designResources = await prisma.collection.create({
    data: {
      name: "Design Resources",
      description: "UI/UX resources and references",
      userId: user.id,
    },
  });

  console.log("Created 5 collections");

  // ─── Items: React Patterns (3 snippets) ────────────────────────────────────

  const useDebounce = await prisma.item.create({
    data: {
      title: "useDebounce Hook",
      contentType: "text",
      language: "typescript",
      content: `import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}`,
      description: "A generic debounce hook for search inputs and API calls",
      isFavorite: true,
      isPinned: true,
      userId: user.id,
      typeId: types.snippet,
      collectionId: reactPatterns.id,
    },
  });

  const contextProvider = await prisma.item.create({
    data: {
      title: "Type-Safe Context Provider",
      contentType: "text",
      language: "typescript",
      content: `import { createContext, useContext, useState, ReactNode } from "react";

interface ThemeContextValue {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}`,
      description:
        "Context provider pattern with type-safe hook and null check",
      isPinned: true,
      userId: user.id,
      typeId: types.snippet,
      collectionId: reactPatterns.id,
    },
  });

  const useLocalStorage = await prisma.item.create({
    data: {
      title: "useLocalStorage Hook",
      contentType: "text",
      language: "typescript",
      content: `import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      console.warn(\`Failed to save \${key} to localStorage\`);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}`,
      description:
        "Persistent state hook with SSR safety and JSON serialization",
      userId: user.id,
      typeId: types.snippet,
      collectionId: reactPatterns.id,
    },
  });

  // ─── Items: AI Workflows (3 prompts) ───────────────────────────────────────

  const codeReview = await prisma.item.create({
    data: {
      title: "Code Review Prompt",
      contentType: "text",
      content: `Review the following code for:
1. Security vulnerabilities (injection, XSS, auth bypasses)
2. Performance issues (N+1 queries, unnecessary re-renders, memory leaks)
3. Error handling gaps
4. Edge cases not covered
5. Adherence to SOLID principles

Provide specific line-by-line feedback with suggested fixes. Prioritize issues by severity (critical > major > minor).`,
      description: "Structured code review prompt covering security and performance",
      isFavorite: true,
      userId: user.id,
      typeId: types.prompt,
      collectionId: aiWorkflows.id,
    },
  });

  const docGeneration = await prisma.item.create({
    data: {
      title: "Documentation Generator",
      contentType: "text",
      content: `Generate documentation for the following code:

1. A brief summary of what it does (1-2 sentences)
2. Parameters/props with types and descriptions
3. Return value description
4. Usage example with realistic data
5. Edge cases or gotchas to watch out for

Use JSDoc format for functions and markdown for modules. Keep it concise — developers read docs, not novels.`,
      description: "Prompt for generating concise, useful documentation",
      userId: user.id,
      typeId: types.prompt,
      collectionId: aiWorkflows.id,
    },
  });

  const refactoring = await prisma.item.create({
    data: {
      title: "Refactoring Assistant",
      contentType: "text",
      content: `Analyze this code and suggest refactoring improvements:

1. Identify code smells (duplication, long methods, deep nesting)
2. Suggest design patterns that would improve the structure
3. Show before/after for each refactoring step
4. Ensure all changes preserve existing behavior
5. Estimate complexity reduction for each change

Focus on readability and maintainability over cleverness. Keep changes incremental — one refactoring per step.`,
      description: "Step-by-step refactoring prompt with before/after examples",
      userId: user.id,
      typeId: types.prompt,
      collectionId: aiWorkflows.id,
    },
  });

  // ─── Items: DevOps (1 snippet + 1 command + 2 links) ──────────────────────

  const dockerCompose = await prisma.item.create({
    data: {
      title: "Docker Compose — Dev Stack",
      contentType: "text",
      language: "yaml",
      content: `services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/devdb
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: devdb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:`,
      description: "Docker Compose config with Next.js app and PostgreSQL",
      userId: user.id,
      typeId: types.snippet,
      collectionId: devOps.id,
    },
  });

  const deployScript = await prisma.item.create({
    data: {
      title: "Vercel Deploy with Prisma Migrate",
      contentType: "text",
      content: `# Deploy to Vercel with Prisma migration
npx prisma migrate deploy && next build

# Or use as a build command in vercel.json:
# "buildCommand": "npx prisma migrate deploy && next build"`,
      description:
        "Deployment command that runs Prisma migrations before building",
      userId: user.id,
      typeId: types.command,
      collectionId: devOps.id,
    },
  });

  const k8sDocs = await prisma.item.create({
    data: {
      title: "Kubernetes Documentation",
      contentType: "text",
      url: "https://kubernetes.io/docs/home/",
      description: "Official Kubernetes docs — concepts, tasks, and reference",
      userId: user.id,
      typeId: types.link,
      collectionId: devOps.id,
    },
  });

  const ghActionsDocs = await prisma.item.create({
    data: {
      title: "GitHub Actions Documentation",
      contentType: "text",
      url: "https://docs.github.com/en/actions",
      description:
        "GitHub Actions docs for CI/CD workflows, reusable actions, and runners",
      userId: user.id,
      typeId: types.link,
      collectionId: devOps.id,
    },
  });

  // ─── Items: Terminal Commands (4 commands) ─────────────────────────────────

  const gitOps = await prisma.item.create({
    data: {
      title: "Git — Interactive Rebase & Squash",
      contentType: "text",
      content: `# Interactive rebase last N commits
git rebase -i HEAD~3

# Squash all commits on branch into one
git reset --soft main && git commit -m "feat: squashed feature"

# Amend last commit message
git commit --amend -m "new message"

# Undo last commit (keep changes staged)
git reset --soft HEAD~1`,
      description: "Common git rebase, squash, and undo operations",
      isFavorite: true,
      userId: user.id,
      typeId: types.command,
      collectionId: terminalCommands.id,
    },
  });

  const dockerCmds = await prisma.item.create({
    data: {
      title: "Docker — Cleanup & Management",
      contentType: "text",
      content: `# Remove all stopped containers
docker container prune -f

# Remove unused images
docker image prune -a -f

# Remove everything (containers, images, volumes, networks)
docker system prune -a --volumes -f

# List running containers with resource usage
docker stats --no-stream

# Follow logs for a container
docker logs -f <container_name>`,
      description: "Docker cleanup, stats, and log commands",
      userId: user.id,
      typeId: types.command,
      collectionId: terminalCommands.id,
    },
  });

  const processMgmt = await prisma.item.create({
    data: {
      title: "Process Management",
      contentType: "text",
      content: `# Find process using a port
lsof -i :3000

# Kill process on a port
kill -9 $(lsof -t -i :3000)

# List all node processes
ps aux | grep node

# Watch resource usage (top alternative)
htop

# Run a command in the background with output
nohup node server.js > output.log 2>&1 &`,
      description: "Find, kill, and manage system processes",
      userId: user.id,
      typeId: types.command,
      collectionId: terminalCommands.id,
    },
  });

  const pkgManager = await prisma.item.create({
    data: {
      title: "npm / pnpm — Useful Commands",
      contentType: "text",
      content: `# Check for outdated packages
npm outdated

# Update all packages to latest (respecting semver)
npm update

# List installed packages (top-level only)
npm ls --depth=0

# Find why a package is installed
npm explain <package>

# Clean install (delete node_modules + lockfile, reinstall)
rm -rf node_modules package-lock.json && npm install

# Check for security vulnerabilities
npm audit`,
      description: "Package manager utilities for auditing, updating, and debugging",
      isPinned: true,
      userId: user.id,
      typeId: types.command,
      collectionId: terminalCommands.id,
    },
  });

  // ─── Items: Design Resources (4 links) ────────────────────────────────────

  const tailwindDocs = await prisma.item.create({
    data: {
      title: "Tailwind CSS Documentation",
      contentType: "text",
      url: "https://tailwindcss.com/docs",
      description: "Official Tailwind CSS docs — utilities, configuration, and examples",
      isFavorite: true,
      userId: user.id,
      typeId: types.link,
      collectionId: designResources.id,
    },
  });

  const shadcnUI = await prisma.item.create({
    data: {
      title: "shadcn/ui Components",
      contentType: "text",
      url: "https://ui.shadcn.com",
      description:
        "Beautifully designed components built with Radix UI and Tailwind CSS",
      userId: user.id,
      typeId: types.link,
      collectionId: designResources.id,
    },
  });

  const materialDesign = await prisma.item.create({
    data: {
      title: "Material Design 3",
      contentType: "text",
      url: "https://m3.material.io",
      description: "Google Material Design system — guidelines, components, and tokens",
      userId: user.id,
      typeId: types.link,
      collectionId: designResources.id,
    },
  });

  const lucideIcons = await prisma.item.create({
    data: {
      title: "Lucide Icons",
      contentType: "text",
      url: "https://lucide.dev/icons",
      description: "Open-source icon library used across this project",
      userId: user.id,
      typeId: types.link,
      collectionId: designResources.id,
    },
  });

  console.log("Created 20 items across 5 collections");

  // ─── Item–Tag Associations ─────────────────────────────────────────────────

  const itemTags = [
    // React Patterns
    { itemId: useDebounce.id, tagId: tags.react },
    { itemId: useDebounce.id, tagId: tags.hooks },
    { itemId: useDebounce.id, tagId: tags.typescript },
    { itemId: contextProvider.id, tagId: tags.react },
    { itemId: contextProvider.id, tagId: tags.patterns },
    { itemId: contextProvider.id, tagId: tags.typescript },
    { itemId: useLocalStorage.id, tagId: tags.react },
    { itemId: useLocalStorage.id, tagId: tags.hooks },
    { itemId: useLocalStorage.id, tagId: tags.typescript },
    // AI Workflows
    { itemId: codeReview.id, tagId: tags.ai },
    { itemId: codeReview.id, tagId: tags.workflow },
    { itemId: docGeneration.id, tagId: tags.ai },
    { itemId: docGeneration.id, tagId: tags.prompts },
    { itemId: refactoring.id, tagId: tags.ai },
    { itemId: refactoring.id, tagId: tags.workflow },
    // DevOps
    { itemId: dockerCompose.id, tagId: tags.docker },
    { itemId: dockerCompose.id, tagId: tags.devops },
    { itemId: deployScript.id, tagId: tags.devops },
    { itemId: deployScript.id, tagId: tags["ci-cd"] },
    { itemId: k8sDocs.id, tagId: tags.devops },
    { itemId: ghActionsDocs.id, tagId: tags["ci-cd"] },
    { itemId: ghActionsDocs.id, tagId: tags.devops },
    // Terminal Commands
    { itemId: gitOps.id, tagId: tags.git },
    { itemId: gitOps.id, tagId: tags.shell },
    { itemId: dockerCmds.id, tagId: tags.docker },
    { itemId: dockerCmds.id, tagId: tags.shell },
    { itemId: processMgmt.id, tagId: tags.shell },
    { itemId: pkgManager.id, tagId: tags.npm },
    { itemId: pkgManager.id, tagId: tags.shell },
    // Design Resources
    { itemId: tailwindDocs.id, tagId: tags.css },
    { itemId: tailwindDocs.id, tagId: tags.tailwind },
    { itemId: tailwindDocs.id, tagId: tags.design },
    { itemId: shadcnUI.id, tagId: tags.design },
    { itemId: shadcnUI.id, tagId: tags.css },
    { itemId: materialDesign.id, tagId: tags.design },
    { itemId: lucideIcons.id, tagId: tags.design },
  ];

  await prisma.itemTag.createMany({ data: itemTags });

  console.log(`Created ${itemTags.length} item-tag associations`);

  console.log("\nSeed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
