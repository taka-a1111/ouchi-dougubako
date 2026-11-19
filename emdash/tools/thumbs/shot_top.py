import asyncio,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
        await pg.goto(sys.argv[1],wait_until='networkidle')
        for y in range(0,20000,600):
            await pg.evaluate(f'window.scrollTo(0,{y})'); await pg.wait_for_timeout(60)
        await pg.wait_for_timeout(800)
        sw=await pg.evaluate('document.documentElement.scrollWidth')
        broken=await pg.evaluate('[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src)')
        print('scrollWidth',sw,'broken',broken)
        await pg.evaluate('window.scrollTo(0,0)')
        await pg.screenshot(path=sys.argv[2],full_page=True)
        await b.close()
asyncio.run(main())
