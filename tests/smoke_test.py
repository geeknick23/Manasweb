from playwright.sync_api import sync_playwright

def run():
    print("Starting smoke test...")
    with sync_playwright() as p:
        print("Launching browser...")
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        url = 'http://localhost:3000'
        print(f"Navigating to {url}...")
        try:
            page.goto(url)
            print("Waiting for networkidle...")
            page.wait_for_load_state('networkidle')
            
            title = page.title()
            print(f"Page title: {title}")
            
            screenshot_path = 'homepage_smoke_test.png'
            page.screenshot(path=screenshot_path)
            print(f"Screenshot saved to {screenshot_path}")
            
        except Exception as e:
            print(f"Error during test: {e}")
            
        finally:
            browser.close()
            print("Browser closed.")

if __name__ == "__main__":
    run()
