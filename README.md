# webrtc-web-practice

<br>

## How to Run?

For detailed explanation and example code, refer to https://codelabs.developers.google.com/codelabs/webrtc-web/#0

### [step-01 ~ step03]
#### Case 1. Use Web Server for Chrome
  * For more information, see https://codelabs.developers.google.com/codelabs/webrtc-web/#2

#### Case 2. Use npm install and nodejs
  * In addition to the previously referenced Google example, a server.js file using Sockjs and Stomp was added. 
  * Therefore, it should be executed as follows.
  * Installing npm
  ```
  npm install sockjs
  npm install node-static
  npm install
  ```
  * Run with Nodejs
  ```
  node server.js
  ```
  * Connect to ```localhost:8887```


<br>


### [step-04 ~ step06]
#### Case 1. Use npm install and nodejs
  * Installing npm
  ```
  npm install
  ```
  * Run with Nodejs
  ```
  node index.js
  ```
  * Connect to ```localhost:8080```

<br>



## Interface

### RTCPeerConnection

두 peer 간의 connection은 RTCPeerConnection interface를 통해 이루어진다.

connection이 이루어지면 MediaStream과 RTCDataChannel들을 connection에 연결할 수 있다.

#### Properties

* ```onicecandidate```: Event handler
  * RTCPeerConnection/icecandidate_event 이벤트가 발생할 때 호출될 함수를 지정하는 이벤트 핸들러
  * Local ICE agent가 signaling server를 통해 다른 peer에게 메시지를 전달할 필요가 있을 때마다 발생한다. 
  * 이를 통해 ICE agent는 signaling에 사용되는 기술에 대한 세부 사항을 브라우저 자체가 알 필요 없이 remote peer와 협상을 수행할 수 있다. 
  * ICE cnadidate를 remote peer로 보내기 위해 선택한 메시징 기술을 사용하려면 이 method를 사용한다.

* ```ondatachannel```: Event handler
  * RTCPeerConnection에서 발생하는 datachannel 이벤트에 의해 호출되는 event handler
  * ondatachannel에서는 함수를 정의한다. RTCDataChannelEvent의 한 종류로 remote peer가 createDataChannel()를 호출해서 connection에 RTCDataChannel이 추가되었을 때 전달된다. 

* ```createOffer()```: method
  * renote peer에 대한 새로운 WebRTC 연결을 시작할 목적으로 SDP offer를 생성한다. 
  * session 연결에 필요한 metadata를 SDP형식으로 만든다.
  * SDP offer에는 WebRTC 세션, 코덱 및 브라우저에서 지원하는 옵션에 이미 연결된 MediaStreamTrack 개체에 대한 정보와 잠재적인 피어에게 신호 채널을 통해 보낼 목적으로 ICE agent가 이미 수집한 candidate에 대한 정보가 포함한다.
  * 연결을 요청하거나 기존 연결의 구성을 업데이트한다.
  * 반환 값은 __Promise__ 로, offer가 생성될 때 새로 생성된 제안을 포함하는 RTCSessionDescription 객체로 해결(?)되는 약속이다.

* ```setLocalDescription()```: method
  * interface와 관련이 있는 local description을 변경한다.
  * 로컬 설명은 미디어 형식을 포함하는 connection의 local end에 대한 속성을 명시한다.
  * 해당 method는 session description을 단일 매개변수로 가지며, 설명이 비동기적으로 변하게되면 fulfilled되는 Promise를 반환한다.
  * connection이 이미 설정된 상태에서 setLocalDescription()가 호출된다면, 이는 재협상이 진행 중이라는 뜻이다. (변화하는 네트워크 조건에 적응할 수 있음)
  * 두 peer 모두 설정 값에 모두 동의해야지만 설명이 교환되기 때문에, setLocalDescription()의 호출로 전송된 설명은 즉시 사용되지 못한다. 대신 협상이 완료되는 순간까지는 기존 연결 설정대로 작동한다. 그러다가 협상이 완료된 다음에서야 신규 설정이 사용된다.



<br>

### RTCDataChannel



#### Properties 

* ```onopen```: Event handler
  * open 이벤트가 발생할 때 호출될 함수를 지정하는 이벤트 핸들러
  * 데이터 채널의 기본 데이터 전송(RTCDataChannel의 메시지가 흐르는 링크)이 설정되거나 재설정될 때 전송되는 간단한 이벤트

* ```onclose```: Event handler
  * RTCDataChannel에서 닫기 이벤트를 수신할 때 브라우저에서 호출할 함수를 지정하는 이벤트 핸들러
  * 데이터 채널이 닫혔음을 나타내는 간단한 이벤트

* ```send```: method
  * data channel을 통해 remote peer로 데이터를 보낸다. 기본 전송 채널을 만드는 초기 프로세스를 제외하고 언제든지 수행할 수 있다.
  * 연결하기 전에 전송된 데이터는 가능한 경우 버퍼링되고(또는 불가능한 경우 오류가 발생) 연결이 닫히거나 닫혀 있는 동안 전송된 경우에도 버퍼링된다.
  * 브라우저마다 보낼 수 있는 메시지 크기에 대한 제한이 다르다. 큰 메시지를 자동으로 조각화하는 방법을 정의하는 사양이 있지만 모든 브라우저에서 이를 구현하는 것은 아니며 다양한 추가 제한이 있는 브라우저도 있다.

* ```readyState```: property __read-only__
  * data channel의 기본 데이터 연결 상태를 나타내는 문자열을 반환
  * value: 다음은 data transport(전송)산태를 나타내는 문자열이다.
    * __connecting__ : user agent(브라우저)는 기본 데이터 전송을 생성하는 중이다. connection 프로세스를 시작한 peer에서 RTCPeerConnection.createDataChannel()에 의해 생성된 후 새 RTCDataChannel의 상태입니다.
    * __open__ : 기본 데이터 전송이 설정되었으며 데이터를 양방향으로 전송할 수 있다. remote peer가 채널을 생성하고 데이터 채널 이벤트에서 사이트 또는 앱에 전달할 때 WebRTC 계층에 의해 생성된 새 RTCDataChannel의 기본 상태다.
    * __closing__ : 기본 데이터 전송을 닫는 프로세스가 시작되었다. 더 이상 보낼 새 메시지를 대기열에 넣을 수 없지만 이전에 대기열에 넣은 메시지는 closed 상태로 들어가기 전에 계속 보내거나 받을 수 있습니다.
    * __closed__ : 기본 데이터 전송이 닫혔거나 연결 시도가 실패했다.
  
  
  
  
<br>

<br>

## Reference


* https://developer.mozilla.org/ko/docs/Web/API/WebRTC_API
* https://github.com/googlecodelabs/webrtc-web.
