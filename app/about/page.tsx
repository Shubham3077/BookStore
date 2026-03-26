import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="py-20 lg:py-28">
        <div className="mx-auto max-w-[80%] max-w-2xl">
          <h1 className="text-4xl lg:text-5xl font-serif font-semibold text-foreground text-center mb-6">
            About Us
          </h1>
          <p className="text-muted-foreground text-center text-base lg:text-lg leading-relaxed mb-8">
            The Reading Nook is a curated online bookstore for readers who value quality, craft, and the joy of discovering great writing. We believe every book deserves a thoughtful home.
          </p>
          <p className="text-muted-foreground text-center text-base leading-relaxed mb-8">
            Founded with a love for independent publishing and timeless literature, we handpick every title in our collection — from contemporary fiction to essential non-fiction and rare finds you won't see elsewhere.
          </p>
          <p className="text-muted-foreground text-center text-base leading-relaxed">
            Whether you're building your personal library or searching for the perfect gift, we're here to help you find your next favorite read.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
