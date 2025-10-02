import { Users, Award, BookOpen, Target, Heart, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const About = () => {
  const achievements = [
    { icon: Users, label: "Students Selected", value: "1000+" },
    { icon: Award, label: "Success Rate", value: "95%" },
    { icon: BookOpen, label: "Exams Covered", value: "NIMCET, CUET, JMI & more" },
    { icon: Target, label: "Years Experience", value: "10+" }
  ];

  const values = [
    {
      icon: Lightbulb,
      title: "Vision",
      description:
        "To create highly competent MCA professionals by imparting quality education, instilling integrity, and nurturing confidence."
    },
    {
      icon: Heart,
      title: "Mission",
      description:
        "To provide real exam-level guidance, transform average students into achievers, and ensure consistent results through practice and perseverance."
    }
  ];

  const milestones = [
    { year: "2015", event: "Academy Founded", description: "Started under the guidance of Kartikey Pandey (NIT Raipur, Ph.D. Scholar)" },
    { year: "2018", event: "Nationwide Reach", description: "Became preferred choice for MCA aspirants across India" },
    { year: "2022", event: "1000+ Selections", description: "Students selected in NITs, DU, JNU, BHU, JMI, HCU, IET Lucknow & more" }
  ];

  const faculty = [
    {
      name: "Mr. Kartikey Pandey",
      designation: "Director & Mathematics Mentor",
      qualification: "MCA (NIT Raipur), Ph.D. Scholar",
      experience: "10+ Years",
      specialization: "Mathematics & Reasoning",
      image: "KP"
    },
    {
      name: "Mr. Aman Khan",
      designation: "Computer Fundamentals Mentor",
      qualification: "MCA (NIT Raipur), Ph.D. Scholar",
      specialization: "Computer Science & Programming",
      image: "AK"
    },
    {
      name: "Mr. Satish Mishra",
      designation: "English Mentor",
      qualification: "Retd. Group Captain, Indian Air Force",
      specialization: "English & Communication",
      image: "SM"
    },
    {
      name: "Mr. Pritesh Pandey",
      designation: "Logical Reasoning Mentor",
      qualification: "B.E., 5+ Years Teaching Experience",
      specialization: "Reasoning & Problem Solving",
      image: "PP"
    }
  ];

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className="py-30 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            About
            <span className="block text-gray-800">ACME Academy</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            India’s Most Trusted MCA Entrance Academy – empowering aspirants with
            quality education, expert mentors, and proven results.
          </p>
        </div>
      </section>

      {/* Mission & Vision + Achievements */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-6">
                Our
                <span className="text-3xl font-bold text-transparent bg-clip-text drop-shadow-md transition-all duration-500 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"> Vision & Mission</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Our vision is to produce competent MCA professionals who lead with
                knowledge, confidence, and integrity.  
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our mission is to deliver exam-focused guidance, strengthen fundamentals,
                and help every student – whether average or advanced – achieve their MCA dreams.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className="glass text-center hover-glow transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <achievement.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                    <div className="text-2xl font-bold text-foreground mb-1">{achievement.value}</div>
                    <div className="text-sm text-muted-foreground">{achievement.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Our Core
              <span className="text-3xl font-bold text-transparent bg-clip-text drop-shadow-md transition-all duration-500 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"> Values</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="glass hover-glow transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <value.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="gradient-text">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Our
              <span className="text-3xl font-bold text-transparent bg-clip-text drop-shadow-md transition-all duration-500 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"> Journey</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Key milestones of our growth and success
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary to-accent"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
                  <Card className={`glass w-full max-w-md hover-glow transition-all duration-300 hover:scale-105 ${index % 2 === 0 ? "mr-8" : "ml-8"}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="border-primary/20">{milestone.year}</Badge>
                        <div className="w-4 h-4 bg-primary rounded-full "></div>
                      </div>
                      <CardTitle className="text-xl font-bold text-transparent bg-clip-text drop-shadow-md transition-all duration-500 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">{milestone.event}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Faculty */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Expert
              <span className="text-3xl font-bold text-transparent bg-clip-text drop-shadow-md transition-all duration-500 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"> Faculty</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Learn from experienced mentors and professionals
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {faculty.map((member, index) => (
              <Card key={index} className="glass hover-glow transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground text-2xl font-bold">
                    {member.image}
                  </div>
                  <h3 className="font-heading font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary font-medium mb-2">{member.designation}</p>
                  <p className="text-xs text-muted-foreground mb-2">{member.qualification}</p>
                  {member.experience && (
                    <Badge variant="secondary" className="mb-3 text-xs">{member.experience}</Badge>
                  )}
                  <p className="text-xs text-muted-foreground">{member.specialization}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="glass p-8">
            <CardContent className="p-0">
              <h3 className="text-2xl font-heading font-bold mb-4">
                Join Our
                <span className="text-2xl font-bold text-transparent bg-clip-text drop-shadow-md transition-all duration-500 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"> Success Story</span>
              </h3>
              <p className="text-muted-foreground mb-6">
                Become part of ACME Academy’s legacy of excellence and achieve your MCA dreams
                with proven methodology and expert guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="hover-glow">
                  Start Your Journey
                </Button>
                <Button size="lg" variant="outline">
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;
