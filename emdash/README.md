# おうち学習のどうぐばこ（EmDash版）

- 本番：https://ouchidougubako.com（Cloudflare の Worker ouchi-dougubako-site）
- ツール・プリント・画像・書体は public/ の静的ファイル。記事は EmDash（D1 の posts）から /blog/ と /blog/<slug>/ に出す
- ビルド：npm install --ignore-scripts → npx astro build → npx wrangler deploy
- D1：ouchi-dougubako-site、R2：ouchi-dougubako-media
- ツールを直したら、main のルートの同じファイルと public/ の両方をそろえる（main は Cloudflare Pages 版。ドメイン移行後は転送だけ）
