
import React, { useState } from 'react';
import ChatInput from "../../components/ChatInput";
import ChatMessage from "../../components/ChatMessage";
import ChatStatusIndicator from "../../components/ChatStatusIndicator";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import { useRunPolling } from '../../hooks/useRunPolling';
import { useRunStatus } from '../../hooks/useRunStatus';
import { useThread } from '../../hooks/useThread';
import { postMessage } from "../../services/api";
import './index.css';

function Chat() {
    
    const [run, setRun] = useState(undefined);
    const { threadId, messages, clearThread} = useThread(run, setRun);
    useRunPolling(threadId, run, setRun);
    const { status, processing } = useRunStatus(run);

    let messageList = messages
        .toReversed()
        .filter((message) => message.hidden !== true)
        .map((message) => {
            return <ChatMessage
                    message={message.content}
                    role={message.role}
                    key={message.id}
                />
        })

    return (
        <div className="chart-con md:container md:mx-auto lg:px-32 h-screen bg-slate-700 flex flex-col">
            <Header
                onNewChat={clearThread}
            />
            <div className="flex flex-col-reverse grow overflow-scroll">
                {status !== undefined && (
                    <ChatStatusIndicator
                        status={status}
                    />
                )}
                {processing && <Loading/>}
                {messageList}
            </div>
            <div className="my-4">
                <ChatInput
                    onSend={(message) => {
                        postMessage(threadId, message).then(setRun);
                    }}
                    disabled={processing}
                />
            </div>
        </div>
    )
}

export default Chat;
