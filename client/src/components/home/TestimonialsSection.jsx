import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Priya Sharma",
      exam: "NIMCET 2024",
      rank: "AIR 23",
      image: "PS",
      rating: 5,
      testimonial:
        "ACME Academy's comprehensive study material and expert guidance helped me crack NIMCET with a top rank. The mock tests were exactly like the real exam pattern.",
      college: "NIT Trichy",
    },
    {
      name: "Rahul Kumar",
      exam: "CUET-PG MCA 2024",
      rank: "AIR 15",
      image: "RK",
      rating: 5,
      testimonial:
        "The faculty at ACME Academy are amazing! Their personalized attention and doubt-clearing sessions made all the difference in my preparation journey.",
      college: "JNU Delhi",
    },
    {
      name: "Ananya Gupta",
      exam: "MAH-CET MCA 2024",
      rank: "AIR 8",
      image: "AG",
      rating: 5,
      testimonial:
        "I'm grateful to ACME Academy for helping me achieve my dream. The structured approach and regular assessments kept me motivated throughout my preparation.",
      college: "VJTI Mumbai",
    },
    {
      name: "Vikash Singh",
      exam: "JMI MCA 2024",
      rank: "AIR 12",
      image: "VS",
      rating: 5,
      testimonial:
        "The previous year question papers and detailed solutions provided by ACME Academy were instrumental in my success. Highly recommended!",
      college: "Jamia Millia Islamia",
    },
    {
      name: "Sneha Patel",
      exam: "BIT MCA 2024",
      rank: "AIR 5",
      image: "SP",
      rating: 5,
      testimonial:
        "ACME Academy's online platform made learning flexible and effective. The video lectures and interactive sessions were top-notch.",
      college: "BIT Mesra",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-20 bg-muted/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Success Stories from Our
            <span className="gradient-text"> Toppers</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from our successful students who achieved their MCA dreams with
            ACME Academy's expert guidance
          </p>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="relative max-w-4xl mx-auto">
          <Card className="glass p-8 hover-glow overflow-hidden">
            <CardContent className="p-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="text-center mb-8"
                >
                  <Quote className="h-12 w-12 text-primary mx-auto mb-6 opacity-20" />
                  <blockquote className="text-xl md:text-2xl leading-relaxed text-foreground mb-6 font-medium">
                    "{testimonials[currentIndex].testimonial}"
                  </blockquote>

                  {/* Rating */}
                  <motion.div
                    className="flex justify-center mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </motion.div>

                  {/* Student Info */}
                  <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Avatar className="h-16 w-16 mb-4 ring-4 ring-primary/20">
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                        {testimonials[currentIndex].image}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="text-xl font-semibold text-foreground mb-1">
                      {testimonials[currentIndex].name}
                    </h4>
                    <div className="flex flex-col sm:flex-row items-center gap-2 text-muted-foreground">
                      <span className="bg-primary/10 px-3 py-1 rounded-full text-sm font-medium">
                        {testimonials[currentIndex].rank}
                      </span>
                      <span>•</span>
                      <span>{testimonials[currentIndex].exam}</span>
                      <span>•</span>
                      <span className="text-primary font-medium">
                        {testimonials[currentIndex].college}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 glass hover-glow"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 glass hover-glow"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-primary scale-125"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 1.2 }}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>

        {/* Additional Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="glass hover-glow transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <Avatar className="h-12 w-12 mx-auto mb-4">
                    <AvatarFallback className="bg-accent text-accent-foreground">
                      {testimonial.image}
                    </AvatarFallback>
                  </Avatar>
                  <h4 className="font-semibold mb-1">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {testimonial.rank} • {testimonial.exam}
                  </p>
                  <div className="flex justify-center mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {testimonial.testimonial}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
