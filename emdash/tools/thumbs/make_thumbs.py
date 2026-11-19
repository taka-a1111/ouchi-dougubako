import os,re
from PIL import Image, ImageFilter
import sys
PUB=sys.argv[1] if len(sys.argv)>1 else os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','public')
RAW=sys.argv[2] if len(sys.argv)>2 else 'raw'
OUT=PUB+'/assets/thumbs'; os.makedirs(OUT,exist_ok=True)
html=open(PUB+'/index.html').read()
hrefs=re.findall(r'href="/((?:print/)?[a-z0-9-]+)/"',html)
W,H,M,T=640,480,30,24
def thumb(src,dst):
    pg=Image.open(src).convert('RGB')
    pw=W-2*M; pg=pg.resize((pw,round(pg.height*pw/pg.width)),Image.LANCZOS)
    can=Image.new('RGB',(W,H),'#f1e8d8')
    sh=Image.new('L',(W,H),0); sh.paste(70,(M,T+3,M+pw,H+40)); sh=sh.filter(ImageFilter.GaussianBlur(7))
    can.paste(Image.new('RGB',(W,H),'#b9a888'),(0,0),sh)
    can.paste(pg.crop((0,0,pw,H-T)),(M,T))
    can.save(dst,quality=82,optimize=True,progressive=True)
done=[]
ONLY=set(sys.argv[3].split(',')) if len(sys.argv)>3 else None
for h in hrefs:
    if ONLY and h not in ONLY and h.replace('print/','print-') not in ONLY: continue
    if h.startswith('print/'):
        n=h[6:]
        cands=[f'{PUB}/print/{n}-preview-1.jpg',f'{PUB}/print/{n}-preview.jpg']
        src=next((c for c in cands if os.path.exists(c)),None); key='print-'+n
    else:
        src=f'{RAW}/{h}.png'; key=h
        if not os.path.exists(src): src=None
    if not src: print('MISSING',h); continue
    thumb(src,f'{OUT}/{key}.jpg'); done.append(key)
print(len(done),done)
