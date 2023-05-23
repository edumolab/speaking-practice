import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import {
  type VideoState,
  YouTubePlayer,
  DEFAULT_YOUTUBE_VIDEO_ID,
} from "~/components/YouTube";

const Home: NextPage = () => {
  const [videoState, setVideoState] = useState<VideoState>("HIDDEN");
  const [videoId, setVideoId] = useState("HZtaSGLP1v8");
  const [startTime, setStartTime] = useState<null | number>(null);
  const [endTime, setEndTime] = useState<null | number>(null);
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
      <main className="flex min-h-screen flex-col items-center bg-black">
        <div className="container flex flex-col items-center justify-center gap-12 p-5">
          <form
            className="flex w-full max-w-2xl"
            onSubmit={(e) => {
              e.preventDefault();
              const player = window.player;
              if (!player) return;
              player.loadVideoById(videoId);
              setVideoState("PLAYING");
            }}
          >
            <input
              className="grow bg-slate-700 px-4 py-2 text-white"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              placeholder={`Video ID (e.g. ${DEFAULT_YOUTUBE_VIDEO_ID})`}
            />
            <button className="bg-blue-700 px-4 py-2 uppercase text-white transition duration-300 hover:bg-blue-600">
              Done
            </button>
          </form>
          <YouTubePlayer videoState={videoState} />
          <button
            className="bg-blue-700 px-4 py-2 uppercase text-white transition duration-300 hover:bg-blue-600"
            onClick={() => {
              const player = window.player;
              if (!player) return;
              setStartTime(player.getCurrentTime());
            }}
          >
            Set start time
          </button>
          <span>{`Start time: ${startTime}`}</span>
          <span>{`End time: ${endTime}`}</span>
          <button
            className="bg-blue-700 px-4 py-2 uppercase text-white transition duration-300 hover:bg-blue-600"
            onClick={() => {
              const player = window.player;
              if (!player) return;
              setEndTime(player.getCurrentTime());
            }}
          >
            Set end time
          </button>
        </div>
      </main>
    </>
  );
};

export default Home;
