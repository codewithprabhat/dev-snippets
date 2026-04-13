// Mock data for dashboard UI until database is implemented

export type ItemType = {
  id: string;
  name: string;
  icon: string;
  color: string;
  isSystem: boolean;
  count: number;
};

export type Collection = {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  itemCount: number;
  icon: string;
};

export type Tag = {
  id: string;
  name: string;
};

export type Item = {
  id: string;
  title: string;
  description: string;
  contentType: "text" | "file";
  content: string;
  language?: string;
  isFavorite: boolean;
  isPinned: boolean;
  typeId: string;
  collectionId?: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  isPro: boolean;
};

// Current user
export const currentUser: User = {
  id: "user_1",
  name: "John Doe",
  email: "john@example.com",
  isPro: false,
};

// System item types (sidebar)
export const itemTypes: ItemType[] = [
  {
    id: "type_1",
    name: "Snippets",
    icon: "Code",
    color: "#3b82f6",
    isSystem: true,
    count: 24,
  },
  {
    id: "type_2",
    name: "Prompts",
    icon: "MessageSquare",
    color: "#a855f7",
    isSystem: true,
    count: 18,
  },
  {
    id: "type_3",
    name: "Commands",
    icon: "Terminal",
    color: "#22c55e",
    isSystem: true,
    count: 15,
  },
  {
    id: "type_4",
    name: "Notes",
    icon: "FileText",
    color: "#eab308",
    isSystem: true,
    count: 12,
  },
  {
    id: "type_5",
    name: "Files",
    icon: "File",
    color: "#ef4444",
    isSystem: true,
    count: 5,
  },
  {
    id: "type_6",
    name: "Images",
    icon: "Image",
    color: "#ec4899",
    isSystem: true,
    count: 3,
  },
  {
    id: "type_7",
    name: "Links",
    icon: "Link",
    color: "#06b6d4",
    isSystem: true,
    count: 8,
  },
];

// Collections
export const collections: Collection[] = [
  {
    id: "col_1",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    isFavorite: true,
    itemCount: 12,
    icon: "Folder",
  },
  {
    id: "col_2",
    name: "Python Snippets",
    description: "Useful Python code snippets",
    isFavorite: false,
    itemCount: 8,
    icon: "Folder",
  },
  {
    id: "col_3",
    name: "Context Files",
    description: "AI context files for projects",
    isFavorite: true,
    itemCount: 5,
    icon: "Folder",
  },
  {
    id: "col_4",
    name: "Interview Prep",
    description: "Technical interview preparation",
    isFavorite: false,
    itemCount: 24,
    icon: "Folder",
  },
  {
    id: "col_5",
    name: "Git Commands",
    description: "Frequently used git commands",
    isFavorite: true,
    itemCount: 15,
    icon: "Folder",
  },
  {
    id: "col_6",
    name: "AI Prompts",
    description: "Curated AI prompts for coding",
    isFavorite: false,
    itemCount: 18,
    icon: "Folder",
  },
];

