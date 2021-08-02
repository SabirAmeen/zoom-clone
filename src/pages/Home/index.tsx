import React, { useEffect, useMemo, useState, useRef } from 'react';
import {Redirect} from 'react-router-dom';
import VideoInterface from './components/VideoInterface';
import RecordInterface from './components/RecordInterface';
import {v4 as uuidV4} from 'uuid';
import { Wrapper } from './styled';

declare global {
    interface Window { io: any; Peer: any; }
}

type peerEle = { [peer: string]: Object }

const Home = (props: any) => {
    const [redirectUrl, setRedirectUrl] = useState('');
    const [streamList, setStreamList] = useState([]);
    const [peerList, setPeerList] = useState<peerEle>({});
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
                    setStreamList([]);
                    if (peerList[userId]) {
                        (peerList[userId] as any).close();
                    }
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
            setStreamList([]);
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
            setPeerList({
                ...peerList,
                [call.peer]: call,
            })
            call.on('stream', (userVidStream: any) => {
                setStreamList([...streamList, userVidStream]);
            })
        })
    }

    const onPeerClose = () => {
        socket.emit('manual-disconnect');
        setStreamList([]);
        Object.keys(peerList).forEach((peerKey: string) => {
            return (peerList[peerKey] as any).close()
        });
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
                className={streamList.length ? 'record-interface' : 'video-interface'}
            />
            {
                streamList.map((stream: any) => (
                    <VideoInterface
                        className='video-interface'
                        stream={stream}
                    />
                ))
            }
            {
                streamList.length > 0 &&
                    <img className='call-end' onClick={onPeerClose} src='./assets/end-call.svg' />
            }
        </Wrapper>
    )
}

export default Home;