import sys
import json
import pandas as pd
import numpy as np
from typing import Dict, Any, Union

class DataProcessor:
    def __init__(self):
        self.supported_formats = {
            'json': self._process_json,
            'csv': self._process_csv,
            'text': self._process_text,
            'numbers': self._process_numbers
        }
    
    def _process_json(self, data: Dict) -> Dict[str, Any]:
        """Xử lý dữ liệu JSON"""
        try:
            # Phân tích cấu trúc
            structure = {
                'keys': list(data.keys()),
                'types': {k: type(v).__name__ for k, v in data.items()},
                'depth': self._get_json_depth(data)
            }
            
            return {
                'type': 'json',
                'structure': structure,
                'summary': {
                    'total_keys': len(data),
                    'nested_objects': self._count_nested_objects(data)
                }
            }
        except Exception as e:
            return {'error': str(e)}
    
    def _process_csv(self, data: str) -> Dict[str, Any]:
        """Xử lý dữ liệu CSV"""
        try:
            df = pd.read_csv(data)
            return {
                'type': 'csv',
                'structure': {
                    'columns': list(df.columns),
                    'dtypes': df.dtypes.to_dict(),
                    'shape': df.shape
                },
                'summary': {
                    'total_rows': len(df),
                    'total_columns': len(df.columns),
                    'missing_values': df.isnull().sum().to_dict()
                }
            }
        except Exception as e:
            return {'error': str(e)}
    
    def _process_text(self, data: str) -> Dict[str, Any]:
        """Xử lý dữ liệu văn bản"""
        try:
            words = data.split()
            return {
                'type': 'text',
                'summary': {
                    'total_chars': len(data),
                    'total_words': len(words),
                    'total_lines': len(data.splitlines()),
                    'unique_words': len(set(words))
                }
            }
        except Exception as e:
            return {'error': str(e)}
    
    def _process_numbers(self, data: Union[list, np.ndarray]) -> Dict[str, Any]:
        """Xử lý dữ liệu số"""
        try:
            arr = np.array(data)
            return {
                'type': 'numbers',
                'summary': {
                    'mean': float(np.mean(arr)),
                    'std': float(np.std(arr)),
                    'min': float(np.min(arr)),
                    'max': float(np.max(arr)),
                    'shape': arr.shape
                }
            }
        except Exception as e:
            return {'error': str(e)}
    
    def _get_json_depth(self, obj: Any, depth: int = 1) -> int:
        """Tính độ sâu của JSON"""
        if isinstance(obj, dict):
            return max([self._get_json_depth(v, depth + 1) for v in obj.values()], default=depth)
        elif isinstance(obj, list):
            return max([self._get_json_depth(v, depth + 1) for v in obj], default=depth)
        return depth
    
    def _count_nested_objects(self, obj: Any) -> int:
        """Đếm số lượng object lồng nhau"""
        count = 0
        if isinstance(obj, dict):
            count += 1
            for v in obj.values():
                count += self._count_nested_objects(v)
        elif isinstance(obj, list):
            for v in obj:
                count += self._count_nested_objects(v)
        return count
    
    def process(self, data: str) -> Dict[str, Any]:
        """Xử lý dữ liệu và trả về kết quả"""
        try:
            # Parse input data
            data = json.loads(data)
            
            # Determine data type and process accordingly
            if isinstance(data, dict):
                return self._process_json(data)
            elif isinstance(data, str):
                if ',' in data:  # Assume CSV
                    return self._process_csv(data)
                else:
                    return self._process_text(data)
            elif isinstance(data, (list, np.ndarray)):
                return self._process_numbers(data)
            else:
                return {'error': 'Unsupported data type'}
                
        except Exception as e:
            return {'error': str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No data provided"}))
    else:
        processor = DataProcessor()
        result = processor.process(sys.argv[1])
        print(json.dumps(result)) 