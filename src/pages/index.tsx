import { type NextPage } from "next";
import Head from "next/head";
import { useRef, useState } from "react";
import {
  YouTubePlayer,
  YouTubeSearch,
  setYouTubeVideoId,
  waitUntilPlayerIsPlaying,
} from "~/components/YouTube";
import { Clips, useClips } from "~/components/Clips";
import { ClipEditor } from "~/components/ClipEditor";
import { AudioRecorder } from "~/components/AudioRecorder";

const Home: NextPage = () => {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const { clips, saveClips } = useClips();
  const lastPauseVideoTimeoutId = useRef<NodeJS.Timeout>();

  return (
    <>
      <Head>
        <title>Speaking Practice</title>
        <meta
          name="description"
          content="Practice speaking in a foreign language by using YouTube."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-black text-white">
        <div className="container flex flex-col items-center justify-center gap-3 p-4">
         <a href="#" target="_blank"><button className="absolute left-3 bottom-4 shadow-lg p-4 rounded-full bg-indigo-600 text-white">Tips</button></a>
          
    
          <YouTubeSearch />
          <YouTubePlayer />
          <ClipEditor
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            saveClips={saveClips}
            lastPauseVideoTimeoutId={lastPauseVideoTimeoutId}
          />
          <AudioRecorder />
          <Clips
            clips={clips}
            onPlayClip={(clip) => {
              void (async () => {
                setStartTime(clip.startTime);
                setEndTime(clip.endTime);
                const player = window.player;
                if (!player) return;
                const { video_id: videoId } = player.getVideoData();
                if (clip.videoId !== videoId) {
                  setYouTubeVideoId(clip.videoId);
                  await waitUntilPlayerIsPlaying();
                }
                player.seekTo(clip.startTime);
                player.playVideo();
                clearTimeout(lastPauseVideoTimeoutId.current);
                lastPauseVideoTimeoutId.current = setTimeout(() => {
                  player.pauseVideo();
                }, (clip.endTime - clip.startTime) * 1000);
              })();
            }}
            onDeleteClip={(deletedClip) => {
              saveClips((clips) =>
                clips.filter((clip) => clip.id !== deletedClip.id)
              );
            }}
          />
        </div>
      </main>
    </>
  );
};

export default Home;
