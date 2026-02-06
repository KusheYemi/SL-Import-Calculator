import Link from "next/link";
import {
  Calculator,
  BarChart3,
  Download,
  Globe,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";

const steps = [
  {
    number: "1",
    title: "Choose Category",
    description:
      "Select from 20 product categories based on the ECOWAS Common External Tariff system.",
    icon: Globe,
  },
  {
    number: "2",
    title: "Enter Costs",
    description:
      "Input FOB price, shipping, insurance, and select origin country and currency.",
    icon: Calculator,
  },
  {
    number: "3",
    title: "Get Breakdown",
    description:
      "See detailed cost breakdown with duties, taxes, and total landed cost instantly.",
    icon: BarChart3,
  },
];

const features = [
  {
    icon: Calculator,
    title: "SL-Specific Calculations",
    description:
      "Accurate duty rates based on Sierra Leone's implementation of the ECOWAS CET 5-band tariff system.",
  },
  {
    icon: Globe,
    title: "ECOWAS Origin Detection",
    description:
      "Automatically waives the 0.5% ECOWAS Community Levy for goods originating from member states.",
  },
  {
    icon: Zap,
    title: "No Sign-Up Required",
    description:
      "Use instantly — no account, no login, no data stored. Your calculations stay in your browser.",
  },
  {
    icon: Download,
    title: "Export Your Results",
    description:
      "Download your cost breakdown as a text file, CSV, or print it directly as a PDF.",
  },
  {
    icon: BarChart3,
    title: "Visual Breakdown",
    description:
      "See exactly where your money goes with color-coded stacked bar charts and detailed line items.",
  },
  {
    icon: Shield,
    title: "Transparent Estimates",
    description:
      "Estimated fees are clearly marked. We show you exactly which rates are fixed and which are approximate.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-forest">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-1/2 -right-1/4 h-full w-full rounded-full bg-gold blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 h-3/4 w-3/4 rounded-full bg-sl-green blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="max-w-3xl">
            <div className="sl-flag-gradient mb-6 h-1 w-20 rounded-full" />
            <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Know Your Import Costs{" "}
              <span className="text-gold">Before They Arrive</span>
            </h1>
            <p className="mt-6 text-lg text-white/80 max-w-2xl leading-relaxed">
              Estimate import duties, GST, ECOWAS levies, and total landed costs
              for goods entering Sierra Leone. Powered by the ECOWAS Common
              External Tariff system.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gold hover:bg-gold-light text-forest font-semibold text-base px-8"
              >
                <Link href="/calculator">Start Calculating</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-transparent border-white/30 text-white hover:bg-white/10 text-base px-8"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="mt-3 text-muted-foreground">
            Three simple steps to estimate your import costs
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-forest text-white">
                  <Icon className="h-7 w-7" />
                </div>
                <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gold text-forest text-sm font-bold mb-3">
                  {step.number}
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground">
              Key Features
            </h2>
            <p className="mt-3 text-muted-foreground">
              Built specifically for Sierra Leone&apos;s import ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-border">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-forest/10 text-forest">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <DisclaimerBanner />
      </section>
    </div>
  );
}
