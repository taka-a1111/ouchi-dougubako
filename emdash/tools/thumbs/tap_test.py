import asyncio,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,
          user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36')
        pg=await ctx.new_page()
        ok=0; ng=[]
        await pg.goto(sys.argv[1],wait_until='networkidle')
        hrefs=await pg.evaluate("[...document.querySelectorAll('a.card .thumb img')].map(i=>i.closest('a').getAttribute('href'))")
        for i,h in enumerate(hrefs):
            await pg.goto(sys.argv[1],wait_until='domcontentloaded')
            img=pg.locator('a.card .thumb img').nth(i)
            await img.scroll_into_view_if_needed()
            await img.tap()
            await pg.wait_for_timeout(1500)
            if pg.url.split('ouchidougubako.com')[-1].split('127.0.0.1:8765')[-1].split('?')[0]==h: ok+=1
            else: ng.append((h,pg.url))
        print('tap ok',ok,'/',len(hrefs),'ng',ng)
        await b.close()
asyncio.run(main())
