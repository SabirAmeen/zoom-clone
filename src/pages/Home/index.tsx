import React, { useEffect, useMemo, useState, useRef } from 'react';
import {Redirect} from 'react-router-dom';
import VideoInterface from './components/VideoInterface';
import RecordInterface from './components/RecordInterface';
import {v4 as uuidV4} from 'uuid';
import { Wrapper } from './styled';

declare global {
    interface Window { io: any; Peer: any; }
}

const Home = (props: any) => {
    const [redirectUrl, setRedirectUrl] = useState('');
    const [streamList, setStreamList] = useState([]);
    const [peerList, setPeerList] = useState({});
    const myPeer = useRef(null);
    const [init, setInit] = useState(false);

    const socket = useMemo(() => {
        if (props.match.params.room) {
            return window.io()
        }
    }, [props.match.params])

    useEffect(() => {
        fetch('https://zoom-peer.herokuapp.com/getPort')
            .then(res => {
                return res.json()
            })
            .then((data: any) => {
                myPeer.current = new window.Peer(undefined, {
                    host: 'zoom-peer.herokuapp.com',
                    port: 443,
                    path: '/peerjs/myapp'
                });
                setInit(true);
            })
    }, [])

    useEffect(() => {
        if (!props.match.params.room) {
            setRedirectUrl(`/${uuidV4()}`);
        } else {
            setRedirectUrl('');
            if (socket && myPeer.current) {
                socket.on('user-disconnect', (userId: string) => {
                    // if (peerList[userId]) {
                    //     peerList[userId].close();
                    // }
                })
                myPeer.current.on('open', (id: any) => {
                    socket.emit('join-room', props.match.params.room, id);
                })
            }
        }
    }, [props.match.params, init]);

    const connectUser = (userId: any, stream: any) => {
        const call = myPeer.current.call(userId, stream);
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
        myPeer.current.on('call', (call: any) => {
            call.answer(stream);
            call.on('stream', (userVidStream: any) => {
                setStreamList([...streamList, userVidStream]);
            })
        })
    }

    if (redirectUrl) {
        return <Redirect to={redirectUrl} />
    }
    else if (!myPeer.current) {
        return <div>Loading..........</div>;
    }
    return (
        <Wrapper>
            <RecordInterface
                muted
                onStreamStart={onStreamStart}
                className='record-interface'
            />
            {
                streamList.map((stream: any) => (
                    <VideoInterface
                        className='video-interface'
                        stream={stream}
                    />
                ))
            }
        </Wrapper>
    )
}

export default Home;