
import sys
import json
import shutil
import os

def handle_upload(file_path, destination):
    try:
        # Create destination if not exists
        os.makedirs(destination, exist_ok=True)
        
        # Move file to destination
        filename = os.path.basename(file_path)
        dest_path = os.path.join(destination, filename)
        shutil.move(file_path, dest_path)
        
        return {
            "status": "success",
            "message": "File uploaded successfully",
            "path": dest_path
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

if __name__ == "__main__":
    args = json.loads(sys.argv[1])
    result = handle_upload(args['file'], args.get('destination', 'uploads'))
    print(json.dumps(result))