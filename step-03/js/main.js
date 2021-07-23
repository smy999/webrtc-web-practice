'use strict';

var localConnection;
var remoteConnection;
var sendChannel;
var receiveChannel;
var pcConstraint;
var dataConstraint;
var dataChannelSend = document.querySelector('textarea#dataChannelSend');
var dataChannelReceive = document.querySelector('textarea#dataChannelReceive');
var startButton = document.querySelector('button#startButton');
var sendButton = document.querySelector('button#sendButton');
var closeButton = document.querySelector('button#closeButton');

startButton.onclick = createConnection;
sendButton.onclick = sendData;
closeButton.onclick = closeDataChannels;

function enableStartButton() {
  startButton.disabled = false;
}

function disableSendButton() {
  sendButton.disabled = true;
}

// 사용자가 start 버튼을 누르면 connection을 생성한다.
function createConnection() {
  dataChannelSend.placeholder = '';
  var servers = null;
  pcConstraint = null;
  dataConstraint = null;
  trace('Using SCTP based data channels');

  // For SCTP, reliable and ordered delivery is true by default.
  // Add localConnection to global scope to make it visible
  // from the browser console.

  // 두 peer 간의 connection은 RTCPeerConnection interface를 통해 이루어진다.
  window.localConnection = localConnection =
      new RTCPeerConnection(servers, pcConstraint);
  trace('Created local peer connection object localConnection');

  // connection이 이루어지면 MediaStream과 RTCDataChannel들을 connection에 연결할 수 있다.
  sendChannel = localConnection.createDataChannel('sendDataChannel',
      dataConstraint);
  trace('Created send data channel');

  // 다른 peer에서 메세지를 전달할 필요가 있을 때 ice candidate를 보내기 위해 사용한다.
  localConnection.onicecandidate = iceCallback1;  // local > remote로 ice candidate 보내기, open 이벤트가 발생하면 호출된다.
  sendChannel.onopen = onSendChannelStateChange;  // dataChannel 열 때 호출되는 함수 지정
  sendChannel.onclose = onSendChannelStateChange; // dataChannel 닫을 때 호출되는 함수 지정

  // Add remoteConnection to global scope to make it visible
  // from the browser console.
  window.remoteConnection = remoteConnection =
      new RTCPeerConnection(servers, pcConstraint);
  trace('Created remote peer connection object remoteConnection');

  remoteConnection.onicecandidate = iceCallback2; // remote > local로 ice candidate 보내기, , open 이벤트가 발생하면 호출된다.
  remoteConnection.ondatachannel = receiveChannelCallback;  // remote connection에 data channel이 추가(createDataChannel()을 통해)되었을 때 호출되는 함수

  // SDP는 미디어 스트림 자체를 전달하지 않지만 네트워크 메트릭, 미디어 유형 및 기타 관련 속성 협상을 위해 엔드포인트 간에 사용됩니다. 속성 및 매개변수 집합을 세션 프로필 이라고 합니다 .
  localConnection.createOffer().then( // createOffer는 세션 연결에 필요한 메타데이터를 SDP형식으로 만든다.
    gotDescription1,                  // 생성한 local description을 local, remote에 추가하는 함수. 모두 추가한 후 remote의 answer를 생성하여 local, remote에 모두 추가한다.
    onCreateSessionDescriptionError
  );
  startButton.disabled = true;
  closeButton.disabled = false;
}

function onCreateSessionDescriptionError(error) {
  trace('Failed to create session description: ' + error.toString());
}

// 사용자가 Send 버튼을 누르면 data를 전송한다.
function sendData() {
  var data = dataChannelSend.value; // 사용자가 입력한 data를 받아온다.
  sendChannel.send(data);           // data를 data channel을 통해 전송한다.
  trace('Sent Data: ' + data);
}

