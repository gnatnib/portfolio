import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import HighlightedWork from "@/components/HighlightedWork";
import ExperienceCarousel from "@/components/ExperienceCarousel";
import SpotifyNowPlaying from "@/components/SpotifyNowPlaying";
// import GalleryPreview from "@/components/GalleryPreview";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <HighlightedWork />
      <ExperienceCarousel />
      <SpotifyNowPlaying />
      {/* <GalleryPreview /> */}
    </>
  );
}
