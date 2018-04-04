require 'json'
require 'rake/clean'

DUMP_FILES = Rake::FileList.new('data/dumpstore/dump*.txt')

task default: :data
task data: :history_files
multitask history_files: DUMP_FILES.pathmap('%{dumpstore/,history/}X.history')

directory 'data/history'
CLEAN.include('data/history')

rule '.history' => [->(f) { source_for_history(f) }, 'data/history'] do |t|
  puts "Creating #{t.name} from #{t.source}"
  lines = IO.readlines(t.source)
  data = {}
  data[:version] = /(\w+ \d+\.\d+\.\d+)/.match(lines[0])[1]
  data[:race] = /Race\s+(\S+)/.match(
    lines.find { |line| line.include? 'Race' }
  )[1]
  data[:class] = /Class\s+(\S+)/.match(
    lines.find { |line| line.include? 'Class' }
  )[1]

  start_of_history_index = lines.find_index("[Player history]\n")
  data[:history] = lines
                   .slice(start_of_history_index + 3..-1)
                   .map(&:strip)
                   .take_while { |line| !line.empty? }

  IO.write(t.name, data.to_json)
end

def source_for_history(history_file)
  DUMP_FILES.detect do |txt_file|
    txt_file.ext('') == history_file.pathmap('%{history/,dumpstore/}X')
  end
end
