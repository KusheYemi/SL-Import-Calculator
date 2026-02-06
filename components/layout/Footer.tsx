import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      {/* SL Flag stripe */}
      <div className="sl-flag-gradient h-1" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/logo-64.png"
                alt="SL Import Calculator"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-heading font-bold text-foreground">
                Import Calculator
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Estimate import duties, taxes, and total landed costs for goods
              entering Sierra Leone. Based on the ECOWAS Common External Tariff
              system.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/calculator", label: "Calculator" },
                { href: "/categories", label: "Product Categories" },
                { href: "/about", label: "About & Methodology" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-3">
              Disclaimer
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This tool provides estimates only and should not be used as a
              substitute for official customs assessments. Actual duties may vary
              based on product classification, valuation, and current
              regulations. Consult the National Revenue Authority (NRA) of
              Sierra Leone for official rates.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SL Import Calculator. Not
            affiliated with the Government of Sierra Leone.
          </p>
        </div>
      </div>
    </footer>
  );
}
