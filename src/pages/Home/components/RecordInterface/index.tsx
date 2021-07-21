import React, { useEffect, useRef } from 'react';
import { VideoEle } from '../../styled';

export const RecordInterface = (props: any) => {
    const videoRef = useRef(null);
    useEffect(() => {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            })
                .then(stream => {
                    props.onStreamStart(stream);
                    videoRef.current.srcObject = stream;
                    videoRef.current.addEventListener('loadedmetadata', () => {
                        videoRef.current.play();
                    })
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

export default RecordInterface;