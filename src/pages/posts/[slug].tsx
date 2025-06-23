import { GetStaticPaths, GetStaticProps } from 'next';
import { getSortedPostsMeta, getPostBySlug } from '../../lib/posts';
import { Post } from '../../lib/posts';
import { remark } from 'remark';
import html from 'remark-html';
import Link from 'next/link';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getSortedPostsMeta();
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const post = getPostBySlug(slug);
  const processedContent = await remark().use(html).process(post.content);
  const contentHtml = processedContent.toString();
  return {
    props: {
      post: {
        ...post,
        contentHtml,
      },
    },
  };
};

export default function PostPage({ post }: { post: Post & { contentHtml: string } }) {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h1>{post.title}</h1>
      <div style={{ color: '#888', fontSize: 14 }}>{post.date}</div>
      <article style={{ marginTop: 32 }} dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      <div style={{ marginTop: 32 }}>
        <Link href="/">← 回到首頁</Link>
      </div>
    </div>
  );
} 