import hashlib
import json

# Try Redis, fallback to memory if not available
try:
    import redis
    r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
    r.ping()
    USE_REDIS = True
except:
    USE_REDIS = False
    memory_cache = {}

TTL = 900  # 15 minutes


def get_cache_key(text):
    return hashlib.sha256(text.encode()).hexdigest()


def get_from_cache(text):
    key = get_cache_key(text)

    if USE_REDIS:
        data = r.get(key)
        if data:
            return json.loads(data)
    else:
        return memory_cache.get(key)

    return None


def set_cache(text, value):
    key = get_cache_key(text)

    if USE_REDIS:
        r.setex(key, TTL, json.dumps(value))
    else:
        memory_cache[key] = value