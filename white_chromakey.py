# 한번에 투명도랑 같이 영상 저장이 안돼서 일단 이미지로 다운받고 ffmpeg -i %05d.png output.webm 명령어로 투명영상으로 합성해야 한다. 영상퀄리티가 떨어진다싶으면 추가옵션 ㄱㄱ

import numpy as np
import cv2
import math
import os
import sys
from moviepy.editor import *

path = os.path.realpath(__file__);
dirPath = path.split(__file__)[0];
videoPath = os.path.join(dirPath, "walking.mp4")
cap1 = cv2.VideoCapture(videoPath)

if not cap1.isOpened():
    print('video open failed')
    sys.exit()

    
w = math.floor(cap1.get(cv2.CAP_PROP_FRAME_WIDTH))
h = math.floor(cap1.get(cv2.CAP_PROP_FRAME_HEIGHT))
frame_cnt1 = math.floor(cap1.get(cv2.CAP_PROP_FRAME_COUNT))
frame_cnt2 = math.floor(cap1.get(cv2.CAP_PROP_FRAME_COUNT))
fps = math.floor(cap1.get(cv2.CAP_PROP_FPS))
print("fps:", fps)

delay = int(1000 / fps)

do_composit = True

return_frames = []

transparent = np.zeros((h, w, 4), np.uint8)

imgIdx = 0

while True:
    ret1, frame1 = cap1.read()
    if not ret1:
        break
    if do_composit:
        frame1 = cv2.cvtColor(frame1, cv2.COLOR_BGR2BGRA)
        hsv = cv2.cvtColor(frame1, cv2.COLOR_BGR2HSV)
        mask = cv2.inRange(hsv, (0,0,100), (255,10,255))
        cv2.copyTo(transparent, mask, frame1)
                
    cv2.imshow('frame', frame1)
    img_rgba = cv2.cvtColor(frame1, cv2.COLOR_BGRA2RGBA)
    print(img_rgba)
    hsv = cv2.cvtColor(frame1, cv2.COLOR_BGR2HSV)
    
    key = cv2.waitKey(delay)
    
    cv2.imwrite(os.path.join(dirPath,'output', '{0:05d}.png'.format(imgIdx)), frame1)
    
    imgIdx += 1
    
    if key == ord(' '):
        do_composit = not do_composit
    elif key == 27:
        break
    
cap1.release()
cv2.destroyAllWindows()

# print(return_frames)

# result_video_single = os.path.join(dirPath , 'output.webm')
# videoClip = VideoFileClip(videoPath)
# audioClip = videoClip.audio
# save_clip_single = ImageSequenceClip(return_frames, fps=fps)
# print(save_clip_single)
# save_clip_single = save_clip_single.set_audio(audioClip)
# save_clip_single.write_videofile(result_video_single, temp_audiofile="audio_" + os.path.basename(result_video_single), remove_temp=True, audio_codec='libvorbis', fps=fps, withmask=True)
