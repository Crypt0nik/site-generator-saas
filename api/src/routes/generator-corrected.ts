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

// Classe pour générer les templates
class TemplateGenerator {
  private config: SiteConfig

  constructor(config: SiteConfig) {
    this.config = config
  }

  // Génère le script d'installation principal
  generateInstallScript(): string {
    const projectName = this.config.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
    
    const scriptParts = [
      '#!/bin/bash',
      '',
      `# Script d'installation automatique pour ${this.config.name}`,
      `# Template: ${this.config.template}`,
      '',
      'set -e',
      '',
      `echo "Installation de votre site: ${this.config.name}"`,
      'echo "================================================="',
      '',
      '# Variables',
      `projectName="${projectName}"`,
      '',
      '# Couleurs pour les messages',
      "RED='\\033[0;31m'",
      "GREEN='\\033[0;32m'",
      "YELLOW='\\033[1;33m'",
      "BLUE='\\033[0;34m'",
      "NC='\\033[0m'",
      '',
      '# Fonction pour afficher les messages',
      'log_info() {',
      '    echo -e "${BLUE}ℹ️  $1${NC}"',
      '}',
      '',
      'log_success() {',
      '    echo -e "${GREEN}✅ $1${NC}"',
      '}',
      '',
      'log_warning() {',
      '    echo -e "${YELLOW}⚠️  $1${NC}"',
      '}',
      '',
      'log_error() {',
      '    echo -e "${RED}❌ $1${NC}"',
      '}',
      ''
    ]

    // Ajouter les fonctions principales
    scriptParts.push(...this.generateBashFunctions())
    
    // Ajouter l'exécution principale
    scriptParts.push(
      '# Fonction principale d\'installation',
      'main() {',
      `    log_info "Début de l'installation de ${this.config.name}"`,
      `    echo "Template: ${this.config.template}"`,
      `    echo "Couleurs: Primaire(${this.config.primaryColor}) Secondaire(${this.config.secondaryColor}) Accent(${this.config.accentColor})"`,
      '    echo ""',
      '    ',
      '    check_requirements',
      '    clone_project',
      '    configure_project',
      '    install_dependencies',
      '    setup_laravel',
      '    apply_customizations',
      '    start_application',
      '}',
      '',
      '# Lancer l\'installation',
      'main'
    )

    return scriptParts.join('\n')
  }

  // Génère les fonctions bash nécessaires
  private generateBashFunctions(): string[] {
    return [
      '# Vérifier les prérequis',
      'check_requirements() {',
      '    log_info "Vérification des prérequis..."',
      '    ',
      '    # Vérifier PHP',
      '    if ! command -v php &> /dev/null; then',
      '        log_error "PHP n\'est pas installé"',
      '        exit 1',
      '    fi',
      '    ',
      '    # Vérifier Composer',
      '    if ! command -v composer &> /dev/null; then',
      '        log_error "Composer n\'est pas installé"',
      '        exit 1',
      '    fi',
      '    ',
      '    # Vérifier Node.js',
      '    if ! command -v node &> /dev/null; then',
      '        log_error "Node.js n\'est pas installé"',
      '        exit 1',
      '    fi',
      '    ',
      '    log_success "Tous les prérequis sont installés"',
      '}',
      '',
      '# Cloner le projet de base',
      'clone_project() {',
      '    log_info "Clonage du projet Laravel..."',
      '    ',
      '    composer create-project laravel/laravel $projectName',
      '    cd $projectName',
      '    ',
      '    log_success "Projet Laravel créé avec succès"',
      '}',
      '',
      '# Configurer le projet',
      'configure_project() {',
      '    log_info "Configuration du projet..."',
      '    ',
      '    # Configurer l\'environnement',
      '    cp .env.example .env',
      '    php artisan key:generate',
      '    ',
      '    log_success "Configuration de base terminée"',
      '}',
      '',
      '# Installer les dépendances',
      'install_dependencies() {',
      '    log_info "Installation des dépendances..."',
      '    ',
      '    # Installer les dépendances PHP',
      '    composer install',
      '    ',
      '    # Installer les dépendances Node.js',
      '    npm install',
      '    ',
      '    log_success "Dépendances installées"',
      '}',
      '',
      '# Configuration Laravel spécifique',
      'setup_laravel() {',
      '    log_info "Configuration Laravel..."',
      '    ',
      '    # Créer la base de données',
      '    touch database/database.sqlite',
      '    ',
      '    # Configurer la base de données dans .env',
      '    sed -i \'s/DB_CONNECTION=mysql/DB_CONNECTION=sqlite/g\' .env',
      '    sed -i \'s/DB_DATABASE=laravel/DB_DATABASE=database\\/database.sqlite/g\' .env',
      '    ',
      '    # Exécuter les migrations',
      '    php artisan migrate:fresh --seed',
      '    ',
      '    log_success "Laravel configuré"',
      '}'
    ]
  }

