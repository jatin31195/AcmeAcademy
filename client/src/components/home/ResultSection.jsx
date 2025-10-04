import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import resultSample1 from "../../assets/images/acme-poster.jpg";
import resultSample2 from "../../assets/images/ACMEs-CUET-MCA-2024.png";
import resultSample3 from "../../assets/images/mah-mca-cet-2024-result.png";
import resultSample4 from "../../assets/images/acme-banner.jpg";
import resultSample5 from "../../assets/images/Results.jpg";
import resultSample6 from "../../assets/images/nimcet-2024-result.png";

const ResultsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const resultImages = [
    { src: resultSample1, title: "NIMCET 2025 Toppers", exam: "NIMCET", year: "2025" },
    { src: resultSample2, title: "CUET-PG 2024 Results", exam: "CUET-PG", year: "2024" },
    { src: resultSample3, title: "MAH-CET 2024 Achievers", exam: "MAH-CET", year: "2024" },
    { src: resultSample4, title: "NIMCET 2024 Success Story", exam: "NIMCET", year: "2024" },
    { src: resultSample5, title: "BIT MCA 2024 Results", exam: "BIT MCA", year: "2024" },
    { src: resultSample6, title: "JMI MCA 2024 Toppers", exam: "JMI MCA", year: "2024" },
  ];

  // Auto-slide every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % resultImages.length);
    }, 30000); 

    return () => clearInterval(timer);
  }, [resultImages.length]);

  return (
    <section className="w-full h-[700px] md:h-[900px] relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 text-center">
        <h2 className="text-5xl md:text-5xl font-heading font-bold mb-2">
          Outstanding <span className="gradient-text">Results</span>
        </h2>
        <p className="text-xl md:text-xl text-muted-foreground">
          Celebrating the success of our MCA entrance exam toppers
        </p>
      </div>

      {/* Image Slider */}
      <div className="w-full pt-16 flex flex-col items-center mt-20 px-4 sm:px-6 lg:px-8">
  <div className="w-full max-w-7xl shadow-2xl rounded-2xl overflow-hidden">
    <div className="w-full h-[500px] md:h-[550px] lg:h-[600px] flex items-center justify-center bg-black">
      <Carousel value={currentSlide} onValueChange={setCurrentSlide} className="w-full h-full rounded-2xl">
        <CarouselContent className="h-full">
          {resultImages.map((result, index) => (
            <CarouselItem key={index} className="h-full flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={result.src}
                  alt={result.title}
                  className="max-h-full max-w-full object-contain object-center"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 text-white z-10">
                  <div className="glass-dark backdrop-blur-md bg-black/30 p-4 rounded-lg border border-white/20">
                    <h3 className="text-lg md:text-xl font-bold mb-1">{result.title}</h3>
                    <div className="flex items-center gap-2 text-xs md:text-sm">
                      <span className="bg-primary/80 px-2 py-1 rounded-full">{result.exam}</span>
                      <span className="bg-white/20 px-2 py-1 rounded-full">{result.year}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 z-30 text-white hover:text-gray-200" />
        <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 z-30 text-white hover:text-gray-200" />
      </Carousel>
    </div>

    {/* Carousel Dots */}
    <div className="flex justify-center space-x-2 py-4 bg-gray-50">
      {resultImages.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentSlide(index)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            index === currentSlide ? "bg-gray-800 scale-125" : "bg-gray-400 hover:bg-gray-600"
          }`}
        />
      ))}
    </div>
  </div>

  {/* Tagline Below Carousel */}
  <div className="w-full max-w-7xl mt-6 text-center">
    <h2 className="text-2xl md:text-3xl font-bold">
      If <span className="gradient-text">NIMCET</span> is the ऐम, <span className="gradient-text">Acme</span> is the नेम
    </h2>
  </div>
</div>

    </section>
  );
};

export default ResultsSection;
