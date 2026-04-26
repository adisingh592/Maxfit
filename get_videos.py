import urllib.request
import re

queries = [
    "how+to+bench+press",
    "how+to+overhead+press",
    "how+to+pull+up",
    "how+to+jump+rope",
    "how+to+plank",
    "how+to+burpee"
]

for q in queries:
    url = f"https://www.youtube.com/results?search_query={q}"
    html = urllib.request.urlopen(url).read().decode('utf-8')
    matches = re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', html)
    print(f"{q}: {matches[0] if matches else 'Not found'}")