  // Génère le modèle Modern SAAS Content
  generateModernSaasModel(): string {
    const modelParts = [
      '<?php',
      '',
      'namespace App\\Models;',
      '',
      'use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;',
      'use Illuminate\\Database\\Eloquent\\Model;',
      '',
      'class ModernSaasContent extends Model',
      '{',
      '    use HasFactory;',
      '',
      '    protected $fillable = [',
      '        \'section_key\',',
      '        \'title\',',
      '        \'subtitle\',',
      '        \'content\',',
      '        \'button_text\',',
      '        \'button_link\',',
      '        \'image_url\',',
      '        \'icon\',',
      '        \'is_active\',',
      '        \'order_position\'',
      '    ];',
      '',
      '    protected $casts = [',
      '        \'is_active\' => \'boolean\'',
      '    ];',
      '',
      '    public static function getSection($key)',
      '    {',
      '        return self::where(\'section_key\', $key)->where(\'is_active\', true)->orderBy(\'order_position\')->get();',
      '    }',
      '',
      '    public static function getSingleSection($key)',
      '    {',
      '        return self::where(\'section_key\', $key)->where(\'is_active\', true)->first();',
      '    }',
      '}'
    ]

    return modelParts.join('\n')
  }

  // Génère la migration
  generateMigration(): string {
    const migrationParts = [
      '<?php',
      '',
      'use Illuminate\\Database\\Migrations\\Migration;',
      'use Illuminate\\Database\\Schema\\Blueprint;',
      'use Illuminate\\Support\\Facades\\Schema;',
      '',
      'return new class extends Migration',
      '{',
      '    public function up()',
      '    {',
      '        Schema::create(\'modern_saas_content\', function (Blueprint $table) {',
      '            $table->id();',
      '            $table->string(\'section_key\')->index();',
      '            $table->string(\'title\')->nullable();',
      '            $table->string(\'subtitle\')->nullable();',
      '            $table->text(\'content\')->nullable();',
      '            $table->string(\'button_text\')->nullable();',
      '            $table->string(\'button_link\')->nullable();',
      '            $table->string(\'image_url\')->nullable();',
      '            $table->string(\'icon\')->nullable();',
      '            $table->boolean(\'is_active\')->default(true);',
      '            $table->integer(\'order_position\')->default(0);',
      '            $table->timestamps();',
      '        });',
      '    }',
      '',
      '    public function down()',
      '    {',
      '        Schema::dropIfExists(\'modern_saas_content\');',
      '    }',
      '};'
    ]

    return migrationParts.join('\n')
  }

