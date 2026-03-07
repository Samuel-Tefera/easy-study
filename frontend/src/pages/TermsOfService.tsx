import BackToHomeHeader from '../components/BackToHomeHeader';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <BackToHomeHeader />

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 py-16 animate-fade-in-up">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Terms of Service</h1>
                <p className="text-muted-foreground mb-12">Last updated: March 7, 2026</p>

                <div className="space-y-10 text-[0.9375rem] leading-relaxed text-muted-foreground">
                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using Easy Study, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">2. Description of Service</h2>
                        <p>
                            Easy Study is an AI-powered document tutor that allows you to upload PDF files, read them in a study workspace, and interact with an AI assistant for explanations, summaries, and learning support.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">3. User Accounts</h2>
                        <p>
                            You must sign in with a Google account to use Easy Study. You are responsible for maintaining the security of your account. Each person should maintain only one account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">4. Acceptable Use</h2>
                        <p>You agree not to:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Upload illegal, harmful, or copyrighted content you do not have rights to</li>
                            <li>Abuse, exploit, or misuse the AI features</li>
                            <li>Attempt to access other users' data or accounts</li>
                            <li>Use automated tools to scrape or overload the service</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">5. Intellectual Property</h2>
                        <p>
                            You retain full ownership of any documents you upload. Easy Study and its branding, design, and code are the property of Easy Study. The source code is available on{' '}
                            <a
                                href="https://github.com/Samuel-Tefera/easy-study"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                GitHub
                            </a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">6. AI-Generated Content</h2>
                        <p>
                            AI responses provided by Easy Study are for educational purposes only. They may not always be accurate or complete. You should not rely on AI-generated content as a sole source of information for critical decisions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">7. Limitation of Liability</h2>
                        <p>
                            Easy Study is provided "as is" without warranties of any kind. We are not liable for any data loss, service interruptions, or inaccuracies in AI-generated content.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">8. Termination</h2>
                        <p>
                            We reserve the right to suspend or terminate accounts that violate these terms, without prior notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">9. Changes to Terms</h2>
                        <p>
                            We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the updated terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">10. Contact</h2>
                        <p>
                            If you have any questions about these terms, please contact us at{' '}
                            <a href="mailto:samuelteferab@gmail.com" className="text-primary hover:underline">
                                samuelteferab@gmail.com
                            </a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
