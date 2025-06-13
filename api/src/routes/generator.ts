import express from 'express'
import path from 'path'
import fs from 'fs-extra'

const router = express.Router()

// Interface pour la configuration de site
interface SiteConfig {
  name: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  template: 'modern-saas' | 'e-commerce' | 'portfolio'
  features: {
    auth: boolean
    payment: boolean
    blog: boolean
    analytics: boolean
  }
}

// Fonction pour générer le script d'installation
function generateInstallScript(config: SiteConfig): string {
  const projectName = config.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
  
  return `#!/bin/bash

# 🚀 Script d'installation automatique pour ${config.name}
# Généré le $(date '+%Y-%m-%d %H:%M:%S')
# Template: ${config.template}

set -e  # Exit on any error

echo "🎉 Installation de votre site: ${config.name}"
echo "================================================="

# Variables
projectName="${projectName}"

# Couleurs pour les messages
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "\${BLUE}ℹ️  \$1\${NC}"
}

log_success() {
    echo -e "\${GREEN}✅ \$1\${NC}"
}

log_warning() {
    echo -e "\${YELLOW}⚠️  \$1\${NC}"
}

log_error() {
    echo -e "\${RED}❌ \$1\${NC}"
}

# Vérification des prérequis
check_requirements() {
    log_info "Vérification des prérequis..."
    
    # Vérifier Git
    if ! command -v git &> /dev/null; then
        log_error "Git n'est pas installé. Veuillez installer Git et relancer le script."
        exit 1
    fi
    
    # Vérifier PHP
    if ! command -v php &> /dev/null; then
        log_error "PHP n'est pas installé. Veuillez installer PHP 8.1+ et relancer le script."
        exit 1
    fi
    
    # Vérifier Composer
    if ! command -v composer &> /dev/null; then
        log_error "Composer n'est pas installé. Veuillez installer Composer et relancer le script."
        exit 1
    fi
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js n'est pas installé. Veuillez installer Node.js 18+ et relancer le script."
        exit 1
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        log_error "npm n'est pas installé. Veuillez installer npm et relancer le script."
        exit 1
    fi
    
    log_success "Tous les prérequis sont installés!"
}

# Cloner le projet de base
clone_project() {
    log_info "Clonage du projet de base..."
    
    if [ -d "\${projectName}" ]; then
        log_warning "Le dossier \${projectName} existe déjà. Suppression..."
        rm -rf "\${projectName}"
    fi
    
    # Clonage du repository Laravel e-commerce
    git clone https://github.com/Dantr3b/Projet-Dev-B2.git "\${projectName}"
    cd "\${projectName}"
    
    log_success "Projet cloné avec succès!"
}

# Configuration personnalisée
configure_project() {
    log_info "Configuration du projet avec vos paramètres..."
    
    # Créer le fichier .env
    cp .env.example .env
    
    # Configuration sécurisée du nom (gestion des caractères spéciaux)
    # Utilisation d'un fichier temporaire pour éviter les problèmes d'échappement
    cat > temp_config.php << 'EOPHP'
<?php
$env = file_get_contents('.env');
$appName = '${config.name.replace(/'/g, "\\'")}';
$env = preg_replace('/^APP_NAME=.*/m', 'APP_NAME="' . $appName . '"', $env);
$env = preg_replace('/^APP_URL=.*/m', 'APP_URL=http://localhost:8000', $env);
file_put_contents('.env', $env);
echo "Configuration du nom d'application terminée\\n";
EOPHP
    
    php temp_config.php
    rm temp_config.php
    
    # Configuration de la base de données SQLite (compatible multi-plateforme)
    if [[ "\$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/DB_CONNECTION=.*/DB_CONNECTION=sqlite/" .env
        sed -i '' "s|DB_HOST=.*|DB_HOST=|" .env
        sed -i '' "s|DB_PORT=.*|DB_PORT=|" .env
        sed -i '' "s|DB_DATABASE=.*|DB_DATABASE=database/database.sqlite|" .env
        sed -i '' "s|DB_USERNAME=.*|DB_USERNAME=|" .env
        sed -i '' "s|DB_PASSWORD=.*|DB_PASSWORD=|" .env
    else
        # Linux
        sed -i "s/DB_CONNECTION=.*/DB_CONNECTION=sqlite/" .env
        sed -i "s|DB_HOST=.*|DB_HOST=|" .env
        sed -i "s|DB_PORT=.*|DB_PORT=|" .env
        sed -i "s|DB_DATABASE=.*|DB_DATABASE=database/database.sqlite|" .env
        sed -i "s|DB_USERNAME=.*|DB_USERNAME=|" .env
        sed -i "s|DB_PASSWORD=.*|DB_PASSWORD=|" .env
    fi
    
    # Créer le fichier de configuration des couleurs personnalisées
    cat > config/brand.php << 'EOF'
<?php

return [
    'name' => '${config.name}',
    'template' => '${config.template}',
    'colors' => [
        'primary' => '${config.primaryColor}',
        'secondary' => '${config.secondaryColor}',
        'accent' => '${config.accentColor}',
    ],
    'features' => [
        'auth' => ${config.features.auth ? 'true' : 'false'},
        'payment' => ${config.features.payment ? 'true' : 'false'},
        'blog' => ${config.features.blog ? 'true' : 'false'},
        'analytics' => ${config.features.analytics ? 'true' : 'false'},
    ],
];
EOF
    
    log_success "Configuration personnalisée terminée!"
}

# Installation des dépendances
install_dependencies() {
    log_info "Installation des dépendances PHP..."
    composer install --optimize-autoloader
    
    log_info "Installation de Faker pour les données de test..."
    composer require fakerphp/faker --dev --no-interaction
    
    log_info "Installation des dépendances Node.js..."
    npm install
    
    log_success "Dépendances installées!"
}

# Correction des modèles pour la compatibilité avec la structure de base de données
fix_user_model() {
    log_info "Correction du modèle User pour la compatibilité..."
    
    # Corriger le modèle User
    cat > app/Models/User.php << 'EOF'
<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Foundation\\Auth\\User as Authenticatable;
use Illuminate\\Notifications\\Notifiable;
use Laravel\\Sanctum\\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected \$table = 'users';
    protected \$primaryKey = 'user_id';
    public \$incrementing = true;
    protected \$keyType = 'int';
    
    protected \$fillable = ['username', 'email', 'password'];

    protected \$hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }
}
EOF

    # Corriger la factory User
    cat > database/factories/UserFactory.php << 'EOF'
<?php

namespace Database\\Factories;

use Illuminate\\Database\\Eloquent\\Factories\\Factory;
use Illuminate\\Support\\Facades\\Hash;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'username' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('password'),
        ];
    }
}
EOF

    # Corriger le seeder
    cat > database/seeders/DatabaseSeeder.php << 'EOF'
<?php

namespace Database\\Seeders;

use App\\Models\\User;
use Illuminate\\Database\\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'username' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
EOF
    
    # Créer les routes web avec administration
    cat > routes/web.php << 'EOF'
<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\Admin\\ContentController;

// Route principale
Route::get('/', function () {
    return view('welcome');
});

// Routes d'administration (nécessitent une authentification)
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', function () {
        return redirect()->route('admin.content.index');
    });
    
    Route::get('/content', [ContentController::class, 'index'])->name('content.index');
    Route::put('/content', [ContentController::class, 'update'])->name('content.update');
});

// Inclure les routes d'authentification si disponibles
if (file_exists(base_path('routes/auth.php'))) {
    require base_path('routes/auth.php');
}
EOF
    
    log_success "Modèle User et routes corrigés!"
}

# Créer le système de gestion de contenu éditable
create_content_management() {
    log_info "Création du système de gestion de contenu éditable..."
    
    # Créer le modèle SiteContent
    cat > app/Models/SiteContent.php << 'EOF'
<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;

class SiteContent extends Model
{
    use HasFactory;

    protected $table = 'site_contents';

    protected $fillable = [
        'section',
        'key', 
        'value',
        'type'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public static function get($section, $key, $default = '')
    {
        $content = self::where('section', $section)
                      ->where('key', $key)
                      ->first();
        
        return $content ? $content->value : $default;
    }
    
    public static function set($section, $key, $value, $type = 'text')
    {
        return self::updateOrCreate(
            ['section' => $section, 'key' => $key],
            ['value' => $value, 'type' => $type]
        );
    }
}
EOF

    # Créer la migration pour site_contents
    cat > database/migrations/2024_01_01_000001_create_site_contents_table.php << 'EOF'
<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('site_contents', function (Blueprint $table) {
            $table->id();
            $table->string('section')->index(); // 'hero', 'features', 'cta', etc.
            $table->string('key'); // 'title', 'subtitle', 'description', etc.
            $table->text('value'); // Le contenu éditable
            $table->string('type')->default('text'); // 'text', 'textarea', 'html'
            $table->timestamps();
            
            $table->unique(['section', 'key']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('site_contents');
    }
};
EOF

    # Créer le seeder pour site_contents avec contenu par défaut
    cat > database/seeders/SiteContentSeeder.php << 'EOF'
<?php

namespace Database\\Seeders;

use App\\Models\\SiteContent;
use Illuminate\\Database\\Seeder;

class SiteContentSeeder extends Seeder
{
    public function run()
    {
        $contents = [
            // Section Hero
            ['section' => 'hero', 'key' => 'title', 'value' => 'Welcome to ${config.name}', 'type' => 'text'],
            ['section' => 'hero', 'key' => 'subtitle', 'value' => 'Your premier destination for innovative solutions', 'type' => 'textarea'],
            ['section' => 'hero', 'key' => 'cta_primary', 'value' => 'Explore Products', 'type' => 'text'],
            ['section' => 'hero', 'key' => 'cta_secondary', 'value' => 'Learn More', 'type' => 'text'],
            
            // Section Features
            ['section' => 'features', 'key' => 'title', 'value' => 'Why Choose ${config.name}?', 'type' => 'text'],
            ['section' => 'features', 'key' => 'subtitle', 'value' => 'Innovative solutions tailored to your needs', 'type' => 'text'],
            
            // Features individuelles
            ['section' => 'feature_1', 'key' => 'title', 'value' => 'Lightning Fast', 'type' => 'text'],
            ['section' => 'feature_1', 'key' => 'description', 'value' => 'Experience unparalleled speed and performance', 'type' => 'textarea'],
            
            ['section' => 'feature_2', 'key' => 'title', 'value' => 'Reliable', 'type' => 'text'],
            ['section' => 'feature_2', 'key' => 'description', 'value' => 'Count on our robust infrastructure', 'type' => 'textarea'],
            
            ['section' => 'feature_3', 'key' => 'title', 'value' => 'User-Friendly', 'type' => 'text'],
            ['section' => 'feature_3', 'key' => 'description', 'value' => 'Intuitive design and seamless experience', 'type' => 'textarea'],
            
            // Section CTA finale
            ['section' => 'cta', 'key' => 'title', 'value' => 'Ready to Get Started?', 'type' => 'text'],
            ['section' => 'cta', 'key' => 'description', 'value' => 'Join thousands of satisfied customers', 'type' => 'textarea'],
            ['section' => 'cta', 'key' => 'button', 'value' => 'Start Your Journey Today', 'type' => 'text'],
        ];
        
        foreach ($contents as $content) {
            SiteContent::create($content);
        }
    }
}
EOF

    # Créer le contrôleur d'administration pour la gestion de contenu
    mkdir -p app/Http/Controllers/Admin
    cat > app/Http/Controllers/Admin/ContentController.php << 'EOF'
<?php

namespace App\\Http\\Controllers\\Admin;

use App\\Http\\Controllers\\Controller;
use App\\Models\\SiteContent;
use Illuminate\\Http\\Request;

class ContentController extends Controller
{
    /**
     * Afficher la page de gestion du contenu
     */
    public function index()
    {
        $contents = SiteContent::orderBy('section')->orderBy('key')->get()->groupBy('section');
        return view('admin.content.index', compact('contents'));
    }
    
    /**
     * Mettre à jour le contenu du site
     */
    public function update(Request $request)
    {
        $request->validate([
            'contents' => 'required|array',
            'contents.*.section' => 'required|string',
            'contents.*.key' => 'required|string',
            'contents.*.value' => 'required|string',
            'contents.*.type' => 'required|string',
        ]);
        
        foreach ($request->contents as $content) {
            SiteContent::set(
                $content['section'],
                $content['key'],
                $content['value'],
                $content['type']
            );
        }
        
        return redirect()->back()->with('success', 'Contenu mis à jour avec succès !');
    }
}
EOF

    # Créer le layout d'administration
    mkdir -p resources/views/admin
    cat > resources/views/admin/layout.blade.php << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administration - ${config.name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '${config.primaryColor}',
                        secondary: '${config.secondaryColor}',
                        accent: '${config.accentColor}'
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gray-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <h1 class="text-xl font-bold" style="color: ${config.primaryColor}">Admin - ${config.name}</h1>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="/" class="text-gray-700 hover:text-gray-900">Voir le site</a>
                    <a href="/admin/content" class="text-gray-700 hover:text-gray-900">Gérer le contenu</a>
                    <form method="POST" action="{{ route('logout') }}" class="inline">
                        @csrf
                        <button type="submit" class="text-gray-700 hover:text-gray-900">Déconnexion</button>
                    </form>
                </div>
            </div>
        </div>
    </nav>

    <!-- Content -->
    <div class="py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-6">
                <h1 class="text-2xl font-bold text-gray-900">@yield('title')</h1>
            </div>
            
            @if(session('success'))
                <div class="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {{ session('success') }}
                </div>
            @endif
            
            @yield('content')
        </div>
    </div>
</body>
</html>
EOF

    # Créer la vue d'administration pour éditer les contenus
    mkdir -p resources/views/admin/content
    cat > resources/views/admin/content/index.blade.php << 'EOF'
@extends('admin.layout')

@section('title', 'Gestion du Contenu')

@section('content')
<div class="bg-white rounded-lg shadow-md">
    <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">Éditer le Contenu du Site</h2>
        <p class="text-gray-600 mt-1">Modifiez les textes qui apparaissent sur votre site web</p>
    </div>
    
    <form action="{{ route('admin.content.update') }}" method="POST" class="p-6">
        @csrf
        @method('PUT')
        
        @foreach($contents as $section => $sectionContents)
        <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 capitalize border-b pb-2" style="border-color: ${config.primaryColor}">
                Section : {{ str_replace('_', ' ', $section) }}
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @foreach($sectionContents as $index => $content)
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700 capitalize">
                        {{ str_replace('_', ' ', $content->key) }}
                    </label>
                    
                    <input type="hidden" name="contents[{{ $section }}_{{ $index }}][section]" value="{{ $content->section }}">
                    <input type="hidden" name="contents[{{ $section }}_{{ $index }}][key]" value="{{ $content->key }}">
                    <input type="hidden" name="contents[{{ $section }}_{{ $index }}][type]" value="{{ $content->type }}">
                    
                    @if($content->type === 'textarea')
                        <textarea 
                            name="contents[{{ $section }}_{{ $index }}][value]"
                            rows="3"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >{{ $content->value }}</textarea>
                    @else
                        <input 
                            type="text"
                            name="contents[{{ $section }}_{{ $index }}][value]"
                            value="{{ $content->value }}"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                    @endif
                </div>
                @endforeach
            </div>
        </div>
        @endforeach
        
        <div class="flex justify-end border-t pt-6">
            <button type="submit" class="text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity" style="background-color: ${config.primaryColor}">
                Mettre à jour le contenu
            </button>
        </div>
    </form>
</div>
@endsection
EOF

    # Mettre à jour le DatabaseSeeder pour inclure SiteContentSeeder
    cat > database/seeders/DatabaseSeeder.php << 'EOF'
<?php

namespace Database\\Seeders;

use App\\Models\\User;
use Illuminate\\Database\\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'username' => 'Test User',
            'email' => 'test@example.com',
        ]);
        
        // Ajouter le seeder pour le contenu du site
        $this->call(SiteContentSeeder::class);
    }
}
EOF

    log_success "Système de gestion de contenu créé!"
}

# Appliquer le template personnalisé
apply_template() {
    log_info "Application du template ${config.template}..."
    
    # Créer la vue welcome personnalisée selon le template choisi
    case "${config.template}" in
        "modern-saas")
            cat > resources/views/welcome.blade.php << 'TEMPLATE_EOF'
@php
use App\\Models\\SiteContent;
@endphp

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.name} - Modern Business Solutions</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '${config.primaryColor}',
                        secondary: '${config.secondaryColor}',
                        accent: '${config.accentColor}'
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
                    <h1 class="text-xl font-bold" style="color: ${config.primaryColor}">${config.name}</h1>
                </div>
                <div class="flex items-center space-x-4">
                    @auth
                        <a href="/admin" class="text-gray-300 hover:text-white">Admin</a>
                        <form method="POST" action="{{ route('logout') }}" class="inline">
                            @csrf
                            <button type="submit" class="text-gray-300 hover:text-white">Logout</button>
                        </form>
                    @else
                        <a href="/login" class="text-gray-300 hover:text-white">Login</a>
                        <a href="/register" class="px-4 py-2 rounded-md text-white" style="background-color: ${config.primaryColor}">Sign Up</a>
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
                    {!! SiteContent::get('hero', 'title', 'Welcome to ${config.name}') !!}
                </h1>
                <p class="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                    {!! SiteContent::get('hero', 'subtitle', 'Your premier destination for innovative solutions and exceptional service.') !!}
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/products" class="px-8 py-3 rounded-lg text-white font-semibold text-lg transition-all duration-300 hover:scale-105" style="background-color: ${config.primaryColor}">
                        {!! SiteContent::get('hero', 'cta_primary', 'Explore Products') !!}
                    </a>
                    <a href="/about" class="px-8 py-3 rounded-lg border-2 text-white font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-gray-900" style="border-color: ${config.secondaryColor}">
                        {!! SiteContent::get('hero', 'cta_secondary', 'Learn More') !!}
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Features Section -->
    <div class="py-24 bg-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">
                    {!! SiteContent::get('features', 'title', 'Why Choose ${config.name}?') !!}
                </h2>
                <p class="text-xl text-gray-300">
                    {!! SiteContent::get('features', 'subtitle', 'Innovative solutions tailored to your needs') !!}
                </p>
            </div>
            <div class="grid md:grid-cols-3 gap-8">
                @for($i = 1; $i <= 3; $i++)
                <div class="text-center p-6 rounded-lg bg-gray-700">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style="background-color: ${config.accentColor}">
                        @if($i == 1)
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        @elseif($i == 2)
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        @else
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                        @endif
                    </div>
                    <h3 class="text-xl font-semibold mb-2">
                        {!! SiteContent::get('feature_' . $i, 'title', 'Feature ' . $i) !!}
                    </h3>
                    <p class="text-gray-300">
                        {!! SiteContent::get('feature_' . $i, 'description', 'Description ' . $i) !!}
                    </p>
                </div>
                @endfor
            </div>
        </div>
    </div>

    <!-- CTA Section -->
    <div class="py-24">
        <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">
                {!! SiteContent::get('cta', 'title', 'Ready to Get Started?') !!}
            </h2>
            <p class="text-xl text-gray-300 mb-8">
                {!! SiteContent::get('cta', 'description', 'Join thousands of satisfied customers who trust ${config.name} for their business needs.') !!}
            </p>
            <a href="/register" class="inline-block px-8 py-4 rounded-lg text-white font-semibold text-lg transition-all duration-300 hover:scale-105" style="background-color: ${config.primaryColor}">
                {!! SiteContent::get('cta', 'button', 'Start Your Journey Today') !!}
            </a>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-800 border-t border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="text-center">
                <h3 class="text-lg font-semibold mb-4" style="color: ${config.primaryColor}">${config.name}</h3>
                <p class="text-gray-400">&copy; {{ date('Y') }} ${config.name}. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>
TEMPLATE_EOF
            ;;
        "e-commerce")
            cat > resources/views/welcome.blade.php << 'TEMPLATE_EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.name} - Online Store</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '${config.primaryColor}',
                        secondary: '${config.secondaryColor}',
                        accent: '${config.accentColor}'
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-white">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <h1 class="text-2xl font-bold" style="color: ${config.primaryColor}">${config.name}</h1>
                </div>
                <div class="flex items-center space-x-6">
                    <a href="/" class="text-gray-700 hover:text-gray-900">Accueil</a>
                    <a href="/products" class="text-gray-700 hover:text-gray-900">Produits</a>
                    <a href="/categories" class="text-gray-700 hover:text-gray-900">Catégories</a>
                    <a href="/about" class="text-gray-700 hover:text-gray-900">À propos</a>
                    @auth
                        <a href="/admin" class="text-gray-700 hover:text-gray-900">Admin</a>
                        <form method="POST" action="{{ route('logout') }}" class="inline">
                            @csrf
                            <button type="submit" class="text-gray-700 hover:text-gray-900">Déconnexion</button>
                        </form>
                    @else
                        <a href="/login" class="text-gray-700 hover:text-gray-900">Connexion</a>
                    @endauth
                    <div class="relative">
                        <button class="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
                            </svg>
                            <span class="text-sm font-medium">Panier (0)</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative h-96 overflow-hidden">
        <div class="absolute inset-0" style="background: linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%);">
            <div class="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div class="text-white">
                <h1 class="text-4xl md:text-6xl font-bold mb-4">Bienvenue chez ${config.name}</h1>
                <p class="text-xl mb-6 max-w-2xl">Découvrez notre collection exclusive de produits de qualité supérieure</p>
                <a href="/products" class="inline-block px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                    Voir nos produits
                </a>
            </div>
        </div>
    </section>

    <!-- Categories -->
    <section class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl font-bold text-center mb-12 text-gray-900">Nos Catégories</h2>
            <div class="grid md:grid-cols-3 gap-8">
                <div class="text-center group">
                    <div class="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center transition-transform group-hover:scale-110" style="background-color: ${config.accentColor}">
                        <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2 text-gray-900">Électronique</h3>
                    <p class="text-gray-600">Dernières technologies et gadgets innovants</p>
                </div>
                <div class="text-center group">
                    <div class="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center transition-transform group-hover:scale-110" style="background-color: ${config.accentColor}">
                        <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2 text-gray-900">Mode</h3>
                    <p class="text-gray-600">Vêtements et accessoires tendance</p>
                </div>
                <div class="text-center group">
                    <div class="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center transition-transform group-hover:scale-110" style="background-color: ${config.accentColor}">
                        <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2 text-gray-900">Maison</h3>
                    <p class="text-gray-600">Décoration et équipements pour la maison</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl font-bold text-center mb-12 text-gray-900">Produits Vedettes</h2>
            <div class="grid md:grid-cols-4 gap-6">
                @for ($i = 1; $i <= 4; $i++)
                <div class="bg-white rounded-lg shadow-md overflow-hidden group">
                    <div class="aspect-square bg-gray-200 relative overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-br" style="background: linear-gradient(135deg, {{ ['#f3f4f6', '${config.primaryColor}20', '${config.secondaryColor}20', '${config.accentColor}20'][$i-1] }} 0%, {{ ['#e5e7eb', '${config.primaryColor}30', '${config.secondaryColor}30', '${config.accentColor}30'][$i-1] }} 100%);"></div>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <span class="text-4xl font-bold text-gray-400">{{ $i }}</span>
                        </div>
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-gray-900 mb-2">Produit {{ $i }}</h3>
                        <p class="text-gray-600 text-sm mb-3">Description du produit vedette</p>
                        <div class="flex justify-between items-center">
                            <span class="text-lg font-bold" style="color: ${config.primaryColor}">€{{ $i * 25 }}.99</span>
                            <button class="px-4 py-2 text-white rounded-md transition-colors" style="background-color: ${config.primaryColor}">
                                Ajouter
                            </button>
                        </div>
                    </div>
                </div>
                @endfor
            </div>
            <div class="text-center mt-8">
                <a href="/products" class="inline-block px-8 py-3 border-2 rounded-lg font-semibold transition-all hover:bg-gray-900 hover:text-white" style="border-color: ${config.secondaryColor}; color: ${config.secondaryColor}">
                    Voir tous les produits
                </a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-lg font-semibold mb-4" style="color: ${config.primaryColor}">${config.name}</h3>
                    <p class="text-gray-400">Votre boutique en ligne de confiance pour des produits de qualité.</p>
                </div>
                <div>
                    <h4 class="font-semibold mb-3">Navigation</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="/" class="hover:text-white">Accueil</a></li>
                        <li><a href="/products" class="hover:text-white">Produits</a></li>
                        <li><a href="/about" class="hover:text-white">À propos</a></li>
                        <li><a href="/contact" class="hover:text-white">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-3">Aide</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="/help" class="hover:text-white">Centre d\'aide</a></li>
                        <li><a href="/shipping" class="hover:text-white">Livraison</a></li>
                        <li><a href="/returns" class="hover:text-white">Retours</a></li>
                        <li><a href="/faq" class="hover:text-white">FAQ</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-3">Newsletter</h4>
                    <p class="text-gray-400 text-sm mb-3">Recevez nos dernières offres</p>
                    <div class="flex">
                        <input type="email" placeholder="Votre email" class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-white">
                        <button class="px-4 py-2 rounded-r-md text-white" style="background-color: ${config.primaryColor}">OK</button>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; {{ date('Y') }} ${config.name}. Tous droits réservés.</p>
            </div>
        </div>
    </footer>
</body>
</html>
TEMPLATE_EOF
            ;;
        "portfolio")
            cat > resources/views/welcome.blade.php << 'TEMPLATE_EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.name} - Creative Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '${config.primaryColor}',
                        secondary: '${config.secondaryColor}',
                        accent: '${config.accentColor}'
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="fixed w-full bg-white/90 backdrop-blur-sm shadow-sm z-50">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <h1 class="text-xl font-bold" style="color: ${config.primaryColor}">${config.name}</h1>
                </div>
                <div class="flex items-center space-x-8">
                    <a href="#home" class="text-gray-700 hover:text-gray-900 font-medium">Accueil</a>
                    <a href="#about" class="text-gray-700 hover:text-gray-900 font-medium">À propos</a>
                    <a href="#portfolio" class="text-gray-700 hover:text-gray-900 font-medium">Portfolio</a>
                    <a href="#services" class="text-gray-700 hover:text-gray-900 font-medium">Services</a>
                    <a href="#contact" class="text-gray-700 hover:text-gray-900 font-medium">Contact</a>
                    @auth
                        <a href="/admin" class="text-gray-700 hover:text-gray-900 font-medium">Admin</a>
                    @else
                        <a href="/login" class="text-gray-700 hover:text-gray-900 font-medium">Connexion</a>
                    @endauth
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br" style="background: linear-gradient(135deg, ${config.primaryColor}10 0%, ${config.secondaryColor}10 50%, ${config.accentColor}10 100%);"></div>
        <div class="text-center z-10 max-w-4xl mx-auto px-4">
            <div class="w-32 h-32 mx-auto mb-8 rounded-full border-4 overflow-hidden" style="border-color: ${config.primaryColor}">
                <div class="w-full h-full bg-gradient-to-br flex items-center justify-center text-white text-4xl font-bold" style="background: linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%);">
                    {{ substr('${config.name}', 0, 1) }}
                </div>
            </div>
            <h1 class="text-5xl md:text-7xl font-bold mb-6 text-gray-900">
                Bonjour, je suis <span style="color: ${config.primaryColor}">${config.name}</span>
            </h1>
            <p class="text-xl md:text-2xl text-gray-600 mb-8">Designer Créatif & Développeur Full Stack</p>
            <p class="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
                Je crée des expériences numériques uniques qui allient créativité, technologie et performance pour donner vie à vos idées.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#portfolio" class="px-8 py-3 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:scale-105" style="background-color: ${config.primaryColor}">
                    Voir mon travail
                </a>
                <a href="#contact" class="px-8 py-3 rounded-full border-2 font-semibold text-lg transition-all duration-300 hover:scale-105" style="border-color: ${config.secondaryColor}; color: ${config.secondaryColor}">
                    Me contacter
                </a>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-20 bg-white">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold mb-4 text-gray-900">À propos de moi</h2>
                <p class="text-xl text-gray-600">Passionné par l\'innovation et l\'excellence</p>
            </div>
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <div class="aspect-square rounded-2xl overflow-hidden shadow-xl">
                        <div class="w-full h-full bg-gradient-to-br flex items-center justify-center text-white text-6xl font-bold" style="background: linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%);">
                            👨‍💻
                        </div>
                    </div>
                </div>
                <div>
                    <h3 class="text-2xl font-bold mb-6 text-gray-900">Ma philosophie créative</h3>
                    <p class="text-gray-600 mb-6 leading-relaxed">
                        Avec plus de 5 ans d\'expérience dans le domaine du design et du développement, 
                        je me spécialise dans la création d\'expériences utilisateur exceptionnelles qui 
                        combinent esthétique moderne et fonctionnalité intuitive.
                    </p>
                    <div class="space-y-4">
                        <div class="flex items-center space-x-3">
                            <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background-color: ${config.accentColor}">
                                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <span class="text-gray-700">Design centré utilisateur</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background-color: ${config.accentColor}">
                                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <span class="text-gray-700">Technologies modernes</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background-color: ${config.accentColor}">
                                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <span class="text-gray-700">Performance optimale</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Portfolio Section -->
    <section id="portfolio" class="py-20 bg-gray-50">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold mb-4 text-gray-900">Mon Portfolio</h2>
                <p class="text-xl text-gray-600">Découvrez une sélection de mes projets récents</p>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                @for ($i = 1; $i <= 6; $i++)
                <div class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                    <div class="aspect-video bg-gradient-to-br relative overflow-hidden" style="background: linear-gradient(135deg, {{ ['${config.primaryColor}', '${config.secondaryColor}', '${config.accentColor}', '${config.primaryColor}80', '${config.secondaryColor}80', '${config.accentColor}80'][$i-1] }} 0%, {{ ['${config.secondaryColor}', '${config.accentColor}', '${config.primaryColor}', '${config.secondaryColor}80', '${config.accentColor}80', '${config.primaryColor}80'][$i-1] }} 100%);">
                        <div class="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
                            Projet {{ $i }}
                        </div>
                        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-semibold mb-2 text-gray-900">Projet {{ $i }}</h3>
                        <p class="text-gray-600 mb-4">Description détaillée du projet créatif et des technologies utilisées.</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            @foreach (['Design', 'Développement', 'UI/UX'] as $tag)
                            <span class="px-3 py-1 text-xs font-medium rounded-full" style="background-color: ${config.accentColor}20; color: ${config.accentColor}">
                                {{ $tag }}
                            </span>
                            @endforeach
                        </div>
                        <a href="#" class="inline-flex items-center font-medium hover:underline" style="color: ${config.primaryColor}">
                            Voir le projet
                            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                            </svg>
                        </a>
                    </div>
                </div>
                @endfor
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-20 bg-white">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold mb-4 text-gray-900">Mes Services</h2>
                <p class="text-xl text-gray-600">Solutions créatives pour tous vos besoins numériques</p>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="text-center p-8 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-colors">
                    <div class="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style="background-color: ${config.primaryColor}">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0H3a2 2 0 01-2-2V7a2 2 0 012-2h3m10 0h3a2 2 0 012 2v10a2 2 0 01-2 2h-3m-6 0a1 1 0 100-2 1 1 0 000 2z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-4 text-gray-900">Design UI/UX</h3>
                    <p class="text-gray-600">Création d\'interfaces intuitives et d\'expériences utilisateur mémorables</p>
                </div>
                <div class="text-center p-8 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-colors">
                    <div class="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style="background-color: ${config.secondaryColor}">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-4 text-gray-900">Développement Web</h3>
                    <p class="text-gray-600">Création de sites web modernes, rapides et optimisés pour tous les appareils</p>
                </div>
                <div class="text-center p-8 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-colors">
                    <div class="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style="background-color: ${config.accentColor}">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-4 text-gray-900">Stratégie Créative</h3>
                    <p class="text-gray-600">Conseil en stratégie digitale et accompagnement dans vos projets créatifs</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20 bg-gray-50">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold mb-4 text-gray-900">Travaillons Ensemble</h2>
                <p class="text-xl text-gray-600">Prêt à donner vie à votre prochain projet ?</p>
            </div>
            <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <form class="space-y-6">
                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                            <input type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent" style="focus:ring-color: ${config.primaryColor}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input type="email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent" style="focus:ring-color: ${config.primaryColor}">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Sujet</label>
                        <input type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent" style="focus:ring-color: ${config.primaryColor}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                        <textarea rows="5" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent" style="focus:ring-color: ${config.primaryColor}"></textarea>
                    </div>
                    <div class="text-center">
                        <button type="submit" class="px-8 py-3 rounded-lg text-white font-semibold text-lg transition-all duration-300 hover:scale-105" style="background-color: ${config.primaryColor}">
                            Envoyer le message
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h3 class="text-2xl font-bold mb-4" style="color: ${config.primaryColor}">${config.name}</h3>
                <p class="text-gray-400 mb-6">Designer Créatif & Développeur Full Stack</p>
                <div class="flex justify-center space-x-6 mb-8">
                    <a href="#" class="w-12 h-12 rounded-full flex items-center justify-center transition-colors" style="background-color: ${config.primaryColor}">
                        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
                        </svg>
                    </a>
                    <a href="#" class="w-12 h-12 rounded-full flex items-center justify-center transition-colors" style="background-color: ${config.secondaryColor}">
                        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
                        </svg>
                    </a>
                    <a href="#" class="w-12 h-12 rounded-full flex items-center justify-center transition-colors" style="background-color: ${config.accentColor}">
                        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clip-rule="evenodd"></path>
                        </svg>
                    </a>
                </div>
                <p class="text-gray-400">&copy; {{ date('Y') }} ${config.name}. Tous droits réservés.</p>
            </div>
        </div>
    </footer>

    <!-- Smooth scrolling script -->
    <script>
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    </script>
</body>
</html>
TEMPLATE_EOF
            ;;
        *)
            log_warning "Template non reconnu, utilisation du template par défaut..."
            ;;
    esac
    
    log_success "Template ${config.template} appliqué avec succès!"
}

# Configurer le système d'administration
setup_admin_panel() {
    log_info "Configuration du panel d'administration..."
    
    # Ajouter les routes d'administration
    cat > routes/web.php << 'ADMIN_ROUTES_EOF'
<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\AdminController;
use App\\Http\\Controllers\\Auth\\AuthenticatedSessionController;

// Page d'accueil publique
Route::get('/', function () {
    return view('welcome');
});

// Routes d'authentification
Route::get('/login', function () {
    return view('auth.login');
})->name('login');

Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

// Panel d'administration (protégé par authentification)
Route::middleware('auth')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/products', [AdminController::class, 'products'])->name('products');
    Route::get('/orders', [AdminController::class, 'orders'])->name('orders');
    Route::get('/customers', [AdminController::class, 'customers'])->name('customers');
    Route::get('/settings', [AdminController::class, 'settings'])->name('settings');
    Route::get('/content', [AdminController::class, 'content'])->name('content');
    Route::put('/content', [AdminController::class, 'updateContent'])->name('content.update');
});
ADMIN_ROUTES_EOF

    # Créer le contrôleur d'administration
    cat > app/Http/Controllers/AdminController.php << 'ADMIN_CONTROLLER_EOF'
<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use App\\Models\\User;
use App\\Models\\SiteContent;

class AdminController extends Controller
{
    public function dashboard()
    {
        \$stats = [
            'users' => User::count(),
            'products' => 0, // Sera implémenté avec le modèle Product
            'orders' => 0,   // Sera implémenté avec le modèle Order
            'revenue' => 0   // Sera calculé depuis les commandes
        ];
        
        return view('admin.dashboard', compact('stats'));
    }
    
    public function products()
    {
        return view('admin.products');
    }
    
    public function orders()
    {
        return view('admin.orders');
    }
    
    public function customers()
    {
        \$customers = User::latest()->paginate(15);
        return view('admin.customers', compact('customers'));
    }
    
    public function settings()
    {
        \$config = config('brand');
        return view('admin.settings', compact('config'));
    }
    
    public function content()
    {
        \$contents = \\App\\Models\\SiteContent::orderBy('section')->orderBy('key')->get()->groupBy('section');
        return view('admin.content', compact('contents'));
    }
    
    public function updateContent(Request \$request)
    {
        \$contents = \$request->input('contents', []);
        
        foreach (\$contents as \$key => \$content) {
            if (isset(\$content['id'], \$content['value'])) {
                \\App\\Models\\SiteContent::where('id', \$content['id'])
                    ->update(['value' => \$content['value']]);
            }
        }
        
        return redirect()->route('admin.content')->with('success', 'Contenu mis à jour avec succès!');
    }
}
ADMIN_CONTROLLER_EOF

    # Créer le contrôleur d'authentification
    mkdir -p app/Http/Controllers/Auth
    cat > app/Http/Controllers/Auth/AuthenticatedSessionController.php << 'AUTH_CONTROLLER_EOF'
<?php

namespace App\\Http\\Controllers\\Auth;

use App\\Http\\Controllers\\Controller;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;
use Illuminate\\Validation\\ValidationException;

class AuthenticatedSessionController extends Controller
{
    public function store(Request \$request)
    {
        \$request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt(\$request->only('email', 'password'), \$request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        \$request->session()->regenerate();

        // Redirection différente selon le type de requête
        if (\$request->wantsJson()) {
            return response()->json([
                'user' => Auth::user(),
                'token' => \$request->user()->createToken('auth-token')->plainTextToken,
            ]);
        }

        return redirect()->intended('/admin');
    }

    public function destroy(Request \$request)
    {
        Auth::guard('web')->logout();

        \$request->session()->invalidate();
        \$request->session()->regenerateToken();

        if (\$request->wantsJson()) {
            return response()->json(['message' => 'Logged out successfully']);
        }

        return redirect('/');
    }
}
AUTH_CONTROLLER_EOF

    # Créer les vues d'administration
    mkdir -p resources/views/admin
    mkdir -p resources/views/auth
    
    # Layout admin
    cat > resources/views/admin/layout.blade.php << 'ADMIN_LAYOUT_EOF'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Administration') - {{ config('brand.name', '${config.name}') }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '{{ config("brand.colors.primary", "${config.primaryColor}") }}',
                        secondary: '{{ config("brand.colors.secondary", "${config.secondaryColor}") }}',
                        accent: '{{ config("brand.colors.accent", "${config.accentColor}") }}'
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gray-100">
    <div class="flex h-screen">
        <!-- Sidebar -->
        <div class="w-64 bg-white shadow-lg">
            <div class="p-6">
                <h1 class="text-xl font-bold text-primary">{{ config('brand.name', '${config.name}') }}</h1>
                <p class="text-sm text-gray-600">Administration</p>
            </div>
            <nav class="mt-6">
                <a href="{{ route('admin.dashboard') }}" class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary {{ request()->routeIs('admin.dashboard') ? 'bg-primary/10 text-primary border-r-2 border-primary' : '' }}">
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"></path>
                    </svg>
                    Tableau de bord
                </a>
                <a href="{{ route('admin.products') }}" class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary {{ request()->routeIs('admin.products') ? 'bg-primary/10 text-primary border-r-2 border-primary' : '' }}">
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                    </svg>
                    Produits
                </a>
                <a href="{{ route('admin.orders') }}" class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary {{ request()->routeIs('admin.orders') ? 'bg-primary/10 text-primary border-r-2 border-primary' : '' }}">
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    Commandes
                </a>
                <a href="{{ route('admin.customers') }}" class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary {{ request()->routeIs('admin.customers') ? 'bg-primary/10 text-primary border-r-2 border-primary' : '' }}">
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    </svg>
                    Clients
                </a>
                <a href="{{ route('admin.content') }}" class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary {{ request()->routeIs('admin.content') ? 'bg-primary/10 text-primary border-r-2 border-primary' : '' }}">
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Contenu
                </a>
                <a href="{{ route('admin.settings') }}" class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary {{ request()->routeIs('admin.settings') ? 'bg-primary/10 text-primary border-r-2 border-primary' : '' }}">
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Paramètres
                </a>
            </nav>
            <div class="absolute bottom-0 w-64 p-6 border-t">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {{ substr(Auth::user()->username ?? 'U', 0, 1) }}
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">{{ Auth::user()->username ?? 'Utilisateur' }}</p>
                        <form method="POST" action="{{ route('logout') }}" class="inline">
                            @csrf
                            <button type="submit" class="text-xs text-gray-500 hover:text-gray-700">Déconnexion</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main content -->
        <div class="flex-1 overflow-auto">
            <header class="bg-white shadow-sm border-b">
                <div class="px-6 py-4">
                    <h1 class="text-2xl font-semibold text-gray-900">@yield('title', 'Administration')</h1>
                </div>
            </header>
            <main class="p-6">
                @yield('content')
            </main>
        </div>
    </div>
</body>
</html>
ADMIN_LAYOUT_EOF

    # Vue du tableau de bord
    cat > resources/views/admin/dashboard.blade.php << 'DASHBOARD_EOF'
@extends('admin.layout')

@section('title', 'Tableau de bord')

@section('content')
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
            <div class="p-3 rounded-full bg-primary/10">
                <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </div>
            <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Clients</p>
                <p class="text-2xl font-semibold text-gray-900">{{ \$stats['users'] }}</p>
            </div>
        </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
            <div class="p-3 rounded-full bg-secondary/10">
                <svg class="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
            </div>
            <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Produits</p>
                <p class="text-2xl font-semibold text-gray-900">{{ \$stats['products'] }}</p>
            </div>
        </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
            <div class="p-3 rounded-full bg-accent/10">
                <svg class="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
            </div>
            <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Commandes</p>
                <p class="text-2xl font-semibold text-gray-900">{{ \$stats['orders'] }}</p>
            </div>
        </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
            </div>
            <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Chiffre d'affaires</p>
                <p class="text-2xl font-semibold text-gray-900">€{{ \$stats['revenue'] }}</p>
            </div>
        </div>
    </div>
</div>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Activité récente</h3>
        </div>
        <div class="p-6">
            <div class="text-center text-gray-500 py-8">
                <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2v6z"></path>
                </svg>
                <p>Aucune activité récente</p>
            </div>
        </div>
    </div>

    <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Actions rapides</h3>
        </div>
        <div class="p-6">
            <div class="space-y-3">
                <a href="{{ route('admin.products') }}" class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg class="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Ajouter un produit
                </a>
                <a href="{{ route('admin.orders') }}" class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg class="w-5 h-5 text-secondary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    Voir les commandes
                </a>
                <a href="{{ route('admin.customers') }}" class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg class="w-5 h-5 text-accent mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    </svg>
                    Gérer les clients
                </a>
            </div>
        </div>
    </div>
</div>
@endsection
DASHBOARD_EOF

    # Vue de gestion des produits
    cat > resources/views/admin/products.blade.php << 'PRODUCTS_EOF'
@extends('admin.layout')

@section('title', 'Gestion des produits')

@section('content')
<div class="flex justify-between items-center mb-6">
    <div>
        <h2 class="text-xl font-semibold text-gray-900">Produits</h2>
        <p class="text-gray-600">Gérez votre catalogue de produits</p>
    </div>
    <!-- Bouton pour afficher le formulaire -->
    <button id="show-add-product" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
        Ajouter un produit
    </button>
</div>

<!-- Formulaire d'ajout de produit (masqué par défaut) -->
<div id="add-product-form" class="bg-white rounded-lg shadow p-6 mb-6" style="display:none;">
    <h3 class="text-lg font-semibold mb-4">Ajouter un produit</h3>
    <form id="productForm">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" name="name" placeholder="Nom" class="px-3 py-2 border rounded" required>
            <input type="text" name="description" placeholder="Description" class="px-3 py-2 border rounded" required>
            <input type="number" name="price" placeholder="Prix (€)" class="px-3 py-2 border rounded" min="0" step="0.01" required>
            <input type="number" name="stock_quantity" placeholder="Stock" class="px-3 py-2 border rounded" min="0" required>
        </div>
        <div class="flex justify-end mt-4">
            <button type="button" id="cancel-add-product" class="mr-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Annuler</button>
            <button type="submit" class="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">Ajouter</button>
        </div>
    </form>
</div>

<!-- Tableau des produits -->
<table id="products-table" class="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow" style="display:none;">
    <thead>
        <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Prix</th>
            <th>Stock</th>
        </tr>
    </thead>
    <tbody>
        <!-- Les produits seront injectés ici -->
    </tbody>
</table>
<div id="no-products" class="text-center text-gray-500 py-12" style="display:none;">
    <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
    </svg>
    <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun produit</h3>
    <p class="text-gray-500 mb-4">Commencez par ajouter votre premier produit</p>
    <button id="show-add-product-2" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
        Ajouter un produit
    </button>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    const addForm = document.getElementById("add-product-form");
    const showBtn = document.getElementById("show-add-product");
    const showBtn2 = document.getElementById("show-add-product-2");
    const cancelBtn = document.getElementById("cancel-add-product");
    const productForm = document.getElementById("productForm");

    function fetchProducts() {
        fetch("/api/products")
            .then(res => res.json())
            .then(products => {
                const tbody = document.querySelector("#products-table tbody");
                const noProducts = document.getElementById("no-products");
                tbody.innerHTML = "";
                if (products.length === 0) {
                    noProducts.style.display = "";
                    document.getElementById("products-table").style.display = "none";
                } else {
                    noProducts.style.display = "none";
                    document.getElementById("products-table").style.display = "";
                    products.forEach(product => {
                        tbody.innerHTML += '<tr>'
                            + '<td>' + product.name + '</td>'
                            + '<td>' + product.description + '</td>'
                            + '<td>' + product.price + ' €</td>'
                            + '<td>' + product.stock_quantity + '</td>'
                            + '</tr>';
                    });
                }
            });
    }

    fetchProducts();

    if (showBtn) showBtn.onclick = () => { addForm.style.display = ""; };
    if (showBtn2) showBtn2.onclick = () => { addForm.style.display = ""; };
    if (cancelBtn) cancelBtn.onclick = () => { addForm.style.display = "none"; };

    if (productForm) {
        productForm.onsubmit = function (e) {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(productForm).entries());
            fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
            .then(res => {
                if (res.ok) {
                    addForm.style.display = "none";
                    productForm.reset();
                    fetchProducts();
                } else {
                    alert("Erreur lors de l'ajout du produit.");
                }
            });
        };
    }
});
</script>
@endsection
PRODUCTS_EOF

    # Vue de gestion des commandes
    cat > resources/views/admin/orders.blade.php << 'ORDERS_EOF'
@extends('admin.layout')

@section('title', 'Gestion des commandes')

@section('content')
<div class="flex justify-between items-center mb-6">
    <div>
        <h2 class="text-xl font-semibold text-gray-900">Commandes</h2>
        <p class="text-gray-600">Suivez et gérez toutes les commandes</p>
    </div>
</div>

<div class="bg-white rounded-lg shadow">
    <div class="p-6">
        <div class="text-center text-gray-500 py-12">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune commande</h3>
            <p class="text-gray-500">Les commandes apparaîtront ici une fois que les clients commenceront à acheter</p>
        </div>
    </div>
</div>
@endsection
ORDERS_EOF

    # Vue de gestion des clients
    cat > resources/views/admin/customers.blade.php << 'CUSTOMERS_EOF'
@extends('admin.layout')

@section('title', 'Gestion des clients')

@section('content')
<div class="flex justify-between items-center mb-6">
    <div>
        <h2 class="text-xl font-semibold text-gray-900">Clients</h2>
        <p class="text-gray-600">Gérez votre base de clients</p>
    </div>
</div>

@if(\$customers->count() > 0)
<div class="bg-white rounded-lg shadow overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
            <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inscription</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            @foreach(\$customers as \$customer)
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                            {{ substr(\$customer->username ?? 'U', 0, 1) }}
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">{{ \$customer->username ?? 'Utilisateur' }}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ \$customer->email }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ \$customer->created_at->format('d/m/Y') }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-primary hover:text-primary/80">Voir</button>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
    <div class="px-6 py-3 bg-gray-50">
        {{ \$customers->links() }}
    </div>
</div>
@else
<div class="bg-white rounded-lg shadow">
    <div class="p-6">
        <div class="text-center text-gray-500 py-12">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun client</h3>
            <p class="text-gray-500 mb-4">Les clients apparaîtront ici après leur inscription</p>
        </div>
    </div>
</div>
@endif
@endsection
CUSTOMERS_EOF

    # Vue des paramètres
    cat > resources/views/admin/settings.blade.php << 'SETTINGS_EOF'
@extends('admin.layout')

@section('title', 'Paramètres')

@section('content')
<div class="max-w-4xl">
    <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-900">Paramètres du site</h2>
        <p class="text-gray-600">Configurez les paramètres de votre site</p>
    </div>

    <div class="bg-white rounded-lg shadow">
        <div class="p-6">
            <form class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nom du site</label>
                    <input type="text" value="{{ \$config['name'] ?? '${config.name}' }}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Template</label>
                    <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="modern-saas" {{ (\$config['template'] ?? '${config.template}') === 'modern-saas' ? 'selected' : '' }}>Modern SAAS</option>
                        <option value="e-commerce" {{ (\$config['template'] ?? '${config.template}') === 'e-commerce' ? 'selected' : '' }}>E-commerce</option>
                        <option value="portfolio" {{ (\$config['template'] ?? '${config.template}') === 'portfolio' ? 'selected' : '' }}>Portfolio</option>
                    </select>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Couleur primaire</label>
                        <div class="flex items-center space-x-2">
                            <input type="color" value="{{ \$config['colors']['primary'] ?? '${config.primaryColor}' }}" class="w-12 h-10 border border-gray-300 rounded cursor-pointer">
                            <input type="text" value="{{ \$config['colors']['primary'] ?? '${config.primaryColor}' }}" class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Couleur secondaire</label>
                        <div class="flex items-center space-x-2">
                            <input type="color" value="{{ \$config['colors']['secondary'] ?? '${config.secondaryColor}' }}" class="w-12 h-10 border border-gray-300 rounded cursor-pointer">
                            <input type="text" value="{{ \$config['colors']['secondary'] ?? '${config.secondaryColor}' }}" class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Couleur d'accent</label>
                        <div class="flex items-center space-x-2">
                            <input type="color" value="{{ \$config['colors']['accent'] ?? '${config.accentColor}' }}" class="w-12 h-10 border border-gray-300 rounded cursor-pointer">
                            <input type="text" value="{{ \$config['colors']['accent'] ?? '${config.accentColor}' }}" class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                        </div>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-4">Fonctionnalités</label>
                    <div class="space-y-3">
                        <label class="flex items-center">
                            <input type="checkbox" {{ (\$config['features']['auth'] ?? ${config.features.auth ? 'true' : 'false'}) ? 'checked' : '' }} class="rounded border-gray-300 text-primary focus:ring-primary">
                            <span class="ml-2 block text-sm text-gray-900">Authentification</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" {{ (\$config['features']['payment'] ?? ${config.features.payment ? 'true' : 'false'}) ? 'checked' : '' }} class="rounded border-gray-300 text-primary focus:ring-primary">
                            <span class="ml-2 block text-sm text-gray-900">Paiements</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" {{ (\$config['features']['blog'] ?? ${config.features.blog ? 'true' : 'false'}) ? 'checked' : '' }} class="rounded border-gray-300 text-primary focus:ring-primary">
                            <span class="ml-2 block text-sm text-gray-900">Blog</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" {{ (\$config['features']['analytics'] ?? ${config.features.analytics ? 'true' : 'false'}) ? 'checked' : '' }} class="rounded border-gray-300 text-primary focus:ring-primary">
                            <span class="ml-2 block text-sm text-gray-900">Analytics</span>
                        </label>
                    </div>
                </div>

                <div class="flex justify-end">
                    <button type="submit" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                        Sauvegarder les modifications
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
SETTINGS_EOF

    # Vue de gestion de contenu
    cat > resources/views/admin/content.blade.php << 'CONTENT_EOF'
@extends('admin.layout')

@section('title', 'Gestion du Contenu')

@section('content')
<div class="max-w-6xl">
    <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-900">Gestion du Contenu</h2>
        <p class="text-gray-600">Modifiez les titres et descriptions de votre site</p>
    </div>

    @if(session('success'))
        <div class="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {{ session('success') }}
        </div>
    @endif

    <form action="{{ route('admin.content.update') }}" method="POST">
        @csrf
        @method('PUT')
        
        <div class="bg-white rounded-lg shadow">
            <div class="p-6">
                @foreach(\$contents as \$sectionName => \$sectionContents)
                <div class="mb-6 p-4 border border-gray-200 rounded-lg">
                    <div class="mb-4">
                        <h3 class="text-lg font-medium text-gray-900 mb-2 capitalize">{{ str_replace('_', ' ', \$sectionName) }}</h3>
                        <p class="text-sm text-gray-500">Modifiez le contenu de la section {{ \$sectionName }}</p>
                    </div>
                    
                    <div class="space-y-4">
                        @foreach(\$sectionContents as \$content)
                        <div>
                            <label for="content_{{ \$content->id }}" class="block text-sm font-medium text-gray-700 mb-2">
                                {{ ucfirst(str_replace('_', ' ', \$content->key)) }}
                            </label>
                            @if(in_array(\$content->key, ['description', 'subtitle', 'content']) || strlen(\$content->value) > 100)
                            <textarea 
                                id="content_{{ \$content->id }}"
                                name="contents[{{ \$content->id }}][value]" 
                                rows="3"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Saisissez le contenu..."
                            >{{ old('contents.' . \$content->id . '.value', \$content->value) }}</textarea>
                            @else
                            <input 
                                type="text" 
                                id="content_{{ \$content->id }}"
                                name="contents[{{ \$content->id }}][value]" 
                                value="{{ old('contents.' . \$content->id . '.value', \$content->value) }}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Saisissez le contenu..."
                            >
                            @endif
                            <input type="hidden" name="contents[{{ \$content->id }}][id]" value="{{ \$content->id }}">
                            @error('contents.' . \$content->id . '.value')
                                <p class="mt-1 text-sm text-red-600">{{ \$message }}</p>
                            @enderror
                        </div>
                        @endforeach
                    </div>
                </div>
                @endforeach
                
                @if(\$contents->isEmpty())
                <div class="text-center py-8">
                    <div class="text-gray-400 text-lg mb-2">📝</div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun contenu à modifier</h3>
                    <p class="text-gray-500 mb-4">Le contenu sera disponible après la génération complète du site.</p>
                </div>
                @endif
            </div>
            
            @if(!\$contents->isEmpty())
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                <div class="flex justify-between items-center">
                    <p class="text-sm text-gray-600">
                        {{ \$contents->flatten()->count() }} élément(s) de contenu dans {{ \$contents->count() }} section(s)
                    </p>
                    <button 
                        type="submit" 
                        class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        Sauvegarder les modifications
                    </button>
                </div>
            </div>
            @endif
        </div>
    </form>
</div>
@endsection
CONTENT_EOF

    # Vue de connexion
    cat > resources/views/auth/login.blade.php << 'LOGIN_EOF'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion - {{ config('brand.name', '${config.name}') }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '{{ config("brand.colors.primary", "${config.primaryColor}") }}',
                        secondary: '{{ config("brand.colors.secondary", "${config.secondaryColor}") }}',
                        accent: '{{ config("brand.colors.accent", "${config.accentColor}") }}'
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Connexion à {{ config('brand.name', '${config.name}') }}
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Accédez à votre panel d'administration
                </p>
            </div>
            <form class="mt-8 space-y-6" method="POST" action="{{ route('login') }}">
                @csrf
                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label for="email" class="sr-only">Adresse email</label>
                        <input id="email" name="email" type="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="Adresse email">
                    </div>
                    <div>
                        <label for="password" class="sr-only">Mot de passe</label>
                        <input id="password" name="password" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="Mot de passe">
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input id="remember" name="remember" type="checkbox" class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded">
                        <label for="remember" class="ml-2 block text-sm text-gray-900">
                            Se souvenir de moi
                        </label>
                    </div>
                </div>

                <div>
                    <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        Se connecter
                    </button>
                </div>

                <div class="text-center">
                    <a href="/" class="text-sm text-primary hover:text-primary/80">
                        ← Retour au site
                    </a>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
LOGIN_EOF
    
    log_success "Panel d'administration configuré!"
}

# Configuration de Laravel
setup_laravel() {
    log_info "Configuration de Laravel..."
    
    # Générer la clé d'application
    php artisan key:generate
    
    # Créer la base de données SQLite
    touch database/database.sqlite
    
    # Lancer les migrations
    php artisan migrate --seed
    
    # Créer le lien de stockage
    php artisan storage:link
    
    # Générer la documentation Swagger (si disponible)
    if php artisan list | grep -q "l5-swagger:generate"; then
        log_info "Génération de la documentation Swagger..."
        # Créer un fichier de configuration Swagger temporaire pour éviter les erreurs de namespace
        cat > config/l5-swagger-temp.php << 'SWAGGER_EOF'
<?php
return [
    'default' => 'default',
    'documentations' => [
        'default' => [
            'api' => [
                'title' => 'API Documentation',
            ],
            'routes' => [
                'api' => 'api/documentation',
            ],
            'paths' => [
                'use_absolute_path' => env('L5_SWAGGER_USE_ABSOLUTE_PATH', true),
                'docs_json' => 'api-docs.json',
                'docs_yaml' => 'api-docs.yaml',
                'format_to_use_for_docs' => env('L5_FORMAT_TO_USE_FOR_DOCS', 'json'),
                'annotations' => [
                    base_path('app/Http/Controllers'),
                ],
            ],
        ],
    ],
    'defaults' => [
        'routes' => [
            'docs' => 'docs',
            'oauth2_callback' => 'api/oauth2-callback',
            'middleware' => [
                'api' => [],
                'asset' => [],
                'docs' => [],
                'oauth2_callback' => [],
            ],
            'group_options' => [],
        ],
        'paths' => [
            'docs' => storage_path('api-docs'),
            'views' => base_path('resources/views/vendor/l5-swagger'),
            'base' => env('L5_SWAGGER_BASE_PATH', null),
            'swagger_ui_assets_path' => env('L5_SWAGGER_UI_ASSETS_PATH', 'vendor/swagger-api/swagger-ui/dist/'),
            'excludes' => [],
        ],
        'scanOptions' => [
            'analyser' => null,
            'analysis' => null,
            'processors' => [],
            'pattern' => null,
            'exclude' => [],
            'open_api_spec_version' => env('L5_SWAGGER_OPEN_API_SPEC_VERSION', '3.0.0'),
        ],
        'securityDefinitions' => [
            'securitySchemes' => [
                'sanctum' => [
                    'type' => 'apiKey',
                    'description' => 'Enter token in format (Bearer <token>)',
                    'name' => 'Authorization',
                    'in' => 'header',
                ],
            ],
            'security' => [
                'sanctum' => [],
            ],
        ],
        'generate_always' => env('L5_SWAGGER_GENERATE_ALWAYS', false),
        'generate_yaml_copy' => env('L5_SWAGGER_GENERATE_YAML_COPY', false),
        'proxy' => false,
        'additional_config_url' => null,
        'operations_sort' => env('L5_SWAGGER_OPERATIONS_SORT', null),
        'validator_url' => null,
        'ui' => [
            'display' => [
                'dark_mode' => env('L5_SWAGGER_UI_DARK_MODE', false),
                'doc_expansion' => env('L5_SWAGGER_UI_DOC_EXPANSION', 'none'),
                'filter' => env('L5_SWAGGER_UI_FILTERS', true),
            ],
            'authorization' => [
                'persist_authorization' => env('L5_SWAGGER_UI_PERSIST_AUTHORIZATION', false),
            ],
        ],
        'constants' => [
            'L5_SWAGGER_CONST_HOST' => env('L5_SWAGGER_CONST_HOST', 'http://localhost'),
        ],
    ],
];
SWAGGER_EOF
        # Tentative de génération avec gestion d'erreur améliorée
        if ! php artisan l5-swagger:generate --config=l5-swagger-temp 2>/dev/null; then
            # Si échec, essayer sans config spécifique
            if ! php artisan l5-swagger:generate 2>/dev/null; then
                log_info "⚠️  Avertissement: Documentation Swagger non générée (erreurs d'annotations ou de namespace)"
                log_info "   Le site fonctionnera parfaitement sans la documentation Swagger"
            fi
        fi
        # Nettoyer le fichier temporaire
        rm -f config/l5-swagger-temp.php
    fi
    
    log_success "Laravel configuré!"
}

# Appliquer les personnalisations CSS
apply_customizations() {
    log_info "Application des personnalisations CSS..."
    
    # Créer le fichier CSS personnalisé
    cat > resources/css/custom.css << 'EOF'
/* Couleurs personnalisées générées */
:root {
    --primary-color: ${config.primaryColor};
    --secondary-color: ${config.secondaryColor};
    --accent-color: ${config.accentColor};
}

.bg-primary { background-color: var(--primary-color) !important; }
.text-primary { color: var(--primary-color) !important; }
.border-primary { border-color: var(--primary-color) !important; }

.bg-secondary { background-color: var(--secondary-color) !important; }
.text-secondary { color: var(--secondary-color) !important; }
.border-secondary { border-color: var(--secondary-color) !important; }

.bg-accent { background-color: var(--accent-color) !important; }
.text-accent { color: var(--accent-color) !important; }
.border-accent { border-color: var(--accent-color) !important; }
EOF
    
    log_success "Personnalisations appliquées!"
}

# Démarrer l'application
start_application() {
    log_info "Démarrage de l'application..."
    
    # Trouver un port disponible
    PORT=8000
    while lsof -i :\$PORT >/dev/null 2>&1; do
        PORT=\$((PORT + 1))
    done
    
    log_success "🚀 Votre site est prêt!"
    echo ""
    echo "==================== INFORMATIONS ===================="
    echo "🌐 URL du site: http://localhost:\$PORT"
    echo "📊 API Documentation: http://localhost:\$PORT/api/documentation"
    echo "🎨 Template: ${config.template}"
    echo "🎨 Couleurs:"
    echo "   • Primaire: ${config.primaryColor}"
    echo "   • Secondaire: ${config.secondaryColor}"
    echo "   • Accent: ${config.accentColor}"
    echo "======================================================="
    echo ""
    echo "💡 Pour arrêter le serveur: Ctrl+C"
    echo "💡 Pour redémarrer: php artisan serve --port=\$PORT"
    echo ""
    
    # Démarrer le serveur
    php artisan serve --host=127.0.0.1 --port=\$PORT
}

# Fonction principale d'installation
main() {
    log_info "Début de l'installation de ${config.name}"
    echo "Template: ${config.template}"
    echo "Couleurs: Primaire(${config.primaryColor}) Secondaire(${config.secondaryColor}) Accent(${config.accentColor})"
    echo ""
    
    check_requirements
    clone_project
    configure_project
    install_dependencies
    fix_user_model
    create_content_management
    apply_template
    setup_admin_panel
    setup_laravel
    apply_customizations
    start_application
}

# Lancer l'installation
main
`
}

