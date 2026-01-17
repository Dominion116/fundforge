'use client'

import Link from 'next/link'
import { Twitter, Github, Linkedin, Mail } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="py-12 border-t border-border/40 bg-card/20 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold tracking-tighter">FundForge</span>
            </Link>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Empowering creators and protecting contributors through milestone-based decentralized crowdfunding.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-tight mb-4 uppercase text-foreground/50">Platform</h4>
            <ul className="space-y-3 text-sm text-foreground/70">
              <li><Link href="/explore" className="hover:text-foreground transition-colors">Browse Campaigns</Link></li>
              <li><Link href="/create" className="hover:text-foreground transition-colors">Create Project</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-foreground transition-colors">How it Works</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Staking</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-tight mb-4 uppercase text-foreground/50">Company</h4>
            <ul className="space-y-3 text-sm text-foreground/70">
              <li><Link href="#" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Media Kit</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-tight mb-4 uppercase text-foreground/50">Community</h4>
            <div className="flex gap-4 mb-4">
              <Link href="#" className="size-10 rounded-none bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all">
                <Twitter className="size-5" />
              </Link>
              <Link href="#" className="size-10 rounded-none bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all">
                <Github className="size-5" />
              </Link>
              <Link href="#" className="size-10 rounded-none bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all">
                <Linkedin className="size-5" />
              </Link>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <Mail className="size-4" />
              <span>hello@fundforge.com</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-foreground/50">
          <p>© 2026 FundForge. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
