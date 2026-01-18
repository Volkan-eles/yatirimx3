import json
import os
import sys

print(f"Python Executable: {sys.executable}")
print(f"CWD: {os.getcwd()}")
print("Starting write test")
try:
    with open('public/test_write.json', 'w') as f:
        json.dump({"status": "Success"}, f)
    print(f"Wrote to {os.path.abspath('public/test_write.json')}")
except Exception as e:
    print(f"Error: {e}")
