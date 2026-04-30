#!/usr/bin/env python3
"""Generate ElevenLabs narration audio for the GraphRAG demo — Fall Müller.

Uses Alice voice (multilingual v2) — professional, clear female narrator.
The narration walks through a complex Sachbearbeiter case (Erwerbsminderungsrente)
and explains the knowledge graph connections.
"""
import json, urllib.request, os, sys

# ── Configuration ──
API_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
if not API_KEY:
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
    if os.path.exists(env_path):
        for line in open(env_path):
            if line.startswith("ELEVENLABS_API_KEY"):
                API_KEY = line.split("=", 1)[1].strip().strip('"').strip("'")

if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY not set. Add to .env or environment.")
    sys.exit(1)

# Alice — Clear, Engaging Educator — middle-aged female, professional
VOICE_ID = "Xb7hH8MSUJpSbSDYk0k2"

NARRATION_TEXT = """Willkommen beim digitalen Wissensassistenten für die Deutsche Rentenversicherung — einer Demo-Anwendung für Knowledge Graph und GraphRAG.

Ich möchte Ihnen anhand eines realen Sachbearbeiterfalls zeigen, warum ein Knowledge Graph mit GraphRAG für die DRV unverzichtbar ist — und warum klassische KI-Ansätze wie ChatGPT oder Vector RAG bei der Komplexität des Sozialrechts versagen.

Stellen Sie sich vor: Auf Ihrem Schreibtisch landet der Fall von Sabine Müller. Aktenzeichen R 920 Schrägstrich 25 EM. Frau Müller, geboren am 15. März 1968, Industriekauffrau aus Essen, beantragt eine volle Erwerbsminderungsrente. Was erstmal nach einem Standard-Antrag klingt, entpuppt sich schnell als hochkomplexer Fall.

Schauen wir uns ihren Versicherungsverlauf an — und Sie werden sehen, warum dieser Fall so viele Paragraphen gleichzeitig berührt.

Frau Müller beginnt 1984 eine Ausbildung bei Thyssen in Duisburg. Drei Jahre Pflichtbeiträge. Danach arbeitet sie sechs Jahre Vollzeit — stabile Beiträge, alles unkompliziert.

Dann kommen die Kinder: Leon 1993, Marie 1995. Drei Jahre Kindererziehungszeit. Und hier wird es schon spannend — denn nach Paragraph 56 SGB Sechs zählen Kindererziehungszeiten als Pflichtbeiträge. Ein voller Entgeltpunkt pro Jahr, als hätte sie Durchschnittsgehalt verdient. Das wird später noch entscheidend.

Von 1996 bis 2000 arbeitet sie Teilzeit — halbe Beiträge. Und dann — die kritische Phase: Von 2000 bis 2002 macht sich Frau Müller als Buchhalterin selbstständig. Ohne Pflichtversicherung. 27 Monate Beitragslücke. Im Graphen sehen Sie diesen Knoten rot markiert — denn diese Lücke gefährdet potenziell die Drei-von-Fünf-Jahre-Regel für die Erwerbsminderungsrente nach Paragraph 43.

Ab 2002 geht sie zurück in eine Festanstellung. 17 Jahre stabile Pflichtbeiträge bei einem Logistikunternehmen in Essen. Bis zum 15. September 2019.

An diesem Tag passiert der Arbeitsunfall. Ein Sturz am Arbeitsplatz, Wirbelsäulenverletzung, BWK 11/12 Fraktur. Anerkannt durch die Berufsgenossenschaft. Und dieser Arbeitsunfall ist im Graphen das auslösende Ereignis für eine ganze Kette von Folgen.

Im Graphen sehen Sie jetzt die Verbindung: Der Arbeitsunfall-Knoten verweist direkt auf Paragraph 53 SGB Sechs — die vorzeitige Wartezeiterfüllung. Wenn die Erwerbsminderung durch einen Arbeitsunfall verursacht wird, gilt die Wartezeit als sofort erfüllt. Das ist eine Ausnahme, die die normale Fünf-Jahre-Wartezeit außer Kraft setzt. Kein Vector RAG der Welt könnte diese Querverbindung zuverlässig herstellen — denn dafür muss man wissen, dass Paragraph 43 auf Paragraph 50 verweist, und Paragraph 53 eine Ausnahme zu Paragraph 50 definiert. Das sind drei Paragraphen in einer Kette.

Aber es kommt noch komplexer. Bevor überhaupt eine Erwerbsminderungsrente bewilligt werden kann, muss der Grundsatz "Reha vor Rente" geprüft werden — Paragraph 9 SGB Sechs in Verbindung mit Paragraph 49 SGB Neun. Und tatsächlich: Frau Müller war bereits in Rehabilitation. Drei Wochen stationär in der BG Klinik Bergmannsheil in Bochum, danach sechs Monate ambulante Nachsorge. Der Reha-Entlassbericht bestätigt: Teilweise Besserung, aber keine Vollbelastung mehr möglich. Im Graphen sehen Sie: Der Reha-Knoten ist direkt mit der Geschäftsregel "Reha vor Rente" verbunden — die Voraussetzung ist erfüllt.

Jetzt die Drei-von-Fünf-Jahre-Regel: In den letzten fünf Jahren vor Eintritt der Erwerbsminderung müssen mindestens drei Jahre Pflichtbeiträge vorliegen. Frau Müllers Erwerbsminderung tritt im November 2024 ein. Fünf Jahre zurück: November 2019. In diesem Zeitraum hat sie: Die Reha-Zeit als Anrechnungszeit, und dann Teilzeit-Pflichtbeiträge von 2020 bis 2024. Das sind über drei Jahre Pflichtbeiträge — die Regel ist erfüllt. Aber: Hätte die Lücke von 2000 bis 2002 in diesem Zeitfenster gelegen, wäre es kritisch geworden.

Im Graphen sehen Sie genau diese Prüfkette: Fall Müller prüft gegen die Geschäftsregel Paragraph 43, diese verweist auf die Wartezeit-Regel Paragraph 50, der Arbeitsunfall löst Paragraph 53 aus, die Kindererziehungszeiten werden nach Paragraph 56 als Pflichtbeiträge angerechnet, und die Reha erfüllt den Grundsatz "Reha vor Rente". Sechs Paragraphen, drei Sozialgesetzbücher — SGB Sechs, SGB Neun, SGB Zehn — alle in einem einzigen Fall verknüpft.

Und dann die Rentenberechnung. Paragraph 63 SGB Sechs: Monatliche Rente gleich Entgeltpunkte mal Zugangsfaktor mal Rentenartfaktor mal aktueller Rentenwert. Frau Müller hat geschätzt 28,5 Entgeltpunkte gesammelt. Bei einem aktuellen Rentenwert von 39 Euro 32 im Westen und einer vollen Erwerbsminderungsrente mit Rentenartfaktor 1,0 ergibt das eine monatliche Bruttorente von circa 1.120 Euro. Aber erst, wenn alle Zeiten korrekt im Versicherungskonto erfasst sind — inklusive der Kindererziehungszeiten und der Reha-Anrechnungszeit.

Bemerkenswert ist auch der Verfahrensweg. Der erste Antrag im März 2024 wurde abgelehnt — unvollständiges Versicherungskonto, fehlende Arbeitsunfähigkeits-Bescheinigungen. Frau Müller hat fristgerecht Widerspruch eingelegt — innerhalb eines Monats nach Bekanntgabe, wie Paragraph 84 SGB Zehn es vorschreibt. Der Widerspruch führte zu einer neuen Begutachtung durch den Ärztlichen Dienst der DRV. Dr. Bergmann bestätigt: Restleistungsvermögen unter drei Stunden täglich. Volle Erwerbsminderung, befristet auf drei Jahre.

Im Graphen sehen Sie diese gesamte Ereigniskette: Arbeitsunfall führt zu Erstantrag, Erstantrag erzeugt Ablehnungsbescheid, Widerspruch nach Paragraph 84 SGB Zehn, neues Gutachten, Neuantrag. Jedes Ereignis verknüpft mit den relevanten Rechtsgrundlagen, Dokumenten und Prozessschritten.

Und genau hier liegt der entscheidende Unterschied: Ein Vector RAG System hätte bei der Frage 'Hat Frau Müller Anspruch auf Erwerbsminderungsrente' vielleicht Paragraph 43 gefunden und die allgemeinen Voraussetzungen aufgelistet. Aber es hätte nicht erkannt, dass der Arbeitsunfall Paragraph 53 auslöst. Es hätte nicht gewusst, dass die Kindererziehungszeiten als Pflichtbeiträge zählen. Es hätte die Kette Paragraph 43, 50, 53, 56, 9, 63 nicht traversieren können. Und es hätte schon gar nicht die Widerspruchsfrist nach SGB Zehn im Blick gehabt.

Der Knowledge Graph dagegen modelliert all diese Zusammenhänge als explizite Beziehungen. Jeder Knoten in diesem Graphen — jedes Gesetz, jeder Paragraph, jede Geschäftsregel, jedes Ereignis im Fall Müller — ist mit seinen Nachbarn verbunden. Und die GraphRAG-Engine kann diese Verbindungen traversieren, um vollständige, nachvollziehbare und rechtssichere Antworten zu liefern.

Das ist die Idee: Ein System, das die Komplexität des Sozialrechts nicht vereinfacht, sondern beherrschbar macht. Für die 56.000 Mitarbeitenden der DRV, die jeden Tag Fälle wie den von Sabine Müller bearbeiten."""

