<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{SITE_NAME}} - Creative Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '{{PRIMARY_COLOR}}',
                        secondary: '{{SECONDARY_COLOR}}',
                        accent: '{{ACCENT_COLOR}}'
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-white text-gray-900">
    <!-- Navigation -->
    <nav class="fixed w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <h1 class="text-xl font-bold" style="color: {{PRIMARY_COLOR}}">{{SITE_NAME}}</h1>
                </div>
                <div class="flex items-center space-x-8">
                    <a href="#home" class="text-gray-700 hover:text-gray-900 transition-colors">Home</a>
                    <a href="#about" class="text-gray-700 hover:text-gray-900 transition-colors">About</a>
                    <a href="#portfolio" class="text-gray-700 hover:text-gray-900 transition-colors">Portfolio</a>
                    <a href="#contact" class="text-gray-700 hover:text-gray-900 transition-colors">Contact</a>
                    @auth
                        <a href="/dashboard" class="text-gray-700 hover:text-gray-900">Dashboard</a>
                    @else
                        <a href="/login" class="px-4 py-2 rounded-lg text-white" style="background-color: {{PRIMARY_COLOR}}">Login</a>
                    @endauth
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="min-h-screen flex items-center pt-16">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <div class="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6" style="background-color: {{ACCENT_COLOR}}; color: white;">
                        Welcome to my world
                    </div>
                    <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Creative
                        <span class="block" style="color: {{PRIMARY_COLOR}}">Designer</span>
                        & Developer
                    </h1>
                    <p class="text-xl text-gray-600 mb-8">
                        I create beautiful digital experiences that combine creativity with functionality. 
                        Let's bring your ideas to life.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <a href="#portfolio" class="px-8 py-4 rounded-lg text-white font-semibold text-lg transition-all duration-300 hover:scale-105" style="background-color: {{PRIMARY_COLOR}}">
                            View My Work
                        </a>
                        <a href="#contact" class="px-8 py-4 rounded-lg border-2 font-semibold text-lg transition-all duration-300 hover:bg-gray-50" style="border-color: {{SECONDARY_COLOR}}; color: {{SECONDARY_COLOR}}">
                            Get In Touch
                        </a>
                    </div>
                </div>
                <div class="hidden lg:block">
                    <div class="relative">
                        <div class="w-80 h-80 rounded-full bg-gradient-to-br mx-auto" style="background: linear-gradient(135deg, {{PRIMARY_COLOR}}, {{ACCENT_COLOR}})"></div>
                        <div class="absolute inset-0 w-80 h-80 rounded-full bg-white/20 mx-auto animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-20 bg-gray-50">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">About {{SITE_NAME}}</h2>
                <p class="text-xl text-gray-600">Passionate about creating exceptional digital experiences</p>
            </div>
            <div class="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h3 class="text-2xl font-bold mb-6" style="color: {{PRIMARY_COLOR}}">My Story</h3>
                    <p class="text-gray-600 mb-6">
                        With over 5 years of experience in design and development, I've worked with clients 
                        ranging from startups to Fortune 500 companies. My passion lies in creating intuitive 
                        and beautiful digital solutions that solve real-world problems.
                    </p>
                    <p class="text-gray-600 mb-8">
                        I specialize in user experience design, web development, and brand identity. 
                        Every project is an opportunity to push creative boundaries and deliver exceptional results.
                    </p>
                    <div class="flex flex-wrap gap-3">
                        <span class="px-4 py-2 rounded-full text-sm font-medium" style="background-color: {{ACCENT_COLOR}}; color: white;">UI/UX Design</span>
                        <span class="px-4 py-2 rounded-full text-sm font-medium" style="background-color: {{ACCENT_COLOR}}; color: white;">Web Development</span>
                        <span class="px-4 py-2 rounded-full text-sm font-medium" style="background-color: {{ACCENT_COLOR}}; color: white;">Brand Identity</span>
                        <span class="px-4 py-2 rounded-full text-sm font-medium" style="background-color: {{ACCENT_COLOR}}; color: white;">Mobile Apps</span>
                    </div>
                </div>
                <div class="bg-white rounded-2xl shadow-xl p-8">
                    <div class="grid grid-cols-2 gap-6">
                        <div class="text-center">
                            <div class="text-3xl font-bold mb-2" style="color: {{PRIMARY_COLOR}}">50+</div>
                            <div class="text-gray-600">Projects Completed</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold mb-2" style="color: {{PRIMARY_COLOR}}">30+</div>
                            <div class="text-gray-600">Happy Clients</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold mb-2" style="color: {{PRIMARY_COLOR}}">5+</div>
                            <div class="text-gray-600">Years Experience</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold mb-2" style="color: {{PRIMARY_COLOR}}">15+</div>
                            <div class="text-gray-600">Awards Won</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Portfolio Section -->
    <section id="portfolio" class="py-20">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">My Portfolio</h2>
                <p class="text-xl text-gray-600">A showcase of my recent work and creative projects</p>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="group cursor-pointer">
                    <div class="relative overflow-hidden rounded-xl">
                        <div class="h-64 bg-gradient-to-br transition-transform duration-300 group-hover:scale-110" style="background: linear-gradient(135deg, {{PRIMARY_COLOR}}, {{SECONDARY_COLOR}})"></div>
                        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span class="text-white font-semibold">View Project</span>
                        </div>
                    </div>
                    <h3 class="text-xl font-semibold mt-4 mb-2">Brand Identity Design</h3>
                    <p class="text-gray-600">Complete brand identity for a tech startup</p>
                </div>
                <div class="group cursor-pointer">
                    <div class="relative overflow-hidden rounded-xl">
                        <div class="h-64 bg-gradient-to-br transition-transform duration-300 group-hover:scale-110" style="background: linear-gradient(135deg, {{SECONDARY_COLOR}}, {{ACCENT_COLOR}})"></div>
                        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span class="text-white font-semibold">View Project</span>
                        </div>
                    </div>
                    <h3 class="text-xl font-semibold mt-4 mb-2">E-commerce Platform</h3>
                    <p class="text-gray-600">Modern online store with seamless UX</p>
                </div>
                <div class="group cursor-pointer">
                    <div class="relative overflow-hidden rounded-xl">
                        <div class="h-64 bg-gradient-to-br transition-transform duration-300 group-hover:scale-110" style="background: linear-gradient(135deg, {{ACCENT_COLOR}}, {{PRIMARY_COLOR}})"></div>
                        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span class="text-white font-semibold">View Project</span>
                        </div>
                    </div>
                    <h3 class="text-xl font-semibold mt-4 mb-2">Mobile App Design</h3>
                    <p class="text-gray-600">iOS app for fitness tracking and wellness</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20 bg-gray-50">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">Let's Work Together</h2>
                <p class="text-xl text-gray-600">Ready to bring your next project to life?</p>
            </div>
            <div class="grid lg:grid-cols-2 gap-12">
                <div>
                    <h3 class="text-2xl font-bold mb-6" style="color: {{PRIMARY_COLOR}}">Get In Touch</h3>
                    <div class="space-y-4">
                        <div class="flex items-center">
                            <div class="w-12 h-12 rounded-full flex items-center justify-center mr-4" style="background-color: {{ACCENT_COLOR}}">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <div>
                                <div class="font-semibold">Email</div>
                                <div class="text-gray-600">hello@{{SITE_NAME|lower}}.com</div>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div class="w-12 h-12 rounded-full flex items-center justify-center mr-4" style="background-color: {{ACCENT_COLOR}}">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                            </div>
                            <div>
                                <div class="font-semibold">Phone</div>
                                <div class="text-gray-600">+1 (555) 123-4567</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl shadow-lg p-8">
                    <form class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent" style="focus:ring-color: {{PRIMARY_COLOR}}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input type="email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent" style="focus:ring-color: {{PRIMARY_COLOR}}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                            <textarea rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent" style="focus:ring-color: {{PRIMARY_COLOR}}"></textarea>
                        </div>
                        <button type="submit" class="w-full px-8 py-3 rounded-lg text-white font-semibold transition-all duration-300 hover:scale-105" style="background-color: {{PRIMARY_COLOR}}">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="text-center">
                <h3 class="text-lg font-semibold mb-4" style="color: {{PRIMARY_COLOR}}">{{SITE_NAME}}</h3>
                <p class="text-gray-600 mb-6">Creating beautiful digital experiences</p>
                <div class="flex justify-center space-x-6 mb-6">
                    <a href="#" class="text-gray-400 hover:text-gray-600">LinkedIn</a>
                    <a href="#" class="text-gray-400 hover:text-gray-600">Dribbble</a>
                    <a href="#" class="text-gray-400 hover:text-gray-600">Behance</a>
                    <a href="#" class="text-gray-400 hover:text-gray-600">Twitter</a>
                </div>
                <p class="text-gray-400">&copy; {{ date('Y') }} {{SITE_NAME}}. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>
