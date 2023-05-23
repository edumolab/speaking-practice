import { useEffect, useState } from "react";
import { classes } from "~/utils/classes";

const YOUTUBE_API_URL = "https://www.youtube.com/iframe_api";
const YOUTUBE_PLAYER_ID = "__youtube-player__";
export const DEFAULT_YOUTUBE_VIDEO_ID = "M7lc1UVf-VE";

export type VideoState = "HIDDEN" | "PAUSED" | "PLAYING";

type YouTubePlayer = {
  loadVideoById: (videoId: string) => void;
};

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: {
      Player: {
        new (
          youtubePlayerId: string,
          options: {
            height: number;
            width: number;
            videoId: string;
            playerVars: { playsinline: 1 };
          }
        ): YouTubePlayer;
      };
    };
    player?: YouTubePlayer;
  }
}

const getYouTubePlayer = (
  videoId: string
): undefined | Promise<YouTubePlayer> => {
  if (typeof window === "undefined") return;
  if (window.player) return Promise.resolve(window.player);
  const youtubeApiScriptTag = document.createElement("script");
  youtubeApiScriptTag.src = YOUTUBE_API_URL;
  document.body.append(youtubeApiScriptTag);
  return new Promise((resolve) => {
    window.onYouTubeIframeAPIReady = () => {
      const player = new window.YT.Player(YOUTUBE_PLAYER_ID, {
        height: 390,
        width: 640,
        videoId,
        playerVars: { playsinline: 1 },
      });
      window.player = player;
      resolve(player);
    };
  });
};

const useYouTubePlayer = () => {
  const globalPlayer =
    typeof window === "undefined" ? undefined : window.player;
  const [player, setPlayer] = useState<undefined | YouTubePlayer>(globalPlayer);
  useEffect(() => {
    (async () => {
      setPlayer(await getYouTubePlayer(DEFAULT_YOUTUBE_VIDEO_ID));
    })();
  }, [globalPlayer]);
  return player;
};

export const YouTubePlayer = ({ videoState }: { videoState: VideoState }) => {
  const player = useYouTubePlayer();
  return (
    <div
      id={YOUTUBE_PLAYER_ID}
      // className={classes(videoState === "HIDDEN" && "invisible")}
    ></div>
  );
};
