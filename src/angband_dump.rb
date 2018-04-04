# On initialize, reads a dump file and parses it.
# `write!` outputs just the parts of the file that were parsed.
class AngbandDump
  attr_reader :file_name
  attr_accessor :version
  attr_accessor :profession
  attr_accessor :race

  def initialize(file_name)
    @file_name = file_name

    @lines = IO.readlines("data/dumpstore/#{file_name}")
    extract_version!
  end

  def write!
  end

  private

  def extract_version!
    self.version = /(\w+ \d+\.\d+\.\d+)/.match(@lines[0])[1]
  end
end
