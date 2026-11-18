import subprocess, sys, time, urllib.parse
from playwright.sync_api import sync_playwright
# 使い方: python3 qa/render_eyecatch.py <出力.jpg> <タグ> <タイトル(HTML可、<br>と<em>)> <サブ>
out, tag, title, sub = sys.argv[1:5]
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8769", "-d", "."], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
try:
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        s = b.new_page(viewport={"width": 1200, "height": 630}, device_scale_factor=1)
        q = urllib.parse.urlencode({"tag": tag, "title": title, "sub": sub})
        s.goto(f"http://localhost:8769/posts/eyecatch/eyecatch.html?{q}")
        s.evaluate("document.fonts.ready")
        s.wait_for_timeout(2000)
        over = s.evaluate("""() => {const r=document.getElementById('title').getBoundingClientRect(); const sub=document.getElementById('sub').getBoundingClientRect(); return {titleBottom:Math.round(r.bottom), subTop:Math.round(sub.top)}}""")
        print(over)
        s.locator("#e1").screenshot(path=out, type="jpeg", quality=90)
        b.close()
finally:
    srv.terminate()
