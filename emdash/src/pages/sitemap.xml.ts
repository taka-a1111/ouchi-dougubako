import type { APIRoute } from "astro";
import { BASE, livePosts } from "../lib/dougubako";

/** 固定ページ（ツール）と公開中の記事。ツールを足したら PAGES に1行足す */
const PAGES: [string, string][] = [
	["/", "2026-11-18"],
	["/nazori/", "2026-11-18"],
	["/tokei/", "2026-11-18"],
	["/bunkai/", "2026-11-18"],
	["/kuku/", "2026-11-18"],
	["/fuyuyasumi/", "2026-11-18"],
	["/kanji/", "2026-11-19"],
	["/ondoku/", "2026-11-19"],
	["/keisan/", "2026-11-19"],
	["/bunshodai/", "2026-11-19"],
	["/nyugaku-calendar/", "2026-11-19"],
	["/suuji/", "2026-11-19"],
	["/hyakumasu/", "2026-11-19"],
	["/jikanwari-maker/", "2026-11-19"],
	["/namae-label/", "2026-11-19"],
	["/shitaku/", "2026-11-19"],
	["/shukudai/", "2026-11-19"],
	["/kukucard/", "2026-11-19"],
	["/print/checklist/", "2026-11-18"],
	["/print/kukuhyo/", "2026-11-18"],
	["/print/schedule/", "2026-11-18"],
	["/print/kotoba/", "2026-11-19"],
	["/print/yakusoku/", "2026-11-19"],
	["/print/mokuhyo/", "2026-11-19"],
	["/print/kanji80/", "2026-11-19"],
	["/print/kanji160/", "2026-11-19"],
	["/print/furikaeri/", "2026-11-19"],
	["/print/mochimono/", "2026-11-19"],
	["/print/gakunen-mokuhyo/", "2026-11-19"],
	["/print/gohoubi/", "2026-11-19"],
	["/print/renrakucho/", "2026-11-19"],
	["/print/gakki1/", "2026-11-19"],
	["/print/nyugaku3/", "2026-11-19"],
	["/print/matome1/", "2026-11-19"],
	["/print/namae/", "2026-11-19"],
	["/print/kata-miwake/", "2026-11-19"],
	["/print/otetsudai/", "2026-11-19"],
	["/print/jikanwari/", "2026-11-19"],
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
