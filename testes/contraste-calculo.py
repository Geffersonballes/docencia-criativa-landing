# Calcula o contraste entre a cor de cada texto e o fundo medido na captura (sem o texto).
# Usa o fundo mais claro (percentil 95) dentro da caixa do texto: é o pior caso para texto claro.
# Uso: python3 testes/contraste-calculo.py testes/saida/contraste  (precisa do Pillow: pip install pillow)
import json, re, sys
from PIL import Image

D = sys.argv[1]
indice = json.load(open(D + "/indice.json"))


def lin(c):
    c = c / 255
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4


def lum(rgb):
    return 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2])


def cor(s):
    n = [float(x) for x in re.findall(r"[\d.]+", s)]
    return (n[0], n[1], n[2], n[3] if len(n) > 3 else 1.0)


ruins, total, piores = [], 0, {}
for nome in indice:
    im = Image.open(f"{D}/{nome}.png").convert("RGB")
    W, H = im.size
    px = im.load()
    for c in json.load(open(f"{D}/{nome}.json")):
        x0, y0 = int(c["x"]), int(c["y"])
        x1, y1 = min(W, int(c["x"] + c["w"])), min(H, int(c["y"] + c["h"]))
        if x1 - x0 < 2 or y1 - y0 < 2:
            continue
        passo = max(1, int(min(x1 - x0, y1 - y0) / 6))
        amostras = sorted(lum(px[x, y]) for x in range(x0, x1, passo) for y in range(y0, y1, passo))
        if not amostras:
            continue
        fundo = amostras[int(len(amostras) * .95) - 1 if len(amostras) > 1 else 0]
        r, g, b, a = cor(c["cor"])
        lt = lum((r, g, b))
        claro, escuro = max(lt, fundo), min(lt, fundo)
        cr = (claro + 0.05) / (escuro + 0.05)
        grande = c["fs"] >= 24 or (c["fs"] >= 18.66 and c["peso"] >= 700)
        minimo = 3 if grande else 4.5
        total += 1
        chave = c["sel"] + " | " + c["txt"]
        if chave not in piores or cr < piores[chave][0]:
            piores[chave] = (cr, nome, minimo, c["sombra"])
        if cr < minimo:
            ruins.append((round(cr, 2), minimo, nome, c["sel"], c["txt"], "com halo" if c["sombra"] else "sem halo"))

print("caixas de texto medidas:", total)
print("abaixo do mínimo AA:", len(ruins))
vistos = set()
for r in sorted(ruins):
    if (r[3], r[4]) in vistos:
        continue
    vistos.add((r[3], r[4]))
    print("  ", r)
print("10 menores contrastes (mesmo acima do mínimo):")
for k, v in sorted(piores.items(), key=lambda kv: kv[1][0])[:10]:
    print("   %.2f (mín %s) %s  %s" % (v[0], v[2], v[1], k))
