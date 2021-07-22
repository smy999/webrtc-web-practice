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

## WebRTC 피어 간의 3가지 호출 설정
* 호출의 각 끝에 RTCPeerConnection을 만들고 그 끝에 ```getUserMedia()```에서 local stream을 추가한다.
* 네트워크 정보를 가져와서 공유한다. 잠재적인 연결 끝점은 __ICE candidate__ 로 알려저 있다.
* local과 remote의 description을 받아와 공유한다. __SDP__ 형식으로 작성된 local media에 대한 metadata 정로를 의미한다.

<br>

## Peer Call Process

### 1. ICE를 활용한 네트워크 정보 교환

__'finding candidates(후보 찾기)'__ 라는 표현은 __ICE framework__ 를 사용하여 네트워크 interface와 port를 찾는 과정을 의미한다.

<br>

1-1. onicecandidate(addEventListener('icecandidate')) 핸들러를 사용하여 RTCPeerConnection 객체를 생성한다.:
```
let localPeerConnection;

localPeerConnection = new RTCPeerConnection(servers);
localPeerConnection.addEventListener('icecandidate', handleConnection);
localPeerConnection.addEventListener(
    'iceconnectionstatechange', handleConnectionChange);
```

  * 주의 사항
    * RTCPeerConnection에 대한 서버 설정는 이 부분에서 구현하지 않는다. 여기에서 STUN 및 TURN 서버를 지정할 수 있습니다.
    * WebRTC는 P2P로 작동하도록 설계되어 사용자가 가능한 가장 직접적인 경로로 연결할 수 있다. 그러나 WebRTC는 실제 네트워킹에 대처하도록 구축되었다.  Client 애플리케이션은 NAT Gateway 및 방화벽을 통과해야 하고 P2P 네트워킹은 직접 연결이 실패할 경우 fallback이 필요하다.
    * 이 프로세스의 일부로 WebRTC API는 STUN 서버를 사용하여 컴퓨터의 IP 주소를 가져오고 TURN 서버는 피어 투 피어 통신이 실패한 경우 릴레이 서버로 작동한다.

<br>

1-2. getUserMedia()를 호출하고 전달된 stream을 추가한다.:
```
// getUserMedia()로 stream을 가져온다.
navigator.mediaDevices.getUserMedia(mediaStreamConstraints). // getUserMedia()를 호출하면 브라우저는 기기 엑세스 권한을 요쳥한다.
  then(gotLocalMediaStream).                                 // 권한이 수락되면, MediaStream이 반환된다. 
  catch(handleLocalMediaStreamError);
```
```
function gotLocalMediaStream(mediaStream) {
  localVideo.srcObject = mediaStream;       // MediaStream에서는 srcObject를 통해서 media element를 사용할 수 있다.
  localStream = mediaStream;                // 생성된 media stream을 local stream에 저장한다.
  trace('Received local stream.');
  callButton.disabled = false;  // Enable call button.
}
```
```
// PeerConnection에 local stream을 추가한다.
localPeerConnection.addStream(localStream);
trace('Added local stream to localPeerConnection.');
```

<br>

1-3. onicecandidate 핸들러는 네트워크 후보를 사용할 수 있게 되면 호출된다.

<br>

1-4. 해당 peer는 다른 peer에게 직렬화된 후보 데이터(serializes condidate data)를 보낸다. 이 과정을 시그널링(signaling)이라고하는데, 시그널링은 messaging 서비스를 통해 발생한다. (두 개의 RTCPeerConnection 객체가 같은 페이지에 있으며 외부 메시징 없이 직접 통신할 수 있다.)

<br>

1-5. 후보 메시지를 받은 peer는 addIceCandidate()를 호출하여 원격 peer 설명에 후보를 추가한다.:
```
function handleConnection(event) {
  const peerConnection = event.target;
  const iceCandidate = event.candidate;

  if (iceCandidate) {
    const newIceCandidate = new RTCIceCandidate(iceCandidate);
    const otherPeer = getOtherPeer(peerConnection);

    otherPeer.addIceCandidate(newIceCandidate)
      .then(() => {
        handleConnectionSuccess(peerConnection);
      }).catch((error) => {
        handleConnectionFailure(peerConnection, error);
      });

    trace(`${getPeerName(peerConnection)} ICE candidate:\n` +
          `${event.candidate.candidate}.`);
  }
}
```

<br>

### 2. SDP를 활용한 Metadata 정보 교환

WebRTC peer는 해상도 및 코덱 기능과 같은 로컬 및 원격 오디오 및 비디오 미디어 정보를 찾고 교환해야 한다. 미디어 구성 정보를 교환하는 신호는 SDP라고 하는 세션 설명 프로토콜 형식을 사용하여 제안 및 답변으로 알려진 메타데이터 덩어리이다.

