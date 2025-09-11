from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timedelta, timezone
import bcrypt
import jwt
from pymongo import DESCENDING

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'drift_world_db')]

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Create the main app
app = FastAPI(title="Drift World Online API")
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    total_score: int = 0
    best_score: int = 0
    games_played: int = 0
    total_drift_time: int = 0
    favorite_car: str = "Mazda RX-7 FD"
    favorite_track: str = "Circuito Alpha"
    level: int = 1
    experience: int = 0
    achievements: List[str] = Field(default_factory=list)
    is_online: bool = False
    last_seen: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    total_score: int
    best_score: int
    games_played: int
    total_drift_time: int
    favorite_car: str
    favorite_track: str
    level: int
    experience: int
    achievements: List[str]
    is_online: bool
    created_at: datetime

class GameScore(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    username: str
    score: int
    drift_time: int
    track_name: str
    car_used: str
    color_used: str
    game_duration: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GameScoreCreate(BaseModel):
    score: int
    drift_time: int
    track_name: str
    car_used: str
    color_used: str
    game_duration: int

class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    score: int
    track_name: str
    car_used: str
    color_used: str
    created_at: datetime

class UserStats(BaseModel):
    total_score: int
    best_score: int
    games_played: int
    total_drift_time: int
    average_score: float
    level: int
    experience: int
    achievements: List[str]

class OnlineUser(BaseModel):
    id: str
    username: str
    level: int
    is_in_game: bool = False
    current_room: Optional[str] = None

class MultiplayerRoom(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    host_id: str
    host_username: str
    track: str
    max_players: int = 4
    current_players: int = 0
    players: List[dict] = Field(default_factory=list)
    status: str = "waiting"  # waiting, starting, playing, finished
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class RoomCreate(BaseModel):
    name: str
    track: str
    max_players: int = 4

# Utility functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = await db.users.find_one({"id": user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user)

def calculate_level(experience: int) -> int:
    return min(100, max(1, int(experience / 1000) + 1))

def calculate_experience_gain(score: int, drift_time: int) -> int:
    return int(score / 10) + int(drift_time / 5)

# Routes
@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    # Check if user already exists
    existing_user = await db.users.find_one({"$or": [{"email": user_data.email}, {"username": user_data.username}]})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Hash password and create user
    hashed_password = hash_password(user_data.password)
    user = User(
        username=user_data.username,
        email=user_data.email
    )
    
    user_dict = user.dict()
    user_dict["password"] = hashed_password
    
    await db.users.insert_one(user_dict)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(**user.dict())
    }

@api_router.post("/auth/login")
async def login(user_data: UserLogin):
    user = await db.users.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Update online status
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"is_online": True, "last_seen": datetime.now(timezone.utc)}}
    )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["id"]}, expires_delta=access_token_expires
    )
    
    updated_user = await db.users.find_one({"id": user["id"]})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(**{k: v for k, v in updated_user.items() if k != "password"})
    }

@api_router.post("/auth/logout")
async def logout(current_user: User = Depends(get_current_user)):
    await db.users.update_one(
        {"id": current_user.id},
        {"$set": {"is_online": False, "last_seen": datetime.now(timezone.utc)}}
    )
    return {"message": "Logged out successfully"}

