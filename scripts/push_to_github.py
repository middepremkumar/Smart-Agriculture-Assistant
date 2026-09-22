"""
Helper script to push Smart-Agriculture-Assistant to GitHub.
Usage:
    .venv\\Scripts\\python.exe scripts/push_to_github.py <GITHUB_TOKEN>
    OR
    set GITHUB_TOKEN=ghp_...
    .venv\\Scripts\\python.exe scripts/push_to_github.py
"""

import sys
import os
import dulwich.porcelain as dp

REPO_URL = "https://github.com/middepremkumar/Smart-Agriculture-Assistant.git"

def main():
    token = None
    if len(sys.argv) > 1:
        token = sys.argv[1].strip()
    elif "GITHUB_TOKEN" in os.environ:
        token = os.environ["GITHUB_TOKEN"].strip()

    if not token:
        print("=" * 65)
        print("GITHUB AUTHENTICATION REQUIRED")
        print("=" * 65)
        print("GitHub requires a Personal Access Token (PAT) to push code.")
        print("\nHow to get a token:")
        print("1. Go to: https://github.com/settings/tokens")
        print("2. Click 'Generate new token (classic)'")
        print("3. Check the 'repo' scope checkbox")
        print("4. Click 'Generate token' and copy it")
        print("\nThen run:")
        print("    .venv\\Scripts\\python.exe scripts/push_to_github.py <YOUR_GITHUB_TOKEN>")
        print("=" * 65)
        return

    repo = dp.open_repo(".")
    authenticated_url = f"https://{token}@github.com/middepremkumar/Smart-Agriculture-Assistant.git"

    print("Pushing 'main' branch to GitHub...")
    try:
        dp.push(repo, authenticated_url, "main")
        print("SUCCESS! Successfully pushed to https://github.com/middepremkumar/Smart-Agriculture-Assistant")
    except Exception as e:
        print(f"Push failed: {e}")

if __name__ == "__main__":
    main()
