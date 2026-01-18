
import sys
import os

def log(msg):
    with open("env_test_result.txt", "a") as f:
        f.write(msg + "\n")

try:
    import curl_cffi
    log("curl_cffi found")
except ImportError:
    log("curl_cffi MISSING")

try:
    import bs4
    log("bs4 found")
except ImportError:
    log("bs4 MISSING")

try:
    import requests
    log("requests found")
except ImportError:
    log("requests MISSING")

log("Done")
