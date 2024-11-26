from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import aiohttp
import asyncio
import os
import exifread
from datetime import datetime
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="NetRunner OSINT Aggregator",
    description="Cyberpunk-themed OSINT data collection and analysis tool",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

class UsernameRequest(BaseModel):
    username: str
    platforms: list[str] = []

class EmailRequest(BaseModel):
    email: str

# Username lookup endpoint
@app.post("/api/username-lookup")
async def username_lookup(request: UsernameRequest):
    try:
        results = {}
        async with aiohttp.ClientSession() as session:
            for platform in request.platforms:
                url = f"https://api.{platform}.com/users/{request.username}"
                try:
                    async with session.get(url) as response:
                        if response.status == 200:
                            results[platform] = {
                                "exists": True,
                                "url": url,
                                "status": "active"
                            }
                        else:
                            results[platform] = {
                                "exists": False,
                                "status": "not found"
                            }
                except:
                    results[platform] = {
                        "exists": False,
                        "status": "error"
                    }
        
        return JSONResponse(content={
            "username": request.username,
            "timestamp": datetime.now().isoformat(),
            "results": results
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Email OSINT endpoint
@app.post("/api/email-lookup")
async def email_lookup(request: EmailRequest):
    try:
        # Implement Hunter.io API integration here
        api_key = os.getenv("HUNTER_API_KEY")
        if not api_key:
            raise HTTPException(status_code=400, detail="Hunter.io API key not configured")

        async with aiohttp.ClientSession() as session:
            url = f"https://api.hunter.io/v2/email-verifier?email={request.email}&api_key={api_key}"
            async with session.get(url) as response:
                data = await response.json()
                return JSONResponse(content=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Image metadata endpoint
@app.post("/api/image-metadata")
async def image_metadata(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        
        # Save temporarily
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as f:
            f.write(contents)
        
        # Extract EXIF data
        with open(temp_path, 'rb') as f:
            tags = exifread.process_file(f)
        
        # Clean up
        os.remove(temp_path)
        
        # Process relevant EXIF data
        metadata = {
            "GPS": {},
            "DateTime": "",
            "Make": "",
            "Model": "",
            "Software": ""
        }
        
        for tag, value in tags.items():
            if tag.startswith('GPS'):
                metadata["GPS"][tag] = str(value)
            elif tag == 'Image DateTime':
                metadata["DateTime"] = str(value)
            elif tag == 'Image Make':
                metadata["Make"] = str(value)
            elif tag == 'Image Model':
                metadata["Model"] = str(value)
            elif tag == 'Image Software':
                metadata["Software"] = str(value)
        
        return JSONResponse(content={
            "filename": file.filename,
            "metadata": metadata,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "operational", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