// Items (pinned & recent for dashboard display)
export const items: Item[] = [
  {
    id: "item_1",
    title: "useAuth Hook",
    description: "Custom authentication hook for React applications",
    contentType: "text",
    content: `import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth status
    checkAuth().then(setUser).finally(() => setLoading(false));
  }, []);

  return { user, loading };
}`,
    language: "typescript",
    isFavorite: true,
    isPinned: true,
    typeId: "type_1",
    collectionId: "col_1",
    tags: [
      { id: "tag_1", name: "react" },
      { id: "tag_2", name: "auth" },
      { id: "tag_3", name: "hooks" },
    ],
    createdAt: "2026-03-15T10:00:00Z",
    updatedAt: "2026-04-10T14:30:00Z",
  },
  {
    id: "item_2",
    title: "API Error Handling Pattern",
    description:
      "Fetch wrapper with exponential backoff retry logic",
    contentType: "text",
    content: `async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.statusText);
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 2 ** i * 1000));
    }
  }
}`,
    language: "typescript",
    isFavorite: false,
    isPinned: true,
    typeId: "type_1",
    collectionId: "col_1",
    tags: [
      { id: "tag_4", name: "api" },
      { id: "tag_5", name: "error-handling" },
      { id: "tag_6", name: "fetch" },
    ],
    createdAt: "2026-03-20T08:00:00Z",
    updatedAt: "2026-04-12T09:15:00Z",
  },
  {
    id: "item_3",
    title: "Git Rebase Workflow",
    description: "Step-by-step rebase workflow for clean history",
    contentType: "text",
    content: `git fetch origin
git checkout feature-branch
git rebase origin/main
# resolve conflicts if any
git add .
git rebase --continue
git push --force-with-lease`,
    language: "bash",
    isFavorite: false,
    isPinned: false,
    typeId: "type_3",
    collectionId: "col_5",
    tags: [
      { id: "tag_7", name: "git" },
      { id: "tag_8", name: "rebase" },
    ],
    createdAt: "2026-03-22T11:00:00Z",
    updatedAt: "2026-04-08T16:00:00Z",
  },
  {
    id: "item_4",
    title: "Python List Comprehension Examples",
    description: "Common list comprehension patterns in Python",
    contentType: "text",
    content: `# Filter even numbers
evens = [x for x in range(20) if x % 2 == 0]

# Flatten nested list
flat = [item for sublist in nested for item in sublist]

# Dict comprehension
squares = {x: x**2 for x in range(10)}`,
    language: "python",
    isFavorite: true,
    isPinned: false,
    typeId: "type_1",
    collectionId: "col_2",
    tags: [
      { id: "tag_9", name: "python" },
      { id: "tag_10", name: "list-comprehension" },
    ],
    createdAt: "2026-03-25T09:00:00Z",
    updatedAt: "2026-04-05T12:00:00Z",
  },
  {
    id: "item_5",
    title: "Code Review Prompt",
    description: "AI prompt for thorough code review",
    contentType: "text",
    content:
      "Review this code for bugs, security issues, performance problems, and style. Suggest improvements with explanations.",
    isFavorite: false,
    isPinned: false,
    typeId: "type_2",
    collectionId: "col_6",
    tags: [
      { id: "tag_11", name: "ai" },
      { id: "tag_12", name: "code-review" },
    ],
    createdAt: "2026-04-01T10:00:00Z",
    updatedAt: "2026-04-10T11:00:00Z",
  },
  {
    id: "item_6",
    title: "Docker Compose Basics",
    description: "Essential docker compose commands for development",
    contentType: "text",
    content: `docker compose up -d
docker compose down
docker compose logs -f service_name
docker compose exec service_name sh
docker compose build --no-cache`,
    language: "bash",
    isFavorite: false,
    isPinned: false,
    typeId: "type_3",
    tags: [
      { id: "tag_13", name: "docker" },
      { id: "tag_14", name: "devops" },
    ],
    createdAt: "2026-04-03T14:00:00Z",
    updatedAt: "2026-04-11T10:00:00Z",
  },
  {
    id: "item_7",
    title: "Meeting Notes Template",
    description: "Markdown template for dev meeting notes",
    contentType: "text",
    content: `# Meeting: [Title]
**Date:** YYYY-MM-DD
**Attendees:**

## Agenda
-

## Decisions
-

## Action Items
- [ ]
`,
    isFavorite: false,
    isPinned: false,
    typeId: "type_4",
    tags: [
      { id: "tag_15", name: "template" },
      { id: "tag_16", name: "meetings" },
    ],
    createdAt: "2026-04-05T08:00:00Z",
    updatedAt: "2026-04-05T08:00:00Z",
  },
  {
    id: "item_8",
    title: "Prisma Schema Reference",
    description: "Quick reference for common Prisma schema patterns",
    contentType: "text",
    content: `model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`,
    language: "prisma",
    isFavorite: true,
    isPinned: false,
    typeId: "type_1",
    tags: [
      { id: "tag_17", name: "prisma" },
      { id: "tag_18", name: "database" },
    ],
    createdAt: "2026-04-07T15:00:00Z",
    updatedAt: "2026-04-11T09:00:00Z",
  },
];
