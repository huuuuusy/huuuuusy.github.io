#!/usr/bin/env ruby
# frozen_string_literal: true

# Refresh _data/scholar.yml from the public Google Scholar profile.
# Run before the first homepage or CV update of the day; it does nothing
# when the data is already dated today (pass --force to fetch anyway).
# The figures are the "All" column, cross-checked against the per-paper
# citation counts on the profile page.

require "date"
require "net/http"
require "uri"
require "yaml"

ROOT = File.expand_path("..", __dir__)
DATA_PATH = File.join(ROOT, "_data", "scholar.yml")
PROFILE_URL = "https://scholar.google.com/citations?user=49W-Rx4AAAAJ&hl=en&pagesize=100"
USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129 Safari/537.36"

current = YAML.safe_load(File.read(DATA_PATH), permitted_classes: [Date])
today = Date.today
if current["as_of"] == today && !ARGV.include?("--force")
  puts "Already refreshed today (#{today}): #{current["citations"]} citations, h-index #{current["h_index"]}, i10-index #{current["i10_index"]}"
  exit
end

uri = URI(PROFILE_URL)
response = Net::HTTP.start(uri.host, uri.port, use_ssl: true, open_timeout: 20, read_timeout: 30) do |http|
  http.get(uri.request_uri, "User-Agent" => USER_AGENT, "Accept-Language" => "en")
end
abort("Google Scholar returned HTTP #{response.code}; _data/scholar.yml left unchanged") unless response.is_a?(Net::HTTPSuccess)

html = response.body.force_encoding("UTF-8")
abort("Google Scholar served a CAPTCHA page; _data/scholar.yml left unchanged") if html =~ /captcha|unusual traffic/i

stats = html.scan(%r{<td class="gsc_rsb_sc1"><a[^>]*>([^<]+)</a></td><td class="gsc_rsb_std">(\d+)</td>}).to_h
citations = stats["Citations"]&.to_i
h_index = stats["h-index"]&.to_i
i10_index = stats["i10-index"]&.to_i
abort("Could not read the citation table; _data/scholar.yml left unchanged") unless citations && h_index && i10_index

counts = html.scan(/class="gsc_a_ac gs_ibl">(\d+)</).flatten.map(&:to_i).sort.reverse
unless counts.empty?
  recomputed_h = counts.each_with_index.count { |count, index| count >= index + 1 }
  recomputed_i10 = counts.count { |count| count >= 10 }
  if counts.sum != citations || recomputed_h != h_index || recomputed_i10 != i10_index
    warn "Note: per-paper counts give #{counts.sum} / h #{recomputed_h} / i10 #{recomputed_i10} " \
         "(profile table: #{citations} / #{h_index} / #{i10_index}); using the profile table"
  end
end

text = File.read(DATA_PATH)
{ "citations" => citations, "h_index" => h_index, "i10_index" => i10_index, "as_of" => today.iso8601 }.each do |key, value|
  text = text.sub(/^#{key}: .*$/, "#{key}: #{value}")
end
File.write(DATA_PATH, text)

change = citations - current["citations"].to_i
puts "Google Scholar #{today}: #{citations} citations (#{change.negative? ? change : "+#{change}"} since #{current["as_of"]}), " \
     "h-index #{h_index}, i10-index #{i10_index}"
puts "Updated _data/scholar.yml. Update the CV citation lines to the same figures if the CV is being rebuilt today."