// Generate site endpoint
router.post('/generate', async (req, res) => {
  try {
    const config: SiteConfig = req.body
    
    // Validate config
    if (!config.name || !config.primaryColor || !config.template) {
      return res.status(400).json({
        error: 'Missing required fields: name, primaryColor, template'
      })
    }

    console.log('📋 Received generation request:', config)

    // Generate installation script
    const scriptName = `install-${config.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}.sh`
    const scriptContent = generateInstallScript(config)
    
    // Create generated-packages directory if it doesn't exist
    const outputDir = path.join(__dirname, '../../../generated-packages')
    await fs.ensureDir(outputDir)
    
    // Write the installation script
    const scriptPath = path.join(outputDir, scriptName)
    await fs.writeFile(scriptPath, scriptContent, { mode: 0o755 })

    res.json({
      success: true,
      message: 'Script d\'installation généré avec succès',
      downloadUrl: `/api/generator/download/${scriptName}`,
      filename: scriptName,
      scriptType: 'installation'
    })

  } catch (error) {
    console.error('❌ Generation error:', error)
    res.status(500).json({
      error: 'Failed to generate site',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Download generated package
router.get('/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(__dirname, '../../../generated-packages', filename)
    
    console.log(`📥 Download request for: ${filename}`)
    console.log(`📁 File path: ${filePath}`)
    
    // Security check - ensure filename is safe
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\\\')) {
      return res.status(400).json({ error: 'Invalid filename' })
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${filePath}`)
      return res.status(404).json({ error: 'File not found' })
    }

    console.log(`✅ File found, sending download...`)
    
    // Set appropriate headers for script download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-Type', 'application/x-sh')
    
    // Send the file
    res.sendFile(filePath)

  } catch (error) {
    console.error('Download error:', error)
    res.status(500).json({ error: 'Download failed' })
  }
})

// Get generation status/history
router.get('/status', (req, res) => {
  res.json({
    status: 'active',
    message: 'Site generator is ready',
    supportedTemplates: ['modern-saas', 'e-commerce', 'portfolio'],
    features: ['auth', 'payment', 'blog', 'analytics']
  })
})

export { router as generatorRoutes }
