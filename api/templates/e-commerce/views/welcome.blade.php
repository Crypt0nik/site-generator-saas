<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{SITE_NAME}} - Premium Online Store</title>
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
    <!-- Top Bar -->
    <div class="bg-gray-900 text-white py-2">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
            Free shipping on orders over $50 | 30-day return policy
        </div>
    </div>

    <!-- Navigation -->
    <nav class="bg-white shadow-lg border-b-2" style="border-color: {{PRIMARY_COLOR}}">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-20">
                <div class="flex items-center">
                    <h1 class="text-2xl font-bold" style="color: {{PRIMARY_COLOR}}">{{SITE_NAME}}</h1>
                </div>
                <div class="flex items-center space-x-8">
                    <a href="/products" class="text-gray-700 hover:text-gray-900 font-medium">Products</a>
                    <a href="/categories" class="text-gray-700 hover:text-gray-900 font-medium">Categories</a>
                    <a href="/cart" class="relative">
                        <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m4.5-5a2 2 0 104 0m-4 0a2 2 0 004 0"></path>
                        </svg>
                        <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
                    </a>
                    @auth
                        <a href="/dashboard" class="text-gray-700 hover:text-gray-900">Account</a>
                    @else
                        <a href="/login" class="text-gray-700 hover:text-gray-900">Login</a>
                        <a href="/register" class="px-6 py-2 rounded-lg text-white font-semibold" style="background-color: {{PRIMARY_COLOR}}">Sign Up</a>
                    @endauth
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Banner -->
    <div class="relative bg-gradient-to-r from-gray-100 to-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h1 class="text-5xl font-bold mb-6">
                        Discover Amazing Products at <span style="color: {{PRIMARY_COLOR}}">{{SITE_NAME}}</span>
                    </h1>
                    <p class="text-xl text-gray-600 mb-8">
                        Shop the latest trends with unbeatable prices and fast delivery. 
                        Your satisfaction is our priority.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <a href="/products" class="px-8 py-4 rounded-lg text-white font-semibold text-lg transition-all duration-300 hover:scale-105" style="background-color: {{PRIMARY_COLOR}}">
                            Shop Now
                        </a>
                        <a href="/categories" class="px-8 py-4 rounded-lg border-2 font-semibold text-lg transition-all duration-300 hover:bg-gray-50" style="border-color: {{SECONDARY_COLOR}}; color: {{SECONDARY_COLOR}}">
                            Browse Categories
                        </a>
                    </div>
                </div>
                <div class="hidden lg:block">
                    <div class="bg-white rounded-xl shadow-2xl p-8 transform rotate-3">
                        <div class="h-64 bg-gradient-to-br rounded-lg flex items-center justify-center text-white text-xl font-bold" style="background: linear-gradient(135deg, {{PRIMARY_COLOR}}, {{ACCENT_COLOR}})">
                            Featured Product
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Product Categories -->
    <div class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
                <p class="text-xl text-gray-600">Find exactly what you're looking for</p>
            </div>
            <div class="grid md:grid-cols-3 gap-8">
                <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div class="h-48 bg-gradient-to-br flex items-center justify-center" style="background: linear-gradient(135deg, {{PRIMARY_COLOR}}, {{SECONDARY_COLOR}})">
                        <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-semibold mb-2">Electronics</h3>
                        <p class="text-gray-600 mb-4">Latest gadgets and tech accessories</p>
                        <a href="/categories/electronics" class="text-white px-4 py-2 rounded-lg inline-block font-semibold" style="background-color: {{ACCENT_COLOR}}">
                            Shop Now
                        </a>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div class="h-48 bg-gradient-to-br flex items-center justify-center" style="background: linear-gradient(135deg, {{SECONDARY_COLOR}}, {{ACCENT_COLOR}})">
                        <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                        </svg>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-semibold mb-2">Fashion</h3>
                        <p class="text-gray-600 mb-4">Trendy clothing and accessories</p>
                        <a href="/categories/fashion" class="text-white px-4 py-2 rounded-lg inline-block font-semibold" style="background-color: {{ACCENT_COLOR}}">
                            Shop Now
                        </a>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div class="h-48 bg-gradient-to-br flex items-center justify-center" style="background: linear-gradient(135deg, {{ACCENT_COLOR}}, {{PRIMARY_COLOR}})">
                        <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-semibold mb-2">Home & Garden</h3>
                        <p class="text-gray-600 mb-4">Everything for your home</p>
                        <a href="/categories/home" class="text-white px-4 py-2 rounded-lg inline-block font-semibold" style="background-color: {{ACCENT_COLOR}}">
                            Shop Now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Newsletter -->
    <div class="py-20" style="background-color: {{PRIMARY_COLOR}}">
        <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Stay Updated</h2>
            <p class="text-xl text-white mb-8 opacity-90">Get the latest deals and product updates delivered to your inbox</p>
            <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input type="email" placeholder="Enter your email" class="flex-1 px-4 py-3 rounded-lg border-none outline-none">
                <button class="px-8 py-3 bg-white rounded-lg font-semibold transition-all duration-300 hover:scale-105" style="color: {{PRIMARY_COLOR}}">
                    Subscribe
                </button>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="grid md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-lg font-semibold mb-4" style="color: {{PRIMARY_COLOR}}">{{SITE_NAME}}</h3>
                    <p class="text-gray-400">Your trusted online shopping destination</p>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Quick Links</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="/products" class="hover:text-white">Products</a></li>
                        <li><a href="/categories" class="hover:text-white">Categories</a></li>
                        <li><a href="/about" class="hover:text-white">About Us</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Customer Service</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="/contact" class="hover:text-white">Contact Us</a></li>
                        <li><a href="/shipping" class="hover:text-white">Shipping Info</a></li>
                        <li><a href="/returns" class="hover:text-white">Returns</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Follow Us</h4>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-400 hover:text-white">Facebook</a>
                        <a href="#" class="text-gray-400 hover:text-white">Twitter</a>
                        <a href="#" class="text-gray-400 hover:text-white">Instagram</a>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-8 pt-8 text-center">
                <p class="text-gray-400">&copy; {{ date('Y') }} {{SITE_NAME}}. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>
