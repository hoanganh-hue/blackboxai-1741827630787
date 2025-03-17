import sys
import json
import subprocess
import threading
import queue
import time
from typing import Dict, Any

class CommandExecutor:
    def __init__(self):
        self.output_queue = queue.Queue()
        self.error_queue = queue.Queue()
        
    def _read_output(self, pipe, queue):
        """Đọc output từ pipe và đưa vào queue"""
        for line in iter(pipe.readline, b''):
            queue.put(line.decode())
        pipe.close()
        
    def execute(self, command: str, timeout: int = None) -> Dict[str, Any]:
        """Thực thi lệnh và trả về kết quả"""
        try:
            process = subprocess.Popen(
                command,
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                bufsize=1,
                universal_newlines=True
            )
            
            # Tạo threads để đọc output và error
            stdout_thread = threading.Thread(
                target=self._read_output, 
                args=(process.stdout, self.output_queue)
            )
            stderr_thread = threading.Thread(
                target=self._read_output, 
                args=(process.stderr, self.error_queue)
            )
            
            stdout_thread.daemon = True
            stderr_thread.daemon = True
            stdout_thread.start()
            stderr_thread.start()
            
            # Chờ process hoàn thành hoặc timeout
            start_time = time.time()
            output = []
            error = []
            
            while process.poll() is None:
                # Kiểm tra timeout
                if timeout and time.time() - start_time > timeout:
                    process.terminate()
                    return {
                        "status": "timeout",
                        "command": command,
                        "output": output,
                        "error": error + ["Command timed out"]
                    }
                    
                # Đọc output và error từ queues
                while not self.output_queue.empty():
                    output.append(self.output_queue.get())
                while not self.error_queue.empty():
                    error.append(self.error_queue.get())
                    
                time.sleep(0.1)
                
            # Đọc output và error còn lại
            stdout_thread.join()
            stderr_thread.join()
            while not self.output_queue.empty():
                output.append(self.output_queue.get())
            while not self.error_queue.empty():
                error.append(self.error_queue.get())
                
            return {
                "status": "completed" if process.returncode == 0 else "error",
                "command": command,
                "return_code": process.returncode,
                "output": output,
                "error": error
            }
            
        except Exception as e:
            return {
                "status": "error",
                "command": command,
                "error": [str(e)]
            }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No command provided"}))
    else:
        executor = CommandExecutor()
        result = executor.execute(sys.argv[1])
        print(json.dumps(result)) 