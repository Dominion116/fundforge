'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { BackgroundPattern } from "@/components/background-pattern";
import Link from "next/link";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";

export default function Hero() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <BackgroundPattern />

      <div className="relative z-10 text-center max-w-3xl">
        <Badge
          variant="secondary"
          className="rounded-none py-1 border-border"
          asChild
        >
          <Link href="#">
            ✦ Deployed on Base Mainnet <ArrowRight className="ml-1 size-4" />
          </Link>
        </Badge>
        <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-5xl md:leading-[1.2] font-semibold tracking-tighter">
          Decentralized Crowdfunding with Milestone-Based Accountability
        </h1>
        <p className="mt-4 text-base text-foreground/80 max-w-2xl mx-auto">
          Fund projects with confidence. Contributors vote on milestone completion before funds are released. 
          Built on blockchain for transparency and trust.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="rounded-none text-base px-8 group">
            Start a Campaign <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <ConnectWalletButton size="lg" className="px-8 text-base" />
        </div>
      </div>
    </div>
  );
}
