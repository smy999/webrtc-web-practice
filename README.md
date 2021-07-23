# webrtc-web-practice

<br>

## How to Run?

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
  * 로컬 설명은 미디어 형식을 포함하는 연결의 로컬 엔드에 대한 속성을 명시합니다.

이 메소드는 세션 설명 (session description)을 단일 매개변수로 가지며, 설명이 비동기적으로 변하게되면 fulfilled되는 Promise를 반환합니다.

연결이 이미 되어있는데 setLocalDescription()가 호출된다면, 이는 재협상이 진행 중이라는 뜻입니다 (아마도 네트워크 환경이 바뀐 것에 대응하기 위함일 것입니다). 두명의 피어가 설정 값에 모두 동의해야지만 설명이 교환되기 때문에, setLocalDescription()의 호출로 전송된 설명은 즉시 사용되지 못합니다. 대신 협상이 완료되는 순간까지는 기존 연결 설정대로 작동 하게 됩니다. 그러다가 협상이 완료된 다음에서야 신규 설정이 사용됩니다.



<br>

### RTCDataChannel



#### Properties 

* ```onopen```: Event handler
  * open 이벤트가 발생할 때 호출될 함수를 지정하는 이벤트 핸들러
  * 데이터 채널의 기본 데이터 전송(RTCDataChannel의 메시지가 흐르는 링크)이 설정되거나 재설정될 때 전송되는 간단한 이벤트

* ```onclse```: Event handler
  * RTCDataChannel에서 닫기 이벤트를 수신할 때 브라우저에서 호출할 함수를 지정하는 이벤트 핸들러
  * 데이터 채널이 닫혔음을 나타내는 간단한 이벤트



## Reference
For detailed explanation and example code, refer to 
* https://codelabs.developers.google.com/codelabs/webrtc-web/#0
* https://github.com/googlecodelabs/webrtc-web.
