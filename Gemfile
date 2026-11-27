source "https://rubygems.org"

# Match the dependency set used by GitHub Pages.
gem "github-pages", group: :jekyll_plugins

# Security floors for transitive GitHub Pages dependencies. Keeping these
# explicit prevents an old local Ruby from silently locking vulnerable builds.
gem "activesupport", "~> 8.1", ">= 8.1.4.1"
gem "faraday", ">= 2.14.3", "< 3"
gem "nokogiri", ">= 1.19.7", "< 2"
gem "addressable", ">= 2.9.1", "< 3"
gem "rubyzip", ">= 3.4.0", "< 4"

group :jekyll_plugins do
  gem "jekyll-redirect-from"
  gem "jekyll-sitemap"
end
