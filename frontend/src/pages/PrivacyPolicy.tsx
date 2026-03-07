import BackToHomeHeader from '../components/BackToHomeHeader';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <BackToHomeHeader />

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 py-16 animate-fade-in-up">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
                <p className="text-muted-foreground mb-12">Last updated: March 7, 2026</p>

                <div className="space-y-10 text-[0.9375rem] leading-relaxed text-muted-foreground">
                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">1. Information We Collect</h2>
                        <p>When you use Easy Study, we collect the following information:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Google account profile data (name, email address, profile picture)</li>
                            <li>PDF documents you upload to the platform</li>
                            <li>Questions and interactions with the AI assistant</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
                        <p>We use your information to:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Provide and maintain the Easy Study service</li>
                            <li>Process your documents and generate AI-powered explanations</li>
                            <li>Save your study progress and session history</li>
                            <li>Improve the quality of the service</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">3. Data Storage & Security</h2>
                        <p>
                            Your data is stored securely using Supabase. We implement appropriate security measures to protect your personal information and uploaded documents from unauthorized access.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">4. Third-Party Services</h2>
                        <p>Easy Study uses the following third-party services:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Google OAuth for authentication</li>
                            <li>Supabase for data storage</li>
                            <li>AI language model providers for generating explanations</li>
                        </ul>
                        <p className="mt-2">
                            These services have their own privacy policies, and we encourage you to review them.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">5. Data Retention</h2>
                        <p>
                            Your documents and study data are retained as long as your account is active. You may delete your documents at any time from your dashboard.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">6. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Access your personal data stored on the platform</li>
                            <li>Delete your uploaded documents at any time</li>
                            <li>Request deletion of your account and associated data</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">7. Contact</h2>
                        <p>
                            If you have any questions or concerns about this privacy policy, please contact us at{' '}
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

export default PrivacyPolicy;
