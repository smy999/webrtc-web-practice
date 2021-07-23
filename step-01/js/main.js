'use strict';

// On this codelab, you will be streaming only video (video: true).
// 이 예제에서는 일단 비디오만
// constrain 요소에서는 사용하고 싶은 media를 특정할 수 있다.
const mediaStreamConstraints = {
  audio: true,
  video: true,
};

// video와 해상도 없은 추가 요구 사항도 constrain을 통해 정의할 수 있다.
// const hdConstraints = {
//   video: {
//     width: {
//       min: 1280
//     },
//     height: {
//       min: 720
//     }
//   }
// }

// ** constreain은 기기 따라 적용되지 않을 수 있는데, getUserMedia()는 OverconstrainedError와 함께 거부되고 사용자에게 카메라 액세스 권한을 부여하라는 메시지가 표시되지 않는다. **

// Video element where stream will be placed.
// 비디오가 출력될 곳의 dom을 가져온다.
const localVideo = document.querySelector('video');

// Local stream that will be reproduced on the video.
// 비디오에서 재생될 로컬 스트림 변수
let localStream;

// Handles success by adding the MediaStream to the video element.
// getUserMedia()가 성공하면 웹캠의 video stream이 video element의 소스로 설정된다.
// 비디오 요소에 MediaStream을 추가하여 성공을 처리한다.
function gotLocalMediaStream(mediaStream) {
  localStream = mediaStream;
  localVideo.srcObject = mediaStream;
}

// Handles error by logging a message to the console with the error message.
// console에 log를 찍어 에러 메시지를 출력한다.
function handleLocalMediaStreamError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

// Initializes media stream.
// media stream을 초기화한다.
// getUserMedia를 호출한 다음에 브라우저는 카메라 엑세스 권한을 요쳥한다.
// 권한이 수락되면, MediaStream이 반환된다. 
// MediaStream에서는 srcObject를 통해서 media element를 사용할 수 있다.
navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
  .then(gotLocalMediaStream).catch(handleLocalMediaStreamError);

