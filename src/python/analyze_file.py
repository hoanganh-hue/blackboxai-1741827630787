import sys
import json
import os
from typing import Dict, Any

def analyze_file(file_path: str) -> Dict[str, Any]:
    """Phân tích file và trả về kết quả dưới dạng JSON"""
    if not os.path.exists(file_path):
        return {"error": "File not found"}
        
    result = {
        "file_path": file_path,
        "size": os.path.getsize(file_path),
        "extension": os.path.splitext(file_path)[1],
        "content_preview": "",
        "analysis": {}
    }
    
    try:
        with open(file_path, 'rb') as f:
            # Đọc 1024 bytes đầu tiên để xác định loại file
            header = f.read(1024)
            
            # Phân tích dựa trên extension
            if result["extension"] in ['.txt', '.log', '.md']:
                result["content_preview"] = header.decode('utf-8', errors='ignore')
                result["analysis"]["type"] = "text"
                
            elif result["extension"] in ['.jpg', '.png', '.gif']:
                result["analysis"]["type"] = "image"
                result["analysis"]["dimensions"] = "Not implemented"
                
            elif result["extension"] in ['.pdf', '.doc', '.docx']:
                result["analysis"]["type"] = "document"
                
            elif result["extension"] in ['.py', '.js', '.java']:
                result["content_preview"] = header.decode('utf-8', errors='ignore')
                result["analysis"]["type"] = "source_code"
                
            else:
                result["analysis"]["type"] = "unknown"
                
        return result
        
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No file path provided"}))
    else:
        result = analyze_file(sys.argv[1])
        print(json.dumps(result)) 