@api_router.get("/user/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    return UserResponse(**current_user.dict())

@api_router.get("/user/stats", response_model=UserStats)
async def get_user_stats(current_user: User = Depends(get_current_user)):
    average_score = current_user.total_score / max(1, current_user.games_played)
    return UserStats(
        total_score=current_user.total_score,
        best_score=current_user.best_score,
        games_played=current_user.games_played,
        total_drift_time=current_user.total_drift_time,
        average_score=round(average_score, 2),
        level=current_user.level,
        experience=current_user.experience,
        achievements=current_user.achievements
    )

@api_router.post("/game/score")
async def submit_score(
    score_data: GameScoreCreate,
    current_user: User = Depends(get_current_user)
):
    # Calculate experience gain
    exp_gain = calculate_experience_gain(score_data.score, score_data.drift_time)
    new_experience = current_user.experience + exp_gain
    new_level = calculate_level(new_experience)
    
    # Update user stats
    new_total_score = current_user.total_score + score_data.score
    new_best_score = max(current_user.best_score, score_data.score)
    new_games_played = current_user.games_played + 1
    new_drift_time = current_user.total_drift_time + score_data.drift_time
    
    # Check for achievements
    achievements = current_user.achievements.copy()
    if score_data.score > 30000 and "Drift Legend" not in achievements:
        achievements.append("Drift Legend")
    if new_games_played >= 10 and "Veteran Player" not in achievements:
        achievements.append("Veteran Player")
    if score_data.drift_time > 120 and "Drift Master" not in achievements:
        achievements.append("Drift Master")
    
    # Update user in database
    await db.users.update_one(
        {"id": current_user.id},
        {"$set": {
            "total_score": new_total_score,
            "best_score": new_best_score,
            "games_played": new_games_played,
            "total_drift_time": new_drift_time,
            "experience": new_experience,
            "level": new_level,
            "achievements": achievements,
            "favorite_car": score_data.car_used,
            "favorite_track": score_data.track_name
        }}
    )
    
    # Save game score
    game_score = GameScore(
        user_id=current_user.id,
        username=current_user.username,
        **score_data.dict()
    )
    
    await db.game_scores.insert_one(game_score.dict())
    
    return {
        "message": "Score submitted successfully",
        "experience_gained": exp_gain,
        "new_level": new_level,
        "new_achievements": [a for a in achievements if a not in current_user.achievements]
    }

@api_router.get("/leaderboard/global", response_model=List[LeaderboardEntry])
async def get_global_leaderboard(limit: int = 10):
    scores = await db.game_scores.find().sort("score", DESCENDING).limit(limit).to_list(limit)
    
    leaderboard = []
    for rank, score in enumerate(scores, 1):
        leaderboard.append(LeaderboardEntry(
            rank=rank,
            username=score["username"],
            score=score["score"],
            track_name=score["track_name"],
            car_used=score["car_used"],
            color_used=score["color_used"],
            created_at=score["created_at"]
        ))
    
    return leaderboard

@api_router.get("/leaderboard/track/{track_name}", response_model=List[LeaderboardEntry])
async def get_track_leaderboard(track_name: str, limit: int = 10):
    scores = await db.game_scores.find({"track_name": track_name}).sort("score", DESCENDING).limit(limit).to_list(limit)
    
    leaderboard = []
    for rank, score in enumerate(scores, 1):
        leaderboard.append(LeaderboardEntry(
            rank=rank,
            username=score["username"],
            score=score["score"],
            track_name=score["track_name"],
            car_used=score["car_used"],
            color_used=score["color_used"],
            created_at=score["created_at"]
        ))
    
    return leaderboard

@api_router.get("/users/online", response_model=List[OnlineUser])
async def get_online_users():
    users = await db.users.find({"is_online": True}).to_list(100)
    return [
        OnlineUser(
            id=user["id"],
            username=user["username"],
            level=user["level"]
        ) for user in users
    ]

@api_router.post("/multiplayer/room", response_model=MultiplayerRoom)
async def create_room(
    room_data: RoomCreate,
    current_user: User = Depends(get_current_user)
):
    room = MultiplayerRoom(
        name=room_data.name,
        host_id=current_user.id,
        host_username=current_user.username,
        track=room_data.track,
        max_players=room_data.max_players,
        current_players=1,
        players=[{
            "id": current_user.id,
            "username": current_user.username,
            "level": current_user.level,
            "car": current_user.favorite_car,
            "ready": False
        }]
    )
    
    await db.multiplayer_rooms.insert_one(room.dict())
    return room

@api_router.get("/multiplayer/rooms", response_model=List[MultiplayerRoom])
async def get_available_rooms():
    rooms = await db.multiplayer_rooms.find({"status": "waiting"}).to_list(50)
    return [MultiplayerRoom(**room) for room in rooms]

@api_router.post("/multiplayer/room/{room_id}/join")
async def join_room(
    room_id: str,
    current_user: User = Depends(get_current_user)
):
    room = await db.multiplayer_rooms.find_one({"id": room_id})
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    if room["current_players"] >= room["max_players"]:
        raise HTTPException(status_code=400, detail="Room is full")
    
    # Add player to room
    new_player = {
        "id": current_user.id,
        "username": current_user.username,
        "level": current_user.level,
        "car": current_user.favorite_car,
        "ready": False
    }
    
    await db.multiplayer_rooms.update_one(
        {"id": room_id},
        {
            "$push": {"players": new_player},
            "$inc": {"current_players": 1}
        }
    )
    
    return {"message": "Joined room successfully"}

@api_router.delete("/multiplayer/room/{room_id}/leave")
async def leave_room(
    room_id: str,
    current_user: User = Depends(get_current_user)
):
    room = await db.multiplayer_rooms.find_one({"id": room_id})
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    # Remove player from room
    await db.multiplayer_rooms.update_one(
        {"id": room_id},
        {
            "$pull": {"players": {"id": current_user.id}},
            "$inc": {"current_players": -1}
        }
    )
    
    # If host leaves, delete room or transfer ownership
    updated_room = await db.multiplayer_rooms.find_one({"id": room_id})
    if updated_room["host_id"] == current_user.id:
        if updated_room["current_players"] == 0:
            await db.multiplayer_rooms.delete_one({"id": room_id})
        else:
            # Transfer to first remaining player
            new_host = updated_room["players"][0]
            await db.multiplayer_rooms.update_one(
                {"id": room_id},
                {"$set": {"host_id": new_host["id"], "host_username": new_host["username"]}}
            )
    
    return {"message": "Left room successfully"}

@api_router.get("/user/matches", response_model=List[GameScore])
async def get_user_matches(
    current_user: User = Depends(get_current_user),
    limit: int = 10
):
    matches = await db.game_scores.find({"user_id": current_user.id}).sort("created_at", DESCENDING).limit(limit).to_list(limit)
    return [GameScore(**match) for match in matches]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
