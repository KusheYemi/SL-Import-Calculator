import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { BookOpen, Scale, Globe, Receipt, FileText, AlertTriangle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-forest" />
          About & Methodology
        </h1>
        <p className="mt-2 text-muted-foreground">
          Understanding how import duties and taxes are calculated in Sierra
          Leone.
        </p>
      </div>

      <div className="space-y-8">
        {/* How Import Duties Work */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Scale className="h-5 w-5 text-forest" />
              How Import Duties Work
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-muted-foreground">
            <p>
              When goods enter Sierra Leone, the National Revenue Authority (NRA)
              assesses several duties and taxes based on the{" "}
              <strong className="text-foreground">
                Cost, Insurance, and Freight (CIF) value
              </strong>{" "}
              of the goods. The CIF value is calculated as:
            </p>
            <div className="my-4 rounded-lg bg-muted/50 p-4 font-mono text-sm text-foreground">
              CIF = FOB Price + Shipping Cost + Insurance Cost
            </div>
            <p>
              All duties and taxes are then calculated based on this CIF value,
              with each component having its own rate and calculation method.
            </p>
          </CardContent>
        </Card>

        {/* ECOWAS CET System */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Globe className="h-5 w-5 text-forest" />
              ECOWAS Common External Tariff (CET) System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Sierra Leone, as a member of the Economic Community of West African
              States (ECOWAS), applies the{" "}
              <strong className="text-foreground">
                Common External Tariff (CET)
              </strong>{" "}
              — a 5-band tariff structure adopted by all 15 ECOWAS member states
              to harmonize trade policy across the region.
            </p>

            <div className="space-y-3">
              {[
                {
                  band: "Band 0 (0%)",
                  desc: "Essential social goods — medicines, medical equipment, solar panels, agricultural inputs",
                  color: "#22c55e",
                },
                {
                  band: "Band 1 (5%)",
                  desc: "Essential goods and raw materials — basic food staples, machinery, agricultural equipment",
                  color: "#3b82f6",
                },
                {
                  band: "Band 2 (10%)",
                  desc: "Intermediate goods — petroleum products, paper, generators, industrial electronics",
                  color: "#f59e0b",
                },
                {
                  band: "Band 3 (20%)",
                  desc: "Final consumer goods — clothing, furniture, cosmetics, processed food, consumer electronics",
                  color: "#f97316",
                },
                {
                  band: "Band 4 (35%)",
                  desc: "Specific goods for economic development — passenger vehicles and other protected products",
                  color: "#ef4444",
                },
              ].map((item) => (
                <div
                  key={item.band}
                  className="flex items-start gap-3 rounded-lg border border-border p-3"
                >
                  <div
                    className="mt-0.5 h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <p className="font-semibold text-foreground">{item.band}</p>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tax Components */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Receipt className="h-5 w-5 text-forest" />
              Tax Components Explained
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  Import Duty (CET Rate)
                </h4>
                <p>
                  The primary duty based on the CET band classification.
                  Calculated as CIF × CET rate (0%, 5%, 10%, 20%, or 35%).
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  ECOWAS Community Levy (0.5%)
                </h4>
                <p>
                  A 0.5% levy on CIF value charged on imports from non-ECOWAS
                  countries. This levy funds the ECOWAS Commission and is waived
                  for goods originating from ECOWAS member states with valid
                  certificates of origin.
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  Goods and Services Tax — GST (15%)
                </h4>
                <p>
                  Sierra Leone applies a 15% GST on most imported goods.
                  Calculated on (CIF + Import Duty + Excise Duty). Essential
                  goods including basic food staples, medical equipment,
                  pharmaceuticals, agricultural inputs, and solar equipment are
                  exempt.
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  Excise Duty (varies)
                </h4>
                <p>
                  Additional taxes on specific goods: alcoholic beverages (30%),
                  tobacco products (35%), and petroleum products (10%). Applied
                  to the CIF value.
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                  Customs Processing Fee (1.5%)
                  <Badge variant="outline" className="text-[10px]">
                    Estimated
                  </Badge>
                </h4>
                <p>
                  A fee charged for processing the import declaration. The exact
                  rate may vary; 1.5% is used as a standard estimate.
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                  CISS Fee (1%)
                  <Badge variant="outline" className="text-[10px]">
                    Estimated
                  </Badge>
                </h4>
                <p>
                  Comprehensive Import Supervision Scheme fee for pre-shipment
                  inspection and verification of imports.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GST Exemptions */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <FileText className="h-5 w-5 text-forest" />
              GST Exemptions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-3">
              The following categories are exempt from the 15% GST in our
              calculations, based on Sierra Leone&apos;s tax regulations:
            </p>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>Basic food staples (rice, sugar, cooking oil, flour)</li>
              <li>Medical equipment and devices</li>
              <li>Pharmaceuticals and medicines</li>
              <li>Agricultural inputs (seeds, fertilizers, equipment)</li>
              <li>Solar and renewable energy equipment</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-forest" />
              Data Sources & References
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                ECOWAS Common External Tariff (CET) — Official 5-band tariff
                schedule
              </li>
              <li>
                Sierra Leone National Revenue Authority (NRA) — Customs
                regulations and duty rates
              </li>
              <li>
                Sierra Leone Finance Acts 2024/2025 — Latest tax amendments and
                rates
              </li>
              <li>
                World Customs Organization (WCO) — Harmonized System (HS) code
                classifications
              </li>
              <li>
                ECOWAS Trade Liberalization Scheme (ETLS) — Rules of origin for
                intra-ECOWAS trade
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Full Disclaimers */}
        <div className="space-y-4">
          <DisclaimerBanner />

          <Card className="border-destructive/20">
            <CardContent className="pt-5">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground space-y-2">
                  <p className="font-medium text-foreground">
                    Important Disclaimers
                  </p>
                  <ul className="space-y-1.5 list-disc list-inside">
                    <li>
                      This tool is not affiliated with or endorsed by the
                      Government of Sierra Leone or the National Revenue
                      Authority.
                    </li>
                    <li>
                      Actual import costs may differ based on specific HS code
                      classification, customs valuation, exemptions, and current
                      regulations.
                    </li>
                    <li>
                      Processing fees and CISS rates are estimates and may vary.
                    </li>
                    <li>
                      Petroleum product duty rates vary significantly by specific
                      product type.
                    </li>
                    <li>
                      Exchange rates used are indicative only and may not reflect
                      the rate used by customs at the time of import.
                    </li>
                    <li>
                      Always consult a licensed customs broker or the NRA for
                      official assessments before making import decisions.
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
