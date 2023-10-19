import uvicorn
from . import app

if __name__ == "__main__":
    uvicorn.run(app, host="", port=8080)
