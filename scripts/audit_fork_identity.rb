#!/usr/bin/env ruby
# frozen_string_literal: true

# Run this after forking the repository. A clean result means the public site
# no longer contains Shiyu Hu's primary identity, domain, analytics, or counter
# configuration. The original repository is expected to report matches.

require "pathname"

ROOT = Pathname.new(File.expand_path("..", __dir__))
SOURCE_PATTERNS = [
  "CNAME",
  "_config*.yml",
  "_data/**/*.{yml,yaml}",
  "_includes/**/*.{md,html}",
  "_pages/**/*.{md,html}",
  "assets/js/*.js",
  "cloudflare/visitor-counter/**/*.{js,jsonc,md}"
].freeze

MARKERS = {
  "personal name" => /Shiyu Hu/i,
  "personal domains" => /(?:hushiyu1995\.com|huuuuusy\.github\.io)/i,
  "GitHub identity" => /\bhuuuuusy\b/i,
  "email addresses" => /(?:shiyu\.hu@ntu\.edu\.sg|hushiyu199510@gmail\.com|hushiyu2019@ia\.ac\.cn)/i,
  "Cloudflare analytics token" => /fa5370345e8f4dcc8362695323fb5d63/i,
  "visitor-counter names" => /(?:shiyu-homepage-counter|shiyu-homepage-visits)/i
}.freeze

matches = []
sources = SOURCE_PATTERNS.flat_map { |pattern| Dir.glob(ROOT.join(pattern)) }

sources.uniq.sort.each do |source_name|
  source = Pathname.new(source_name)
  next unless source.file?

  source.each_line.with_index(1) do |line, line_number|
    MARKERS.each do |label, marker|
      next unless line.match?(marker)

      matches << [source.relative_path_from(ROOT), line_number, label]
    end
  end
end

if matches.empty?
  puts "Fork identity audit passed: no Shiyu-specific public configuration remains."
  exit 0
end

warn "Replace these Shiyu-specific values before publishing your fork:"
matches.group_by(&:first).each do |source, source_matches|
  line_numbers = source_matches.map { |match| match[1] }.uniq.sort
  labels = source_matches.map { |match| match[2] }.uniq.sort
  visible_lines = line_numbers.first(12).join(", ")
  visible_lines += ", ..." if line_numbers.length > 12
  warn "  #{source}: lines #{visible_lines} (#{labels.join(", ")})"
end
exit 1
