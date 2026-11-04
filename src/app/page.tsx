import Link from 'next/link'
import { Dumbbell, Users, Trophy, MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#171717]/90 backdrop-blur-sm z-50 border-b border-[#333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-[#f59e0b]" />
              <span className="text-2xl font-bold">THE LIONS</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="hover:text-[#f59e0b] transition-colors">About</a>
              <a href="#membership" className="hover:text-[#f59e0b] transition-colors">Membership</a>
              <a href="#trainers" className="hover:text-[#f59e0b] transition-colors">Trainers</a>
              <a href="#contact" className="hover:text-[#f59e0b] transition-colors">Contact</a>
            </div>
            <Link
              href="/admin/login"
              className="bg-[#f59e0b] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#d97706] transition-colors"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-[#171717] to-[#0f0f0f]"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#f59e0b]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#dc2626]/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#f59e0b] to-[#dc2626] bg-clip-text text-transparent">
              UNLEASH YOUR INNER BEAST
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your body, elevate your mind, and become the strongest version of yourself at The Lions Gym.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="admin/members"
                className="bg-[#f59e0b] text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#d97706] transition-all transform hover:scale-105"
              >
                Join Now
              </a>
              <a
                href="#about"
                className="border-2 border-[#f59e0b] text-[#f59e0b] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#f59e0b] hover:text-black transition-all"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#171717]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            About <span className="text-[#f59e0b]">The Lions</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-300 mb-6">
                Founded in 2020, The Lions Gym has been transforming lives through fitness excellence. Our mission is to provide a premium, high-performance environment where athletes of all levels can achieve their goals.
              </p>
              <p className="text-lg text-gray-300 mb-6">
                With state-of-the-art equipment, world-class trainers, and a community that pushes you to be your best, we're more than just a gym – we're a family of champions.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#0f0f0f] p-6 rounded-xl border border-[#333] hover:border-[#f59e0b] transition-colors">
                <Users className="h-10 w-10 text-[#f59e0b] mb-4" />
                <h3 className="text-3xl font-bold mb-2">500+</h3>
                <p className="text-gray-400">Active Members</p>
              </div>
              <div className="bg-[#0f0f0f] p-6 rounded-xl border border-[#333] hover:border-[#f59e0b] transition-colors">
                <Trophy className="h-10 w-10 text-[#f59e0b] mb-4" />
                <h3 className="text-3xl font-bold mb-2">15+</h3>
                <p className="text-gray-400">Expert Trainers</p>
              </div>
              <div className="bg-[#0f0f0f] p-6 rounded-xl border border-[#333] hover:border-[#f59e0b] transition-colors">
                <Dumbbell className="h-10 w-10 text-[#f59e0b] mb-4" />
                <h3 className="text-3xl font-bold mb-2">100+</h3>
                <p className="text-gray-400">Equipment</p>
              </div>
              <div className="bg-[#0f0f0f] p-6 rounded-xl border border-[#333] hover:border-[#f59e0b] transition-colors">
                <Trophy className="h-10 w-10 text-[#f59e0b] mb-4" />
                <h3 className="text-3xl font-bold mb-2">5★</h3>
                <p className="text-gray-400">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Plans */}
   

      {/* Trainers Section */}
      <section id="trainers" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#171717]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            Our <span className="text-[#f59e0b]">Trainers</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Mike Johnson', specialty: 'Strength Training', experience: '10 years' },
              { name: 'Sarah Williams', specialty: 'Yoga & Pilates', experience: '8 years' },
              { name: 'David Chen', specialty: 'HIIT & Cardio', experience: '6 years' }
            ].map((trainer, index) => (
              <div key={index} className="bg-[#0f0f0f] p-6 rounded-xl border border-[#333] hover:border-[#f59e0b] transition-all group">
                <div className="w-full h-48 bg-gradient-to-br from-[#333] to-[#171717] rounded-lg mb-4 flex items-center justify-center group-hover:from-[#f59e0b]/20 group-hover:to-[#dc2626]/20 transition-all">
                  <Users className="h-16 w-16 text-[#f59e0b]" />
                </div>
                <h3 className="text-xl font-bold mb-2">{trainer.name}</h3>
                <p className="text-[#f59e0b] mb-2">{trainer.specialty}</p>
                <p className="text-gray-400">{trainer.experience} experience</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            Contact <span className="text-[#f59e0b]">Us</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-[#f59e0b] mt-1" />
                <div>
                  <h3 className="font-bold mb-1">Location</h3>
                  <p className="text-gray-400">123 Fitness Street, Gym City, GC 12345</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-[#f59e0b] mt-1" />
                <div>
                  <h3 className="font-bold mb-1">Phone</h3>
                  <p className="text-gray-400">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-[#f59e0b] mt-1" />
                <div>
                  <h3 className="font-bold mb-1">Email</h3>
                  <p className="text-gray-400">info@thelions.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-[#f59e0b] mt-1" />
                <div>
                  <h3 className="font-bold mb-1">Working Hours</h3>
                  <p className="text-gray-400">Mon - Fri: 5:00 AM - 11:00 PM</p>
                  <p className="text-gray-400">Sat - Sun: 6:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>
            <div className="bg-[#171717] p-6 rounded-xl border border-[#333]">
              <div className="w-full h-64 bg-[#0f0f0f] rounded-lg flex items-center justify-center">
                <MapPin className="h-12 w-12 text-[#f59e0b]" />
                <span className="ml-2 text-gray-400">Interactive Map</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#171717] py-8 px-4 sm:px-6 lg:px-8 border-t border-[#333]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Dumbbell className="h-6 w-6 text-[#f59e0b]" />
            <span className="text-xl font-bold">THE LIONS</span>
          </div>
          <p className="text-gray-400">&copy; 2024 The Lions Gym. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
