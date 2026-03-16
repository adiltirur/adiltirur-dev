import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main>
      {/* Header */}
      <div className="py-[72px] pb-12 max-w-[680px] mx-auto px-4 sm:px-6">
        <p className="font-mono text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-4 flex items-center gap-2">
          <span className="inline-block w-5 h-px bg-blue-600 dark:bg-blue-400" />
          privacy policy
        </p>
        <h1 className="text-[clamp(28px,5vw,40px)] font-semibold tracking-tight leading-[1.15] mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: March 2026 · Applies to adiltirur.dev and all software published by Adil Chakkala Paramba.
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
              { href: "#website", label: "This Website" },
              { href: "#packages", label: "Open Source Packages" },
              { href: "#bots", label: "Bots & Automated Tools" },
              { href: "#cookies", label: "Cookies" },
              { href: "#children", label: "Children's Privacy" },
              { href: "#changes", label: "Changes to This Policy" },
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

        {/* Section 1 */}
        <section id="website" className="py-12 border-t border-border">
          <p className="font-mono text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-4">
            01 // this website
          </p>
          <h2 className="text-[22px] font-semibold tracking-tight mb-5">This Website (adiltirur.dev)</h2>
          <div className="border-l-[3px] border-blue-600 bg-blue-50 dark:bg-blue-950/30 rounded-r-lg py-3.5 px-4 mb-5">
            <p className="text-sm text-blue-800 dark:text-blue-300 !mb-0">
              <strong>Short version:</strong> This is a static personal website. I don&apos;t collect, store, or track any personal data.
            </p>
          </div>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            adiltirur.dev is a static personal portfolio site. I do not operate any servers that collect or store personal data. I do not run analytics scripts, tracking pixels, or advertising of any kind on this site.
          </p>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            If you contact me via email at{" "}
            <a href="mailto:adiltirur@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">adiltirur@gmail.com</a>,
            your message is handled by Google (Gmail) and is subject to{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">Google&apos;s Privacy Policy</a>.
          </p>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            Links to third-party platforms (GitHub, LinkedIn, Medium, pub.dev) are governed by their respective privacy policies. I have no control over data those platforms collect.
          </p>
        </section>

        {/* Section 2 */}
        <section id="packages" className="py-12 border-t border-border">
          <p className="font-mono text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-4">
            02 // open source packages
          </p>
          <h2 className="text-[22px] font-semibold tracking-tight mb-5">Open Source Packages</h2>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            Packages published on{" "}
            <a href="https://pub.dev/publishers/adiltirur.dev/packages" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">pub.dev</a>
            {" "}and repositories on{" "}
            <a href="https://github.com/adiltirur" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">GitHub</a>
            {" "}do not, by design, collect any personal data.
          </p>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            If a package makes network requests or interacts with external services, this will be clearly documented in that package&apos;s README and changelog. You should audit any third-party package — including mine — before deploying it in a production environment that handles personal data.
          </p>
        </section>

        {/* Section 3 */}
        <section id="bots" className="py-12 border-t border-border">
          <p className="font-mono text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-4">
            03 // bots &amp; automated tools
          </p>
          <h2 className="text-[22px] font-semibold tracking-tight mb-5">Bots &amp; Automated Tools</h2>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            Any bot or automated tool I publish (including but not limited to Microsoft Teams bots and messaging platform integrations) does not intentionally send data to external servers unless explicitly stated in that project&apos;s documentation.
          </p>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            <strong className="text-foreground font-medium">You, as the operator deploying the bot, are the data controller</strong> for any data processed in your environment. I am not a data processor or sub-processor in your deployment. It is your responsibility to ensure compliance with applicable data protection laws (e.g., GDPR) for any personal data that flows through a bot you deploy.
          </p>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            Please review the source code of any bot before deployment to fully understand its data handling behaviour.
          </p>
        </section>

        {/* Section 4 */}
        <section id="cookies" className="py-12 border-t border-border">
          <p className="font-mono text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-4">
            04 // cookies
          </p>
          <h2 className="text-[22px] font-semibold tracking-tight mb-5">Cookies</h2>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            adiltirur.dev does not use cookies, local storage, or any other form of client-side tracking technology.
          </p>
        </section>

        {/* Section 5 */}
        <section id="children" className="py-12 border-t border-border">
          <p className="font-mono text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-4">
            05 // children&apos;s privacy
          </p>
          <h2 className="text-[22px] font-semibold tracking-tight mb-5">Children&apos;s Privacy</h2>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            This Website and associated software are not directed at children under the age of 13. I do not knowingly collect personal information from children. If you believe a child has provided personal information in connection with this site or my software, please contact me and I will take steps to delete it.
          </p>
        </section>

        {/* Section 6 */}
        <section id="changes" className="py-12 border-t border-border">
          <p className="font-mono text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-4">
            06 // changes
          </p>
          <h2 className="text-[22px] font-semibold tracking-tight mb-5">Changes to This Policy</h2>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            I may update this Privacy Policy from time to time. The &quot;last updated&quot; date at the top of this page will reflect the most recent revision. Continued use of this Website or my software after changes are posted constitutes acknowledgement of the updated policy.
          </p>
        </section>

        {/* Section 7 */}
        <section id="contact" className="py-12 border-t border-border">
          <p className="font-mono text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-4">
            07 // contact
          </p>
          <h2 className="text-[22px] font-semibold tracking-tight mb-5">Questions?</h2>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            If you have any questions about this Privacy Policy, please contact me:
          </p>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            <strong className="text-foreground font-medium">Adil Chakkala Paramba</strong><br />
            <a href="mailto:adiltirur@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">adiltirur@gmail.com</a><br />
            Munich, Germany
          </p>
          <p className="text-[15px] text-gray-700 dark:text-muted-foreground leading-[1.8] mb-3.5">
            Also see:{" "}
            <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
              Terms of Use →
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
            <Link href="/terms" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
            <a href="mailto:adiltirur@gmail.com" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Email</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
