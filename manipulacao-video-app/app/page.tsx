import VideoPlayer from "./video-player";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-6">
      {/* Aqui carregamos o seu player de vídeo com a estética que criamos */}
      <VideoPlayer />
    </main>
  );
}