// 2026-11-18 ouchidougubako.com へ移転。pages.dev へのアクセスはすべて同じパスで新しいドメインへ転送する
export async function onRequest({ request }) {
  const u = new URL(request.url);
  return Response.redirect("https://ouchidougubako.com" + u.pathname + u.search, 301);
}