<br>

2-1. P1은 RTCPeerConnection createOffer() 메서드를 실행한다. 해당 메소드는 P1의 로컬 세션 설명을 제공하는 RTCSessionDescription을 반환한다. :
```
trace('localPeerConnection createOffer start.');
localPeerConnection.createOffer(offerOptions)
  .then(createdOffer).catch(setSessionDescriptionError);
```

<br>

2-2. 성공하면 P1 setLocalDescription()을 사용하여 로컬 설명을 설정한 다음, 이 세션 설명을 시그널링 채널을 통해 P2에게 보낸다.

<br>

2-3. P2는 P1이 setRemoteDescription()을 사용하여 원격 설명으로 보낸 설명을 설정한다.

<br>

2-4. P2은 RTCPeerConnection createAnswer() 메소드를 실행하여 P1로부터 얻은 원격 설명을 전달하므로 P1와 호환되는 로컬 세션이 생성될 수 있다. createAnswer() promise는 RTCSessionDescription을 전달한다. P2는 이를 로컬 설명으로 설정하고 P1에게 보낸다.

<br>

2-5. P1이 P2의 세션 설명을 받으면 setRemoteDescription()을 사용하여 이를 원격 설명으로 설정합니다.
```
// Logs offer creation and sets peer connection session descriptions.
function createdOffer(description) {
  trace(`Offer from localPeerConnection:\n${description.sdp}`);

  trace('localPeerConnection setLocalDescription start.');
  localPeerConnection.setLocalDescription(description)
    .then(() => {
      setLocalDescriptionSuccess(localPeerConnection);
    }).catch(setSessionDescriptionError);

  trace('remotePeerConnection setRemoteDescription start.');
  remotePeerConnection.setRemoteDescription(description)
    .then(() => {
      setRemoteDescriptionSuccess(remotePeerConnection);
    }).catch(setSessionDescriptionError);

  trace('remotePeerConnection createAnswer start.');
  remotePeerConnection.createAnswer()
    .then(createdAnswer)
    .catch(setSessionDescriptionError);
}

// Logs answer to offer creation and sets peer connection session descriptions.
function createdAnswer(description) {
  trace(`Answer from remotePeerConnection:\n${description.sdp}.`);

  trace('remotePeerConnection setLocalDescription start.');
  remotePeerConnection.setLocalDescription(description)
    .then(() => {
      setLocalDescriptionSuccess(remotePeerConnection);
    }).catch(setSessionDescriptionError);

  trace('localPeerConnection setRemoteDescription start.');
  localPeerConnection.setRemoteDescription(description)
    .then(() => {
      setRemoteDescriptionSuccess(localPeerConnection);
    }).catch(setSessionDescriptionError);
}
```


<br>

## adaptor.js

&nbsp;&nbsp;WebRTC는 Chrome과 가장 호환성이 좋다. 그 외에 Firefox, Opera 등이 WebRTC 표준을 지원한다. 다른 브라우저도 지원하긴 하지만 호환성이 떨어진다.  말은, WebRTC는 아직 다양한 플래폼에서 표준화가 구현되어있지 않다는 뜻이다. 그렇다면, 이런 cross browsing issue를 어떻게 해결할 수 있을까? adaptor.js 라이브러리를 사용하여 해결할 수 있다. 

adaptor.js는
* shim pattern 및 polyfill을 이용하여 여러 브라우저에서 발생할 수 있는 cross browsing issue를 사전에 처리해준다.
* Vendor prefix를 신경 쓸 필요 없이 동일한 API를 호출할 수 있다.
* 이로 인해 코드 컨벤션 유리와 개발 생산성 향상에 도움을 준다.


<br>

### ICE
대화형 연결 설정(ICE: Interactive Connectivity Establishment)은 P2P 네트워킹 에서 두 컴퓨터가 가능한 한 직접 서로 통신할 수 있는 방법을 찾기 위해 컴퓨터 네트워킹에 사용되는 기술이다. 이것은 VoIP(Voice over Internet Protocol), P2P 통신, 비디오 및 인스턴트 메시징 과 같은 대화형 미디어에 가장 일반적으로 사용된다. VoIP, P2P 및 기타 많은 응용 프로그램은 인터넷 프로토콜 패킷 헤더가 아니라 연결 데이터 스트림 내에서 통신하는 Peer의 주소 정보를 필요로 한다. ICE는 통신하는 Peer가 다른 Peer에게 도달할 수 있도록 공용 IP 주소를 발견하고 전달할 수 있는 프레임워크를 제공한다.


<br>

## SDP

<br>

## Reference

* https://codelabs.developers.google.com/codelabs/webrtc-web/#4
* https://wormwlrm.github.io/2021/01/24/Introducing-WebRTC.html
* ICE: https://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment
