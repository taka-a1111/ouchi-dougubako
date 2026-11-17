# おうち学習のどうぐばこ（EmDash版・本番）

- 本番：https://ouchidougubako.com（Cloudflare の Worker ouchi-dougubako-site。www は308で本番へ。workers.dev は閉じている）
- ツール・プリント・画像・書体は public/ の静的ファイル。ここが正。ツールを直したら public/ を直してデプロイする
- 記事は EmDash（D1 の posts）から /blog/ と /blog/<slug>/ に出す。管理画面は https://ouchidougubako.com/_emdash/admin（パスキー）
- ビルド：npm install --ignore-scripts → npx astro build → npx wrangler deploy
- D1：ouchi-dougubako-site（463efb9e-134a-4f1a-b691-d9dd909e9e5b）、R2：ouchi-dougubako-media
- main ブランチ（Cloudflare Pages の ouchi-dougubako.pages.dev）は functions/_middleware.js で本番へ301転送するだけ