  // Génère le contrôleur admin
  generateAdminController(): string {
    const controllerParts = [
      '<?php',
      '',
      'namespace App\\Http\\Controllers\\Admin;',
      '',
      'use App\\Http\\Controllers\\Controller;',
      'use Illuminate\\Http\\Request;',
      'use App\\Models\\ModernSaasContent;',
      '',
      'class ModernSaasController extends Controller',
      '{',
      '    public function index()',
      '    {',
      '        $sections = ModernSaasContent::orderBy(\'section_key\')->orderBy(\'order_position\')->get()->groupBy(\'section_key\');',
      '        return view(\'admin.modern-saas.index\', compact(\'sections\'));',
      '    }',
      '',
      '    public function edit($id)',
      '    {',
      '        $content = ModernSaasContent::findOrFail($id);',
      '        return response()->json($content);',
      '    }',
      '',
      '    public function update(Request $request, $id)',
      '    {',
      '        $validated = $request->validate([',
      '            \'title\' => \'nullable|string|max:255\',',
      '            \'subtitle\' => \'nullable|string|max:255\',',
      '            \'content\' => \'nullable|string\',',
      '            \'button_text\' => \'nullable|string|max:100\',',
      '            \'button_link\' => \'nullable|string|max:255\',',
      '            \'image_url\' => \'nullable|url|max:255\',',
      '            \'icon\' => \'nullable|string\',',
      '            \'is_active\' => \'boolean\',',
      '            \'order_position\' => \'integer|min:0\'',
      '        ]);',
      '',
      '        $content = ModernSaasContent::findOrFail($id);',
      '        $content->update($validated);',
      '',
      '        return response()->json([',
      '            \'success\' => true,',
      '            \'message\' => \'Contenu mis à jour avec succès\'',
      '        ]);',
      '    }',
      '',
      '    public function destroy($id)',
      '    {',
      '        $content = ModernSaasContent::findOrFail($id);',
      '        $content->delete();',
      '',
      '        return response()->json([',
      '            \'success\' => true,',
      '            \'message\' => \'Contenu supprimé avec succès\'',
      '        ]);',
      '    }',
      '',
      '    public function preview()',
      '    {',
      '        return redirect(\'/\');',
      '    }',
      '}'
    ]

    return controllerParts.join('\n')
  }

  // Génère les vues Blade
  generateBladeViews(): { [key: string]: string } {
    return {
      'admin/layout.blade.php': this.generateAdminLayout(),
      'admin/dashboard.blade.php': this.generateAdminDashboard(),
      'admin/modern-saas/index.blade.php': this.generateModernSaasIndex()
    }
  }

  private generateAdminLayout(): string {
    const layoutParts = [
      '<!DOCTYPE html>',
      '<html lang="fr">',
      '<head>',
      '    <meta charset="UTF-8">',
      '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
      `    <title>@yield('title', 'Administration') - {{ config('brand.name', '${this.config.name}') }}</title>`,
      '    <script src="https://cdn.tailwindcss.com"></script>',
      '    <script>',
      '        tailwind.config = {',
      '            theme: {',
      '                extend: {',
      '                    colors: {',
      `                        primary: '${this.config.primaryColor}',`,
      `                        secondary: '${this.config.secondaryColor}',`,
      `                        accent: '${this.config.accentColor}'`,
      '                    }',
      '                }',
      '            }',
      '        }',
      '    </script>',
      '    <meta name="csrf-token" content="{{ csrf_token() }}">',
      '</head>',
      '<body class="bg-gray-50">',
      '    <!-- Navigation -->',
      '    <nav class="bg-white shadow-sm border-b">',
      '        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">',
      '            <div class="flex justify-between h-16">',
      '                <div class="flex items-center">',
      '                    <a href="{{ route(\'admin.dashboard\') }}" class="text-xl font-bold text-gray-900">',
      `                        {{ config('brand.name', '${this.config.name}') }} Admin`,
      '                    </a>',
      '                </div>',
      '                <div class="flex items-center space-x-4">',
      '                    <a href="{{ route(\'admin.dashboard\') }}" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md">Dashboard</a>',
      '                    <a href="{{ route(\'admin.modern-saas.index\') }}" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md">Modern SAAS</a>',
      '                    <div class="flex items-center space-x-2">',
      '                        <span class="text-sm text-gray-500">{{ Auth::user()->name }}</span>',
      '                        <form method="POST" action="{{ route(\'logout\') }}" class="inline">',
      '                            @csrf',
      '                            <button type="submit" class="text-sm text-red-600 hover:text-red-800">Déconnexion</button>',
      '                        </form>',
      '                    </div>',
      '                </div>',
      '            </div>',
      '        </div>',
      '    </nav>',
      '',
      '    <!-- Contenu principal -->',
      '    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">',
      '        @yield(\'content\')',
      '    </main>',
      '</body>',
      '</html>'
    ]

    return layoutParts.join('\n')
  }

