import type { APIRoute } from "astro";
import { blogIndex, htmlResponse, livePosts } from "../../lib/dougubako";

export const GET: APIRoute = async () => htmlResponse(blogIndex(await livePosts()));
