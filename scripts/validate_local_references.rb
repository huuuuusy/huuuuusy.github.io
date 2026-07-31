#!/usr/bin/env ruby
# frozen_string_literal: true

require "pathname"

ROOT = Pathname.new(File.expand_path("..", __dir__))
SOURCE_PATTERNS = [
  "_pages/**/*.{md,html}",
  "_includes/**/*.{md,html}",
  "_data/**/*.{yml,yaml}",
  "assets/**/*.{scss,css}",
  "README.md"
].freeze

MARKDOWN_REFERENCE = /\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/
HTML_REFERENCE = /(?:href|src)=["']([^"']+)["']/
CSS_REFERENCE = /url\(([^)]+)\)/

def local_reference?(reference)
  return false if reference.empty?
  return false if reference.start_with?("#", "//")
  return false if reference.include?("{{") || reference.include?("{%")

  !reference.match?(/\A(?:https?:|mailto:|tel:|data:|javascript:)/i)
end

def target_path(source, reference)
  clean = reference.strip.delete_prefix('"').delete_suffix('"')
  clean = clean.delete_prefix("'").delete_suffix("'")
  clean = clean.split(/[?#]/, 2).first.to_s
  return nil if clean.empty? || clean == "/"

  if clean.start_with?("/")
    ROOT.join(clean.delete_prefix("/")).cleanpath
  else
    source.dirname.join(clean).cleanpath
  end
end

sources = SOURCE_PATTERNS.flat_map { |pattern| Dir.glob(ROOT.join(pattern)) }
missing = []

sources.uniq.sort.each do |source_name|
  source = Pathname.new(source_name)
  content = source.read.gsub(/<!--.*?-->/m, "")
  patterns = case source.extname
             when ".md"
               [MARKDOWN_REFERENCE, HTML_REFERENCE]
             when ".html"
               [HTML_REFERENCE]
             when ".css", ".scss"
               [CSS_REFERENCE]
             else
               []
             end

  patterns.each do |pattern|
    content.scan(pattern).flatten.each do |reference|
      next unless local_reference?(reference)

      target = target_path(source, reference)
      next unless target
      next if target.exist?

      missing << [source.relative_path_from(ROOT), reference]
    end
  end
end

if missing.empty?
  puts "Local references OK"
  exit 0
end

warn "Missing local references:"
missing.uniq.sort.each do |source, reference|
  warn "  #{source}: #{reference}"
end
exit 1