# ── Generate with ElevenLabs ──
url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
payload = json.dumps({
    "text": NARRATION_TEXT,
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
        "stability": 0.70,
        "similarity_boost": 0.75,
        "style": 0.25,
        "use_speaker_boost": True
    }
}).encode("utf-8")

req = urllib.request.Request(
    url,
    data=payload,
    headers={
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
    },
    method="POST"
)

output_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "audio", "drv_fall_mueller.mp3")
os.makedirs(os.path.dirname(output_path), exist_ok=True)

print(f"Generating speech with voice: Alice (Clear, Engaging Educator)")
print(f"Model: eleven_multilingual_v2 (German)")
print(f"Text length: {len(NARRATION_TEXT)} characters")
print(f"Output: {output_path}")

try:
    with urllib.request.urlopen(req, timeout=180) as resp:
        audio_data = resp.read()
        with open(output_path, "wb") as f:
            f.write(audio_data)
        size_kb = len(audio_data) / 1024
        print(f"\nSuccess! Audio saved: {size_kb:.0f} KB ({size_kb/1024:.1f} MB)")
        print(f"Estimated duration: ~{len(NARRATION_TEXT) / 15 / 60:.1f} minutes")
except urllib.error.HTTPError as e:
    error_body = e.read().decode("utf-8", errors="replace")
    print(f"\nHTTP Error {e.code}: {e.reason}")
    print(f"Response: {error_body}")
    sys.exit(1)
except Exception as e:
    print(f"\nError: {e}")
    sys.exit(1)
