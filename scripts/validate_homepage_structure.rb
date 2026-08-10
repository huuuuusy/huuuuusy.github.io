#!/usr/bin/env ruby
# frozen_string_literal: true

require "yaml"

ROOT = File.expand_path("..", __dir__)
CONFIG_PATH = File.join(ROOT, "_config.yml")
CONTENT_ROOT = File.join(ROOT, "_includes", "home", "content")
SECTIONS = %w[intro news background research publications projects honors activity contact].freeze
TEMPLATES = %w[homepage section publication-browser visitor-insights footer scripts].freeze
PUBLICATION_PARTS = %w[monograph lead-author collaborative workshop preprints].freeze
STYLE_PARTIALS = %w[homepage-foundation homepage-layout homepage-polish homepage-sections academic-template].freeze
NAVIGATION_TITLES = %w[About Background Research Publications Projects Service CV].freeze
LEGACY_TEMPLATE_PATHS = %w[
  _data/ui-text.yml
  _includes/comments.html
  _includes/page__hero.html
  _includes/social-share.html
  _layouts/archive.html
  _layouts/splash.html
  _sass/_archive.scss
  _sass/_navigation.scss
  assets/js/_main.js
  assets/js/main.min.js
  assets/js/plugins
  assets/js/vendor
  package.json
].freeze

errors = []
config = YAML.safe_load(File.read(CONFIG_PATH, encoding: "UTF-8"), aliases: true)
homepage = config.fetch("homepage", {})
visitor_insights = config.fetch("visitor_insights", {})
navigation = YAML.safe_load(File.read(File.join(ROOT, "_data", "navigation.yml"), encoding: "UTF-8"), aliases: true)

errors << "homepage.last_updated must use YYYY-MM" unless homepage["last_updated"].to_s.match?(/\A\d{4}-\d{2}\z/)
unless [true, false].include?(visitor_insights["enabled"])
  errors << "visitor_insights.enabled must be true or false"
end
if visitor_insights["enabled"]
  endpoints = visitor_insights["endpoints"]
  errors << "visitor_insights.endpoints must contain at least one URL when enabled" unless endpoints.is_a?(Array) && endpoints.any?
  errors << "visitor_insights.legacy_count must be a non-negative number" unless visitor_insights["legacy_count"].is_a?(Numeric) && visitor_insights["legacy_count"] >= 0
  errors << "visitor_insights.note must be present when enabled" if visitor_insights["note"].to_s.strip.empty?
end
%w[available_languages published_language show_language_switcher].each do |obsolete_key|
  errors << "obsolete bilingual configuration remains: homepage.#{obsolete_key}" if homepage.key?(obsolete_key)
end

navigation_titles = navigation.fetch("main", []).map { |item| item["title"] }
unless navigation_titles == NAVIGATION_TITLES
  errors << "primary navigation order must be: #{NAVIGATION_TITLES.join(" -> ")}"
end

SECTIONS.each do |section|
  path = File.join(CONTENT_ROOT, "#{section}.md")
  relative_path = path.delete_prefix("#{ROOT}/")
  unless File.file?(path)
    errors << "missing homepage content source: #{relative_path}"
    next
  end

  source = File.read(path, encoding: "UTF-8")
  errors << "empty homepage content source: #{relative_path}" if source.strip.empty?
  errors << "runtime language markup remains in #{relative_path}" if source.include?("data-lang=") || source.include?("data-i18n-")
  errors << "section heading must stay in the shared template, not #{relative_path}" if source.start_with?("# ")
end

TEMPLATES.each do |template|
  path = File.join(ROOT, "_includes", "home", "#{template}.html")
  errors << "missing shared homepage template: #{path.delete_prefix("#{ROOT}/")}" unless File.file?(path)
end

homepage_template = File.read(File.join(ROOT, "_includes", "home", "homepage.html"), encoding: "UTF-8")
SECTIONS.each do |section|
  expected_include = "{% include home/content/#{section}.md %}"
  errors << "homepage template does not include #{section}.md" unless homepage_template.include?(expected_include)
end

publication_index_path = File.join(CONTENT_ROOT, "publications.md")
publication_index = File.read(publication_index_path, encoding: "UTF-8")
publication_sources = []
publication_positions = PUBLICATION_PARTS.map do |part|
  path = File.join(CONTENT_ROOT, "publications", "#{part}.md")
  relative_path = path.delete_prefix("#{ROOT}/")
  unless File.file?(path)
    errors << "missing publication content module: #{relative_path}"
    next
  end

  source = File.read(path, encoding: "UTF-8")
  publication_sources << source
  errors << "empty publication content module: #{relative_path}" if source.strip.empty?
  marker = "{% include home/content/publications/#{part}.md %}"
  position = publication_index.index(marker)
  errors << "publication index does not include #{part}.md" unless position
  position