  private generateAdminDashboard(): string {
    const dashboardParts = [
      '@extends(\'admin.layout\')',
      '',
      '@section(\'content\')',
      '<div class="px-4 py-6 sm:px-0">',
      '    <div class="border-4 border-dashed border-gray-200 rounded-lg p-6">',
      '        <h1 class="text-3xl font-bold text-gray-900 mb-6">Dashboard d\'administration</h1>',
      '        ',
      '        <!-- Actions rapides -->',
      '        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">',
      '            <div class="bg-white overflow-hidden shadow rounded-lg">',
      '                <div class="p-6">',
      '                    <h3 class="text-lg leading-6 font-medium text-gray-900">Contenu Modern SAAS</h3>',
      '                    <p class="mt-2 text-sm text-gray-500">Gérez le contenu dynamique de votre site</p>',
      '                    <div class="mt-3">',
      '                        <a href="{{ route(\'admin.modern-saas.index\') }}" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-opacity-75">',
      '                            Gérer le contenu',
      '                        </a>',
      '                    </div>',
      '                </div>',
      '            </div>',
      '        </div>',
      '    </div>',
      '</div>',
      '@endsection'
    ]

    return dashboardParts.join('\n')
  }

  private generateModernSaasIndex(): string {
    const indexParts = [
      '@extends(\'admin.layout\')',
      '',
      '@section(\'content\')',
      '<div class="container mx-auto px-4 py-8">',
      '    <div class="flex justify-between items-center mb-8">',
      '        <div>',
      '            <h1 class="text-3xl font-bold text-gray-900">Gestion du contenu Modern SAAS</h1>',
      '            <p class="text-gray-600 mt-2">Modifiez facilement le contenu de votre site</p>',
      '        </div>',
      '        <div class="flex space-x-4">',
      '            <a href="{{ route(\'admin.modern-saas.preview\') }}" target="_blank" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">',
      '                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">',
      '                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>',
      '                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>',
      '                </svg>',
      '                Prévisualiser',
      '            </a>',
      '        </div>',
      '    </div>',
      '',
      '    <!-- Sections du contenu -->',
      '    @foreach($sections as $sectionKey => $contents)',
      '        <div class="bg-white rounded-lg shadow-md mb-8">',
      '            <div class="bg-gray-50 px-6 py-4 border-b">',
      '                <h2 class="text-xl font-semibold text-gray-800 capitalize">{{ str_replace(\'_\', \' \', $sectionKey) }}</h2>',
      '            </div>',
      '            <div class="p-6">',
      '                <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">',
      '                    @foreach($contents as $content)',
      '                        <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">',
      '                            <div class="flex justify-between items-start mb-3">',
      '                                <div class="flex items-center">',
      '                                    <span class="inline-block w-3 h-3 rounded-full {{ $content->is_active ? \'bg-green-500\' : \'bg-red-500\' }} mr-2"></span>',
      '                                    <span class="text-sm text-gray-500">Position {{ $content->order_position }}</span>',
      '                                </div>',
      '                                <div class="flex space-x-2">',
      '                                    <button onclick="editContent({{ $content->id }})" class="text-blue-600 hover:text-blue-800">',
      '                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">',
      '                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>',
      '                                        </svg>',
      '                                    </button>',
      '                                    <button onclick="deleteContent({{ $content->id }})" class="text-red-600 hover:text-red-800">',
      '                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">',
      '                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>',
      '                                        </svg>',
      '                                    </button>',
      '                                </div>',
      '                            </div>',
      '                            @if($content->title)',
      '                                <h3 class="font-semibold text-gray-900 mb-2">{{ Str::limit($content->title, 30) }}</h3>',
      '                            @endif',
      '                            @if($content->subtitle)',
      '                                <p class="text-sm text-gray-600 mb-2">{{ Str::limit($content->subtitle, 50) }}</p>',
      '                            @endif',
      '                            @if($content->content)',
      '                                <p class="text-xs text-gray-500 mb-3">{{ Str::limit($content->content, 80) }}</p>',
      '                            @endif',
      '                            @if($content->button_text)',
      '                                <div class="flex items-center justify-between">',
      '                                    <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{{ $content->button_text }}</span>',
      '                                    @if($content->button_link)',
      '                                        <span class="text-xs text-gray-400">→ {{ Str::limit($content->button_link, 20) }}</span>',
      '                                    @endif',
      '                                </div>',
      '                            @endif',
      '                        </div>',
      '                    @endforeach',
      '                </div>',
      '            </div>',
      '        </div>',
      '    @endforeach',
      '</div>',
      '',
      '<script>',
      'let currentContentId = null;',
      '',
      'function editContent(id) {',
      '    currentContentId = id;',
      '    fetch(`/admin/modern-saas/${id}/edit`)',
      '        .then(response => response.json())',
      '        .then(data => {',
      '            document.getElementById(\'title\').value = data.title || \'\';',
      '            document.getElementById(\'subtitle\').value = data.subtitle || \'\';',
      '            document.getElementById(\'content\').value = data.content || \'\';',
      '            document.getElementById(\'button_text\').value = data.button_text || \'\';',
      '            document.getElementById(\'button_link\').value = data.button_link || \'\';',
      '            document.getElementById(\'image_url\').value = data.image_url || \'\';',
      '            document.getElementById(\'icon\').value = data.icon || \'\';',
      '            document.getElementById(\'is_active\').checked = data.is_active;',
      '            document.getElementById(\'order_position\').value = data.order_position || 0;',
      '            document.getElementById(\'editModal\').classList.remove(\'hidden\');',
      '        })',
      '        .catch(error => {',
      '            alert(\'Erreur lors du chargement des données\');',
      '        });',
      '}',
      '',
      'function deleteContent(id) {',
      '    if (confirm(\'Êtes-vous sûr de vouloir supprimer ce contenu ?\')) {',
      '        fetch(`/admin/modern-saas/${id}`, {',
      '            method: \'DELETE\',',
      '            headers: {',
      '                \'X-CSRF-TOKEN\': document.querySelector(\'meta[name="csrf-token"]\').getAttribute(\'content\')',
      '            }',
      '        })',
      '        .then(response => response.json())',
      '        .then(data => {',
      '            if (data.success) {',
      '                alert(\'Contenu supprimé avec succès\');',
      '                location.reload();',
      '            } else {',
      '                alert(\'Erreur lors de la suppression\');',
      '            }',
      '        })',
      '        .catch(error => {',
      '            alert(\'Erreur lors de la suppression\');',
      '        });',
      '    }',
      '}',
      '</script>',
      '@endsection'
    ]

    return indexParts.join('\n')
  }

