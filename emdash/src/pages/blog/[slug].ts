import type { APIRoute } from "astro";
import { htmlResponse, livePost, notFound, renderPost } from "../../lib/dougubako";

/** /blog/<slug>/ */
export const GET: APIRoute = async ({ params }) => {
	const slug = String(params.slug ?? "");
	if (!/^[a-z0-9-]+$/.test(slug)) return notFound();
	const post = await livePost(slug);
	return post ? htmlResponse(renderPost(post)) : notFound();
};