end.compact
errors << "publication content modules are out of order" unless publication_positions == publication_positions.sort

publication_ids = publication_sources.join("\n").scan(/\bid=["']([^"']+)/).flatten
duplicate_publication_ids = publication_ids.group_by { |id| id }.select { |_id, values| values.length > 1 }.keys
errors << "duplicate publication anchors: #{duplicate_publication_ids.join(", ")}" unless duplicate_publication_ids.empty?

main_stylesheet_path = File.join(ROOT, "assets", "css", "main.scss")
main_stylesheet = File.read(main_stylesheet_path, encoding: "UTF-8")
style_positions = STYLE_PARTIALS.map do |partial|
  path = File.join(ROOT, "_sass", "_#{partial}.scss")
  errors << "missing style partial: #{path.delete_prefix("#{ROOT}/")}" unless File.file?(path)
  position = main_stylesheet.index("@import \"#{partial}\";")
  errors << "main stylesheet does not import #{partial}" unless position
  position
end.compact
errors << "homepage style partials are imported out of order" unless style_positions == style_positions.sort

entry_path = File.join(ROOT, "_pages", "about.md")
entry = File.read(entry_path, encoding: "UTF-8")
errors << "_pages/about.md must delegate rendering to home/homepage.html" unless entry.include?("{% include home/homepage.html %}")
errors << "_pages/about.md must not contain homepage section markup" if entry.include?("<section")

legacy_files = Dir.glob(File.join(ROOT, "_pages", "includes", "*.md"))
errors << "legacy homepage files remain under _pages/includes" unless legacy_files.empty?

legacy_template_paths = LEGACY_TEMPLATE_PATHS.select do |relative_path|
  path = File.join(ROOT, relative_path)
  File.file?(path) || (File.directory?(path) && Dir.glob(File.join(path, "**", "*")).any? { |entry| File.file?(entry) })
end
unless legacy_template_paths.empty?
  errors << "unused legacy template paths remain: #{legacy_template_paths.join(", ")}"
end

locale_directories = %w[en zh].select { |language| Dir.exist?(File.join(CONTENT_ROOT, language)) }
errors << "obsolete language content directories remain: #{locale_directories.join(", ")}" unless locale_directories.empty?

bilingual_surfaces = %w[
  _config.yml
  _data/navigation.yml
  _includes/author-profile.html
  _includes/head/custom.html
  _includes/masthead.html
  _includes/home/homepage.html
  _includes/home/visitor-insights.html
  _includes/home/scripts.html
  assets/js/news-toggle.js
  assets/js/publications-toggle.js
  assets/js/visitor-counter.js
  _sass/_academic-template.scss
]
bilingual_markers = /data-lang=|data-i18n-|data-language|site-language-change|published_language|show_language_switcher|title_zh|bio_zh|location_zh/
bilingual_surfaces.each do |relative_path|
  source = File.read(File.join(ROOT, relative_path), encoding: "UTF-8")
  errors << "obsolete bilingual logic remains in #{relative_path}" if source.match?(bilingual_markers)
end

language_script = File.join(ROOT, "assets", "js", "language-toggle.js")
errors << "obsolete language toggle script remains" if File.exist?(language_script)
errors << "obsolete Chinese CV remains" if File.exist?(File.join(ROOT, "files", "CV-CN.pdf"))

profile_template = File.read(File.join(ROOT, "_includes", "author-profile.html"), encoding: "UTF-8")
unless profile_template.include?("author__urls-toggle") &&
       profile_template.include?('id="author-links"') &&
       profile_template.include?('class="author__urls social-icons"')
  errors << "profile links must retain their desktop list and mobile toggle contract"
end

profile_script_include = File.read(File.join(ROOT, "_includes", "home", "scripts.html"), encoding: "UTF-8")
unless profile_script_include.include?("/assets/js/profile-links.js")
  errors << "homepage scripts must load the profile links controller"
end

masthead_template = File.read(File.join(ROOT, "_includes", "masthead.html"), encoding: "UTF-8")
unless masthead_template.include?("site-nav__toggle") && masthead_template.include?('id="primary-navigation-links"')
  errors << "primary navigation must retain its mobile menu contract"
end

global_scripts = File.read(File.join(ROOT, "_includes", "scripts.html"), encoding: "UTF-8")
unless global_scripts.include?("/assets/js/navigation.js")
  errors << "global scripts must load the primary navigation controller"
end

if errors.empty?
  puts "Homepage structure validation passed: English content, shared templates, and no legacy runtime."
else
  warn errors.map { |error| "- #{error}" }.join("\n")
  exit 1
end
