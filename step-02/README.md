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

## Reference

* https://codelabs.developers.google.com/codelabs/webrtc-web/#4
