import json
import sys
import pyautogui

def handle_command(command_str):
    try:
        command = json.loads(command_str)
        action = command.get('action')
        params = command.get('params', {})
        
        if action == 'click':
            x = params.get('x')
            y = params.get('y')
            pyautogui.click(x, y)
            return {'status': 'success', 'action': 'click', 'x': x, 'y': y}
            
        elif action == 'type':
            text = params.get('text')
            pyautogui.typewrite(text)
            return {'status': 'success', 'action': 'type', 'text': text}
            
        elif action == 'screenshot':
            screenshot = pyautogui.screenshot()
            path = 'screenshot.png'
            screenshot.save(path)
            return {'status': 'success', 'action': 'screenshot', 'path': path}
            
        elif action == 'move':
            x = params.get('x')
            y = params.get('y')
            pyautogui.moveTo(x, y)
            return {'status': 'success', 'action': 'move', 'x': x, 'y': y}
            
        else:
            return {'status': 'error', 'message': f'Unknown action: {action}'}
            
    except Exception as e:
        return {'status': 'error', 'message': str(e)}

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({'status': 'error', 'message': 'No command provided'}))
        sys.exit(1)
        
    result = handle_command(sys.argv[1])
    print(json.dumps(result)) 