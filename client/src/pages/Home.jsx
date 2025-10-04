import HeroSection from '@/components/home/HeroSection'
import NoticeBoard from '@/components/home/NoticeBoard'
import ResultSection from '@/components/home/ResultSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import React from 'react'

function Home() {
  return (
   <div className="min-h-screen">
    <HeroSection/>

    <ResultSection/>
    <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <TestimonialsSection />
          </div>
          <div className="lg:col-span-1">
            <NoticeBoard/>
          </div>
        </div>
      
   </div>
  )
}

export default Home