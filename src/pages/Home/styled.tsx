import styled from 'styled-components';

export const VideoEle = styled.video`
    width: 100px;
    height: 100px;
    &.record-interface {
        position: absolute;
        right: 10px;
        bottom: 10px;
    }
    &.video-interface {
        width: 100%;
        height: 100%;
    }
`;

export const Wrapper = styled.section`
    width: 100%;
    height: 100%;
    position: relative;
    background-color: black;
    .call-end {
        position: absolute;
        left: calc(50% - 25px);
        width: 50px;
        bottom: 33px;
        cursor: pointer;
    }
`;