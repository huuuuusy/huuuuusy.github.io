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
  ["Profile links JavaScript", ["node", "--check", "assets/js/profile-links.js"]],
  ["Homepage scrolling JavaScript", ["node", "--check", "assets/js/homepage-scroll.js"]],
  ["Primary navigation JavaScript", ["node", "--check", "assets/js/navigation.js"]],
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
  abort("Rendered homepage is missing its scoped editorial body class") unless html.include?('<body class=homepage-shell>') || html.include?('<body class="homepage-shell">')
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
  abort("Rendered homepage is missing its semantic introduction heading") unless html.include?('<h2>Shiyu Hu (胡世宇)</h2>')
  abort("Rendered homepage is missing the profile links toggle") unless html.include?('class="btn btn--inverse author__urls-toggle"')
  abort("Rendered homepage is missing the profile links list") unless html.include?('id="author-links" class="author__urls social-icons"')
  abort("Rendered homepage is missing the mobile navigation toggle") unless html.include?('class="site-nav__toggle"')
  abort("Rendered homepage is missing the navigation controller") unless html.include?("/assets/js/navigation.js")
  abort("Rendered homepage is missing the page scrolling controls") unless
    html.include?('class="home-scroll-controls"') &&
    html.include?('data-scroll-target="top"') &&
    html.include?('data-scroll-target="bottom"')
  abort("Rendered homepage is missing the page scrolling controller") unless html.include?("/assets/js/homepage-scroll.js")

  navigation_html = html[/<div class="site-nav__links"[^>]*>(.*?)<\/div>/m].to_s
  navigation_titles = navigation_html.scan(/<a href="[^"]+" target="_self">([^<]+)<\/a>/).flatten
  expected_navigation_titles = %w[About Background Research Publications Projects Service CV]
  unless navigation_titles == expected_navigation_titles
    abort("Rendered primary navigation order is incorrect: #{navigation_titles.join(" -> ")}")
  end

  maintenance_outputs = %w[CONTRIBUTING.md cloudflare docs scripts].select do |relative_path|
    File.exist?(File.join(site_path, relative_path))
  end
  unless maintenance_outputs.empty?
    abort("Maintenance files leaked into the published site: #{maintenance_outputs.join(", ")}")
  end

  terms_path = File.join(site_path, "terms", "index.html")
  abort("Rendered privacy page is missing") unless File.file?(terms_path)
  terms_html = File.read(terms_path, encoding: "UTF-8")
  abort("Rendered privacy page repeats its title") if terms_html.include?("<h2 id=privacy-policy>Privacy Policy</h2>")
  abort("Rendered privacy page is missing the navigation controller") unless terms_html.include?("/assets/js/navigation.js")

  not_found_path = File.join(site_path, "404.html")
  abort("Rendered 404 page is missing") unless File.file?(not_found_path)
  not_found_html = File.read(not_found_path, encoding: "UTF-8")
  unless not_found_html.match?(%r{<a href=/ target=_self>Return to the homepage</a>}) ||
         not_found_html.match?(%r{<a href="/" target="_self">Return to the homepage</a>})
    abort("Rendered 404 return link must stay in the current tab")
  end

  puts "Rendered homepage OK: #{rendered_sections.length} sections and #{ids.length} unique IDs."
end

puts "\nAll site checks passed."
