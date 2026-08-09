#!/usr/bin/env ruby
# frozen_string_literal: true

require "open3"
require "optparse"
require "rbconfig"

ROOT = File.expand_path("..", __dir__)
options = { build: false, site: nil }

OptionParser.new do |parser|
  parser.banner = "Usage: ruby scripts/validate_site.rb [--build]"
  parser.on("--build", "Run a production Jekyll build after source checks") do
    options[:build] = true
  end
  parser.on("--site PATH", "Audit an existing built-site directory") do |path|
    options[:site] = File.expand_path(path)
  end
end.parse!

checks = [
  ["Homepage structure", [RbConfig.ruby, "scripts/validate_homepage_structure.rb"]],
  ["Local references", [RbConfig.ruby, "scripts/validate_local_references.rb"]],
  ["Public assets", [RbConfig.ruby, "scripts/validate_public_assets.rb"]],
  ["Fork identity audit syntax", [RbConfig.ruby, "-c", "scripts/audit_fork_identity.rb"]],
  ["News and honors JavaScript", ["node", "--check", "assets/js/news-toggle.js"]],
  ["Publication JavaScript", ["node", "--check", "assets/js/publications-toggle.js"]],
  ["Visitor JavaScript", ["node", "--check", "assets/js/visitor-counter.js"]],
  ["Visitor Worker JavaScript", ["node", "--check", "cloudflare/visitor-counter/src/index.js"]],
  ["Git whitespace", ["git", "diff", "--check"]]
]

destination = nil
if options[:build]
  destination = File.expand_path(ENV.fetch("JEKYLL_DESTINATION", File.join(ROOT, "_site")))
  checks << ["Production Jekyll build", ["bundle", "exec", "jekyll", "build", "--destination", destination]]
end

checks.each do |label, command|
  puts "\n==> #{label}"
  stdout, stderr, status = Open3.capture3(
    {
      "JEKYLL_ENV" => "production",
      # Keep validation deterministic and offline: only load the plugins
      # explicitly declared in _config.yml, not every github-pages helper.
      "JEKYLL_NO_BUNDLER_REQUIRE" => "true"
    },
    *command,
    chdir: ROOT
  )
  $stdout.print(stdout)
  $stderr.print(stderr)
  abort("Validation failed: #{label}") unless status.success?
end

site_path = options[:site] || destination
if site_path
  puts "\n==> Rendered homepage"
  index_path = File.join(site_path, "index.html")
  abort("Rendered homepage is missing: #{index_path}") unless File.file?(index_path)

  html = File.read(index_path, encoding: "UTF-8")
  expected_sections = %w[
    about-me news background research-interests publications projects
    honors-and-awards activities-and-services contact
  ]
  rendered_sections = html.scan(/<section class="home-section[^>]*id="([^"]+)"/).flatten
  abort("Rendered homepage section order is incorrect") unless rendered_sections == expected_sections

  ids = html.scan(/\bid="([^"]+)"/).flatten
  duplicate_ids = ids.group_by { |id| id }.select { |_id, values| values.length > 1 }.keys
  abort("Rendered homepage has duplicate IDs: #{duplicate_ids.join(", ")}") unless duplicate_ids.empty?

  obsolete_runtime = /language-switcher|language-toggle\.js|data-lang=|data-i18n-|data-language=|site-language-change/
  abort("Rendered homepage contains obsolete bilingual runtime") if html.match?(obsolete_runtime)
  abort("Rendered homepage contains unprocessed Markdown attributes") if html.include?('markdown="1"')
  abort("Rendered homepage contains an unprocessed introduction heading") if html.include?('### Shiyu Hu')
  abort("Rendered homepage is missing its semantic introduction heading") unless html.include?('<h3>Shiyu Hu (胡世宇)</h3>')

  maintenance_outputs = %w[CONTRIBUTING.md cloudflare docs scripts].select do |relative_path|
    File.exist?(File.join(site_path, relative_path))
  end
  unless maintenance_outputs.empty?
    abort("Maintenance files leaked into the published site: #{maintenance_outputs.join(", ")}")
  end

  puts "Rendered homepage OK: #{rendered_sections.length} sections and #{ids.length} unique IDs."
end

puts "\nAll site checks passed."
