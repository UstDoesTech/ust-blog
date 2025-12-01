import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');
  const body = JSON.stringify(
    posts.map((p) => ({
      title: p.data.title,
      description: p.data.description ?? '',
      url: `/posts/${p.data.slug || p.id}`,
      pubDate: p.data.pubDate,
      tags: p.data.tags ?? [],
      categories: p.data.categories ?? [],
      slug: p.data.slug || p.id,
    }))
  );

  return new Response(body, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
