# Publicação

## Como está publicada

- **GitHub Pages**, em Settings → Pages: "Deploy from a branch", branch `main`, pasta `/ (root)`. O domínio vem do arquivo `CNAME` e o HTTPS é obrigatório ("Enforce HTTPS" marcado).
- **Endereço:** https://docenciacriativa.ballestech.com.br. O certificado é da Let's Encrypt, renovado pelo GitHub.
- **Atualização:** cada push no `main` publica em cerca de 45 s. Para confirmar, rode `scripts/conferir-publicado.sh`.

## DNS (Hostinger, zona de ballestech.com.br)

O domínio é do dono, registrado na Hostinger, e os servidores de nome também são da Hostinger.

| Registro | Valor | Para quê |
|---|---|---|
| `CNAME docenciacriativa` | `geffersonballes.github.io.` (TTL 300) | Esta landing |
| `CNAME naoerremais` | `geffersonballes.github.io.` | Outro site do dono no GitHub Pages |
| `A @` | IPs da hospedagem Hostinger | Site principal (repositório `ballestech-landing-page`, publicado pelo Git da Hostinger) |
| `MX`, `TXT` (SPF, Google), `CNAME hostingermail-*._domainkey`, `_dmarc`, `autodiscover`, `autoconfig` | — | **E-mail. Nunca mexer** |

**Para mudar o DNS pela conexão da Hostinger** (`mcp__hostinger__search` encontra as operações; `mcp__hostinger__execute` executa):

1. `dns_records_list` com `{domain: "ballestech.com.br"}`. Guarde a resposta inteira num arquivo: é a cópia para desfazer.
2. `dns_records_validate` com o registro novo e `overwrite: false`.
3. `dns_records_update` com `overwrite: false`, que só acrescenta. Exemplo de registro: `{"name":"x","type":"CNAME","ttl":300,"records":[{"content":"geffersonballes.github.io."}]}`.
4. `dns_records_list` de novo, comparando com a cópia: só pode aparecer o registro novo.

Nunca use `dns_records_reset` nem `dns_records_delete` sem o "sim" do dono. Se a conexão da Hostinger pedir login, passe ao dono o caminho no hPanel: Domínios → ballestech.com.br → DNS → adicionar registro.

**Conferir sem DNS local:** o ambiente da sessão não resolve nomes diretamente. Use DNS sobre HTTPS:

```bash
curl -s -H 'accept: application/dns-json' 'https://dns.google/resolve?name=docenciacriativa.ballestech.com.br&type=CNAME'
```

Para ver qual certificado o site apresenta: `curl -sv https://docenciacriativa.ballestech.com.br/ -o /dev/null 2>&1 | grep subject`.

## Problemas já vistos e solução

| Sintoma | Causa | O que fazer |
|---|---|---|
| GitHub Pages diz "DNS check unsuccessful / InvalidDNSError" logo depois de criar o registro | O GitHub verificou antes do registro existir, e a resposta "não existe" fica guardada por até 10 min (mínimo do SOA = 600 s) | Esperar, tocar em "Check again". Se insistir, "Remove" e "Save" do domínio. Isso gera commits "Delete CNAME" e "Create CNAME" no `main`; dê `git pull` antes de trabalhar |
| O certificado apresentado é `*.github.io` (erro de nome no HTTPS) | Certificado do subdomínio ainda sendo emitido | Esperar (até 1 h) e então marcar "Enforce HTTPS" |
| Algumas respostas com o certificado novo, outras com o antigo | O certificado se espalha pelos servidores do GitHub aos poucos | Repetir em alguns minutos |
| "A página está parada" no iPhone | Aberta pela pré-visualização de arquivos, que não roda JavaScript | Abrir o endereço no Safari |
| Prévia do WhatsApp sem imagem | `og:image` sem `https://`, certificado ainda não emitido ou cache do WhatsApp | Endereços completos no `<head>`; HTTPS ativo; o WhatsApp guarda prévias, então teste com um link novo ou espere |

## Prévia do WhatsApp

- **No `<head>`:** `canonical`, `og:url` e `og:image` com o endereço completo (`https://docenciacriativa.ballestech.com.br/` e `/previa.jpg`), mais `og:image:width` 1200 e `og:image:height` 630.
- **`previa.jpg`:** 1200 × 630, menos de 300 KB.
- **Se o endereço mudar:** troque no arquivo `CNAME`, nas três tags do `<head>` e no DNS. O teste `[prévia]` de `testes/conteudo.js` confere se `CNAME` e tags batem.

## Limites desta sessão de trabalho

- **Criar repositório:** a sessão não cria; quem cria é o dono. Para a sessão enxergar o repositório, o app do Claude no GitHub precisa ter acesso a ele (Settings → Applications → Claude → Repository access). Depois, conecte com `add_repo` (acesso `push`).
- **Apagar branches pelo `git push --delete`:** é recusado (HTTP 403). Peça ao dono para apagar em github.com/…/branches.
- **Histórico:** a landing nasceu no repositório `Tutoriais` (pasta `ia-para-professores`) e foi separada com `git subtree split`, com o histórico preservado. Não restou nada dela no `Tutoriais`.
