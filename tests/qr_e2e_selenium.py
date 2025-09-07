import base64
import io
import sys
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

try:
    import cv2  # type: ignore
    from pyzbar.pyzbar import decode  # type: ignore
    import numpy as np  # type: ignore
    HAS_DECODER = True
except Exception:
    HAS_DECODER = False


def decode_png_data_url(data_url: str) -> str:
    assert data_url.startswith("data:image/png;base64,")
    b64 = data_url.split(",", 1)[1]
    raw = base64.b64decode(b64)
    if not HAS_DECODER:
        return "(decoder not installed)"
    import numpy as np
    import cv2
    file_bytes = np.asarray(bytearray(raw), dtype=np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    items = decode(img)  # type: ignore
    return items[0].data.decode("utf-8") if items else "(no QR found)"


def run():
    root = Path(__file__).resolve().parent.parent
    index = root / "index.html"
    url = f"file://{index}"

    opts = Options()
    opts.add_argument("--headless=new")
    driver = webdriver.Chrome(options=opts)
    wait = WebDriverWait(driver, 10)
    try:
        all_pages = ["home", "cybersecurity", "linux", "calendar"]
        failures = 0
        for page in all_pages:
            driver.get(f"{url}?page={page}")
            wait.until(EC.presence_of_element_located((By.ID, "footer-qr-toggle")))
            driver.find_element(By.ID, "footer-qr-toggle").click()
            wait.until(EC.presence_of_element_located((By.ID, "footer-qr-canvas")))
            # Ensure QR finished rendering (wait a beat)
            driver.implicitly_wait(0.5)
            # pull canvas as dataURL
            data_url = driver.execute_script(
                "return arguments[0].toDataURL('image/png');",
                driver.find_element(By.ID, "footer-qr-canvas"),
            )
            decoded = decode_png_data_url(data_url)
            expected = driver.execute_script("return window.location.href;")
            ok = decoded == expected
            print(f"{page}: {decoded} == {expected} -> {'PASS' if ok else 'FAIL'}")
            if not ok:
                failures += 1
        sys.exit(1 if failures else 0)
    finally:
        driver.quit()


if __name__ == "__main__":
    run()


