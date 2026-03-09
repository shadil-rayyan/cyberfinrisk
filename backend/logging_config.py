import logging
import json
import sys
from datetime import datetime

class JsonFormatter(logging.Formatter):
    """
    Custom formatter to output logs in JSON format.
    Works perfectly for Docker, Cloudwatch, and other log collectors.
    """
    def format(self, record):
        log_entry = {
            "timestamp": datetime.utcfromtimestamp(record.created).isoformat() + "Z",
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "funcName": record.funcName,
        }
        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_entry)

def setup_logging():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # Console Handler
    handler = logging.StreamHandler(sys.stdout)
    
    # Use JSON in production/container, simple formatting in development
    # You can set an environment variable to toggle this
    import os
    if os.getenv("LOG_FORMAT", "JSON").upper() == "JSON":
        handler.setFormatter(JsonFormatter())
    else:
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)

    # Remove existing handlers to avoid duplicates
    if logger.hasHandlers():
        logger.handlers.clear()
        
    logger.addHandler(handler)
    return logger
