# On initialize, reads a dump file and parses it.
# `write!` outputs just the parts of the file that were parsed.
class AngbandDump
  attr_reader :file_name
  attr_accessor :version
  attr_accessor :profession
  attr_accessor :race
  attr_accessor :history

  def initialize(file_name)
    @file_name = file_name

    @lines = IO.readlines("data/dumpstore/#{file_name}")
    extract_version!
    extract_profession!
    extract_race!
    extract_history!
  end

  def write!
  end

  private

  def extract_version!
    self.version = /(\w+ \d+\.\d+\.\d+)/.match(@lines[0])[1]
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
    self.history = 1
  end
end
