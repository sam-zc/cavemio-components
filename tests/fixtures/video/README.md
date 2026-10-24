# Deterministic player fixtures

18 seconds of FFmpeg `testsrc2` and a 440Hz sine wave, generated for this repository. No third-party footage. Two H.264 video representations (360p/180p), AAC audio, MPEG-DASH and fMP4 HLS manifests. These fixtures are test-only and are served by Storybook at `/video-fixtures/`; they do not ship in the component registry or public demo.

Generate with FFmpeg (commands overwrite only these owned test fixtures):

```sh
ffmpeg -y -f lavfi -i testsrc2=size=640x360:rate=24 -f lavfi -i sine=frequency=440:sample_rate=48000 -t 18 -map 0:v -map 0:v -map 1:a -c:v libx264 -preset veryfast -pix_fmt yuv420p -b:v:0 280k -b:v:1 90k -filter:v:1 scale=320:180 -g 48 -keyint_min 48 -sc_threshold 0 -c:a aac -b:a 48k -f dash -seg_duration 2 -use_template 1 -use_timeline 1 -hls_playlist 1 -hls_master_name sample.m3u8 -adaptation_sets 'id=0,streams=v id=1,streams=a' tests/fixtures/video/sample.mpd
ffmpeg -y -f lavfi -i testsrc2=size=320x180:rate=24 -f lavfi -i sine=frequency=440:sample_rate=48000 -t 18 -c:v libx264 -preset veryfast -b:v 90k -pix_fmt yuv420p -c:a aac -b:a 48k -movflags +faststart tests/fixtures/video/sample.mp4
```

Use the required RTK wrapper in environments that mandate it. Public stream and DRM smoke tests are separate opt-in tests.
