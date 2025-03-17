import pyautogui
import sys
import json
from appium import webdriver

command = sys.argv[1]

def setup_appium():
    desired_caps = {
        "platformName": "Android",
        "deviceName": "Android Emulator",
        "appPackage": "com.example.android",
        "appActivity": ".MainActivity",
        "automationName": "UiAutomator2"
    }
    driver = webdriver.Remote('http://localhost:4723/wd/hub', desired_caps)
    return driver

if command == 'click':
    x, y = int(sys.argv[2]), int(sys.argv[3])
    pyautogui.click(x, y)
    print(json.dumps({"status": "success", "action": "click", "x": x, "y": y}))

elif command == 'type':
    text = sys.argv[2]
    pyautogui.typewrite(text)
    print(json.dumps({"status": "success", "action": "type", "text": text}))

elif command == 'screenshot':
    screenshot = pyautogui.screenshot()
    screenshot.save('screenshot.png')
    print(json.dumps({"status": "success", "action": "screenshot", "file": "screenshot.png"}))

elif command == 'move':
    x, y = int(sys.argv[2]), int(sys.argv[3])
    pyautogui.moveTo(x, y)
    print(json.dumps({"status": "success", "action": "move", "x": x, "y": y}))

elif command == 'scroll':
    amount = int(sys.argv[2])
    pyautogui.scroll(amount)
    print(json.dumps({"status": "success", "action": "scroll", "amount": amount}))

elif command == 'appium_click':
    driver = setup_appium()
    element_id = sys.argv[2]
    element = driver.find_element_by_id(element_id)
    element.click()
    print(json.dumps({"status": "success", "action": "appium_click", "element_id": element_id}))

elif command == 'appium_type':
    driver = setup_appium()
    element_id = sys.argv[2]
    text = sys.argv[3]
    element = driver.find_element_by_id(element_id)
    element.send_keys(text)
    print(json.dumps({"status": "success", "action": "appium_type", "element_id": element_id, "text": text}))

elif command == 'appium_screenshot':
    driver = setup_appium()
    screenshot = driver.get_screenshot_as_file('appium_screenshot.png')
    print(json.dumps({"status": "success", "action": "appium_screenshot", "file": "appium_screenshot.png"}))