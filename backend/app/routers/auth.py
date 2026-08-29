"""Auth router for login and signup."""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import create_access_token, verify_password, get_password_hash
from app.database import get_db
from app.models.profile import Profile, UserRole
from app.models.team import Team
from app.schemas.profile import ProfileRead

router = APIRouter(prefix="/auth", tags=["auth"])


class SignUpRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: UserRole = UserRole.EMPLOYEE
    team_name: str | None = None



class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: UserRole | None = None


class AuthResponse(BaseModel):
    user: ProfileRead
    token: str


@router.post("/signup", response_model=AuthResponse)
async def signup(payload: SignUpRequest, db: AsyncSession = Depends(get_db)):
    # Check if email is already taken
    email_query = select(Profile).where(Profile.email == payload.email)
    result = await db.execute(email_query)
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Determine team assignment
    team_name = payload.team_name or "Alpha Engineering"
    team_query = select(Team).where(Team.name == team_name)
    team_result = await db.execute(team_query)
    team = team_result.scalar_one_or_none()

    if not team:
        team = Team(name=team_name)
        db.add(team)
        await db.flush()  # Populates team.id

    # Create new profile
    hashed = get_password_hash(payload.password)
    title = "Engineering Lead" if payload.role == UserRole.MANAGER else "Software Engineer"
    new_profile = Profile(
        name=payload.name,
        email=payload.email,
        hashed_password=hashed,
        role=payload.role,
        team_id=team.id,
        weekly_capacity=40.0,
        title=title,
        avatar_url=None,
    )
    db.add(new_profile)
    await db.flush()

    # Generate token
    token = create_access_token(data={"sub": str(new_profile.id)})

    user_read = ProfileRead.model_validate(new_profile)
    user_read.team_name = team.name

    return AuthResponse(user=user_read, token=token)


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    query = select(Profile).where(Profile.email == payload.email)
    result = await db.execute(query)
    profile = result.scalar_one_or_none()

    if not profile or not verify_password(payload.password, profile.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Find the user's team name
    team_query = select(Team.name).where(Team.id == profile.team_id)
    team_result = await db.execute(team_query)
    team_name = team_result.scalar()

    # Calculate current task hours allocated
    task_query = select(Profile).where(Profile.id == profile.id)
    # The tasks relationship is lazyloaded, but in model it is selectinloaded, so it is present
    total_hours = sum(t.estimated_hours for t in profile.tasks if t.status != "completed")

    token = create_access_token(data={"sub": str(profile.id)})

    user_read = ProfileRead.model_validate(profile)
    user_read.team_name = team_name
    user_read.current_hours = total_hours

    return AuthResponse(user=user_read, token=token)
