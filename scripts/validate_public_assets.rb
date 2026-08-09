#!/usr/bin/env ruby
# frozen_string_literal: true

require "digest"

ROOT = File.expand_path("..", __dir__)
PUBLIC_DIRECTORIES = %w[images files].freeze
WARNING_BYTES = 50 * 1024 * 1024
MAXIMUM_BYTES = 95 * 1024 * 1024

paths = PUBLIC_DIRECTORIES.flat_map do |directory|
  Dir.glob(File.join(ROOT, directory, "**", "*")).select { |path| File.file?(path) }
end

errors = []
warnings = []
hashes = Hash.new { |hash, key| hash[key] = [] }

paths.each do |path|
  relative_path = path.delete_prefix("#{ROOT}/")
  size = File.size(path)
  errors << "asset exceeds 95 MiB: #{relative_path}" if size > MAXIMUM_BYTES
  warnings << "large asset (#{(size / 1024.0 / 1024.0).round(1)} MiB): #{relative_path}" if size > WARNING_BYTES
  errors << "copy-style asset filename: #{relative_path}" if File.basename(path).match?(/\scopy(?:\s|\.|$)/i)
  hashes[Digest::SHA256.file(path).hexdigest] << relative_path
end

hashes.each_value do |duplicates|
  errors << "duplicate public assets: #{duplicates.join(", ")}" if duplicates.length > 1
end

warnings.each { |warning| warn "Warning: #{warning}" }

if errors.empty?
  puts "Public asset validation passed: #{paths.length} files and no duplicates."
else
  warn errors.map { |error| "- #{error}" }.join("\n")
  exit 1
end