  // Génère le fichier CSS personnalisé
  generateCustomCSS(): string {
    const cssParts = [
      ':root {',
      `    --primary-color: ${this.config.primaryColor};`,
      `    --secondary-color: ${this.config.secondaryColor};`,
      `    --accent-color: ${this.config.accentColor};`,
      '}',
      '',
      '.bg-primary { background-color: var(--primary-color) !important; }',
      '.text-primary { color: var(--primary-color) !important; }',
      '.border-primary { border-color: var(--primary-color) !important; }',
      '',
      '.bg-secondary { background-color: var(--secondary-color) !important; }',
      '.text-secondary { color: var(--secondary-color) !important; }',
      '.border-secondary { border-color: var(--secondary-color) !important; }',
      '',
      '.bg-accent { background-color: var(--accent-color) !important; }',
      '.text-accent { color: var(--accent-color) !important; }',
      '.border-accent { border-color: var(--accent-color) !important; }'
    ]

    return cssParts.join('\n')
  }

  // Génère le seeder
  generateSeeder(): string {
    const seederParts = [
      '<?php',
      '',
      'namespace Database\\Seeders;',
      '',
      'use Illuminate\\Database\\Seeder;',
      'use App\\Models\\ModernSaasContent;',
      '',
      'class ModernSaasContentSeeder extends Seeder',
      '{',
      '    public function run()',
      '    {',
      '        $defaultContent = [',
      '            [',
      '                \'section_key\' => \'hero\',',
      '                \'title\' => \'Bienvenue sur votre plateforme SAAS\',',
      '                \'subtitle\' => \'Votre destination privilégiée pour des solutions innovantes et un service exceptionnel.\',',
      '                \'content\' => \'Découvrez ce qui fait de nous le leader de notre secteur.\',',
      '                \'button_text\' => \'Explorer les produits\',',
      '                \'button_link\' => \'/products\',',
      '                \'order_position\' => 1',
      '            ],',
      '            [',
      '                \'section_key\' => \'features_title\',',
      '                \'title\' => \'Pourquoi nous choisir ?\',',
      '                \'subtitle\' => \'Des solutions innovantes adaptées à vos besoins\',',
      '                \'order_position\' => 1',
      '            ],',
      '            [',
      '                \'section_key\' => \'features\',',
      '                \'title\' => \'Ultra rapide\',',
      '                \'content\' => \'Découvrez une vitesse et des performances inégalées grâce à notre technologie de pointe.\',',
      '                \'icon\' => \'M13 10V3L4 14h7v7l9-11h-7z\',',
      '                \'order_position\' => 1',
      '            ],',
      '            [',
      '                \'section_key\' => \'features\',',
      '                \'title\' => \'Fiable\',',
      '                \'content\' => \'Comptez sur notre infrastructure robuste et notre garantie de disponibilité de 99,9%.\',',
      '                \'icon\' => \'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z\',',
      '                \'order_position\' => 2',
      '            ],',
      '            [',
      '                \'section_key\' => \'features\',',
      '                \'title\' => \'Sécurisé\',',
      '                \'content\' => \'Vos données sont protégées par un chiffrement de niveau militaire et des audits de sécurité réguliers.\',',
      '                \'icon\' => \'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z\',',
      '                \'order_position\' => 3',
      '            ],',
      '            [',
      '                \'section_key\' => \'cta\',',
      '                \'title\' => \'Prêt à commencer ?\',',
      '                \'subtitle\' => \'Rejoignez des milliers d\\\'utilisateurs satisfaits et transformez votre entreprise dès aujourd\\\'hui.\',',
      '                \'content\' => \'Ne manquez pas cette opportunité de faire passer votre entreprise au niveau supérieur.\',',
      '                \'button_text\' => \'Commencez votre parcours dès aujourd\\\'hui\',',
      '                \'button_link\' => \'/register\',',
      '                \'order_position\' => 1',
      '            ]',
      '        ];',
      '',
      '        foreach ($defaultContent as $content) {',
      '            ModernSaasContent::create($content);',
      '        }',
      '    }',
      '}'
    ]

    return seederParts.join('\n')
  }

