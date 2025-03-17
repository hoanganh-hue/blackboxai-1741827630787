
import sys
import json
import pyautogui

def handle_action(action, params):
    try:
        if action == "click":
            pyautogui.click(params['x'], params['y'])
        elif action == "type":
            pyautogui.typewrite(params['text'])
        elif action == "screenshot":
            screenshot = pyautogui.screenshot()
            path = "screenshots/screen.png"
            screenshot.save(path)
            return {"path": path}
            
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    args = json.loads(sys.argv[1])
    result = handle_action(args['action'], args['params'])
    print(json.dumps(result))