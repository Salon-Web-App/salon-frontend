import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-gradient-to-br from-charcoal to-[#1a1a1a] text-white relative overflow-hidden"
    >
      <div className="container-app py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold gold-gradient-text mb-4">Makeup Studio</h3>
            <p className="text-white/70 leading-relaxed">
              Where elegance meets expertise. Book your appointment online in minutes.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-white/70 text-sm">
              <li>
                <Link href="/" className="hover:text-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#booking" className="hover:text-gold transition-colors">
                  Book Now
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-gold transition-colors">
                  My Booking
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-gold transition-colors">
                  Reviews
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-white/70">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <span>Your studio address here</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                <span>Your phone number</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                <span>Your email here</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <div>Mon-Sat: 9:00 AM - 8:00 PM</div>
                  <div>Sunday: Closed</div>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Follow Us</h4>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-white/5 hover:bg-gold rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/5 hover:bg-gold rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 text-white/60 text-sm">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} Makeup Studio. Made with</span>
            <Heart className="w-4 h-4 text-gold fill-gold" />
          </div>
        </div>
      </div>
    </footer>
  );
}
