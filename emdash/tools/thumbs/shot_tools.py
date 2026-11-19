import sys, asyncio
from playwright.async_api import async_playwright
TOOLS = sys.argv[2].split(',')
OUT = sys.argv[1]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg = await b.new_page(viewport={'width':1200,'height':1000}, device_scale_factor=2)
        for t in TOOLS:
            await pg.goto(f'http://127.0.0.1:8765/{t}/', wait_until='networkidle')
            await pg.wait_for_timeout(1200)
            if t=='namae-label':
                await pg.fill('#name','たなか はると'); await pg.fill('#sub','1ねん2くみ'); await pg.fill('#short','はると')
                await pg.dispatch_event('#name','input'); await pg.wait_for_timeout(800)
            await pg.evaluate("""() => {
              const el=document.querySelector('.page'); if(!el) return;
              el.style.setProperty('transform','none','important');
              let n=el;
              while(n.parentElement){
                for(const sb of n.parentElement.children){ if(sb!==n) sb.style.setProperty('display','none','important') }
                n=n.parentElement;
                for(const [k,v] of [['transform','none'],['overflow','visible'],['width','auto'],['height','auto'],['max-width','none'],['margin','0'],['padding','0'],['display','block'],['position','static'],['min-width','0']]) n.style.setProperty(k,v,'important');
              }
              window.scrollTo(0,0);
            }""")
            await pg.wait_for_timeout(400)
            el = pg.locator('.page').first
            n = await pg.locator('.page').count()
            if n == 0:
                print(t, 'NO PAGE'); continue
            await el.screenshot(path=f'{OUT}/{t}.png')
            print(t, n, await el.bounding_box())
        await b.close()
asyncio.run(main())
