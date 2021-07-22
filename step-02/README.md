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
* 하나의 비디오 요소는 ```getUserMedia()```의 스트림을 표시하고 다른 하나는 RTCPeerconnection을 통해 스트리밍된 동일한 비디오를 표시한다.
* 실제 응용 프로그램에서 하나의 비디오 요소는 로컬 스트림(내 영상)을 표시하고 다른 하나는 원격 스트림(서버에서 보내주는 영상)을 표시한다.
* 한마디로 client 간에 비디오를 스트리밍하기 위한 방법

<br>

## Peer Call Process
* 호출의 각 끝에 RTCPeerConnection을 만들고 그 끝에 ```getUserMedia()```에서 __localStream__ 을 추가한다.
* 네트워크 정보를 가져와서 공유한다. 잠재적인 연결 끝점은 __ICE candidate__ 로 알려저 있다.
* local과 remote의 description을 받아와 공유한다. __SDP__ 형식으로 작성된 local media에 대한 metadata 정로를 의미한다.

<br>

### 1. 네트워크 정보 교환
__'finding candidates(후보 찾기)'__ 라는 표현은 __ICE framework__ 를 사용하여 네트워크 interface와 port를 찾는 과정을 의미한다.

WebRTC 피어는 또한 해상도 및 코덱 기능과 같은 로컬 및 원격 오디오 및 비디오 미디어 정보를 찾고 교환해야 합니다. 미디어 구성 정보를 교환하라는 신호는 SDP라고 하는 세션 설명 프로토콜 형식을 사용하여 제안 및 답변으로 알려진 메타데이터 덩어리를 교환함으로써 진행됩니다.



<br>

## adaptor.js

&nbsp;&nbsp;WebRTC는 Chrome과 가장 호환성이 좋다. 그 외에 Firefox, Opera 등이 WebRTC 표준을 지원한다. 다른 브라우저도 지원하긴 하지만 호환성이 떨어진다.  말은, WebRTC는 아직 다양한 플래폼에서 표준화가 구현되어있지 않다는 뜻이다. 그렇다면, 이런 cross browsing issue를 어떻게 해결할 수 있을까? adaptor.js 라이브러리를 사용하여 해결할 수 있다. 

adaptor.js는
* shim pattern 및 polyfill을 이용하여 여러 브라우저에서 발생할 수 있는 cross browsing issue를 사전에 처리해준다.
* Vendor prefix를 신경 쓸 필요 없이 동일한 API를 호출할 수 있다.
* 이로 인해 코드 컨벤션 유리와 개발 생산성 향상에 도움을 준다.

## ICE
대화형 연결 설정 ( ICE )은 P2P 네트워킹 에서 두 컴퓨터가 가능한 한 직접 서로 통신할 수 있는 방법을 찾기 위해 컴퓨터 네트워킹 에 사용되는 기술 입니다. 이것은 VoIP( Voice over Internet Protocol ), P2P 통신, 비디오 및 인스턴트 메시징 과 같은 대화형 미디어에 가장 일반적으로 사용됩니다 .
VoIP, 피어 투 피어 및 기타 많은 응용 프로그램은 인터넷 프로토콜 패킷 헤더가 아니라 연결 데이터 스트림 내에서 통신하는 피어의 주소 정보를 필요로 합니다.
ICE는 통신하는 피어가 다른 피어가 도달할 수 있도록 공용 IP 주소를 발견하고 전달할 수 있는 프레임워크를 제공합니다.

## SDP

<br>

## Reference

* https://codelabs.developers.google.com/codelabs/webrtc-web/#4
* https://wormwlrm.github.io/2021/01/24/Introducing-WebRTC.html
* ICE: https://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment
