# RTCPeerConnection을 통한 비디오 스트리밍<br>(Stream video with RTCPeerConnection)

<br>

## Goal

* WebRTC shim, adapter.js를 사용하여 브라우저 차이점을 추상화한다.
* RTCPeerConnection API를 사용하여 비디오를 스트리밍한다.
* 미디어 캡처 및 스트리밍을 제어한다.

<br>

## RTCPeerConnection?

* RTCPeerConnection은 WebRTC를 호출하여 비디오 및 오디오를 스트리밍하고 데이터를 교환하기 위한 API
* 이 예제는 동일한 페이지에 있는 두 개의 RTCPeerConnection 객체(피어라고 함) 간의 연결을 설정한다.

<br>

## Details

* 하나의 비디오 요소는 getUserMedia()의 스트림을 표시하고 다른 하나는 RTCPeerconnection을 통해 스트리밍된 동일한 비디오를 표시한다.
* 실제 응용 프로그램에서 하나의 비디오 요소는 로컬 스트림(내 영상)을 표시하고 다른 하나는 원격 스트림(서버에서 보내주는 영상)을 표시한다.

<br>

## adaptor.js

WebRTC는 Chrome과 가장 호환성이 좋다. 그 외에 Firefox, Opera 등이 WevRTC 표준을 지원한다. 다른 브라우저도 지원하긴 하지만 호환성이 떨어진다.  말은, WebRTC는 아직 다양한 플래폼에서 표준화가 구현되어있지 않다는 뜻이다. 그렇다면, 이런 Cross Browsing 문제를 어떻게 해결할 수 있을까? adaptor.js 라이브러리를 사용하여 해결할 수 있다. adaptor.js는
* shim 


<br>

## Reference

* https://codelabs.developers.google.com/codelabs/webrtc-web/#4
* https://wormwlrm.github.io/2021/01/24/Introducing-WebRTC.html
