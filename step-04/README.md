# 메시지 교환을 위한 신호 서비스 설정<br>Set up a signaling service to exchange messages

<br>

## Goal

* package.json에 지정된 대로 프로젝트 종속성(dependencies)을 설치하는데 ```npm```을 사용한다.
* Node.js 서버를 실행하고 node-static을 사용하여 정적 파일을 제공한다.
* Socket.IO를 사용하여 Node.js에서 메시징 서비스를 설정합니다.
* 위를 사용하여 'room'을 만들고 메시지를 교환한다.

<br>

## Concepts

### WebRTC 호출을 설정하고 유지하려면 WebRTC client(peer)가 메타데이터를 교환해야 한다.
* Candidate(network) 정보
* 제공 및 대답 등의 해상도와 코덱 등의 미디어에 대한 정보를 제공하는 메시지.


### Signaling?
* 오디오, 비디오 또는 데이터의 P2P streaming이 발생하기 전에 metadata의 교환이 필요한데, 이 프로세스를 signaling이라고 한다.

<br>

이전 단계에서는, RTCPeerConnection 객체가 동일 페이지에서 동작했다. 'signaling'은 단순히 객체 간의 metadata 만을 전달했다.<br>
실제 응용 프로그램에서는, RTCPeerConnection 객체는 서로 다른 기기의 웹 페이지에 실행되며 metadata를 전달하는 방법이 필요하다.

<br>

이를 위해 WebRTC client(peer) 간에 메시지를 전달할 수 있는 server인 signaling server를 사용한다.<br>
실제 메시지는 문자열화된 JavaScript 객체인 일반 텍스트다.


<br>

## Install

1. Node.js를 사용하여 localhost에서 server를 실행하기 때문에 Node.js를 설치해야 한다.
2. 설치 후 필요한 종속성을 가져오기 위해 ```npm install```을 수행한다.
3. 이후 ```node index.js```을 통해 localhost server를 실행할 수 있다.

<br>

## About the app

WebRTC는 client-side JavaScript API를 사용하지만 실제 사용을 위해서는 signaling(messaging) server와 STUN 및 TURN 서버도 필요하다.<br>
이 예제에서는 Socket.IO, Node.js 모듈과 메시징용 JavaScript 라이브러리를 사용하여 간단한 Node.js signaling server를 빌드한다.<br>
또한, server는 index.js에 구현되고 server에서 실행되는 client(웹 앱)는 index.html에 구현된다.


<br>

* Signaling server
  * 해당 예제에서는 socket.io를 사용한다.
  * Socket.io는 메시지 교환을 위한 서비스를 간단하게 구출 할 수 있으며, 'room'이라는 기본 개념을 제공하여 WebRTC signaling를 학습하는데 적합하다.
  * but, 더 나은 서비스도 존재한다.(필수가 아니라는 뜻!)







