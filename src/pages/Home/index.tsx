import React, { useEffect, useMemo, useState } from 'react';
import {Redirect} from 'react-router-dom';
import VideoInterface from './components/VideoInterface';
import RecordInterface from './components/RecordInterface';
import {v4 as uuidV4} from 'uuid';

declare global {
    interface Window { io: any; Peer: any; }
}

const Home = (props: any) => {
    const [redirectUrl, setRedirectUrl] = useState('');
    const [streamList, setStreamList] = useState([]);
    const [peerList, setPeerList] = useState({});

    const socket = useMemo(() => {
        if (props.match.params.room) {
            return window.io('localhost:3000')
        }
    }, [props.match.params])

    const myPeer = useMemo(() => {
        if (window.Peer) {
            return new window.Peer(undefined, {
                host: '/',
                port: '3001',
            })
        }
    }, [])

    useEffect(() => {
        if (!props.match.params.room) {
            setRedirectUrl(`/${uuidV4()}`);
        } else {
            setRedirectUrl('');
            if (socket && myPeer) {
                socket.on('user-disconnect', (userId: string) => {
                    // if (peerList[userId]) {
                    //     peerList[userId].close();
                    // }
                })
                myPeer.on('open', (id: any) => {
                    socket.emit('join-room', props.match.params.room, id);
                })
            }
        }
    }, [props.match.params]);

    const connectUser = (userId: any, stream: any) => {
        const call = myPeer.call(userId, stream);
        call.on('stream', (userVidStream: any) => {
            setStreamList([...streamList, userVidStream]);
        });
        call.on('close', () => {
            setStreamList(streamList.filter(oldStream => oldStream!==stream))
        });
        setPeerList({
            ...peerList,
            [userId]: call,
        })
    }

    const onStreamStart = (stream: any) => {
        socket.on('user-connected', (userId: any) => {
            connectUser(userId, stream);
        })
        myPeer.on('call', (call: any) => {
            call.answer(stream);
            call.on('stream', (userVidStream: any) => {
                setStreamList([...streamList, userVidStream]);
            })
        })
    }

    if (redirectUrl) {
        return <Redirect to={redirectUrl} />
    }

    return (
        <div>
            <RecordInterface
                muted
                onStreamStart={onStreamStart}
            />
            {
                streamList.map((stream: any) => (
                    <VideoInterface
                        stream={stream}
                    />
                ))
            }
        </div>
    )
}

export default Home;