import { useState } from "react";
import { MapPin, Phone, Mail, Send, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    center: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const quickContacts = [
    {
      icon: Phone,
      title: "Call Us",
      primary: "+91 8109977628",
      secondary: "+91 9516001679",
      action: "tel:+918109977628"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      primary: "Quick Support",
      secondary: "Instant Reply",
      action: "https://wa.me/918109977628"
    },
    {
      icon: Mail,
      title: "Email Us",
      primary: "info@acmeacademy.com",
      secondary: "support@acmeacademy.com",
      action: "mailto:info@acmeacademy.com"
    }
  ];

  const centers = [
    {
      name: "Raipur Center",
      address: "ACME Building, behind Kota Stadium, Kota, Raipur, Chhattisgarh 492010",
      map: "https://maps.app.goo.gl/Y55gth8JRU9TUKVD7",
      phone: "+91 8109977628"
    },
    {
      name: "Kanpur Center",
      address: "Geeta Nagar, Kanpur",
      map: "https://maps.app.goo.gl/RFvRVBkKAmFmAqiq8",
      phone: "+91 9516001679"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
     
      <section className="py-30 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Get In
            <span className="block gradient-text">Touch</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Have questions about our courses or need guidance for your MCA preparation? We're here to help!
          </p>
        </div>
      </section>

      {/* Quick Contact Options */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {quickContacts.map((contact, index) => (
              <Card key={index} className="glass hover-glow transition-all duration-300 hover:scale-105 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <contact.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-heading font-semibold mb-2">{contact.title}</h3>
                  <p className="text-sm text-foreground font-medium">{contact.primary}</p>
                  <p className="text-xs text-muted-foreground">{contact.secondary}</p>
                  <Button 
                    className="mt-4 w-full" 
                    variant="outline"
                    onClick={() => window.open(contact.action, '_blank')}
                  >
                    Contact Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Centers */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="gradient-text">Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="Your phone number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="center">Preferred Center</Label>
                      <Select onValueChange={(value) => handleInputChange("center", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select center" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="raipur">Raipur Center</SelectItem>
                          <SelectItem value="kanpur">Kanpur Center</SelectItem>
                          <SelectItem value="online">Online Classes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select onValueChange={(value) => handleInputChange("subject", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="What can we help you with?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="course-inquiry">Course Inquiry</SelectItem>
                        <SelectItem value="admission">Admission Process</SelectItem>
                        <SelectItem value="fees">Fee Structure</SelectItem>
                        <SelectItem value="schedule">Class Schedule</SelectItem>
                        <SelectItem value="exam-dates">Exam Dates</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your query in detail..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full hover-glow">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Centers Cards */}
            <div className="space-y-6">
              {centers.map((center, index) => (
                <Card key={index} className="glass hover-glow transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="gradient-hero flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>{center.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <a
                      href={center.map}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start space-x-2 hover:text-primary transition-colors"
                    >
                      <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-base text-muted-foreground">{center.address}</p>
                    </a>
                    <a
                      href={`tel:${center.phone}`}
                      className="flex items-center space-x-2 hover:text-primary transition-colors"
                    >
                      <Phone className="h-5 w-5 text-primary" />
                      <p className="text-base text-muted-foreground">{center.phone}</p>
                    </a>
                    <a
                      href="mailto:info@acmeacademy.com"
                      className="flex items-center space-x-2 hover:text-primary transition-colors"
                    >
                      <Mail className="h-5 w-5 text-primary" />
                      <p className="text-base text-muted-foreground">info@acmeacademy.com</p>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
