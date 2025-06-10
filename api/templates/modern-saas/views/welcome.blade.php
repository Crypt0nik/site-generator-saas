<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{SITE_NAME}} - Modern Business Solutions</title>
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
<body class="bg-gray-900 text-white">
    <!-- Navigation -->
    <nav class="bg-gray-800 border-b border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <h1 class="text-xl font-bold" style="color: {{PRIMARY_COLOR}}">{{SITE_NAME}}</h1>
                </div>
                <div class="flex items-center space-x-4">
                    @auth
                        <a href="/dashboard" class="text-gray-300 hover:text-white">Dashboard</a>
                        <form method="POST" action="{{ route('logout') }}" class="inline">
                            @csrf
                            <button type="submit" class="text-gray-300 hover:text-white">Logout</button>
                        </form>
                    @else
                        <a href="/login" class="text-gray-300 hover:text-white">Login</a>
                        <a href="/register" class="px-4 py-2 rounded-md text-white" style="background-color: {{PRIMARY_COLOR}}">Sign Up</a>
                    @endauth
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <div class="relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div class="text-center">
                <h1 class="text-4xl md:text-6xl font-bold mb-6">
                    Welcome to <span style="color: {{PRIMARY_COLOR}}">{{SITE_NAME}}</span>
                </h1>
                <p class="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                    Your premier destination for innovative solutions and exceptional service. 
                    Discover what makes us the leader in our industry.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/products" class="px-8 py-3 rounded-lg text-white font-semibold text-lg transition-all duration-300 hover:scale-105" style="background-color: {{PRIMARY_COLOR}}">
                        Explore Products
                    </a>
                    <a href="/about" class="px-8 py-3 rounded-lg border-2 text-white font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-gray-900" style="border-color: {{SECONDARY_COLOR}}">
                        Learn More
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Features Section -->
    <div class="py-24 bg-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">Why Choose {{SITE_NAME}}?</h2>
                <p class="text-xl text-gray-300">Innovative solutions tailored to your needs</p>
            </div>
            <div class="grid md:grid-cols-3 gap-8">
                <div class="text-center p-6 rounded-lg bg-gray-700">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style="background-color: {{ACCENT_COLOR}}">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Lightning Fast</h3>
                    <p class="text-gray-300">Experience unparalleled speed and performance with our cutting-edge technology.</p>
                </div>
                <div class="text-center p-6 rounded-lg bg-gray-700">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style="background-color: {{ACCENT_COLOR}}">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Reliable</h3>
                    <p class="text-gray-300">Count on our robust infrastructure and 99.9% uptime guarantee.</p>
                </div>
                <div class="text-center p-6 rounded-lg bg-gray-700">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style="background-color: {{ACCENT_COLOR}}">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">User-Friendly</h3>
                    <p class="text-gray-300">Intuitive design and seamless user experience across all devices.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- CTA Section -->
    <div class="py-24">
        <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p class="text-xl text-gray-300 mb-8">Join thousands of satisfied customers who trust {{SITE_NAME}} for their business needs.</p>
            <a href="/register" class="inline-block px-8 py-4 rounded-lg text-white font-semibold text-lg transition-all duration-300 hover:scale-105" style="background-color: {{PRIMARY_COLOR}}">
                Start Your Journey Today
            </a>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-800 border-t border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="text-center">
                <h3 class="text-lg font-semibold mb-4" style="color: {{PRIMARY_COLOR}}">{{SITE_NAME}}</h3>
                <p class="text-gray-400">&copy; {{ date('Y') }} {{SITE_NAME}}. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>
