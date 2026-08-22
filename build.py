"""Gera a versão em arquivo único (tudo embutido), a partir dos arquivos
deste mesmo diretório. Rode com: python3 build.py"""
import base64, json, re
d = ""
h = open(d + "index.html").read()
css = open(d + "app.css").read()
js = "\n".join(open(d + f).read() for f in ["data.js", "poses.js", "corrida.js", "app.js"])
icone = open(d + "icone.svg").read()
m = json.loads(open(d + "manifest.json").read())
icon_uri = "data:image/svg+xml;base64," + base64.b64encode(icone.encode()).decode()
m["icons"][0]["src"] = icon_uri
m["start_url"] = "."
man_uri = "data:application/json;base64," + base64.b64encode(json.dumps(m).encode()).decode()
h = h.replace('<link rel="manifest" href="manifest.json">', f'<link rel="manifest" href="{man_uri}">')
h = h.replace('<link rel="icon" href="icone.svg">', f'<link rel="icon" href="{icon_uri}">')
h = h.replace('<link rel="stylesheet" href="app.css">', "<style>\n" + css + "\n</style>")
h = re.sub(r'(<script src="[^"]+"></script>\s*){4}', "<script>\n" + js.replace("\\", "\\\\") + "\n</script>\n", h, count=1)
open("treino-isa.html", "w").write(h)
print(f"treino-isa.html gerado ({len(h)/1024:.1f} KB)")
