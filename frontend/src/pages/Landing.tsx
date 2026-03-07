import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, BrainCircuit, LineChart, FileText, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui';
import { useAuth } from '../context/useAuth';

const Landing = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleAction = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-glow">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="font-semibold tracking-tight text-lg">Easy Study</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={handleAction}>
                            {isAuthenticated ? 'Dashboard' : 'Sign In'}
                        </Button>
                        <Button onClick={handleAction}>
                            {isAuthenticated ? 'Go to Study' : 'Get Started'}
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={fadeIn}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-8 border border-primary/20"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">Your AI-Powered Study Companion</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent"
                    >
                        Master Your Studies <br /> with AI
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
                    >
                        Upload your PDFs, textbooks, and notes. Ask questions, get instant explanations, and track your progress effortlessly in a beautiful workspace.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex items-center justify-center gap-4"
                    >
                        <Button size="lg" className="h-12 px-8 text-base" onClick={handleAction} icon={<ArrowRight className="w-4 h-4" />}>
                            {isAuthenticated ? 'Continue Studying' : 'Start Studying Now'}
                        </Button>
                    </motion.div>

                    {/* App Demo Video/GIF Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-16 relative w-full max-w-5xl mx-auto rounded-2xl border border-border/50 bg-surface/50 p-2 shadow-2xl backdrop-blur-sm"
                    >
                        <div className="aspect-[16/9] rounded-xl overflow-hidden bg-surface-elevated flex items-center justify-center border border-border/50 relative">
                            {/* In production, replace this with an actual video/gif tag */}
                            <div className="absolute inset-0 bg-gradient-to-br from-surface to-background flex flex-col items-center justify-center text-muted-foreground/50">
                                <BookOpen className="w-16 h-16 mb-4 opacity-50" />
                                <p className="font-medium">Main App Demo (Video/GIF)</p>
                                <p className="text-sm">~ 10-15s showing study flow</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-surface/20 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Learn</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Simple tools to make learning fast, easy, and fun.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <motion.div
                            className="bg-surface/50 backdrop-blur-sm border border-border/50 p-8 rounded-3xl hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center mb-6 shadow-inner">
                                <FileText className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 tracking-tight">Fast PDF Reading</h3>
                            <p className="text-muted-foreground leading-relaxed">Instantly open large files and books. We make it easy to find exactly what you are looking for without delays.</p>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div
                            className="bg-surface/50 backdrop-blur-sm border border-border/50 p-8 rounded-3xl hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center mb-6 shadow-inner">
                                <BrainCircuit className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 tracking-tight">Smart AI Buddy</h3>
                            <p className="text-muted-foreground leading-relaxed">Ask any question while you read. Get quick answers and simple explanations right next to your notes.</p>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div
                            className="bg-surface/50 backdrop-blur-sm border border-border/50 p-8 rounded-3xl hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center mb-6 shadow-inner">
                                <LineChart className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 tracking-tight">Pick Up Where You Left</h3>
                            <p className="text-muted-foreground leading-relaxed">We save your work automatically. Open your dashboard and jump right back into your study session quickly.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-32 px-6 sm:px-10 md:px-16 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Start learning better in three easy steps.</p>
                    </div>

                    <div className="space-y-32">
                        {/* Step 1 */}
                        <div className="grid md:grid-cols-[2fr_3fr] gap-12 lg:gap-16 items-center">
                            <div>
                                <div className="text-primary font-bold text-lg mb-2">Step 1</div>
                                <h3 className="text-3xl font-bold mb-4">Upload Your PDF Files</h3>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Just upload your PDF notes, books, or research papers into the app.
                                </p>
                            </div>
                            <div className="w-full aspect-[2/1] rounded-2xl border border-border/50 bg-surface/50 backdrop-blur-sm shadow-card p-1.5 group hover:border-primary/30 transition-colors overflow-hidden">
                                <div className="w-full h-full rounded-xl overflow-hidden relative shadow-inner">
                                    <img
                                        src="/images/hiw1-.png"
                                        alt="Upload PDF"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="grid md:grid-cols-[3fr_2fr] gap-12 lg:gap-16 items-center">
                            <div className="order-2 md:order-1 w-full aspect-[2/1] rounded-2xl border border-border/50 bg-surface/50 backdrop-blur-sm shadow-card p-1.5 group hover:border-primary/30 transition-colors overflow-hidden">
                                <div className="w-full h-full rounded-xl overflow-hidden relative shadow-inner">
                                    <img
                                        src="/images/hiw-2.png"
                                        alt="Read with AI"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="order-1 md:order-2">
                                <div className="text-primary font-bold text-lg mb-2">Step 2</div>
                                <h3 className="text-3xl font-bold mb-4">Read Side-by-Side with AI</h3>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Read your document normally on the left, while your intelligent AI companion sits ready on the right.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="grid md:grid-cols-[2fr_3fr] gap-12 lg:gap-16 items-center">
                            <div>
                                <div className="text-primary font-bold text-lg mb-2">Step 3</div>
                                <h3 className="text-3xl font-bold mb-4">Highlight for Explanations</h3>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Get explanations, examples, or related things with AI by just highlighting the text.
                                </p>
                            </div>
                            <div className="w-full aspect-[2/1] rounded-2xl border border-border/50 bg-surface/50 backdrop-blur-sm shadow-card p-1.5 group hover:border-primary/30 transition-colors overflow-hidden">
                                <div className="w-full h-full rounded-xl overflow-hidden relative shadow-inner">
                                    <img
                                        src="/images/hiw-3.png"
                                        alt="Highlight for Explanations"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-32 px-6 relative border-t border-border/30 bg-background">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />

                <div className="max-w-3xl mx-auto text-center relative z-10 flex flex-col items-center">
                    <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-6 tracking-tight">
                        Start Learning Faster Today
                    </h2>

                    <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
                        Join other students who have already made studying easier, faster, and much more enjoyable.
                    </p>

                    <div className="flex justify-center">
                        <Button
                            size="lg"
                            className="h-14 px-8 text-base shadow-glow hover:-translate-y-1 transition-transform duration-300"
                            onClick={handleAction}
                            icon={<ArrowRight className="w-4 h-4" />}
                        >
                            {isAuthenticated ? 'Go to Dashboard' : 'Get Started for Free'}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/40 py-12 px-6 bg-background">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Easy Study</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Easy Study. All rights reserved.
                    </p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                        <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                        <a href="https://github.com/Samuel-Tefera/easy-study" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
