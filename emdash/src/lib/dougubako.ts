import { getEmDashCollection, getEmDashEntry } from "emdash";

export const BASE = "https://ouchidougubako.com";
export const SITE = "おうち学習のどうぐばこ";

export interface Post {
	slug: string;
	title: string;
	date: string;
	modified?: string;
	cat: string;
	description: string;
	eyecatch?: string;
	eyecatch_alt?: string;
	body_html: string;
}

/** 日本時間の今日（YYYY-MM-DD） */
export function todayJST(): string {
	return new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
}

function toPost(e: { id: string; data: Record<string, unknown> }): Post {
	const d = e.data as any;
	return {
		slug: String(d.slug ?? e.id),
		title: String(d.title ?? ""),
		date: String(d.date ?? ""),
		modified: d.modified ? String(d.modified) : undefined,
		cat: String(d.cat ?? ""),
		description: String(d.description ?? ""),
		eyecatch: d.eyecatch ? String(d.eyecatch) : undefined,
		eyecatch_alt: d.eyecatch_alt ? String(d.eyecatch_alt) : undefined,
		body_html: String(d.body_html ?? ""),
	};
}

/** 公開日が来ているか（公開日は日本時間のその日から） */
export function isLive(p: Post, today = todayJST()): boolean {
	return !!p.date && p.date <= today;
}

/** 公開済みの記事（新しい順） */
export async function livePosts(): Promise<Post[]> {
	const { entries } = await getEmDashCollection("posts", { status: "published", limit: 1000 });
	const today = todayJST();
	return entries.map(toPost).filter((p) => isLive(p, today)).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function livePost(slug: string): Promise<Post | null> {
	const { entry } = await getEmDashEntry("posts", slug);
	if (!entry || (entry as any).data?.status === "draft") return null;
	const p = toPost(entry as any);
	return isLive(p) ? p : null;
}

export function esc(s: string): string {
	return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

const STYLE = `:root{--navy:#1f2d4d;--cream:#fff9ee;--yellow:#f5c542;--teal:#2a9d8f;--line:#e6dccb;
--ui-font:"Hiragino Maru Gothic ProN","ヒラギノ丸ゴ ProN","Zen Maru Gothic","游ゴシック","Yu Gothic","メイリオ",Meiryo,"Noto Sans JP","Noto Sans CJK JP",sans-serif}
*{box-sizing:border-box}body{margin:0;background:var(--cream);color:var(--navy);font-family:var(--ui-font);line-height:1.9}
a{color:var(--teal)}.topbar{background:var(--navy);padding:10px 16px}.topbar a{color:#fff;text-decoration:none;font-weight:700}
.wrap{max-width:760px;margin:0 auto;padding:20px 16px}h1{font-size:1.5rem;line-height:1.5;margin:8px 0 12px}
.meta{font-size:.85rem;color:#5a6577;margin:0 0 16px}.eye{width:100%;height:auto;border-radius:12px;display:block;margin:0 0 20px}
article h2{font-size:1.25rem;margin:32px 0 10px;padding:6px 12px;background:#fff;border-left:6px solid var(--teal);border-radius:6px}
article h3{font-size:1.08rem;margin:24px 0 8px}article img{max-width:100%;height:auto}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;list-style:none;padding:0}
.cards a{display:block;background:#fff;border:1px solid var(--line);border-radius:12px;padding:14px;text-decoration:none;color:inherit}
.cards a:hover{border-color:var(--teal)}.cards .t{font-weight:700}.cards .d{font-size:.8rem;color:#5a6577}
footer{font-size:.8rem;color:#5a6577;text-align:center;padding:24px 16px}`;

/** ページの枠（記事一覧・記事ページで共通） */
export function layout(o: { title: string; description: string; path: string; body: string; jsonld?: unknown }): string {
	const full = o.path === "/blog/" ? `${o.title}｜${SITE}` : `${o.title}｜${SITE}`;
	return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(o.description)}">
<link rel="canonical" href="${BASE}${o.path}">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(o.description)}">
<meta property="og:url" content="${BASE}${o.path}">
<meta property="og:site_name" content="${SITE}">
<meta property="og:locale" content="ja_JP">
${o.jsonld ? `<script type="application/ld+json">${JSON.stringify(o.jsonld).replace(/</g, "\\u003c")}</script>` : ""}
<style>${STYLE}</style>
</head>
<body>
<div class="topbar"><a href="/">📦 ${SITE}</a></div>
<main class="wrap">
${o.body}
</main>
<footer><a href="/">ツールの一覧</a>　<a href="/blog/">記事</a>　<a href="https://www.instagram.com/ouchi_dougubako/" target="_blank" rel="noopener">Instagram @ouchi_dougubako</a><br>© ${SITE}</footer>
</body>
</html>`;
}

export function blogIndex(posts: Post[]): string {
	const items = posts
		.map((p) => `<li><a href="/blog/${esc(p.slug)}/"><span class="t">${esc(p.title)}</span><br><span class="d">${esc(p.date.replace(/-/g, "."))}・${esc(p.cat)}</span></a></li>`)
		.join("\n");
	return layout({
		title: "記事の一覧",
		description: "年長〜小学生の家庭学習に役立つ記事の一覧です。",
		path: "/blog/",
		body: `<h1>記事の一覧</h1>${items ? `<ul class="cards">${items}</ul>` : "<p>記事は準備中です。</p>"}`,
	});
}

export function renderPost(p: Post): string {
	const path = `/blog/${p.slug}/`;
	const eye = p.eyecatch ? `<img class="eye" src="/blog/img/${esc(p.eyecatch)}" alt="${esc(p.eyecatch_alt || p.title)}" width="1200" height="630">` : "";
	const jsonld = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: p.title,
		description: p.description,
		datePublished: p.date,
		dateModified: p.modified || p.date,
		mainEntityOfPage: `${BASE}${path}`,
		publisher: { "@type": "Organization", name: SITE, url: `${BASE}/` },
	};
	return layout({
		title: p.title,
		description: p.description,
		path,
		jsonld,
		body: `<article><h1>${esc(p.title)}</h1><p class="meta">${esc(p.date.replace(/-/g, "."))}${p.modified ? `（更新 ${esc(p.modified.replace(/-/g, "."))}）` : ""}・${esc(p.cat)}</p>${eye}${p.body_html}</article>`,
	});
}

export const SECURITY_HEADERS: Record<string, string> = {
	"x-content-type-options": "nosniff",
	"referrer-policy": "strict-origin-when-cross-origin",
	"x-frame-options": "DENY",
};

export function htmlResponse(body: string, status = 200): Response {
	return new Response(body, { status, headers: { "content-type": "text/html; charset=utf-8", ...SECURITY_HEADERS } });
}

export function notFound(): Response {
	return htmlResponse(
		layout({ title: "ページが見つかりません", description: "お探しのページは見つかりませんでした。", path: "/404", body: `<h1>ページが見つかりません</h1><p><a href="/">ツールの一覧へ戻る</a></p>` }),
		404,
	);
}
