# On initialize, reads a dump file and parses it.
# `write!` outputs just the parts of the file that were parsed.
class AngbandDump
  attr_reader :file_name
  attr_accessor :version
  attr_accessor :name
  attr_accessor :profession
  attr_accessor :race
  attr_accessor :history

  def initialize(file_name)
    @file_name = file_name

    @lines = IO.readlines("data/dumpstore/#{file_name}")
    raise 'Invalid player history' unless parsable_history?
    extract_version!
    raise 'Invalid variant' unless version.start_with? 'Angband '
    extract_name!
    extract_profession!
    extract_race!
    extract_history!
  end

  def write!
    IO.write("/doc/data/angband_#{major_minor}/characters.tsv",
             "#{name}\t#{race}\t#{profession}\t#{data_file_name}",
             'a')
    IO.write("/doc/data/angband_#{major_minor}/#{data_file_name}",
             history_tsv,
             'w')
  end

  private

  def data_file_name
    "#{/(\d+)/.match(file_name)[0]}.tsv"
  end

  def major_minor
    /\w+ (\d\.\d)/.match(version)[0]
  end

  def history_tsv
    tsv = "turn\tdepth\tlevel"
    history.map 
  end

  def extract_version!
    self.version = /(\w+ \d+\.\d+\.\d+)/.match(@lines[0])[1]
  end

  def extract_name!
    name_line = @lines.find { |line| line.include? 'Name' }
    self.profession = /Name\s+(\S+)/.match(name_line)[1]
  end

  def extract_profession!
    class_line = @lines.find { |line| line.include? 'Class' }
    self.profession = /Class\s+(\S+)/.match(class_line)[1]
  end

  def extract_race!
    race_line = @lines.find { |line| line.include? 'Race' }
    self.race = /Race\s+(\S+)/.match(race_line)[1]
  end

  def extract_history!
    self.history = []
    level = 1

    history_lines.each do |line|
      turn = line.split[0].to_i
      depth = line.split[1].to_i
      level = line.split[-1].to_i if line.include? 'Reached level'
      history << { turn: turn, depth: depth, level: level }
    end
  end

  def history_lines
    start_line = @lines.find_index { |line| line.include? 'Player history' } + 2
    @lines.slice(start_line..-1)
          .map(&:strip)
          .take_while { |line| !line.empty? }
          .map { |line| line.sub("'", '') }
  end

  def parsable_history?
    idx = @lines.find_index { |line| line.include? 'Player history' }
    idx && @lines[idx + 1].match?(/Turn\s+Depth\s+Note/)
  end
end
