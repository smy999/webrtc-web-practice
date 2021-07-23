# 사진을 찍어 데이터 채널을 통해 공유<br>Take a photo and share it via a data channel



<br>



## Goal

* 사진을 찍고 캔버스 요소를 사용하여 사진에서 데이터를 가져온다.
* 원격 사용자와 이미지 데이터를 교환한다.



<br>



## How it works

1. Data channel을 설정한다. 이 단계에서는 peer connection에 media stream을 추가하지 않는다.
2. `getUserMedia()`을 사용하여 사용자의 웹캠 video stream을 캡처한다.

3. 사용자가 **Snap** 버튼을 클릭하면 video stream에서 스냅샷(a video frame)을 가져와 `canvas`요소에 표시한다 .

4. 사용자가 **Send** 버튼을 클릭하면 이미지를 byte로 변환하고 data channel을 통해 보낸다.
5. 수신측은 data channel message byte를 다시 이미지로 변환하고 사용자에게 이미지를 표시한다.



<br>



## Run

* 앱은 임의의 방 ID를 (자동)생성하고 해당 ID를 URL에 추가한다. 새 브라우저 탭이나 창의 주소 표시줄에서 URL을 연다.
* **Snap and Send** 버튼을 누른 다음 페이지의 맨 아래에있는 다른 탭의 수신 영역을 확인한다. 앱은 탭 간에 사진을 전송한다.

