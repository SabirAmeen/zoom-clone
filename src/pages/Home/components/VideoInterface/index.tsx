import React, { useEffect, useRef } from 'react';
import { VideoEle } from '../../styled';

const VideoInterface = (props: any) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (props.stream) {
            videoRef.current.srcObject = props.stream;
            videoRef.current.addEventListener('loadedmetadata', () => {
                videoRef.current.play();
            })
        }
    }, [])

    return (
        <VideoEle
            ref={videoRef}
            {...props}
        />
    )
}

export default VideoInterface;