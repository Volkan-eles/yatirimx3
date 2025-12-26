import requests
import sys

def fetch_html():
    url = "https://halkarz.com/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        with open("halkarz_main.html", "w", encoding="utf-8") as f:
            f.write(response.text)
        print("Successfully saved halkarz_main.html")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fetch_html()
