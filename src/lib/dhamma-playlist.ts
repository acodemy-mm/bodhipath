/**
 * Dhamma audio via YouTube playlist embed.
 *
 * Replace `playlistId` with your real public playlist when ready.
 * Placeholder: a public Theravada / Dhamma talks playlist for launch UI.
 */
export const DHAMMA_PLAYLIST = {
  title: "Dhamma Audio",
  title_mm: "တရားနာရန်",
  description:
    "Listen to Dhamma talks while you sit. Replace this placeholder playlist with your own YouTube playlist URL later.",
  /** Public BSWA Ajahn Brahm talks — swap for your own playlist later. */
  playlistId: "PLPxfnU-O-ZydNT1ZsWwtSd2rl4AW8iwkM",
} as const;

export function dhammaPlaylistEmbedUrl(playlistId = DHAMMA_PLAYLIST.playlistId) {
  const params = new URLSearchParams({
    list: playlistId,
    rel: "0",
  });
  return `https://www.youtube.com/embed/videoseries?${params.toString()}`;
}
