# トップのカードの見本画像（サムネイル）

トップ（public/index.html）のツール・配布プリントのカードには、640×480 の見本画像を入れる。
置き場：public/assets/thumbs/<ツール名>.jpg、配布物は print-<名前>.jpg。

1. public を http.server で配る：`cd emdash/public && python3 -m http.server 8765 --bind 127.0.0.1 &`
2. ツールの1ページ目を撮る（実物のツールを動かして撮る）：`python3 shot_tools.py <出力dir> nazori,tokei,...`
   - 入力が要るツール（namae-label など）は shot_tools.py の中で例の名前を入れる
3. 見本画像を作る：`python3 make_thumbs.py <publicのパス> <出力dir> [対象をカンマ区切り]`
   - 配布物は public/print/<名前>-preview-1.jpg（なければ -preview.jpg）から作る
4. カードに `<span class="thumb"><img draggable="false" src="/assets/thumbs/<key>.jpg" width="640" height="480" loading="lazy" decoding="async" alt="<タイトル>の見本"></span>` を tag の前に入れる
5. デプロイ後に確かめる：`python3 shot_top.py https://ouchidougubako.com/ out.png`（はみ出し・画像の欠け）と `python3 tap_test.py https://ouchidougubako.com/`（画像のタップで全カードが詳細へ移るか）
