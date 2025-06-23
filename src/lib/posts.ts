import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
};

export type Post = PostMeta & {
  content: string;
};

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsMeta(): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    return {
      slug,
      title: data.title as string,
      date: data.date as string,
    };
  });
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    content,
  };
} 