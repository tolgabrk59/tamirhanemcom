import Hero from '@/components/home/Hero'
import Categories from '@/components/home/Categories'
import VehicleGuide from '@/components/home/VehicleGuide'
import AIRecommendation from '@/components/home/AIRecommendation'
import CommonProblems from '@/components/home/CommonProblems'
import ObdInfo from '@/components/home/ObdInfo'
import HowItWorks from '@/components/home/HowItWorks'
import Benefits from '@/components/home/Benefits'
import Stats from '@/components/home/Stats'
import Testimonials from '@/components/home/Testimonials'
import CTA from '@/components/home/CTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <VehicleGuide />
      <AIRecommendation />
      <CommonProblems />
      <ObdInfo />
      <HowItWorks />
      <Benefits />
      <Stats />
      <Testimonials />
      <CTA />
    </>
  )
}
