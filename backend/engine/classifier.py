import json
from typing import Dict

def load_taxonomy() -> Dict:
    with open("knowledge_base/bug_taxonomy.json") as f:
        return json.load(f)

RULE_MAPPING = {
    "sql": "SQL_INJECTION", "sqli": "SQL_INJECTION", "injection": "SQL_INJECTION",
    "xss": "XSS", "cross-site": "XSS",
    "auth": "AUTH_BYPASS", "authentication": "AUTH_BYPASS",
    "deserializ": "INSECURE_DESERIALIZATION", "pickle": "INSECURE_DESERIALIZATION",
    "ssrf": "SSRF", "idor": "IDOR",
    "rce": "RCE", "remote-code": "RCE",
    "path-traversal": "PATH_TRAVERSAL", "directory-traversal": "PATH_TRAVERSAL",
    "hardcoded": "HARDCODED_CREDENTIALS", "secret": "HARDCODED_CREDENTIALS",
    "password": "HARDCODED_CREDENTIALS", "api-key": "HARDCODED_CREDENTIALS",
    "csrf": "CSRF", "redirect": "OPEN_REDIRECT",
    "xxe": "XXE", "xml": "XXE",
    "command": "COMMAND_INJECTION", "exec": "COMMAND_INJECTION", "subprocess": "COMMAND_INJECTION",
    "crypto": "WEAK_CRYPTO", "md5": "WEAK_CRYPTO", "sha1": "WEAK_CRYPTO",
    "random": "INSECURE_RANDOM"
}

def classify_bug(raw_rule_id: str, message: str) -> str:
    combined = (raw_rule_id + " " + message).lower()
    for keyword, bug_type in RULE_MAPPING.items():
        if keyword in combined:
            return bug_type
    return "UNKNOWN"

def get_fix_effort(bug_type: str, taxonomy: Dict) -> float:
    return taxonomy.get(bug_type, {}).get("typical_fix_hours", 4)
