import type { APIRoute } from "astro";
import { BASE, livePosts } from "../lib/dougubako";

/** 固定ページ（ツール）と公開中の記事。ツールを足したら PAGES に1行足す */
const PAGES: [string, string][] = [
	["/", "2026-11-18"],
	["/nazori/", "2026-11-18"],
	["/tokei/", "2026-11-18"],
	["/bunkai/", "2026-11-18"],
	["/blog/", "2026-11-18"],
];

export const GET: APIRoute = async () => {
	const posts = await livePosts();
	const url = (loc: string, lastmod: string) => `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`;
	const lines = [...PAGES.map(([p, d]) => url(`${BASE}${p}`, d)), ...posts.map((p) => url(`${BASE}/blog/${p.slug}/`, p.modified || p.date))];
	return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lines.join("\n")}\n</urlset>\n`, {
		headers: { "content-type": "application/xml; charset=utf-8" },
	});
};
