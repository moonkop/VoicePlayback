/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

// Put variables in global scope to make them available to the browser console.
const audio = document.querySelector('audio');

const constraints = window.constraints = {
    audio: true,
    video: false
};

function handleSuccess(stream) {
    const audioTracks = stream.getAudioTracks();
    console.log('Got stream with constraints:', constraints);
    console.log('Using audio device: ' + audioTracks[0].label);
    const RECORDER_MIME_TYPE = "audio/mp4;codecs=\"mp4a.40.2\""
    const recorder = new MediaRecorder(stream,{
        mimeType: 'video/webm'
    })
    const mediaSource = new MediaSource()
    audio.src = URL.createObjectURL(mediaSource)
    mediaSource.onsourceopen = (e)=>{
        let sourceBuffer = mediaSource.addSourceBuffer('audio/webm;codecs=opus');
        recorder.ondataavailable = async({data})=>{
            console.log(data)
            sourceBuffer.appendBuffer(await data.arrayBuffer())
        }
        setInterval(recorder.requestData.bind(recorder), 300)
    }
    console.log('Recorder created')
    recorder.start()
}

function handleError(error) {
    const errorMessage = 'navigator.MediaDevices.getUserMedia error: ' + error.message + ' ' + error.name;
    document.getElementById('errorMsg').innerText = errorMessage;
    console.log(errorMessage);
}

navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