  // Génère tous les fichiers nécessaires
  generateAllFiles(): { [key: string]: string } {
    return {
      'install.sh': this.generateInstallScript(),
      'app/Models/ModernSaasContent.php': this.generateModernSaasModel(),
      'database/migrations/create_modern_saas_content_table.php': this.generateMigration(),
      'app/Http/Controllers/Admin/ModernSaasController.php': this.generateAdminController(),
      'database/seeders/ModernSaasContentSeeder.php': this.generateSeeder(),
      'resources/css/custom.css': this.generateCustomCSS(),
      ...this.generateBladeViews()
    }
  }
}

// Route pour générer un site
router.post('/generate', (req, res) => {
  try {
    const config: SiteConfig = req.body

    // Validation de base
    if (!config.name || !config.template) {
      return res.status(400).json({
        error: 'Configuration invalide'
      })
    }

    // Créer le générateur
    const generator = new TemplateGenerator(config)

    // Générer tous les fichiers
    const files = generator.generateAllFiles()

    // Retourner les fichiers générés
    res.json({
      success: true,
      files,
      projectName: config.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      config
    })

  } catch (error) {
    console.error('Erreur lors de la génération:', error)
    res.status(500).json({
      error: 'Erreur lors de la génération du site'
    })
  }
})

// Route pour télécharger le script d'installation
router.get('/download/:projectName', (req, res) => {
  const { projectName } = req.params
  
  // Configuration exemple (dans un vrai cas, ça viendrait de la base de données)
  const config: SiteConfig = {
    name: projectName,
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    accentColor: '#F59E0B',
    template: 'modern-saas',
    features: {
      auth: true,
      payment: false,
      blog: false,
      analytics: true
    }
  }

  const generator = new TemplateGenerator(config)
  const installScript = generator.generateInstallScript()

  res.setHeader('Content-Type', 'application/x-sh')
  res.setHeader('Content-Disposition', `attachment; filename="${projectName}-install.sh"`)
  res.send(installScript)
})

export default router
