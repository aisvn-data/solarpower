import asyncio
import sys

from freetrans import SyncTranslator, Translator

# (text, dest, substring expected in the lowercased result)
CASES = [
    ("Bonjour le monde", "en", "hello"),
    ("Guten Morgen", "en", "morning"),
    ("Thank you very much", "vi", "cảm ơn"),
    ("Good night", "es", "noche"),
]
failures = []


def check(label, ok, detail=""):
    print(f"[{'OK' if ok else 'FAIL'}] {label} {detail}")
    if not ok:
        failures.append(label)


async def run_async():
    async with Translator(ipv4=True) as t:
        for text, dest, expected in CASES:
            r = await t.translate(text, dest=dest)
            check(f"async {text!r}->{dest}", expected in r.text.lower(), repr(r.text))

        # batch
        items = ["Good morning", "Good afternoon", "Good night"]
        res = await t.translate(items, dest="ja")
        check("async batch", len(res) == 3 and all(x.text for x in res),
              repr([x.text for x in res]))


def run_sync():
    with SyncTranslator(ipv4=True) as t:
        r = t.translate("Hello world", dest="es")
        check("sync hello->es", "hola" in r.text.lower(), repr(r.text))

        d = t.detect("이 문장은 한국어로 작성되었습니다.")
        check("detect korean", d.lang == "ko", f"lang={d.lang} conf={d.confidence}")


print(f"Python {sys.version.split()[0]}")
asyncio.run(run_async())
run_sync()

if failures:
    print(f"\n{len(failures)} check(s) failed: {failures}")
    sys.exit(1)
print("\nAll checks passed")
