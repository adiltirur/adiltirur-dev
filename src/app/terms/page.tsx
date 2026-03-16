import Link from "next/link";

export default function TermsPage() {
  return (
    <main>
      {/* Header */}
      <div className="py-[72px] pb-12 max-w-[680px] mx-auto px-4 sm:px-6">
        <p className="font-mono text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-4 flex items-center gap-2">
          <span className="inline-block w-5 h-px bg-blue-600 dark:bg-blue-400" />
          terms of use
        </p>
        <h1 className="text-[clamp(28px,5vw,40px)] font-semibold tracking-tight leading-[1.15] mb-3">
          Terms of Use
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: March 2026 · Applies to adiltirur.dev, open source packages, bots, and all software published by Adil Chakkala Paramba.
        </p>
      </div>

      <div className="max-w-[680px] mx-auto px-4 sm:px-6 pb-16">
        {/* Table of Contents */}
        <div className="bg-muted border border-border rounded-[10px] p-5 sm:px-6 mb-14">
          <p className="font-mono text-[11px] text-muted-foreground tracking-widest uppercase mb-2.5">
            {"// contents"}
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            {[
              { href: "#general", label: "General Terms" },
              { href: "#oss", label: "Open Source Software" },
              { href: "#bots", label: "Bots & Automated Tools" },
              { href: "#liability", label: "Limitation of Liability" },
              { href: "#governing", label: "Governing Law" },
              { href: "#contact", label: "Contact" },
            ].map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Section 1: General Terms */}
        <section id="general" className="py-12 border-t border-border">
          <p className="font-mono text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-4">
            01 // general terms
          </p>
          <h2 className="text-[22px] font-semibold tracking-tight mb-5">General Terms</h2>
          <div className="border-l-[3px] border-blue-600 bg-blue-50 dark:bg-blue-950/30 rounded-r-lg py-3.5 px-4 mb-5">
            <p className="text-sm text-blue-800 dark:text-blue-300 !mb-0">
              <strong>Plain English:</strong> Use this site and my software freely. Don&apos;t do anything illegal with them, and don&apos;t hold me responsible if something goes wrong.
            </p>
          </div>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            By accessing adiltirur.dev (the &quot;Website&quot;) or using any software, packages, bots, or tools published by{" "}
            <strong className="text-foreground font-medium">Adil Chakkala Paramba</strong> (&quot;I&quot;, &quot;me&quot;, &quot;my&quot;), you agree to these Terms. If you do not agree, please do not use them.
          </p>

          <h3 className="text-[15px] font-semibold mt-6 mb-2.5">Permitted Use</h3>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            You may use this Website and associated software for lawful purposes only. You agree not to use them in any way that violates applicable laws or regulations, infringes the rights of others, or could harm, disable, or overburden any system or service.
          </p>

          <h3 className="text-[15px] font-semibold mt-6 mb-2.5">Intellectual Property</h3>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            The content on this Website — including text, design, and code — is owned by me unless otherwise stated. Open source packages are separately licensed under their respective licenses (typically MIT). Refer to the individual repository for the applicable license.
          </p>

          <h3 className="text-[15px] font-semibold mt-6 mb-2.5">No Warranty</h3>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            This Website and all associated software are provided{" "}
            <strong className="text-foreground font-medium">&quot;as is&quot;</strong> and{" "}
            <strong className="text-foreground font-medium">&quot;as available&quot;</strong>, without warranty of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, accuracy, or non-infringement.
          </p>

          <h3 className="text-[15px] font-semibold mt-6 mb-2.5">Links to Third Parties</h3>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            This Website contains links to external sites (GitHub, LinkedIn, Medium, pub.dev, etc.). I have no control over the content or practices of those sites and accept no responsibility for them.
          </p>

          <h3 className="text-[15px] font-semibold mt-6 mb-2.5">Changes to These Terms</h3>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            I may update these Terms at any time. The &quot;last updated&quot; date at the top of this page reflects the most recent revision. Continued use of the Website or software after changes are posted constitutes acceptance of the updated Terms.
          </p>
        </section>

        {/* Section 2: Open Source Software */}
        <section id="oss" className="py-12 border-t border-border">
          <p className="font-mono text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-4">
            02 // open source software
          </p>
          <h2 className="text-[22px] font-semibold tracking-tight mb-5">Open Source Software</h2>
          <div className="border-l-[3px] border-amber-500 bg-amber-50 dark:bg-amber-950/30 rounded-r-lg py-3.5 px-4 mb-5">
            <p className="text-sm text-amber-800 dark:text-amber-300 !mb-0">
              <strong>Important:</strong> All open source software is provided with no guarantees. Use it at your own risk. I am not liable for any damage, data loss, or issues arising from its use in any environment.
            </p>
          </div>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            All packages published on{" "}
            <a href="https://pub.dev/publishers/adiltirur.dev/packages" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">pub.dev</a>
            {" "}and repositories on{" "}
            <a href="https://github.com/adiltirur" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">GitHub</a>
            {" "}are released under the <strong className="text-foreground font-medium">MIT License</strong> unless a specific repository states otherwise.
          </p>

          {/* MIT License Block */}
          <pre className="bg-[#111] text-emerald-200 font-mono text-[13px] leading-[1.7] p-6 rounded-[10px] my-5 whitespace-pre-wrap">{`MIT License

Copyright (c) 2026 Adil Chakkala Paramba

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}</pre>

          <h3 className="text-[15px] font-semibold mt-6 mb-2.5">Versioning &amp; Maintenance</h3>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            Packages are maintained on a best-effort, voluntary basis. There is no guarantee of bug fixes, security patches, or continued development on any particular timeline. Pin specific versions in production and evaluate any package before integrating it into critical systems.
          </p>

          <h3 className="text-[15px] font-semibold mt-6 mb-2.5">Security Vulnerabilities</h3>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            If you discover a security vulnerability in any of my open source packages, please disclose it responsibly by emailing{" "}
            <a href="mailto:adiltirur@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">adiltirur@gmail.com</a>
            {" "}before making it public.
          </p>
        </section>

        {/* Section 3: Bots */}
        <section id="bots" className="py-12 border-t border-border">
          <p className="font-mono text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-4">
            03 // bots &amp; automated tools
          </p>
          <h2 className="text-[22px] font-semibold tracking-tight mb-5">Bots &amp; Automated Tools</h2>
          <div className="border-l-[3px] border-amber-500 bg-amber-50 dark:bg-amber-950/30 rounded-r-lg py-3.5 px-4 mb-5">
            <p className="text-sm text-amber-800 dark:text-amber-300 !mb-0">
              <strong>No responsibility:</strong> I accept no liability whatsoever for any actions taken by or with bots and tools I publish — including messages sent, data processed, or integrations triggered in your environment.
            </p>
          </div>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            Any bots, automation scripts, or platform integrations (including but not limited to{" "}
            <strong className="text-foreground font-medium">Microsoft Teams bots</strong>, Slack apps, or other messaging integrations) published under my name or at adiltirur.dev are independent software projects provided without warranty of any kind.
          </p>

          <h3 className="text-[15px] font-semibold mt-6 mb-2.5">Your Responsibilities as Operator</h3>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            By deploying any bot or automated tool I publish, you accept sole responsibility for:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mb-3.5">
            <li className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.7]">How you configure, deploy, and operate the bot in your environment</li>
            <li className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.7]">Ensuring your deployment complies with the Terms of Service of the platform it runs on (e.g., Microsoft Teams, Slack, Discord)</li>
            <li className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.7]">All messages sent, data transmitted, or actions triggered by the bot under your deployment</li>
            <li className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.7]">Securing all access credentials, API keys, tokens, and secrets used by the bot</li>
            <li className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.7]">Obtaining any necessary consents from end users who interact with the bot</li>
            <li className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.7]">Compliance with applicable data protection laws (e.g., GDPR, CCPA) for any personal data processed</li>
          </ul>

          <h3 className="text-[15px] font-semibold mt-6 mb-2.5">Platform Compliance</h3>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            It is your responsibility to ensure any bot complies with all applicable platform policies. I make no representations that any bot will meet those requirements for your specific use case or deployment.
          </p>

          <h3 className="text-[15px] font-semibold mt-6 mb-2.5">No Support Guarantee</h3>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            Support for bots and automated tools is provided on a best-effort, voluntary basis. There is no SLA, no guaranteed response time, and no obligation to maintain compatibility with future platform updates.
          </p>
        </section>

        {/* Section 4: Liability */}
        <section id="liability" className="py-12 border-t border-border">
          <p className="font-mono text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-4">
            04 // limitation of liability
          </p>
          <h2 className="text-[22px] font-semibold tracking-tight mb-5">Limitation of Liability</h2>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            To the fullest extent permitted by applicable law,{" "}
            <strong className="text-foreground font-medium">Adil Chakkala Paramba shall not be liable</strong> for any direct, indirect, incidental, special, consequential, exemplary, or punitive damages arising out of or in connection with:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mb-3.5">
            <li className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.7]">Your use of, or inability to use, this Website or any software I publish</li>
            <li className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.7]">Any errors, bugs, or inaccuracies in the software</li>
            <li className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.7]">Unauthorised access to or alteration of your data</li>
            <li className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.7]">Any third-party conduct or content linked to from this Website</li>
            <li className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.7]">Any other matter relating to this Website or associated software</li>
          </ul>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            This limitation applies even if I have been advised of the possibility of such damages. Some jurisdictions do not allow the exclusion of certain warranties or the limitation or exclusion of liability for certain damages. In such jurisdictions, my liability is limited to the maximum extent permitted by law.
          </p>
        </section>

        {/* Section 5: Governing Law */}
        <section id="governing" className="py-12 border-t border-border">
          <p className="font-mono text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-4">
            05 // governing law
          </p>
          <h2 className="text-[22px] font-semibold tracking-tight mb-5">Governing Law</h2>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            These Terms are governed by and construed in accordance with the laws of the{" "}
            <strong className="text-foreground font-medium">Federal Republic of Germany</strong>, without regard to conflict-of-law principles. Any disputes arising from these Terms or your use of this Website shall be subject to the exclusive jurisdiction of the competent courts of{" "}
            <strong className="text-foreground font-medium">Munich, Germany</strong>.
          </p>
        </section>

        {/* Section 6: Contact */}
        <section id="contact" className="py-12 border-t border-border">
          <p className="font-mono text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-4">
            06 // contact
          </p>
          <h2 className="text-[22px] font-semibold tracking-tight mb-5">Questions?</h2>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            If you have any questions about these Terms, please contact me:
          </p>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            <strong className="text-foreground font-medium">Adil Chakkala Paramba</strong><br />
            <a href="mailto:adiltirur@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">adiltirur@gmail.com</a><br />
            Munich, Germany
          </p>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            Also see:{" "}
            <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
              Privacy Policy →
            </Link>
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-[680px] mx-auto px-4 sm:px-6 flex justify-between items-center flex-wrap gap-3">
          <span className="font-mono text-xs text-muted-foreground">© 2026 adiltirur.dev</span>
          <div className="flex gap-5 flex-wrap">
            <Link href="/" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link href="/privacy" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <a href="mailto:adiltirur@gmail.com" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Email</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
