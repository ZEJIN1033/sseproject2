import os
from dotenv import load_dotenv
from openai.types.beta.threads.run import RequiredAction
from openai.types.beta.threads.run_submit_tool_outputs_params import ToolOutput
from openai.types.beta.threads.runs.run_step import LastError
from starlette.middleware.cors import CORSMiddleware
from openai import AsyncOpenAI, BaseModel
from app import auth
from app.auth import get_current_user
from app import models
from app.database import engine, SessionLocal
from fastapi import FastAPI, Depends
from typing import Annotated, Optional, List
from sqlalchemy.orm import Session

from app.models import Notes
from app.script.fetch_script import get_youtube_title, process_video_transcript

app = FastAPI()
models.Base.metadata.create_all(bind=engine)
app.include_router(auth.router)
load_dotenv()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://front.bbdcd4huabbsetg5.uksouth.azurecontainer.io:3000",  # used to run with react server
        "http://proxya.djedaradfbefdnap.uksouth.azurecontainer.io:3003",
        "http://notes.ftg7fthxc5eycrhj.uksouth.azurecontainer.io:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AsyncOpenAI(
    api_key=os.getenv("SECRET_KEY"),
)

assistant_id = os.getenv("assistant_id")
run_finished_states = ["completed", "failed", "cancelled", "expired", "requires_action"]


class RunStatus(BaseModel):
    run_id: str
    thread_id: str
    status: str
    required_action: Optional[RequiredAction]
    last_error: Optional[LastError]


class ThreadMessage(BaseModel):
    content: str
    role: str
    hidden: bool
    id: str
    created_at: int


class Thread(BaseModel):
    messages: List[ThreadMessage]


class CreateMessage(BaseModel):
    content: str


@app.post("/api/new")
async def post_new(user: user_dependency):
    thread = await client.beta.threads.create()
    await client.beta.threads.messages.create(
        thread_id=thread.id,
        content="Greet the user and tell it about yourself and ask it what it is looking for.",
        role="user",
        metadata={
            "type": "hidden"
        }
    )
    run = await client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant_id
    )

    return RunStatus(
        run_id=run.id,
        thread_id=thread.id,
        status=run.status,
        required_action=run.required_action,
        last_error=run.last_error
    )


@app.get("/api/threads/{thread_id}/runs/{run_id}")
async def get_run(thread_id: str, run_id: str, user: user_dependency):
    run = await client.beta.threads.runs.retrieve(
        thread_id=thread_id,
        run_id=run_id
    )

    return RunStatus(
        run_id=run.id,
        thread_id=thread_id,
        status=run.status,
        required_action=run.required_action,
        last_error=run.last_error
    )


@app.post("/api/threads/{thread_id}/runs/{run_id}/tool")
async def post_tool(thread_id: str, run_id: str, tool_outputs: List[ToolOutput], user: user_dependency):
    run = await client.beta.threads.runs.submit_tool_outputs(
        run_id=run_id,
        thread_id=thread_id,
        tool_outputs=tool_outputs
    )
    return RunStatus(
        run_id=run.id,
        thread_id=thread_id,
        status=run.status,
        required_action=run.required_action,
        last_error=run.last_error
    )


@app.get("/api/threads/{thread_id}")
async def get_thread(thread_id: str, user: user_dependency):
    messages = await client.beta.threads.messages.list(
        thread_id=thread_id
    )

    result = [
        ThreadMessage(
            content=message.content[0].text.value,
            role=message.role,
            hidden="type" in message.metadata and message.metadata["type"] == "hidden",
            id=message.id,
            created_at=message.created_at
        )
        for message in messages.data
    ]

    return Thread(
        messages=result,
    )


@app.post("/api/threads/{thread_id}")
async def post_thread(thread_id: str, message: CreateMessage, user: user_dependency):
    await client.beta.threads.messages.create(
        thread_id=thread_id,
        content=message.content,
        role="user"
    )

    run = await client.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=assistant_id
    )

    return RunStatus(
        run_id=run.id,
        thread_id=thread_id,
        status=run.status,
        required_action=run.required_action,
        last_error=run.last_error
    )


# 定义一个模型来接收前端传递的数据
class InputData(BaseModel):
    url: str


@app.post("/fetch_script")
async def fetch_script(data: InputData, user: user_dependency, db: db_dependency):
    # 在这里处理接收到的数据
    youtube_url = data.url
    selected_model = "gpt-3.5-turbo-0125"
    # Check if a YouTube URL is provided as a command line argument

    video_title = get_youtube_title(youtube_url)

    print(video_title)
    summarized_output = process_video_transcript(youtube_url, selected_model)
    if summarized_output:
        print(summarized_output)
        # 创建一个新的Notes实例
        new_note = Notes(
            user_id=user['id'],  # 假设user_dependency提供了用户ID
            title=video_title,  # 使用YouTube视频标题作为笔记标题
            content=summarized_output,  # 存储生成的摘要
            # created_at和updated_at字段将由数据库自动处理
        )
        db.add(new_note)
        db.commit()
        # 返回存储的摘要信息
        return {"response": True}

    else:
        print("Failed to generate a summary.")
        return {"response": False}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
