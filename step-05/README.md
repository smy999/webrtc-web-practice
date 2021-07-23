# 피어 연결과 시그널링 결합<br>Combine peer connection and signaling

<br>

## Goal

- Node.js에서 실행되는 Socket.IO를 사용하여 WebRTC signaling service 실행
- 해당 서비스를 사용하여 Peer 간에 WebRTC metadata를 교환



<br>



## Run

* 새 탭이나 창에서 localhost:8080을 다시 연다. 하나의 video element는 getUserMedia()의 local stream을 표시하고 다른 하나는 RTCPeerconnection을 통해 스트리밍되는 'remote' video stream을 표시한다.
* Client 탭이나 창을 닫을 때마나 node.js server를 다시 시작해야 한다.
* room 이름을 입력하고 새 탭에서 같은 room 이름을 입력하면 local&remote video stream을 볼 수 있다.