// 사용자가 Stop 버튼을 누르면 data를 전송한다.
function closeDataChannels() {
  trace('Closing data channels');
  sendChannel.close();            // 송신 data channel 닫기
  trace('Closed data channel with label: ' + sendChannel.label);
  receiveChannel.close();         // 수신 data channel 닫기
  trace('Closed data channel with label: ' + receiveChannel.label);
  localConnection.close();        // local & remote connection 닫기
  remoteConnection.close();
  localConnection = null;         // local & remote connetion null로 초기화
  remoteConnection = null;
  trace('Closed peer connections');
  startButton.disabled = false;   // 버튼 설정 초기화
  sendButton.disabled = true;
  closeButton.disabled = true;
  dataChannelSend.value = '';     // 전송 데이터 초기화
  dataChannelReceive.value = '';
  dataChannelSend.disabled = true;// 입력 막기(start 버튼이 눌리면 활성화)
  disableSendButton();
  enableStartButton();
}

// 호출한 곳에서 생성한 local description(offer)을 local과 remote connection에 추가한다.
// 또한, remote의 answer를 생성하여 gotDescription2()를 통해 local과 remote connection에 추가한다.
function gotDescription1(desc) {
  localConnection.setLocalDescription(desc);
  trace('Offer from localConnection \n' + desc.sdp);
  remoteConnection.setRemoteDescription(desc);
  remoteConnection.createAnswer().then(
    gotDescription2,
    onCreateSessionDescriptionError
  );
}

// 호출한 곳에서 생성한 remote description(answer)을 local과 remote connection에 추가한다.
function gotDescription2(desc) {
  remoteConnection.setLocalDescription(desc);
  trace('Answer from remoteConnection \n' + desc.sdp);
  localConnection.setRemoteDescription(desc);
}

// local > remote로 ice candidate 보내기
function iceCallback1(event) {
  trace('local ice callback');
  if (event.candidate) {
    remoteConnection.addIceCandidate(
      event.candidate
    ).then(
      onAddIceCandidateSuccess,
      onAddIceCandidateError
    );
    trace('Local ICE candidate: \n' + event.candidate.candidate);
  }
}

// remote > local로 ice candidate 보내기
function iceCallback2(event) {
  trace('remote ice callback');
  if (event.candidate) {
    localConnection.addIceCandidate(
      event.candidate
    ).then(
      onAddIceCandidateSuccess,
      onAddIceCandidateError
    );
    trace('Remote ICE candidate: \n ' + event.candidate.candidate);
  }
}

function onAddIceCandidateSuccess() {
  trace('AddIceCandidate success.');
}

function onAddIceCandidateError(error) {
  trace('Failed to add Ice Candidate: ' + error.toString());
}

// remote connection의 data channel을 만든 후 receiveChannel에 할당하고 event별 호출 함수를 지정한다.
function receiveChannelCallback(event) {
  trace('Receive Channel Callback');
  receiveChannel = event.channel;
  receiveChannel.onmessage = onReceiveMessageCallback;
  receiveChannel.onopen = onReceiveChannelStateChange;
  receiveChannel.onclose = onReceiveChannelStateChange;
}

function onReceiveMessageCallback(event) {
  trace('Received Message');
  dataChannelReceive.value = event.data;
}

// data channel의 상태(open, close)가 바뀔 때마다 호출되는 함수
function onSendChannelStateChange() {
  var readyState = sendChannel.readyState;  // 호출한 data channel의 상태를 받아온 후
  trace('Send channel state is: ' + readyState);
  if (readyState === 'open') {              // 상태에 따라 처리한다.
    dataChannelSend.disabled = false;
    dataChannelSend.focus();
    sendButton.disabled = false;
    closeButton.disabled = false;
  } else {
    dataChannelSend.disabled = true;
    sendButton.disabled = true;
    closeButton.disabled = true;
  }
}

function onReceiveChannelStateChange() {
  var readyState = receiveChannel.readyState;
  trace('Receive channel state is: ' + readyState);
}

function trace(text) {
  if (text[text.length - 1] === '\n') {
    text = text.substring(0, text.length - 1);
  }
  if (window.performance) {
    var now = (window.performance.now() / 1000).toFixed(3);
    console.log(now + ': ' + text);
  } else {
    console.log(text);
  }
}
